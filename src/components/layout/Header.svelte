<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from '@/components/ui/Button.svelte';
	import Icon from '@/components/ui/Icon.svelte';
	import Logo from '@/components/ui/Logo.svelte';
	import MobileNavigation from '@/components/layout/MobileNavigation.svelte';
	import { site } from '@/lib/config/site';
	import { navLinks } from '@/lib/data/nav';

	let scrolled = $state(false);

	$effect(() => {
		const updateHeader = (): void => {
			scrolled = window.scrollY > 16;
		};

		updateHeader();
		window.addEventListener('scroll', updateHeader, { passive: true });
		return () => window.removeEventListener('scroll', updateHeader);
	});
</script>

<header class="header" class:header--scrolled={scrolled}>
	<div class="container header__inner">
		<a class="header__logo" href="/" aria-label="{site.brand} — {$_('home.a11y.homeLink')}">
			<Logo inverse compact />
		</a>

		<nav class="header__nav" aria-label={$_('home.a11y.primaryNav')}>
			{#each navLinks as link}
				<a href={link.href}>{$_(link.labelKey)}</a>
			{/each}
		</nav>

		<div class="header__cta">
			<Button variant="primary" size="small" href="#contact">
				{$_('home.nav.cta')}
				<Icon name="arrow-right" size={16} />
			</Button>
		</div>

		<MobileNavigation />
	</div>
</header>

<style lang="scss">
	.header {
		position: fixed;
		inset: 0 0 auto;
		z-index: var(--z-header);
		height: var(--header-h);
		color: var(--color-on-dark);
		background: linear-gradient(180deg, rgb(var(--rgb-ink) / 0.78), transparent);
		transition:
			background-color var(--motion-base) var(--ease-standard),
			border-color var(--motion-base) var(--ease-standard),
			box-shadow var(--motion-base) var(--ease-standard);

		&--scrolled {
			background: rgb(var(--rgb-ink) / 0.97);
			border-bottom: 1px solid var(--color-line-dark);
			box-shadow: 0 8px 30px rgb(var(--rgb-ink) / 0.18);
		}

		&__inner {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 24px;
			height: 100%;
		}

		&__logo {
			overflow: hidden;
			border-radius: var(--radius-sm);
		}

		&__nav {
			display: none;
			align-items: center;
			justify-content: center;
			gap: clamp(1.25rem, 2.5vw, 2.5rem);

			a {
				position: relative;
				padding-block: 10px;
				color: var(--color-on-dark-muted);
				font-size: 0.8125rem;
				font-weight: 650;
				transition: color var(--motion-fast) var(--ease-standard);

				&::after {
					position: absolute;
					right: 0;
					bottom: 4px;
					left: 0;
					height: 2px;
					background: var(--color-accent);
					content: '';
					transform: scaleX(0);
					transform-origin: right;
					transition: transform var(--motion-fast) var(--ease-out);
				}

				&:hover,
				&:focus-visible {
					color: var(--color-on-dark);

					&::after {
						transform: scaleX(1);
						transform-origin: left;
					}
				}
			}
		}

		&__cta {
			display: none;
		}

		@media (min-width: 64rem) {
			&__nav,
			&__cta {
				display: flex;
			}

			&--scrolled {
				@supports (backdrop-filter: blur(8px)) {
					background: rgb(var(--rgb-ink) / 0.9);
					backdrop-filter: blur(8px);
				}
			}
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;

			&__nav {
				a {
					&::after {
						transition: none;
					}
				}
			}
		}
	}
</style>
