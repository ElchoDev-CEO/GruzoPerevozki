<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { processSteps } from '@/lib/data/process';
</script>

<section id="about" class="process section-space" tabindex="-1">
	<div class="container process__layout">
		<div class="process__intro motion-reveal">
			<SectionHeading
				eyebrow={$_('home.process.eyebrow')}
				title={$_('home.process.h2')}
				subtitle={$_('home.process.sub')}
			/>

			<div class="process__route" aria-hidden="true">
				<span>{$_('home.process.routeStart')}</span>
				<div></div>
				<span>{$_('home.process.routeEnd')}</span>
			</div>
		</div>

		<ol class="process__steps">
			{#each processSteps as step}
				<li class="motion-reveal">
					<span class="process__code">{step.code}</span>
					<div>
						<h3>{$_(step.titleKey)}</h3>
						<p>{$_(step.descKey)}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style lang="scss">
	.process {
		background: var(--color-surface);

		&__layout {
			display: grid;
			gap: clamp(3rem, 7vw, 7rem);
		}

		&__intro {
			align-self: start;
			min-width: 0;
		}

		&__route {
			display: flex;
			align-items: center;
			gap: 14px;
			margin-top: 40px;
			color: var(--color-ink-muted);
			font-family: var(--font-mono);
			font-size: 0.625rem;
			font-weight: 700;
			letter-spacing: 0.1em;

			div {
				position: relative;
				flex: 1;
				height: 1px;
				background: var(--color-line);

				&::before,
				&::after {
					position: absolute;
					top: 50%;
					width: 7px;
					height: 7px;
					background: var(--color-accent);
					border-radius: 50%;
					content: '';
					transform: translateY(-50%);
				}

				&::before {
					left: 0;
				}

				&::after {
					right: 0;
				}
			}
		}

		&__steps {
			position: relative;
			display: grid;
			min-width: 0;
			list-style: none;

			&::before {
				position: absolute;
				top: 2rem;
				bottom: 2rem;
				left: 1.5rem;
				width: 1px;
				background: var(--color-line);
				content: '';
			}

			li {
				position: relative;
				display: grid;
				grid-template-columns: 3rem minmax(0, 1fr);
				gap: 24px;
				padding-block: 28px;
				border-bottom: 1px solid var(--color-line);

				&:first-child {
					padding-top: 0;
				}

				&:last-child {
					padding-bottom: 0;
					border-bottom: 0;
				}

				h3 {
					color: var(--color-ink);
					font-size: clamp(1.25rem, 2vw, 1.625rem);
					font-weight: 700;
				}

				p {
					max-width: 56ch;
					margin-top: 10px;
					color: var(--color-ink-muted);
				}
			}
		}

		&__code {
			position: relative;
			z-index: 1;
			display: grid;
			width: 3rem;
			height: 3rem;
			place-items: center;
			color: var(--color-ink);
			background: var(--color-accent);
			border-radius: 50%;
			font-family: var(--font-mono);
			font-size: 0.6875rem;
			font-weight: 700;
		}

		@media (min-width: 56rem) {
			&__layout {
				grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
			}

			&__intro {
				position: sticky;
				top: calc(var(--header-h) + 2rem);
			}
		}

		@media (max-width: 39.99rem) {
			&__route {
				display: none;
			}

			&__steps {
				&::before {
					left: 1.25rem;
				}

				li {
					grid-template-columns: 2.5rem minmax(0, 1fr);
					gap: 18px;
				}
			}

			&__code {
				width: 2.5rem;
				height: 2.5rem;
			}
		}
	}
</style>
