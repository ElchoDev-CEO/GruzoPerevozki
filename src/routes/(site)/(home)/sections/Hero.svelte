<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from '@/components/ui/Button.svelte';
	import Icon from '@/components/ui/Icon.svelte';
	import HeroMedia from './HeroMedia.svelte';
	import { site } from '@/lib/config/site';
	import { telHref, waHref } from '@/lib/utils/contact';

	const whatsappHref = $derived(waHref(site.whatsapp, $_('home.contact.whatsappMessage')));

	const signals = [
		{ valueKey: 'home.hero.signal1v', labelKey: 'home.hero.signal1l' },
		{ valueKey: 'home.hero.signal2v', labelKey: 'home.hero.signal2l' },
		{ valueKey: 'home.hero.signal3v', labelKey: 'home.hero.signal3l' }
	] as const;
</script>

<section class="hero" aria-labelledby="hero-title">
	<div class="hero__grid-pattern" aria-hidden="true"></div>

	<div class="container hero__main">
		<div class="hero__content">
			<p class="hero__eyebrow">{$_('home.hero.eyebrow')}</p>
			<h1 id="hero-title">
				<span>{$_('home.hero.heading')}</span>
				<strong>{$_('home.hero.headingAccent')}</strong>
			</h1>
			<p class="hero__lead">{$_('home.hero.sub')}</p>

			<div class="hero__actions">
				<Button
					variant="primary"
					size="large"
					href={whatsappHref}
					target="_blank"
					rel="noopener noreferrer"
					ariaLabel="{$_('home.hero.btnPrimary')}, {$_('home.a11y.newWindow')}"
				>
					<Icon name="message" size={20} />
					{$_('home.hero.btnPrimary')}
				</Button>
				<Button variant="secondary" size="large" href={telHref(site.phones[0])}>
					<Icon name="phone" size={20} />
					{$_('home.hero.btnSecondary')}
				</Button>
			</div>

			<a class="hero__explore" href="#services">
				<span>{$_('home.hero.explore')}</span>
				<Icon name="arrow-right" size={18} />
			</a>
		</div>

		<HeroMedia />
	</div>

	<div class="container">
		<ul class="hero__signals" aria-label={$_('home.a11y.heroSignals')}>
			{#each signals as signal}
				<li>
					<strong>{$_(signal.valueKey)}</strong>
					<span>{$_(signal.labelKey)}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style lang="scss">
	@keyframes hero-enter {
		from {
			transform: translateY(20px);
		}

		to {
			transform: translateY(0);
		}
	}

	.hero {
		position: relative;
		overflow: hidden;
		color: var(--color-on-dark);
		background:
			radial-gradient(circle at 86% 12%, rgb(var(--rgb-accent) / 0.11), transparent 28rem),
			var(--color-ink);

		&__grid-pattern {
			position: absolute;
			inset: 0;
			pointer-events: none;
			background-image:
				linear-gradient(var(--color-line-dark) 1px, transparent 1px),
				linear-gradient(90deg, var(--color-line-dark) 1px, transparent 1px);
			background-size: 80px 80px;
			mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.36), transparent 76%);
		}

		&__main {
			position: relative;
			z-index: 1;
			display: grid;
			gap: clamp(2.5rem, 6vw, 6rem);
			align-items: center;
			min-height: 46rem;
			padding-top: calc(var(--header-h) + clamp(3rem, 7vw, 6.5rem));
			padding-bottom: clamp(3.5rem, 7vw, 6rem);
		}

		&__content {
			max-width: 47rem;

			h1 {
				margin-top: 20px;
				font-size: clamp(2.75rem, 6.1vw, 5.6rem);
				font-weight: 750;

				span,
				strong {
					display: block;
				}

				strong {
					color: var(--color-accent);
					font-weight: inherit;
				}
			}
		}

		&__eyebrow {
			color: var(--color-accent);
			font-family: var(--font-mono);
			font-size: 0.75rem;
			font-weight: 700;
			letter-spacing: 0.12em;
			text-transform: uppercase;
		}

		&__lead {
			max-width: 59ch;
			margin-top: 26px;
			color: var(--color-on-dark-muted);
			font-size: clamp(1.0625rem, 1.7vw, 1.25rem);
			line-height: 1.7;
		}

		&__actions {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			margin-top: 34px;
		}

		&__explore {
			display: inline-flex;
			align-items: center;
			gap: 10px;
			margin-top: 26px;
			color: var(--color-on-dark-muted);
			font-size: 0.875rem;
			font-weight: 650;
			transition: color var(--motion-fast) var(--ease-standard);

			&:hover {
				color: var(--color-on-dark);
			}
		}

		&__signals {
			position: relative;
			z-index: 1;
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			list-style: none;
			border-top: 1px solid var(--color-line-dark);

			li {
				display: grid;
				gap: 5px;
				padding: 24px clamp(0.75rem, 2.5vw, 2rem);
				border-right: 1px solid var(--color-line-dark);

				&:first-child {
					padding-left: 0;
				}

				&:last-child {
					border-right: 0;
				}

				strong {
					font-size: clamp(1rem, 1.8vw, 1.25rem);
					font-weight: 700;
				}

				span {
					color: var(--color-on-dark-muted);
					font-size: 0.8125rem;
				}
			}
		}

		@media (min-width: 52rem) {
			&__main {
				grid-template-columns: minmax(0, 1.08fr) minmax(18rem, 0.92fr);
			}

			&__content {
				h1 {
					font-size: clamp(3.25rem, 5.8vw, 5.6rem);
				}
			}
		}

		@media (max-width: 51.99rem) {
			&__main {
				min-height: auto;
			}
		}

		@media (max-width: 39.99rem) {
			&__main {
				gap: 38px;
				padding-bottom: 42px;
			}

			&__content {
				h1 {
					font-size: clamp(2.55rem, 12vw, 3.35rem);
					overflow-wrap: anywhere;
				}
			}

			&__actions {
				flex-direction: column;

				:global(.button) {
					width: 100%;
				}
			}

			&__signals {
				grid-template-columns: 1fr;

				li {
					grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
					align-items: baseline;
					padding-inline: 0;
					border-right: 0;
					border-bottom: 1px solid var(--color-line-dark);

					&:last-child {
						border-bottom: 0;
					}
				}
			}
		}

		@media (prefers-reduced-motion: no-preference) {
			&__eyebrow,
			&__content h1,
			&__lead,
			&__actions,
			&__explore {
				animation: hero-enter var(--motion-slow) var(--ease-out) forwards;
			}

			&__content {
				h1 {
					animation-delay: 70ms;
				}
			}

			&__lead {
				animation-delay: 140ms;
			}

			&__actions {
				animation-delay: 210ms;
			}

			&__explore {
				animation-delay: 260ms;
			}
		}
	}
</style>
