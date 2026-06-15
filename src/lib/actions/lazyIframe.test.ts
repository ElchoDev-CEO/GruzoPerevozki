import { describe, it, expect, vi } from 'vitest';
import { lazyIframe } from '@/lib/actions/lazyIframe';

describe('lazyIframe action', () => {
	it('без IntersectionObserver выставляет src сразу', () => {
		const original = globalThis.IntersectionObserver;
		// @ts-expect-error эмулируем отсутствие API
		globalThis.IntersectionObserver = undefined;

		const iframe = document.createElement('iframe');
		lazyIframe(iframe, 'https://example.com/map');
		expect(iframe.getAttribute('src')).toBe('https://example.com/map');

		globalThis.IntersectionObserver = original;
	});

	it('возвращает объект с destroy', () => {
		const iframe = document.createElement('iframe');
		const ret = lazyIframe(iframe, 'https://example.com/map');
		expect(typeof ret?.destroy).toBe('function');
		ret?.destroy?.();
	});
});
