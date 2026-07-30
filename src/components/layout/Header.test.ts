import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { init, addMessages } from 'svelte-i18n';
import ru from '@/lib/i18n/locales/ru.json';
import Header from '@/components/layout/Header.svelte';

beforeEach(() => {
	addMessages('ru', ru);
	init({ fallbackLocale: 'ru', initialLocale: 'ru' });
});

describe('Header', () => {
	it('бургер-меню скрыто по умолчанию', () => {
		render(Header);
		const toggle = screen.getByLabelText('menu');
		expect(toggle).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByRole('link', { name: 'Услуги' })).toHaveAttribute('href', '#services');
	});

	it('клик по бургеру открывает мобильное меню', async () => {
		render(Header);
		const toggle = screen.getByLabelText('menu');
		await fireEvent.click(toggle);
		expect(toggle).toHaveAttribute('aria-expanded', 'true');
	});
});
