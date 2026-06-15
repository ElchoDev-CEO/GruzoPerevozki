<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import { site } from '@/lib/config/site';
	import { navLinks } from '@/lib/data/nav';
	import { smoothScrollToId, scrollToTop } from '@/lib/utils/scroll';
	import IconBox from '@/components/ui/IconBox.svelte';
	import Button from '@/components/ui/Button.svelte';

	let menuOpen = $state(false);

	const go = (targetId: string | null): void => {
		if (targetId) smoothScrollToId(targetId);
		else scrollToTop();
		menuOpen = false;
	};

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
		<button class="header__logo" onclick={() => go(null)}>
			<IconBox icon="lucide:truck" bg="var(--brand)" size={48} hoverScale />
			<span class="header__brand">{site.brand}</span>
		</button>

		<nav class="header__nav">
			{#each navLinks as link}
				<button class="header__link" onclick={() => go(link.targetId)}>{$_(link.labelKey)}</button>
			{/each}
		</nav>

		<div class="header__cta">
			<Button variant="primary" onclick={() => go('contact')}>{$_('home.nav.cta')}</Button>
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
				<button class="header__mobile-link" onclick={() => go(link.targetId)}>
					{$_(link.labelKey)}
				</button>
			{/each}
			<Button variant="primary" onclick={() => go('contact')}>{$_('home.nav.cta')}</Button>
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
			background: none;
			border: none;

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
			background: none;
			border: none;
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
			background: none;
			border: none;
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
