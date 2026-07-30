<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { ServiceItem } from '@/lib/data/services';

	interface Props {
		item: ServiceItem;
	}

	let { item }: Props = $props();

	const avifSrcset = $derived(
		`${item.imageBase}-480.avif 480w, ${item.imageBase}-${item.imageLargeWidth}.avif ${item.imageLargeWidth}w`
	);
	const webpSrcset = $derived(
		`${item.imageBase}-480.webp 480w, ${item.imageBase}-${item.imageLargeWidth}.webp ${item.imageLargeWidth}w`
	);
	const sizes = $derived(
		item.featured
			? '(min-width: 1024px) 52vw, (min-width: 768px) 66vw, 100vw'
			: '(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw'
	);
</script>

<article class="service-card" class:service-card--featured={item.featured}>
	<picture class="service-card__picture">
		<source type="image/avif" srcset={avifSrcset} {sizes} />
		<source type="image/webp" srcset={webpSrcset} {sizes} />
		<img
			src="{item.imageBase}.jpg"
			alt=""
			width={item.imageWidth}
			height={item.imageHeight}
			loading="lazy"
			decoding="async"
		/>
	</picture>
	<div class="service-card__shade" aria-hidden="true"></div>
	<div class="service-card__content">
		<span class="service-card__code">{item.code}</span>
		<div>
			<h3>{$_(item.titleKey)}</h3>
			<p>{$_(item.descKey)}</p>
		</div>
	</div>
</article>

<style lang="scss">
	.service-card {
		position: relative;
		display: grid;
		min-height: 22rem;
		overflow: hidden;
		color: var(--color-on-dark);
		background: var(--color-ink-soft);
		border-radius: var(--radius-lg);
		isolation: isolate;

		&--featured {
			min-height: 30rem;
		}

		&__picture,
		&__shade {
			position: absolute;
			inset: 0;
			z-index: -2;
		}

		&__picture {
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				transition: transform var(--motion-slow) var(--ease-out);
			}
		}

		&__shade {
			z-index: -1;
			background:
				linear-gradient(180deg, rgb(var(--rgb-ink) / 0.08) 20%, rgb(var(--rgb-ink) / 0.9) 100%),
				linear-gradient(90deg, rgb(var(--rgb-ink) / 0.42), transparent 70%);
		}

		&__content {
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			gap: 24px;
			margin-top: auto;
			padding: clamp(1.5rem, 3vw, 2.25rem);

			h3 {
				max-width: 22ch;
				font-size: clamp(1.5rem, 2.4vw, 2.35rem);
				font-weight: 700;
			}

			p {
				max-width: 52ch;
				margin-top: 12px;
				color: var(--color-on-dark-muted);
				font-size: 0.9375rem;
				line-height: 1.6;
			}
		}

		&__code {
			align-self: flex-start;
			flex: 0 0 auto;
			color: var(--color-accent);
			font-family: var(--font-mono);
			font-size: 0.75rem;
			font-weight: 700;
			letter-spacing: 0.12em;
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				.service-card__picture {
					img {
						transform: scale(1.035);
					}
				}
			}
		}

		@media (max-width: 47.99rem) {
			min-height: 22rem;

			&__content {
				flex-direction: column;
				align-items: flex-start;
				gap: 48px;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			&__picture {
				img {
					transition: none;
				}
			}

			&:hover {
				.service-card__picture {
					img {
						transform: none;
					}
				}
			}
		}
	}
</style>
