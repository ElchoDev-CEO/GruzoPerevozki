<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		eyebrow?: string;
		align?: 'left' | 'center';
		theme?: 'light' | 'dark';
	}

	let { title, subtitle, eyebrow, align = 'left', theme = 'light' }: Props = $props();
</script>

<div
	class="section-heading section-heading--{align}"
	class:section-heading--dark={theme === 'dark'}
>
	{#if eyebrow}
		<p class="section-heading__eyebrow">{eyebrow}</p>
	{/if}
	<h2>{title}</h2>
	{#if subtitle}
		<p class="section-heading__subtitle">{subtitle}</p>
	{/if}
</div>

<style lang="scss">
	.section-heading {
		max-width: 48rem;

		&--center {
			margin-inline: auto;
			text-align: center;

			.section-heading__subtitle {
				margin-inline: auto;
			}
		}

		&__eyebrow {
			margin-bottom: 14px;
			color: var(--color-ink-muted);
			font-family: var(--font-mono);
			font-size: 0.75rem;
			font-weight: 700;
			letter-spacing: 0.12em;
			line-height: 1.4;
			text-transform: uppercase;
		}

		h2 {
			color: var(--color-ink);
			font-size: clamp(2.125rem, 4.5vw, 4.5rem);
			font-weight: 750;
		}

		&__subtitle {
			max-width: 62ch;
			margin-top: 20px;
			color: var(--color-ink-muted);
			font-size: clamp(1rem, 1.5vw, 1.1875rem);
			line-height: 1.7;
		}

		&--dark {
			h2 {
				color: var(--color-on-dark);
			}

			.section-heading__eyebrow {
				color: var(--color-accent);
			}

			.section-heading__subtitle {
				color: var(--color-on-dark-muted);
			}
		}
	}
</style>
