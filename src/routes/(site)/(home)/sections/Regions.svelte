<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@/components/ui/Icon.svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { regions } from '@/lib/data/regions';
</script>

<section id="regions" class="regions section-space" tabindex="-1">
	<div class="container">
		<div class="regions__heading motion-reveal">
			<SectionHeading
				eyebrow={$_('home.regions.eyebrow')}
				title={$_('home.regions.h2')}
				subtitle={$_('home.regions.sub')}
			/>
		</div>

		<div class="regions__panel">
			<div class="regions__visual motion-reveal">
				<div class="regions__visual-label" aria-hidden="true">
					<span>{$_('home.regions.gridLabel')}</span>
					<strong>{$_('home.regions.coordinates')}</strong>
				</div>

				<svg viewBox="0 0 620 390" aria-hidden="true">
					<path
						class="regions__country"
						d="M51 185 126 91l111 24 67-54 79 37 63-22 114 88-42 72 34 52-104 42-78-32-88 43-94-31-51 35-87-80Z"
					></path>
					<path class="regions__path" d="M91 244c77-110 126 8 201-79s118 120 238 14"></path>
					<circle cx="91" cy="244" r="7"></circle>
					<circle cx="214" cy="193" r="5"></circle>
					<circle cx="326" cy="158" r="5"></circle>
					<circle cx="429" cy="228" r="5"></circle>
					<circle cx="530" cy="179" r="7"></circle>
				</svg>

				<div class="regions__endpoints">
					<div>
						<Icon name="pin" size={18} />
						<span>{$_('home.regions.routeStart')}</span>
					</div>
					<div>
						<Icon name="pin" size={18} />
						<span>{$_('home.regions.routeEnd')}</span>
					</div>
				</div>
			</div>

			<div class="regions__list-wrap motion-reveal">
				<ul class="regions__list">
					{#each regions as region}
						<li>
							<span>{region.code}</span>
							<strong>{$_(region.nameKey)}</strong>
						</li>
					{/each}
				</ul>
				<p class="regions__note">{$_('home.regions.routeNote')}</p>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.regions {
		background: var(--color-canvas-muted);

		&__heading {
			max-width: 54rem;
			margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
		}

		&__panel {
			display: grid;
			overflow: hidden;
			color: var(--color-on-dark);
			background: var(--color-ink);
			border-radius: var(--radius-xl);
			box-shadow: var(--shadow-md);
		}

		&__visual {
			position: relative;
			min-height: 27rem;
			padding: clamp(1.5rem, 4vw, 3rem);
			overflow: hidden;
			background:
				radial-gradient(circle at 40% 45%, rgb(var(--rgb-accent) / 0.12), transparent 16rem),
				linear-gradient(145deg, var(--color-ink-soft), var(--color-ink));
			border-bottom: 1px solid var(--color-line-dark);

			&::before {
				position: absolute;
				inset: 0;
				background-image:
					linear-gradient(var(--color-line-dark) 1px, transparent 1px),
					linear-gradient(90deg, var(--color-line-dark) 1px, transparent 1px);
				background-size: 48px 48px;
				content: '';
				mask-image: radial-gradient(circle at center, black, transparent 74%);
			}

			svg {
				position: absolute;
				inset: 15% 6% 12%;
				width: 88%;
				height: 73%;

				.regions__country {
					fill: rgb(var(--rgb-surface) / 0.035);
					stroke: rgb(var(--rgb-surface) / 0.2);
					stroke-width: 2;
				}

				.regions__path {
					fill: none;
					stroke: var(--color-accent);
					stroke-width: 4;
					stroke-dasharray: 9 10;
					stroke-linecap: round;
				}

				circle {
					fill: var(--color-accent);
					stroke: var(--color-ink);
					stroke-width: 4;
				}
			}
		}

		&__visual-label {
			position: relative;
			z-index: 1;
			display: flex;
			justify-content: space-between;
			gap: 16px;
			font-family: var(--font-mono);
			font-size: 0.6875rem;
			letter-spacing: 0.1em;

			span {
				color: var(--color-accent);
			}

			strong {
				color: var(--color-on-dark-muted);
				font-weight: 500;
			}
		}

		&__endpoints {
			position: absolute;
			right: clamp(1.5rem, 4vw, 3rem);
			bottom: clamp(1.5rem, 4vw, 3rem);
			left: clamp(1.5rem, 4vw, 3rem);
			z-index: 1;
			display: flex;
			justify-content: space-between;
			gap: 16px;

			div {
				display: flex;
				align-items: center;
				gap: 8px;
				font-size: 0.75rem;

				:global(.icon) {
					color: var(--color-accent);
				}
			}
		}

		&__list-wrap {
			align-self: center;
			padding: clamp(1.5rem, 5vw, 4rem);
		}

		&__list {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			list-style: none;

			li {
				display: grid;
				grid-template-columns: 3.25rem minmax(0, 1fr);
				gap: 12px;
				align-items: center;
				min-height: 70px;
				border-bottom: 1px solid var(--color-line-dark);

				&:nth-last-child(-n + 2) {
					border-bottom: 0;
				}

				span {
					color: var(--color-accent);
					font-family: var(--font-mono);
					font-size: 0.625rem;
					letter-spacing: 0.08em;
				}

				strong {
					font-size: 0.9375rem;
					font-weight: 600;
					line-height: 1.35;
				}
			}
		}

		&__note {
			max-width: 54ch;
			margin-top: 28px;
			color: var(--color-on-dark-muted);
			font-size: 0.875rem;
		}

		@media (min-width: 64rem) {
			&__panel {
				grid-template-columns: minmax(0, 1.12fr) minmax(24rem, 0.88fr);
			}

			&__visual {
				border-right: 1px solid var(--color-line-dark);
				border-bottom: 0;
			}
		}

		@media (max-width: 29.99rem) {
			&__panel {
				border-radius: var(--radius-lg);
			}

			&__visual {
				min-height: 22rem;
			}

			&__endpoints {
				flex-direction: column;
			}

			&__list {
				grid-template-columns: 1fr;

				li {
					&:nth-last-child(2) {
						border-bottom: 1px solid var(--color-line-dark);
					}
				}
			}
		}
	}
</style>
