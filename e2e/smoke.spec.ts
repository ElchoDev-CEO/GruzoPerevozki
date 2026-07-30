import { test, expect } from '@playwright/test';
import { site } from '../src/lib/config/site';

test('главная страница объясняет услугу и показывает ключевые разделы', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle('Грузоперевозки в Бишкеке и по Кыргызстану — Грузоперевозка');
	await expect(page.getByRole('link', { name: 'Грузоперевозка — на главную' })).toBeVisible();
	await expect(
		page.getByRole('heading', { name: /Грузоперевозки по Кыргызстану/, level: 1 })
	).toBeVisible();
	await expect(
		page.getByRole('heading', { name: 'Перевозки под конкретную задачу', level: 2 })
	).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Фотообзор транспорта', level: 2 })).toBeVisible();
	await expect(
		page.getByRole('heading', { name: 'Напишите, что и куда нужно перевезти', level: 2 })
	).toBeVisible();
});

test('desktop-навигация прокручивает к транспорту', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/');

	await page
		.getByRole('navigation', { name: 'Основная навигация' })
		.getByRole('link', { name: 'Транспорт' })
		.click();

	await expect(page.locator('#transport')).toBeInViewport({ ratio: 0.1 });
});

test('карусель транспорта управляется кнопками и клавиатурой', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/#transport');

	const carousel = page.locator('.fleet-carousel');
	await expect(carousel).toBeVisible();

	const previous = page.getByRole('button', { name: 'Предыдущее фото' });
	const next = page.getByRole('button', { name: 'Следующее фото' });
	const firstThumbnail = page.getByRole('button', { name: '1. Транспорт на маршруте' });
	const secondThumbnail = page.getByRole('button', { name: '2. Груз в кузове' });
	const lastThumbnail = page.getByRole('button', { name: '6. Транспорт в вечернем городе' });
	const progress = page.locator('.fleet-panel__progress');

	await expect(previous).toBeDisabled();
	await expect(next).toBeEnabled();

	await next.click();
	await expect(secondThumbnail).toHaveAttribute('aria-current', 'true');
	await expect(previous).toBeEnabled();
	await expect(progress).toHaveAttribute('data-state', 'paused');

	await page.mouse.move(0, 0);
	await expect(progress).toHaveAttribute('data-state', 'running');

	await secondThumbnail.press('End');
	await expect(lastThumbnail).toHaveAttribute('aria-current', 'true');
	await expect(next).toBeDisabled();
	await expect(progress).toHaveAttribute('data-state', 'paused');

	await lastThumbnail.press('Home');
	await expect(firstThumbnail).toHaveAttribute('aria-current', 'true');
	await expect(previous).toBeDisabled();
});

test('автопрокрутка считает секунды и меняет кадр', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.goto('/#transport');
	await expect(page.locator('.fleet-carousel')).toBeVisible();

	const firstThumbnail = page.getByRole('button', { name: '1. Транспорт на маршруте' });
	const secondThumbnail = page.getByRole('button', { name: '2. Груз в кузове' });
	const progress = page.locator('.fleet-panel__progress');
	const progressFill = page.locator('.fleet-panel__progress-fill');

	await expect(firstThumbnail).toHaveAttribute('aria-current', 'true');
	await expect(progress).toHaveAttribute('data-state', 'running');
	await expect(progress).toContainText('3 сек');
	await expect(progressFill).toHaveCSS('animation-duration', '3s');
	await expect(progress).toContainText('2 сек', { timeout: 1500 });
	await expect(secondThumbnail).toHaveAttribute('aria-current', 'true', { timeout: 3500 });
	await expect(progress).toContainText('3 сек');
	await expect(page.getByRole('button', { name: 'Остановить автопрокрутку' })).toHaveCount(0);
});

test('контактные действия используют телефон и подготовленный WhatsApp', async ({ page }) => {
	await page.goto('/');

	const whatsapp = page
		.locator('#contact')
		.getByRole('link', { name: 'Открыть WhatsApp, откроется в новой вкладке' });
	await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/996708500935\?text=.+/);
	await expect(page.locator(`a[href="tel:+996708500935"]`).first()).toBeAttached();
});

test('мобильное меню закрывается по Escape и возвращает фокус', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	const menuButton = page.getByLabel('Меню навигации');
	await menuButton.focus();
	await menuButton.press('Enter');

	await expect(page.locator('.mobile-nav')).toHaveAttribute('open', '');
	await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
	await page.keyboard.press('Escape');
	await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open', '');
	await expect(menuButton).toBeFocused();
});

