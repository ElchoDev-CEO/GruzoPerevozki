import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { init, addMessages } from 'svelte-i18n';
import ru from '@/lib/i18n/locales/ru.json';
import Reviews from '@/routes/(site)/(home)/sections/Reviews.svelte';

beforeEach(() => {
	addMessages('ru', ru);
	init({ fallbackLocale: 'ru', initialLocale: 'ru' });
});

describe('Reviews carousel', () => {
	it('по умолчанию показывает первый отзыв', () => {
		render(Reviews);
		expect(screen.getByText('Азамат Кадыров')).toBeInTheDocument();
	});

	it('кнопка "вперёд" показывает второй отзыв', async () => {
		render(Reviews);
		await fireEvent.click(screen.getByLabelText('Next review'));
		expect(screen.getByText('Гульнара Садыкова')).toBeInTheDocument();
	});

	it('кнопка "назад" с первого заворачивает на последний', async () => {
		render(Reviews);
		await fireEvent.click(screen.getByLabelText('Previous review'));
		expect(screen.getByText('Нурбек Токтогулов')).toBeInTheDocument();
	});
});
