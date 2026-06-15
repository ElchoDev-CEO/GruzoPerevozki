export const lazyIframe = (node: HTMLIFrameElement, src: string) => {
	const load = (): void => {
		if (!node.getAttribute('src')) node.setAttribute('src', src);
	};

	if (typeof IntersectionObserver === 'undefined') {
		load();
		return { destroy: (): void => {} };
	}

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				load();
				observer.disconnect();
			}
		},
		{ rootMargin: '200px' }
	);
	observer.observe(node);

	return {
		destroy: (): void => observer.disconnect()
	};
};
