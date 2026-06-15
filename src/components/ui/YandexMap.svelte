<script lang="ts">
	import { lazyIframe } from '@/lib/actions/lazyIframe';

	interface Props {
		src: string;
		title: string;
	}

	let { src, title }: Props = $props();
</script>

<div class="yandex-map">
	<iframe {title} use:lazyIframe={src} loading="lazy" allowfullscreen></iframe>
</div>

<style lang="scss">
	.yandex-map {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 400px;
		border-radius: var(--radius-3xl);
		overflow: hidden;

		iframe {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			border: none;
		}
	}
</style>
