<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { FleetPhoto } from '@/lib/data/fleet';
	import FleetCarouselPanel from './FleetCarouselPanel.svelte';
	import FleetSlide from './FleetSlide.svelte';

	interface Props {
		photos: readonly FleetPhoto[];
	}

	const AUTOPLAY_DELAY = 6000;

	let { photos }: Props = $props();

	let carousel = $state<HTMLElement>();
	let track = $state<HTMLElement>();
	let activeIndex = $state(0);
	let autoplayDirection = $state<1 | -1>(1);
	let autoplayPaused = $state(false);
	let hasFocusWithin = $state(false);
	let isHovered = $state(false);
	let isInViewport = $state(false);
	let pageVisible = $state(true);
	let reducedMotion = $state(true);
	let scrollFrame: number | undefined;

	const lastIndex = $derived(Math.max(photos.length - 1, 0));
	const autoplayRunning = $derived(
		photos.length > 1 &&
			!autoplayPaused &&
			!hasFocusWithin &&
			!isHovered &&
			isInViewport &&
			pageVisible &&
			!reducedMotion
	);

	const getSlide = (index: number): HTMLElement | undefined =>
		track?.querySelector<HTMLElement>(`[data-slide-index="${index}"]`) ?? undefined;

	const setActive = (index: number): void => {
		activeIndex = Math.min(Math.max(index, 0), lastIndex);
	};

	const goTo = (index: number, pauseAutoplay = false): void => {
		const nextIndex = Math.min(Math.max(index, 0), lastIndex);
		const slide = getSlide(nextIndex);

		if (pauseAutoplay) autoplayPaused = true;
		setActive(nextIndex);
		track?.scrollTo({
			left: slide?.offsetLeft ?? 0,
			behavior: reducedMotion ? 'auto' : 'smooth'
		});
	};

	const navigateManually = (index: number): void => {
		goTo(index, true);
	};

	const toggleAutoplay = (): void => {
		autoplayPaused = !autoplayPaused;
	};

	const syncActiveSlide = (): void => {
		const currentTrack = track;
		if (!currentTrack) return;

		let closestIndex = 0;
		let closestDistance = Number.POSITIVE_INFINITY;

		photos.forEach((_photo, index) => {
			const slide = getSlide(index);
			const distance = Math.abs((slide?.offsetLeft ?? 0) - currentTrack.scrollLeft);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = index;
			}
		});

		setActive(closestIndex);
	};

	const handleScroll = (): void => {
		if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame);
		scrollFrame = requestAnimationFrame(() => {
			scrollFrame = undefined;
			syncActiveSlide();
		});
	};

	$effect(() => {
		if (!carousel) return;

		const currentCarousel = carousel;
		const handleMouseEnter = (): void => {
			isHovered = true;
		};
		const handleMouseLeave = (): void => {
			isHovered = false;
		};
		const handleFocusIn = (): void => {
			hasFocusWithin = true;
		};
		const handleFocusOut = (event: FocusEvent): void => {
			const nextTarget = event.relatedTarget;
			hasFocusWithin = nextTarget instanceof Node && currentCarousel.contains(nextTarget);
		};

		currentCarousel.addEventListener('mouseenter', handleMouseEnter);
		currentCarousel.addEventListener('mouseleave', handleMouseLeave);
		currentCarousel.addEventListener('focusin', handleFocusIn);
		currentCarousel.addEventListener('focusout', handleFocusOut);

		const observer =
			typeof IntersectionObserver === 'undefined'
				? undefined
				: new IntersectionObserver(
						([entry]) => {
							isInViewport = entry.isIntersecting && entry.intersectionRatio >= 0.25;
						},
						{ threshold: [0, 0.25, 0.5] }
					);

		if (observer) observer.observe(currentCarousel);
		else isInViewport = true;

		return () => {
			currentCarousel.removeEventListener('mouseenter', handleMouseEnter);
			currentCarousel.removeEventListener('mouseleave', handleMouseLeave);
			currentCarousel.removeEventListener('focusin', handleFocusIn);
			currentCarousel.removeEventListener('focusout', handleFocusOut);
			observer?.disconnect();
		};
	});

	$effect(() => {
		const media =
			typeof window.matchMedia === 'function'
				? window.matchMedia('(prefers-reduced-motion: reduce)')
				: undefined;
		const syncMotionPreference = (): void => {
			reducedMotion = media?.matches ?? false;
		};
		const syncPageVisibility = (): void => {
			pageVisible = !document.hidden;
		};

		syncMotionPreference();
		syncPageVisibility();
		media?.addEventListener('change', syncMotionPreference);
		document.addEventListener('visibilitychange', syncPageVisibility);

		return () => {
			media?.removeEventListener('change', syncMotionPreference);
			document.removeEventListener('visibilitychange', syncPageVisibility);
		};
	});

	$effect(() => {
		if (!track) return;

		const currentTrack = track;
		const pauseAfterInteraction = (): void => {
			autoplayPaused = true;
		};

		currentTrack.addEventListener('pointerdown', pauseAfterInteraction, { passive: true });
		return () => currentTrack.removeEventListener('pointerdown', pauseAfterInteraction);
	});

	$effect(() => {
		if (!autoplayRunning) return;

		const nextDirection: 1 | -1 =
			activeIndex >= lastIndex ? -1 : activeIndex <= 0 ? 1 : autoplayDirection;
		const nextIndex = activeIndex + nextDirection;
		const timer = window.setTimeout(() => {
			autoplayDirection = nextDirection;
			goTo(nextIndex);
		}, AUTOPLAY_DELAY);

		return () => window.clearTimeout(timer);
	});

	$effect(() => {
		if (!track) return;

		const currentTrack = track;
		const observer =
			typeof ResizeObserver === 'undefined'
				? undefined
				: new ResizeObserver(() => {
						const activeSlide = getSlide(activeIndex);
						currentTrack.scrollTo({ left: activeSlide?.offsetLeft ?? 0, behavior: 'auto' });
					});

		observer?.observe(currentTrack);
		return () => {
			observer?.disconnect();
			if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame);
		};
	});
