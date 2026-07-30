import { test, expect } from '@playwright/test';

test('home page loads with title and key headings visible', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle(/Грузоперевозки по Кыргызстану/);

	// h1 in Hero section
	await expect(page.getByRole('heading', { name: 'Грузоперевозки по всему Кыргызстану', level: 1 })).toBeVisible();

	// h2 in Services section (via SectionHeading component)
	await expect(page.getByRole('heading', { name: 'Наши услуги', level: 2 })).toBeVisible();

	// h2 in Contact section (direct h2 in .contact__head)
	await expect(page.getByRole('heading', { name: 'Контакты', level: 2 })).toBeVisible();
});

test('clicking Услуги nav button scrolls #services into viewport', async ({ page }) => {
	// Use desktop viewport so the desktop nav is visible (header__nav is display:none below 768px)
	await page.setViewportSize({ width: 1280, height: 720 });
	await page.goto('/');

	// The desktop nav contains buttons for each nav link; target the one in the <nav> element
	const servicesBtn = page.locator('nav.header__nav button', { hasText: 'Услуги' });
	await servicesBtn.click();

	const servicesSection = page.locator('#services');
	await expect(servicesSection).toBeInViewport({ ratio: 0.1 });
});

test('WhatsApp link with wa.me/996708500935 exists', async ({ page }) => {
	await page.goto('/');

	// The floating WhatsAppButton renders an <a> with href="https://wa.me/996708500935"
	const waLink = page.locator('a[href*="wa.me/996708500935"]').first();
	await expect(waLink).toBeAttached();
});
