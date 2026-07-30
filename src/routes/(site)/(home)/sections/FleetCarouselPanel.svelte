<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@/components/ui/Icon.svelte';
	import type { FleetPhoto } from '@/lib/data/fleet';

	interface Props {
		photos: readonly FleetPhoto[];
		activeIndex: number;
		lastIndex: number;
		autoplayPaused: boolean;
		autoplayRunning: boolean;
		reducedMotion: boolean;
		autoplayDelay: number;
		onNavigate: (index: number) => void;
		onToggleAutoplay: () => void;
	}

	let {
		photos,
		activeIndex,
		lastIndex,
		autoplayPaused,
		autoplayRunning,
		reducedMotion,
		autoplayDelay,
		onNavigate,
		onToggleAutoplay
	}: Props = $props();

	const activePhoto = $derived(photos[activeIndex]);
	const autoplayLabel = $derived(
		reducedMotion
			? $_('home.fleet.autoplayReduced')
			: autoplayPaused
				? $_('home.fleet.autoplayStart')
				: $_('home.fleet.autoplayPause')
	);
	const autoplayDuration = $derived(
		$_('home.fleet.autoplayDuration', { values: { seconds: autoplayDelay / 1000 } })
	);

	const handleKeydown = (event: KeyboardEvent): void => {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			onNavigate(activeIndex - 1);
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			onNavigate(activeIndex + 1);
		}

		if (event.key === 'Home') {
			event.preventDefault();
			onNavigate(0);
		}

		if (event.key === 'End') {
			event.preventDefault();
			onNavigate(lastIndex);
		}
	};
</script>