</script>

<div
	class="fleet-carousel"
	bind:this={carousel}
	role="region"
	aria-roledescription={$_('home.fleet.carouselRole')}
	aria-label={$_('home.fleet.carouselLabel')}
>
	<div class="fleet-carousel__stage">
		<div class="fleet-carousel__viewport">
			<div class="fleet-carousel__track" bind:this={track} onscroll={handleScroll}>
				{#each photos as photo, index (photo.id)}
					<FleetSlide {photo} {index} total={photos.length} />
				{/each}
			</div>
		</div>

		<FleetCarouselPanel
			{photos}
			{activeIndex}
			{lastIndex}
			{autoplayPaused}
			{autoplayRunning}
			{reducedMotion}
			onNavigate={navigateManually}
			onToggleAutoplay={toggleAutoplay}
		/>
	</div>
</div>

<style lang="scss">
	.fleet-carousel {
		padding: clamp(1rem, 2.2vw, 1.75rem);
		color: var(--color-on-dark);
		background: var(--color-ink);
		border: 1px solid var(--color-line-dark);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-md);

		&__stage {
			display: grid;
			gap: clamp(1.5rem, 3vw, 3rem);
		}

		&__viewport {
			min-width: 0;
			overflow: hidden;
			background: var(--color-ink-soft);
			border: 1px solid var(--color-line-dark);
			border-radius: calc(var(--radius-xl) - 0.5rem);
		}

		&__track {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: 100%;
			overflow-x: auto;
			overscroll-behavior-x: contain;
			scrollbar-width: none;
			scroll-snap-type: x mandatory;
			touch-action: pan-x pan-y;

			&::-webkit-scrollbar {
				display: none;
			}

			@media (prefers-reduced-motion: reduce) {
				scroll-behavior: auto;
			}
		}

		@media (min-width: 64rem) {
			&__stage {
				grid-template-columns: minmax(0, 1.6fr) minmax(19rem, 0.7fr);
				align-items: stretch;
			}
		}

		@media (max-width: 39.99rem) {
			border-radius: var(--radius-lg);

			&__viewport {
				border-radius: var(--radius-md);
			}
		}
	}
</style>
