<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { FleetPhoto } from '@/lib/data/fleet';
	import FleetCarouselPanel from './FleetCarouselPanel.svelte';
	import FleetSlide from './FleetSlide.svelte';

	interface Props {
		photos: readonly FleetPhoto[];
	}

	const AUTOPLAY_DELAY = 3000;
	const toCountdownSeconds = (milliseconds: number): number =>
		Math.max(1, Math.ceil(milliseconds / 1000));

	let { photos }: Props = $props();

	let carousel = $state<HTMLElement>();
	let track = $state<HTMLElement>();
	let activeIndex = $state(0);
	let autoplayDirection = $state<1 | -1>(1);
	let hasKeyboardFocusWithin = $state(false);
	let isHovered = $state(false);
	let isInViewport = $state(false);
	let isPointerInteracting = $state(false);
	let pageVisible = $state(true);
	let reducedMotion = $state(true);
	let scrollFrame: number | undefined;
	let programmaticScrollTarget: number | undefined;
	let autoplayRemaining = AUTOPLAY_DELAY;
	let autoplaySeconds = $state(toCountdownSeconds(AUTOPLAY_DELAY));

	const lastIndex = $derived(Math.max(photos.length - 1, 0));
	const autoplayRunning = $derived(
		photos.length > 1 &&
			!hasKeyboardFocusWithin &&
			!isHovered &&
			isInViewport &&
			!isPointerInteracting &&
			pageVisible &&
			!reducedMotion
	);

	const getSlide = (index: number): HTMLElement | undefined =>
		track?.querySelector<HTMLElement>(`[data-slide-index="${index}"]`) ?? undefined;

	const setActive = (index: number): void => {
		const nextIndex = Math.min(Math.max(index, 0), lastIndex);

		if (nextIndex !== activeIndex) {
			autoplayRemaining = AUTOPLAY_DELAY;
			autoplaySeconds = toCountdownSeconds(AUTOPLAY_DELAY);
		}
		activeIndex = nextIndex;
	};

	const goTo = (index: number): void => {
		const nextIndex = Math.min(Math.max(index, 0), lastIndex);
		const slide = getSlide(nextIndex);
		const currentTrack = track;

		setActive(nextIndex);
		if (!currentTrack || !slide) return;

		programmaticScrollTarget = slide.offsetLeft;
		currentTrack.scrollTo({
			left: programmaticScrollTarget,
			behavior: reducedMotion ? 'auto' : 'smooth'
		});

		if (Math.abs(currentTrack.scrollLeft - programmaticScrollTarget) <= 1) {
			programmaticScrollTarget = undefined;
		}
	};

	const navigateManually = (index: number): void => {
		goTo(index);
	};

	const syncActiveSlide = (): void => {
		const currentTrack = track;
		if (!currentTrack) return;

		if (programmaticScrollTarget !== undefined) {
			if (Math.abs(currentTrack.scrollLeft - programmaticScrollTarget) > 1) return;
			programmaticScrollTarget = undefined;
		}

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

	const handleScrollEnd = (): void => {
		programmaticScrollTarget = undefined;
		syncActiveSlide();
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
		const handlePointerDown = (): void => {
			hasKeyboardFocusWithin = false;
		};
		const handleKeyDown = (): void => {
			hasKeyboardFocusWithin = true;
		};
		const handleFocusIn = (event: FocusEvent): void => {
			const target = event.target;
			hasKeyboardFocusWithin = target instanceof Element && target.matches(':focus-visible');
		};
		const handleFocusOut = (event: FocusEvent): void => {
			const nextTarget = event.relatedTarget;
			if (!(nextTarget instanceof Node && currentCarousel.contains(nextTarget))) {
				hasKeyboardFocusWithin = false;
			}
		};

		currentCarousel.addEventListener('mouseenter', handleMouseEnter);
		currentCarousel.addEventListener('mouseleave', handleMouseLeave);
		currentCarousel.addEventListener('pointerdown', handlePointerDown, { passive: true });
		currentCarousel.addEventListener('keydown', handleKeyDown);
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
			currentCarousel.removeEventListener('pointerdown', handlePointerDown);
			currentCarousel.removeEventListener('keydown', handleKeyDown);
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
		const handlePointerDown = (): void => {
			programmaticScrollTarget = undefined;
			isPointerInteracting = true;
		};
		const handlePointerEnd = (): void => {
			isPointerInteracting = false;
		};

		currentTrack.addEventListener('pointerdown', handlePointerDown, { passive: true });
		window.addEventListener('pointerup', handlePointerEnd, { passive: true });
		window.addEventListener('pointercancel', handlePointerEnd, { passive: true });
		window.addEventListener('blur', handlePointerEnd);

		return () => {
			programmaticScrollTarget = undefined;
			currentTrack.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('pointerup', handlePointerEnd);
			window.removeEventListener('pointercancel', handlePointerEnd);
			window.removeEventListener('blur', handlePointerEnd);
		};
	});

	$effect(() => {
		if (!autoplayRunning) return;

		const cycleIndex = activeIndex;
		const nextDirection: 1 | -1 =
			activeIndex >= lastIndex ? -1 : activeIndex <= 0 ? 1 : autoplayDirection;
		const nextIndex = activeIndex + nextDirection;
		const cycleDuration = autoplayRemaining;
		const cycleStartedAt = performance.now();
		let cycleCompleted = false;
		const syncCountdown = (): void => {
			const elapsed = performance.now() - cycleStartedAt;
			autoplaySeconds = toCountdownSeconds(Math.max(cycleDuration - elapsed, 0));
		};

		syncCountdown();
		const countdownTimer = window.setInterval(syncCountdown, 100);
		const timer = window.setTimeout(() => {
			cycleCompleted = true;
			autoplayRemaining = AUTOPLAY_DELAY;
			autoplaySeconds = toCountdownSeconds(AUTOPLAY_DELAY);
			autoplayDirection = nextDirection;
			goTo(nextIndex);
		}, cycleDuration);

		return () => {
			window.clearInterval(countdownTimer);
			window.clearTimeout(timer);

			if (!cycleCompleted && activeIndex === cycleIndex) {
				const elapsed = performance.now() - cycleStartedAt;
				autoplayRemaining = Math.max(cycleDuration - elapsed, 0);
				autoplaySeconds = toCountdownSeconds(autoplayRemaining);
			}
		};
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
			<div
				class="fleet-carousel__track"
				bind:this={track}
				onscroll={handleScroll}
				onscrollend={handleScrollEnd}
			>
				{#each photos as photo, index (photo.id)}
					<FleetSlide {photo} {index} total={photos.length} />
				{/each}
			</div>
		</div>

		<FleetCarouselPanel
			{photos}
			{activeIndex}
			{lastIndex}
			{autoplayRunning}
			{autoplaySeconds}
			autoplayDelay={AUTOPLAY_DELAY}
			onNavigate={navigateManually}
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