<div class="fleet-panel">
	<div
		class="fleet-panel__status"
		aria-live={autoplayRunning ? 'off' : 'polite'}
		aria-atomic="true"
	>
		<p>
			{String(activeIndex + 1).padStart(2, '0')}
			<span>/ {String(photos.length).padStart(2, '0')}</span>
		</p>
		{#if activePhoto}
			<h3>{$_(activePhoto.captionKey)}</h3>
			<p>{$_(activePhoto.descriptionKey)}</p>
		{/if}
	</div>

	<div
		class="fleet-panel__progress"
		data-state={autoplayRunning ? 'running' : 'paused'}
		style={`--autoplay-duration: ${autoplayDelay}ms`}
		aria-hidden="true"
	>
		<div class="fleet-panel__progress-meta">
			<span>{$_('home.fleet.autoplayProgress')}</span>
			<span>
				{autoplayRunning ? autoplayDuration : $_('home.fleet.autoplayProgressPaused')}
			</span>
		</div>
		<div class="fleet-panel__progress-track">
			{#key activeIndex}
				<span class="fleet-panel__progress-fill"></span>
			{/key}
		</div>
	</div>

	<div class="fleet-panel__controls">
		<button
			type="button"
			class="fleet-panel__arrow fleet-panel__arrow--previous"
			aria-label={$_('home.fleet.previous')}
			title={$_('home.fleet.previous')}
			disabled={activeIndex === 0}
			onkeydown={handleKeydown}
			onclick={() => onNavigate(activeIndex - 1)}
		>
			<Icon name="arrow-right" size={21} strokeWidth={1.8} />
		</button>
		<button
			type="button"
			class="fleet-panel__arrow"
			aria-label={$_('home.fleet.next')}
			title={$_('home.fleet.next')}
			disabled={activeIndex === lastIndex}
			onkeydown={handleKeydown}
			onclick={() => onNavigate(activeIndex + 1)}
		>
			<Icon name="arrow-right" size={21} strokeWidth={1.8} />
		</button>
		<button
			type="button"
			class="fleet-panel__arrow fleet-panel__arrow--autoplay"
			aria-label={autoplayLabel}
			aria-pressed={autoplayPaused}
			title={autoplayLabel}
			disabled={reducedMotion || photos.length <= 1}
			onclick={onToggleAutoplay}
		>
			<Icon name={autoplayPaused ? 'play' : 'pause'} size={19} strokeWidth={1.9} />
		</button>
	</div>

	<div class="fleet-panel__thumbnails" role="group" aria-label={$_('home.fleet.thumbnailsLabel')}>
		{#each photos as photo, index (photo.id)}
			<button
				type="button"
				class="fleet-panel__thumbnail"
				aria-label="{index + 1}. {$_(photo.captionKey)}"
				aria-current={index === activeIndex ? 'true' : undefined}
				tabindex={index === activeIndex ? 0 : -1}
				onkeydown={handleKeydown}
				onclick={() => onNavigate(index)}
			>
				<picture>
					<source type="image/avif" srcset="{photo.imageBase}-480.avif" />
					<img
						src="{photo.imageBase}-480.webp"
						width="480"
						height="640"
						alt=""
						loading="lazy"
						decoding="async"
					/>
				</picture>
				<span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	.fleet-panel {
		display: flex;
		flex-direction: column;
		min-width: 0;

		&__status {
			min-height: 9.5rem;

			> p:first-child {
				color: var(--color-accent);
				font-family: var(--font-mono);
				font-size: 0.75rem;
				font-weight: 700;
				letter-spacing: 0.12em;

				span {
					color: var(--color-on-dark-muted);
				}
			}

			h3 {
				max-width: 16ch;
				margin-top: 18px;
				font-size: clamp(1.75rem, 3vw, 2.75rem);
				font-weight: 720;
			}

			> p:last-child {
				max-width: 34rem;
				margin-top: 14px;
				color: var(--color-on-dark-muted);
				line-height: 1.65;
			}
		}

		&__progress {
			--progress-play-state: paused;
			--progress-status-color: var(--color-on-dark-muted);

			display: grid;
			gap: 8px;
			margin-top: 24px;

			&[data-state='running'] {
				--progress-play-state: running;
				--progress-status-color: var(--color-accent);
			}

			&-meta {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 16px;
				color: var(--color-on-dark-muted);
				font-family: var(--font-mono);
				font-size: 0.625rem;
				font-weight: 700;
				letter-spacing: 0.1em;
				line-height: 1.2;
				text-transform: uppercase;

				span:last-child {
					color: var(--progress-status-color);
					transition: color var(--motion-fast) var(--ease-standard);
				}
			}

			&-track {
				position: relative;
				height: 2px;
				overflow: hidden;
				background: rgb(var(--rgb-surface) / 0.13);

				.fleet-panel__progress-fill {
					position: absolute;
					inset: 0;
					background: var(--color-accent);
					transform: scaleX(0);
					transform-origin: left center;
					animation: fleet-autoplay-progress var(--autoplay-duration) linear forwards;
					animation-play-state: var(--progress-play-state);
				}
			}
		}

		&__controls {
			display: flex;
			gap: 10px;
			margin-top: 18px;
		}

		&__arrow {
			display: grid;
			width: 48px;
			height: 48px;
			padding: 0;
			place-items: center;
			color: var(--color-on-dark);
			background: transparent;
			border: 1px solid var(--color-line-dark);
			border-radius: var(--radius-full);
			transition:
				color var(--motion-fast) var(--ease-standard),
				background-color var(--motion-fast) var(--ease-standard),
				border-color var(--motion-fast) var(--ease-standard),
				transform var(--motion-fast) var(--ease-out);

			&--previous {
				:global(.icon) {
					transform: rotate(180deg);
				}
			}

			&--autoplay {
				margin-left: 4px;

				&[aria-pressed='true'] {
					color: var(--color-ink);
					background: var(--color-accent);
					border-color: var(--color-accent);
				}
			}

			&:disabled {
				cursor: not-allowed;
				opacity: 0.35;
			}

			@media (hover: hover) and (pointer: fine) {
				&:not(:disabled):hover {
					color: var(--color-ink);
					background: var(--color-accent);
					border-color: var(--color-accent);
					transform: translateY(-2px);
				}
			}
		}

		&__thumbnails {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 8px;
			margin-top: 30px;
		}

		&__thumbnail {
			position: relative;
			display: grid;
			aspect-ratio: 1;
			min-width: 0;
			overflow: hidden;
			padding: 0;
			background: var(--color-ink-soft);
			border: 1px solid var(--color-line-dark);
			border-radius: var(--radius-sm);
			opacity: 0.58;
			transition:
				opacity var(--motion-fast) var(--ease-standard),
				border-color var(--motion-fast) var(--ease-standard),
				transform var(--motion-fast) var(--ease-out);

			picture,
			img {
				width: 100%;
				height: 100%;
			}

			img {
				object-fit: cover;
			}

			> span {
				position: absolute;
				right: 5px;
				bottom: 4px;
				padding: 2px 4px;
				color: var(--color-on-dark);
				background: rgb(var(--rgb-ink) / 0.78);
				border-radius: 3px;
				font-family: var(--font-mono);
				font-size: 0.5625rem;
				font-weight: 700;
			}

			&[aria-current='true'] {
				border-color: var(--color-accent);
				opacity: 1;
				box-shadow: inset 0 0 0 1px var(--color-accent);
			}

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					opacity: 1;
					transform: translateY(-2px);
				}
			}
		}

		@media (min-width: 64rem) {
			padding: 18px 10px 8px 0;

			&__progress {
				margin-top: auto;
			}
		}

		@media (max-width: 39.99rem) {
			&__status {
				min-height: 8.75rem;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			&__arrow,
			&__thumbnail {
				transition-property: color, background-color, border-color, opacity;

				&:hover {
					transform: none;
				}
			}
		}
	}

	@keyframes fleet-autoplay-progress {
		from {
			transform: scaleX(0);
		}

		to {
			transform: scaleX(1);
		}
	}
</style>
