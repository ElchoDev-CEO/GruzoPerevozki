<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'text';
		size?: 'small' | 'medium' | 'large';
		href?: string;
		target?: '_blank' | '_self';
		rel?: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		fullWidth?: boolean;
		onclick?: (event: MouseEvent) => void;
		ariaLabel?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'medium',
		href,
		target,
		rel,
		type = 'button',
		disabled = false,
		fullWidth = false,
		onclick,
		ariaLabel,
		children
	}: Props = $props();
</script>

{#if href && !disabled}
	<a
		class="button button--{variant} button--{size}"
		class:button--full={fullWidth}
		{href}
		{target}
		{rel}
		{onclick}
		aria-label={ariaLabel}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		class="button button--{variant} button--{size}"
		class:button--full={fullWidth}
		{type}
		{disabled}
		{onclick}
		aria-label={ariaLabel}
	>
		{@render children?.()}
	</button>
{/if}

<style lang="scss">
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		min-height: 44px;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		font-weight: 700;
		line-height: 1.1;
		text-align: center;
		transition:
			color var(--motion-fast) var(--ease-standard),
			background-color var(--motion-fast) var(--ease-standard),
			border-color var(--motion-fast) var(--ease-standard),
			transform var(--motion-fast) var(--ease-out),
			box-shadow var(--motion-fast) var(--ease-standard);

		&--small {
			min-height: 40px;
			padding: 10px 16px;
			font-size: 0.875rem;
		}

		&--medium {
			padding: 13px 20px;
			font-size: 0.9375rem;
		}

		&--large {
			min-height: 54px;
			padding: 16px 24px;
			font-size: 1rem;
		}

		&--primary {
			color: var(--color-ink);
			background: var(--color-accent);
			box-shadow: var(--shadow-accent);

			&:hover {
				background: var(--color-accent-hover);
			}
		}

		&--secondary {
			color: var(--color-on-dark);
			background: transparent;
			border-color: var(--color-line-dark);

			&:hover {
				color: var(--color-ink);
				background: var(--color-on-dark);
				border-color: var(--color-on-dark);
			}
		}

		&--text {
			min-height: 36px;
			padding-inline: 0;
			color: inherit;
			background: transparent;
			border-radius: 0;

			&:hover {
				color: var(--color-accent-ink);
			}
		}

		&--full {
			width: 100%;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.55;
			box-shadow: none;
		}

		&:active {
			transform: translateY(1px) scale(0.99);
		}

		@media (hover: hover) and (pointer: fine) {
			&:not(:disabled):hover {
				transform: translateY(-2px);
			}
		}

		@media (prefers-reduced-motion: reduce) {
			transition-property: color, background-color, border-color;

			&:active,
			&:not(:disabled):hover {
				transform: none;
			}
		}
	}
</style>
