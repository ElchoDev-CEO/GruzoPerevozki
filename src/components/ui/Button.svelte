<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'outline';
		href?: string;
		onclick?: () => void;
		ariaLabel?: string;
		children?: Snippet;
	}

	let { variant = 'primary', href, onclick, ariaLabel, children }: Props = $props();
</script>

{#if href}
	<a class="btn btn--{variant}" {href} {onclick} aria-label={ariaLabel}>{@render children?.()}</a>
{:else}
	<button class="btn btn--{variant}" {onclick} aria-label={ariaLabel}>
		{@render children?.()}
	</button>
{/if}

<style lang="scss">
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-weight: 500;
		border: none;
		transition: all 0.3s ease;

		&--primary {
			background: var(--brand);
			color: var(--gray-900);
			padding: 8px 24px;
			border-radius: var(--radius-xl);

			&:hover {
				background: var(--brand-hover);
			}
		}

		&--outline {
			background: transparent;
			color: var(--gray-900);
			padding: 8px 24px;
			border: 2px solid var(--gray-300);
			border-radius: var(--radius-xl);

			&:hover {
				border-color: var(--brand);
			}
		}
	}
</style>
