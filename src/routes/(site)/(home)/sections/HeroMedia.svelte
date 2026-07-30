<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<figure class="hero-media">
	<picture>
		<source
			type="image/avif"
			srcset="/images/hero-truck-480.avif 480w, /images/hero-truck-720.avif 720w, /images/hero-truck-960.avif 960w"
			sizes="(min-width: 832px) 43vw, 87vw"
		/>
		<source
			type="image/webp"
			srcset="/images/hero-truck-480.webp 480w, /images/hero-truck-720.webp 720w, /images/hero-truck-960.webp 960w"
			sizes="(min-width: 832px) 43vw, 87vw"
		/>
		<img
			src="/images/hero-truck.jpg"
			alt={$_('home.meta.ogImageAlt')}
			width="1080"
			height="1440"
			fetchpriority="high"
		/>
	</picture>

	<div class="hero-media__route" aria-hidden="true">
		<svg viewBox="0 0 140 210">
			<path d="M24 188C34 141 111 151 107 101S43 69 69 20"></path>
			<circle cx="24" cy="188" r="5"></circle>
			<circle cx="69" cy="20" r="5"></circle>
		</svg>
	</div>

	<div class="hero-media__route-card">
		<span>{$_('home.hero.routeLabel')}</span>
		<strong>{$_('home.hero.routeTitle')}</strong>
		<small>{$_('home.hero.routeNote')}</small>
	</div>

	<figcaption>{$_('home.hero.imageNote')}</figcaption>
</figure>

<style lang="scss">
	@keyframes hero-media-enter {
		from {
			transform: scale(1.025);
		}

		to {
			transform: scale(1);
		}
	}

	.hero-media {
		position: relative;
		min-width: 0;
		overflow: hidden;
		background: var(--color-ink-soft);
		border: 1px solid var(--color-line-dark);
		border-radius: var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-md);
		box-shadow: var(--shadow-md);
		isolation: isolate;

		&::after {
			position: absolute;
			inset: 0;
			z-index: 1;
			pointer-events: none;
			background: linear-gradient(180deg, transparent 42%, rgb(var(--rgb-ink) / 0.76));
			content: '';
		}

		picture {
			aspect-ratio: 4 / 5;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: 50% 68%;
			}
		}

		figcaption {
			position: absolute;
			right: 18px;
			bottom: 14px;
			z-index: 3;
			color: rgb(var(--rgb-surface) / 0.7);
			font-family: var(--font-mono);
			font-size: 0.625rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		&__route {
			position: absolute;
			top: 4%;
			right: 3%;
			z-index: 2;
			width: 38%;
			color: var(--color-accent);

			svg {
				width: 100%;
				filter: drop-shadow(0 4px 12px rgb(var(--rgb-ink) / 0.38));

				path {
					fill: none;
					stroke: currentColor;
					stroke-width: 2;
					stroke-dasharray: 5 7;
					stroke-linecap: round;
				}

				circle {
					fill: currentColor;
					stroke: var(--color-ink);
					stroke-width: 3;
				}
			}
		}

		&__route-card {
			position: absolute;
			left: clamp(1rem, 3vw, 2rem);
			bottom: clamp(2.5rem, 5vw, 4rem);
			z-index: 2;
			display: grid;
			max-width: min(18rem, calc(100% - 2rem));
			padding: 18px 20px;
			color: var(--color-ink);
			background: rgb(var(--rgb-on-dark) / 0.94);
			border-left: 4px solid var(--color-accent);
			border-radius: var(--radius-sm);
			box-shadow: var(--shadow-sm);

			span {
				font-family: var(--font-mono);
				font-size: 0.625rem;
				font-weight: 700;
				letter-spacing: 0.12em;
				text-transform: uppercase;
			}

			strong {
				margin-top: 6px;
				font-size: 1.125rem;
			}

			small {
				margin-top: 5px;
				color: var(--color-ink-muted);
				font-size: 0.75rem;
				line-height: 1.45;
			}
		}

		@media (max-width: 51.99rem) {
			picture {
				aspect-ratio: 16 / 9;
			}
		}

		@media (max-width: 39.99rem) {
			border-radius: var(--radius-lg);

			picture {
				aspect-ratio: 5 / 4;
			}

			&__route {
				display: none;
			}

			&__route-card {
				bottom: 34px;
				padding: 14px 16px;
			}
		}

		@media (min-width: 48rem) and (prefers-reduced-motion: no-preference) {
			animation: hero-media-enter 900ms var(--ease-out) 120ms forwards;
		}
	}
</style>
