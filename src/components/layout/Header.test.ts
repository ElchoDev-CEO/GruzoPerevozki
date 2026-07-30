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
	it('переиспользует канонические ссылки навигации', () => {
		render(Header);

		expect(screen.getAllByRole('link', { name: 'Услуги' })[0]).toHaveAttribute('href', '#services');
		expect(screen.getAllByRole('link', { name: 'Транспорт' })[0]).toHaveAttribute(
			'href',
			'#transport'
		);
	});

	it('открывает мобильную навигацию нативным details', async () => {
		render(Header);
		const toggle = screen.getByLabelText('Меню навигации');

		await fireEvent.click(toggle);
		expect(toggle.closest('details')).toHaveAttribute('open');
	});
});
