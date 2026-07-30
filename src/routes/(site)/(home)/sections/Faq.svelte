<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Accordion from '@/components/ui/Accordion.svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { faqEntries } from '@/lib/data/faq';

	const items = $derived(
		faqEntries.map((entry) => ({
			id: entry.id,
			question: $_(entry.questionKey),
			answer: $_(entry.answerKey)
		}))
	);
</script>

<section class="faq section-space">
	<div class="container faq__layout">
		<div class="faq__heading motion-reveal">
			<SectionHeading
				eyebrow={$_('home.faq.eyebrow')}
				title={$_('home.faq.h2')}
				subtitle={$_('home.faq.sub')}
			/>
		</div>
		<div class="faq__accordion motion-reveal">
			<Accordion {items} />
		</div>
	</div>
</section>

<style lang="scss">
	.faq {
		background: var(--color-canvas-muted);

		&__layout {
			display: grid;
			gap: clamp(2.5rem, 6vw, 6rem);
		}

		&__heading {
			align-self: start;
			min-width: 0;
		}

		&__accordion {
			min-width: 0;
		}

		@media (min-width: 60rem) {
			&__layout {
				grid-template-columns: minmax(0, 0.76fr) minmax(0, 1.24fr);
			}

			&__heading {
				position: sticky;
				top: calc(var(--header-h) + 2rem);
			}
		}
	}
</style>
