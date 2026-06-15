<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		icon: string;
		bg: string;
		iconColor?: string;
		size?: number;
		radius?: number;
		hoverScale?: boolean;
	}

	let {
		icon,
		bg,
		iconColor = 'var(--gray-900)',
		size = 56,
		radius = 12,
		hoverScale = false
	}: Props = $props();

	const iconSize = $derived(Math.round(size * 0.5));
</script>

<div
	class="icon-box"
	class:icon-box--hover={hoverScale}
	style="--box-bg:{bg}; --box-size:{size}px; --box-radius:{radius}px; --box-color:{iconColor}; --box-icon:{iconSize}px"
>
	<Icon {icon} width={iconSize} height={iconSize} />
</div>

<style lang="scss">
	.icon-box {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--box-size);
		height: var(--box-size);
		border-radius: var(--box-radius);
		background: var(--box-bg);
		color: var(--box-color);

		&--hover {
			transition: transform 0.3s ease;
		}
	}
</style>
