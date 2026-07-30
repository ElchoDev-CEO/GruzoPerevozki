<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from '@/components/ui/Button.svelte';
	import Icon from '@/components/ui/Icon.svelte';
	import { navLinks } from '@/lib/data/nav';

	let menu = $state<HTMLDetailsElement>();
	let trigger = $state<HTMLElement>();
	let open = $state(false);

	const closeMenu = (returnFocus = false): void => {
		open = false;
		if (menu) menu.open = false;
		if (returnFocus) trigger?.focus();
	};

	const handleKeydown = (event: KeyboardEvent): void => {
		if (event.key !== 'Escape' || !menu?.open) return;
		event.preventDefault();
		closeMenu(true);
	};

	const navigateTo = (link: HTMLAnchorElement): void => {
		const { hash } = link;
		const target = document.querySelector<HTMLElement>(hash);

		closeMenu();
		window.history.pushState(null, '', hash);
		target?.scrollIntoView({ block: 'start' });
		target?.focus({ preventScroll: true });
	};

	const handleNavigation = (event: MouseEvent): void => {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;

		event.preventDefault();
		navigateTo(event.currentTarget as HTMLAnchorElement);
	};

	$effect(() => {
		if (!menu) return;

		open = menu.open;

		if (menu.open && window.location.hash) {
			const target = document.querySelector<HTMLElement>(window.location.hash);
			closeMenu();
			target?.focus({ preventScroll: true });
		}

		const media =
			typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 64rem)') : undefined;
		const handleChange = (event: MediaQueryListEvent): void => {
			if (event.matches) closeMenu();
		};

		window.addEventListener('keydown', handleKeydown);
		media?.addEventListener('change', handleChange);
		document.documentElement.classList.add('has-js');

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			media?.removeEventListener('change', handleChange);
		};
	});
</script>

<details class="mobile-nav" bind:this={menu} bind:open>
	<summary bind:this={trigger} aria-controls="mobile-navigation" aria-label={$_('home.a11y.menu')}>
		<Icon name={open ? 'close' : 'menu'} size={24} />
	</summary>

	<nav id="mobile-navigation" aria-label={$_('home.a11y.mobileNav')}>
		<div class="container mobile-nav__inner">
			{#each navLinks as link}
				<a href={link.href} onclick={handleNavigation}>
					{$_(link.labelKey)}
				</a>
			{/each}
			<Button variant="primary" size="large" href="#contact" onclick={handleNavigation} fullWidth>
				{$_('home.nav.cta')}
				<Icon name="arrow-right" size={18} />
			</Button>
		</div>
	</nav>
</details>

<style lang="scss">
	/* The fixed enhanced menu owns page scroll; no-JS navigation keeps the document scrollable. */
	:global(html.has-js body:has(.mobile-nav[open])) {
		overflow: hidden;
	}

	/* Native fragment navigation can hide the panel after focus leaves it without JavaScript. */
	:global(body:has(section:target) .mobile-nav[open]:not(:focus-within) nav) {
		display: none;
	}

	.mobile-nav {
		summary {
			display: grid;
			width: 44px;
			height: 44px;
			place-items: center;
			color: var(--color-on-dark);
			border: 1px solid var(--color-line-dark);
			border-radius: var(--radius-sm);
			cursor: pointer;
			list-style: none;

			&::-webkit-details-marker {
				display: none;
			}

			&::marker {
				content: '';
			}
		}

		nav {
			position: fixed;
			top: var(--header-h);
			right: 0;
			left: 0;
			max-height: calc(100dvh - var(--header-h));
			overflow-y: auto;
			background: rgb(var(--rgb-ink) / 0.985);
			border-top: 1px solid var(--color-line-dark);
			border-bottom: 1px solid var(--color-line-dark);
			box-shadow: var(--shadow-md);
		}

		&__inner {
			display: grid;
			padding-block: 18px 24px;

			> a {
				display: flex;
				align-items: center;
				min-height: 50px;
				color: var(--color-on-dark);
				border-bottom: 1px solid var(--color-line-dark);
				font-size: 1rem;
				font-weight: 650;
			}

			:global(.button) {
				margin-top: 18px;
			}
		}

		@media (min-width: 64rem) {
			display: none;
		}
	}
</style>
