<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from '@/components/ui/Button.svelte';
	import Icon from '@/components/ui/Icon.svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { features } from '@/lib/data/whyChooseUs';
</script>

<section class="why section-space">
	<div class="container why__layout">
		<div class="why__intro motion-reveal">
			<SectionHeading
				eyebrow={$_('home.why.eyebrow')}
				title={$_('home.why.h2')}
				subtitle={$_('home.why.sub')}
			/>
			<Button variant="text" href="#contact">
				{$_('home.services.cta')}
				<Icon name="arrow-right" size={18} />
			</Button>
		</div>

		<ol class="why__list">
			{#each features as feature}
				<li class="motion-reveal">
					<span>{feature.code}</span>
					<h3>{$_(feature.titleKey)}</h3>
					<p>{$_(feature.descKey)}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style lang="scss">
	.why {
		background: var(--color-surface);

		&__layout {
			display: grid;
			gap: clamp(3.5rem, 7vw, 7rem);
		}

		&__intro {
			align-self: start;

			:global(.button) {
				margin-top: 28px;
			}
		}

		&__list {
			display: grid;
			list-style: none;
			border-top: 1px solid var(--color-line);

			li {
				display: grid;
				grid-template-columns: 2.5rem minmax(0, 1fr);
				gap: 10px 20px;
				padding-block: 28px;
				border-bottom: 1px solid var(--color-line);

				> span {
					grid-row: 1 / span 2;
					color: var(--color-accent-ink);
					font-family: var(--font-mono);
					font-size: 0.6875rem;
					font-weight: 700;
					letter-spacing: 0.1em;
				}

				h3 {
					color: var(--color-ink);
					font-size: clamp(1.25rem, 2vw, 1.65rem);
					font-weight: 700;
				}

				p {
					max-width: 52ch;
					color: var(--color-ink-muted);
				}
			}
		}

		@media (min-width: 60rem) {
			&__layout {
				grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
			}

			&__intro {
				position: sticky;
				top: calc(var(--header-h) + 2rem);
			}
		}
	}
</style>