test('клавиатурный переход из мобильного меню закрывает его и фокусирует раздел', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');

	await page.getByLabel('Меню навигации').press('Enter');
	const servicesLink = page
		.getByRole('navigation', { name: 'Мобильная навигация' })
		.getByRole('link', { name: 'Услуги' });
	await servicesLink.focus();
	await servicesLink.press('Enter');

	await expect(page).toHaveURL(/#services$/);
	await expect(page.locator('.mobile-nav')).not.toHaveAttribute('open', '');
	await expect(page.locator('#services')).toBeFocused();
	await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('нет горизонтального переполнения на целевых ширинах', async ({ page }) => {
	for (const width of [360, 390, 768, 1024, 1440]) {
		await page.setViewportSize({ width, height: width < 800 ? 844 : 900 });
		await page.goto('/');

		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(1);
	}
});

test('увеличение текста до 200% не создаёт горизонтальный скролл', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });

	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth
	);
	expect(overflow).toBeLessThanOrEqual(1);
	await expect(page.locator('h1')).toBeVisible();
});

test('reduced motion сохраняет контент и отключает smooth scroll', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');

	await expect(page.getByRole('heading', { name: /Грузоперевозки по Кыргызстану/ })).toBeVisible();
	const scrollBehavior = await page.evaluate(
		() => getComputedStyle(document.documentElement).scrollBehavior
	);
	expect(scrollBehavior).toBe('auto');

	await page.locator('.fleet-carousel').scrollIntoViewIfNeeded();
	const progress = page.locator('.fleet-panel__progress');
	await expect(progress).toHaveAttribute('data-state', 'paused');
	await expect(progress).toContainText('Пауза');
	await expect(page.locator('.fleet-panel__progress-fill')).toHaveCSS(
		'animation-play-state',
		'paused'
	);
});

test('главный сценарий не пишет ошибок в консоль', async ({ page }) => {
	const errors: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	page.on('pageerror', (error) => errors.push(error.message));

	await page.goto('/');
	await page.getByRole('link', { name: 'Посмотреть услуги' }).click();
	await expect(page.locator('#services')).toBeInViewport({ ratio: 0.1 });

	expect(errors).toEqual([]);
});

test.describe('без JavaScript', () => {
	test.use({ javaScriptEnabled: false });

	test('основной контент, навигация, карусель и FAQ остаются доступными', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');

		await expect(
			page.getByRole('heading', { name: /Грузоперевозки по Кыргызстану/, level: 1 })
		).toBeVisible();

		const menuButton = page.getByLabel('Меню навигации');
		await menuButton.click();
		await expect(page.locator('.mobile-nav')).toHaveAttribute('open', '');
		await expect(page.locator('body')).toHaveCSS('overflow', 'visible');

		await page
			.getByRole('navigation', { name: 'Мобильная навигация' })
			.getByRole('link', { name: 'Услуги' })
			.click();
		await expect(page).toHaveURL(/#services$/);
		await menuButton.click();
		await expect(page.locator('#services')).toBeInViewport({ ratio: 0.1 });

		await page.goto('/#transport');
		await expect(
			page.getByRole('heading', { name: 'Фотообзор транспорта', level: 2 })
		).toBeVisible();
		await expect(
			page.getByRole('img', {
				name: 'Белый грузовой фургон с закрытым кузовом на городской площадке'
			})
		).toBeVisible();

		const firstQuestion = page.locator('.faq details').first();
		await expect(firstQuestion).toHaveAttribute('open', '');
		await expect(firstQuestion.locator('.accordion__panel')).toBeVisible();

		const secondQuestion = page.locator('.faq details').nth(1);
		await secondQuestion.locator('summary').click();
		await expect(secondQuestion).toHaveAttribute('open', '');
	});
});

test('SEO metadata и crawl-файлы используют production domain', async ({ page, request }) => {
	await page.goto('/');

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', site.url);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', site.url);
	await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
		'content',
		'Грузоперевозка'
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		`${site.url}images/og-cargo-kg.jpg`
	);
	await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
	await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);

	const structuredData = JSON.parse(
		(await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}'
	);
	const organization = structuredData['@graph'].find(
		(item: { '@type': string }) => item['@type'] === 'Organization'
	);
	expect(organization).toMatchObject({
		name: 'Грузоперевозка',
		url: site.url,
		telephone: site.phones[0],
		areaServed: { name: site.areaServed }
	});
	expect(organization).not.toHaveProperty('address');
	expect(organization).not.toHaveProperty('email');
	expect(organization).not.toHaveProperty('image');

	const sitemap = await request.get('/sitemap.xml');
	expect(sitemap.ok()).toBe(true);
	expect(await sitemap.text()).toContain(`<loc>${site.url}</loc>`);

	const robots = await request.get('/robots.txt');
	expect(robots.ok()).toBe(true);
	expect(await robots.text()).toContain(`Sitemap: ${site.url}sitemap.xml`);

	const favicon = await request.get('/favicon.svg');
	expect(favicon.ok()).toBe(true);
	expect(await favicon.text()).toContain('<title>Грузоперевозка</title>');
});
