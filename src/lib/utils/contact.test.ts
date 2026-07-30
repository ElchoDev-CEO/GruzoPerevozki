import { describe, it, expect } from 'vitest';
import { telHref, waHref } from '@/lib/utils/contact';

describe('contact href builders', () => {
	it('telHref убирает пробелы и добавляет схему tel:', () => {
		expect(telHref('+996 555 123 456')).toBe('tel:+996555123456');
	});
	it('waHref строит ссылку wa.me только из цифр', () => {
		expect(waHref('996555123456')).toBe('https://wa.me/996555123456');
	});
	it('waHref убирает + и пробелы', () => {
		expect(waHref('+996 555 123 456')).toBe('https://wa.me/996555123456');
	});
	it('waHref добавляет закодированное сообщение', () => {
		expect(waHref('+996 555 123 456', 'Здравствуйте, нужен расчёт')).toBe(
			'https://wa.me/996555123456?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D0%BD%D1%83%D0%B6%D0%B5%D0%BD%20%D1%80%D0%B0%D1%81%D1%87%D1%91%D1%82'
		);
	});
	it('waHref игнорирует пустое сообщение', () => {
		expect(waHref('996555123456', '   ')).toBe('https://wa.me/996555123456');
	});
});
