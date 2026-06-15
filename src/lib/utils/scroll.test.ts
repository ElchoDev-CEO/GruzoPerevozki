import { describe, it, expect, vi, beforeEach } from 'vitest';
import { smoothScrollToId, scrollToTop } from '@/lib/utils/scroll';

describe('scroll helpers', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('smoothScrollToId вызывает scrollIntoView у найденного элемента', () => {
		const el = document.createElement('div');
		el.id = 'target';
		const spy = vi.fn();
		el.scrollIntoView = spy;
		document.body.appendChild(el);

		smoothScrollToId('target');
		expect(spy).toHaveBeenCalledOnce();

		document.body.removeChild(el);
	});

	it('smoothScrollToId — no-op для отсутствующего id', () => {
		expect(() => smoothScrollToId('does-not-exist')).not.toThrow();
	});

	it('scrollToTop вызывает window.scrollTo', () => {
		const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
		scrollToTop();
		expect(spy).toHaveBeenCalledOnce();
	});
});
