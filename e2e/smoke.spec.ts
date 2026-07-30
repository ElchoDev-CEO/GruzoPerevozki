import { test, expect } from '@playwright/test';
import { site } from '../src/lib/config/site';

test('home page loads with title and key headings visible', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle(/Грузоперевозки в Бишкеке и по Кыргызстану/);

	// h1 in Hero section
	await expect(
		page.getByRole('heading', { name: 'Грузоперевозки по всему Кыргызстану', level: 1 })
	).toBeVisible();

	// h2 in Services section (via SectionHeading component)
	await expect(page.getByRole('heading', { name: 'Наши услуги', level: 2 })).toBeVisible();

	// h2 in Contact section (direct h2 in .contact__head)
	await expect(page.getByRole('heading', { name: 'Контакты', level: 2 })).toBeVisible();
});

test('clicking Услуги nav link scrolls #services into viewport', async ({ page }) => {
	// Use desktop viewport so the desktop nav is visible (header__nav is display:none below 768px)
	await page.setViewportSize({ width: 1280, height: 720 });
	await page.goto('/');

	const servicesLink = page.locator('nav.header__nav').getByRole('link', { name: 'Услуги' });
	await servicesLink.click();

	const servicesSection = page.locator('#services');
	await expect(servicesSection).toBeInViewport({ ratio: 0.1 });
});

test('WhatsApp link with wa.me/996708500935 exists', async ({ page }) => {
	await page.goto('/');

	// The floating WhatsAppButton renders an <a> with href="https://wa.me/996708500935"
	const waLink = page.locator('a[href*="wa.me/996708500935"]').first();
	await expect(waLink).toBeAttached();
});

test('SEO metadata and crawl files use the production domain', async ({ page, request }) => {
	await page.goto('/');

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', site.url);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', site.url);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		`${site.url}images/hero-truck.jpg`
	);
	await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);

	const structuredData = JSON.parse(
		(await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}'
	);
	const organization = structuredData['@graph'].find(
		(item: { '@type': string }) => item['@type'] === 'Organization'
	);
	expect(organization).toMatchObject({
		url: site.url,
		telephone: site.phones[0],
		areaServed: { name: site.areaServed }
	});
	expect(organization).not.toHaveProperty('address');
	expect(organization).not.toHaveProperty('email');

	const sitemap = await request.get('/sitemap.xml');
	expect(sitemap.ok()).toBe(true);
	expect(await sitemap.text()).toContain(`<loc>${site.url}</loc>`);

	const robots = await request.get('/robots.txt');
	expect(robots.ok()).toBe(true);
	expect(await robots.text()).toContain(`Sitemap: ${site.url}sitemap.xml`);
});
