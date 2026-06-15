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
});
