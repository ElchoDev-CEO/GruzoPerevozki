const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' &&
	window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const behavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');

export const smoothScrollToId = (id: string): void => {
	const el = document.getElementById(id);
	el?.scrollIntoView({ behavior: behavior() });
};

export const scrollToTop = (): void => {
	window.scrollTo({ top: 0, behavior: behavior() });
};
