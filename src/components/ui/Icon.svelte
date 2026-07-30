<script lang="ts">
	import IconifyIcon from '@iconify/svelte';
	import { icons, type IconName } from '@/lib/icons';

	interface Props {
		name: IconName;
		size?: number;
		strokeWidth?: number;
		title?: string;
	}

	let { name, size = 24, strokeWidth = 2, title }: Props = $props();

	const icon = $derived({
		...icons[name],
		width: 24,
		height: 24,
		body: icons[name].body.replace(/stroke-width="[^"]+"/g, `stroke-width="${strokeWidth}"`)
	});
</script>

{#if title}
	<span class="icon-label" role="img" aria-label={title}>
		<IconifyIcon class="icon" {icon} width={size} height={size} aria-hidden="true" />
	</span>
{:else}
	<IconifyIcon
		class="icon"
		{icon}
		width={size}
		height={size}
		aria-hidden="true"
		focusable="false"
	/>
{/if}

<style lang="scss">
	:global(.icon),
	.icon-label {
		display: inline-flex;
		flex: 0 0 auto;
	}

	.icon-label {
		align-items: center;
	}
</style>
