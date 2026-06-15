<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		subtitleMaxWidth?: number;
	}

	let { title, subtitle, subtitleMaxWidth = 672 }: Props = $props();
</script>

<div class="section-heading">
	<h2>{title}</h2>
	{#if subtitle}
		<p style="--sub-mw:{subtitleMaxWidth}px">{subtitle}</p>
	{/if}
</div>

<style lang="scss">
	.section-heading {
		text-align: center;
		margin-bottom: 48px;

		h2 {
			font-size: 30px;
			font-weight: 700;
			color: var(--gray-900);
			margin-bottom: 16px;
		}

		p {
			font-size: 18px;
			color: var(--gray-600);
			max-width: var(--sub-mw);
			margin: 0 auto;
		}

		@media (min-width: 768px) {
			h2 {
				font-size: 36px;
			}
		}
	}
</style>
