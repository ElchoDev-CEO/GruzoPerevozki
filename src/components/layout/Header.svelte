<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import { site } from '@/lib/config/site';
	import { navLinks } from '@/lib/data/nav';
	import IconBox from '@/components/ui/IconBox.svelte';
	import Button from '@/components/ui/Button.svelte';

	let menuOpen = $state(false);

	$effect(() => {
		const onResize = (): void => {
			if (window.innerWidth >= 768) menuOpen = false;
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});
</script>

<header class="header">
	<div class="container header__inner">
		<a class="header__logo" href="/" aria-label={site.brand}>
			<IconBox icon="lucide:truck" bg="var(--brand)" size={48} hoverScale />
			<span class="header__brand">{site.brand}</span>
		</a>

		<nav class="header__nav">
			{#each navLinks as link}
				<a class="header__link" href={link.href}>{$_(link.labelKey)}</a>
			{/each}
		</nav>

		<div class="header__cta">
			<Button variant="primary" href="#contact">{$_('home.nav.cta')}</Button>
		</div>

		<button
			class="header__burger"
			aria-label="menu"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<Icon icon={menuOpen ? 'lucide:x' : 'lucide:menu'} width="24" height="24" />
		</button>
	</div>

	{#if menuOpen}
		<div class="container header__mobile">
			{#each navLinks as link}
				<a class="header__mobile-link" href={link.href} onclick={() => (menuOpen = false)}>
					{$_(link.labelKey)}
				</a>
			{/each}
			<Button variant="primary" href="#contact" onclick={() => (menuOpen = false)}>
				{$_('home.nav.cta')}
			</Button>
		</div>
	{/if}
</header>

<style lang="scss">
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 40;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(4px);
		box-shadow: var(--shadow-sm);

		&__inner {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: var(--header-h);
		}

		&__logo {
			display: flex;
			align-items: center;
			gap: 8px;

			&:hover :global(.icon-box--hover) {
				transform: scale(1.1);
			}
		}

		&__brand {
			font-size: 24px;
			font-weight: 700;
			color: var(--gray-900);
		}

		&__nav {
			display: none;
			align-items: center;
			gap: 32px;
		}

		&__link {
			font-weight: 500;
			color: var(--gray-700);
			transition: color 0.2s ease;

			&:hover {
				color: var(--brand);
			}
		}

		&__cta {
			display: none;
		}

		&__burger {
			display: inline-flex;
			padding: 8px;
			background: none;
			border: none;
			color: var(--gray-700);
			border-radius: var(--radius-lg);

			&:hover {
				background: var(--gray-100);
			}
		}

		&__mobile {
			display: flex;
			flex-direction: column;
			gap: 8px;
			padding: 16px;
			border-top: 1px solid var(--gray-100);
		}

		&__mobile-link {
			text-align: left;
			padding: 12px 16px;
			color: var(--gray-700);
			border-radius: var(--radius-lg);

			&:hover {
				background: var(--gray-50);
			}
		}

		@media (min-width: 768px) {
			&__nav,
			&__cta {
				display: flex;
			}
			&__burger {
				display: none;
			}
		}
	}
</style>
