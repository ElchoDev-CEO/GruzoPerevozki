import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from '@/lib/utils/carousel';

describe('carousel', () => {
	it('nextIndex увеличивает индекс', () => {
		expect(nextIndex(0, 4)).toBe(1);
	});
	it('nextIndex заворачивается с последнего на первый', () => {
		expect(nextIndex(3, 4)).toBe(0);
	});
	it('prevIndex уменьшает индекс', () => {
		expect(prevIndex(2, 4)).toBe(1);
	});
	it('prevIndex заворачивается с первого на последний', () => {
		expect(prevIndex(0, 4)).toBe(3);
	});
	it('length=1 всегда возвращает 0', () => {
		expect(nextIndex(0, 1)).toBe(0);
		expect(prevIndex(0, 1)).toBe(0);
	});
	it('length=0 безопасно возвращает 0 (нет деления на ноль)', () => {
		expect(nextIndex(0, 0)).toBe(0);
		expect(prevIndex(0, 0)).toBe(0);
	});
});
