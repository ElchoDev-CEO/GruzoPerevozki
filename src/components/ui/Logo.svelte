<script lang="ts">
	import { site } from '@/lib/config/site';

	interface Props {
		inverse?: boolean;
		compact?: boolean;
	}

	let { inverse = false, compact = false }: Props = $props();
</script>

<div class="logo" class:logo--inverse={inverse} class:logo--compact={compact}>
	<span class="logo__mark">
		<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
			<path class="logo__route" d="M9 13h12l4 4h13"></path>
			<circle class="logo__route-point" cx="9" cy="13" r="2"></circle>
			<path class="logo__truck" d="M8 20h23v13H8Zm23 4h6l4 5v4H31Z"></path>
			<circle class="logo__wheel" cx="16" cy="34" r="3"></circle>
			<circle class="logo__wheel" cx="35" cy="34" r="3"></circle>
		</svg>
	</span>
	<span class="logo__wordmark">{site.brand}</span>
</div>

<style lang="scss">
	.logo {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		max-width: 100%;
		color: var(--color-text);

		&--inverse {
			color: var(--color-on-dark);
		}

		&--compact {
			gap: 8px;

			.logo__mark {
				width: 40px;
				height: 40px;
				border-radius: var(--radius-lg);
			}

			.logo__wordmark {
				font-size: 20px;
			}
		}

		&__mark {
			display: grid;
			flex-shrink: 0;
			width: 48px;
			height: 48px;
			place-items: center;
			overflow: hidden;
			color: var(--color-ink);
			background: var(--color-accent);
			border-radius: var(--radius-md);

			svg {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		&__route,
		&__truck,
		&__wheel {
			fill: none;
			stroke: currentColor;
			stroke-linecap: round;
			stroke-linejoin: round;
		}

		&__route {
			stroke-width: 2;
		}

		&__route-point {
			fill: currentColor;
		}

		&__truck {
			stroke-width: 2.4;
		}

		&__wheel {
			fill: var(--color-accent);
			stroke-width: 2.4;
		}

		&__wordmark {
			min-width: 0;
			overflow: hidden;
			font-size: 24px;
			font-weight: 800;
			line-height: 1;
			letter-spacing: -0.03em;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
