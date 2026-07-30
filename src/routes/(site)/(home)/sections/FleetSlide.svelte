<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { FleetPhoto } from '@/lib/data/fleet';

	interface Props {
		photo: FleetPhoto;
		index: number;
		total: number;
	}

	let { photo, index, total }: Props = $props();
</script>

<figure
	class="fleet-slide"
	data-slide-index={index}
	role="group"
	aria-roledescription={$_('home.fleet.slideRole')}
	aria-label="{index + 1} / {total}: {$_(photo.captionKey)}"
>
	<picture>
		<source
			type="image/avif"
			srcset="{photo.imageBase}-480.avif 480w, {photo.imageBase}-960.avif 960w"
			sizes="(min-width: 64rem) 50vw, calc(100vw - 2.5rem)"
		/>
		<img
			src="{photo.imageBase}-960.webp"
			srcset="{photo.imageBase}-480.webp 480w, {photo.imageBase}-960.webp 960w"
			sizes="(min-width: 64rem) 50vw, calc(100vw - 2.5rem)"
			width="960"
			height="1280"
			alt={$_(photo.altKey)}
			loading="lazy"
			decoding="async"
		/>
	</picture>
	<span aria-hidden="true">
		{$_('home.fleet.frame')} / {String(index + 1).padStart(2, '0')}
	</span>
</figure>

<style lang="scss">
	.fleet-slide {
		position: relative;
		display: grid;
		aspect-ratio: 4 / 5;
		overflow: hidden;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		background:
			linear-gradient(
				90deg,
				transparent 49.8%,
				rgb(var(--rgb-surface) / 0.06) 50% 50.2%,
				transparent 50.2%
			),
			var(--color-ink-soft);
		isolation: isolate;

		picture,
		img {
			width: 100%;
			height: 100%;
		}

		picture {
			position: absolute;
			inset: 0;
		}

		img {
			object-fit: cover;
		}

		> span {
			position: absolute;
			right: 14px;
			bottom: 14px;
			z-index: 1;
			padding: 7px 9px;
			color: var(--color-ink);
			background: var(--color-accent);
			border-radius: var(--radius-sm);
			font-family: var(--font-mono);
			font-size: 0.625rem;
			font-weight: 700;
			letter-spacing: 0.08em;
		}

		@media (min-width: 64rem) {
			aspect-ratio: 4 / 3;

			img {
				object-fit: contain;
			}
		}
	}
</style>
