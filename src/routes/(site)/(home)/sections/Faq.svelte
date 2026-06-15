<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import Accordion from '@/components/ui/Accordion.svelte';
	import { faqEntries } from '@/lib/data/faq';

	const items = $derived(
		faqEntries.map((e) => ({ id: e.id, question: $_(e.questionKey), answer: $_(e.answerKey) }))
	);
</script>

<section class="faq">
	<div class="container faq__inner">
		<SectionHeading title={$_('home.faq.h2')} subtitle={$_('home.faq.sub')} />
		<Accordion {items} />
	</div>
</section>

<style lang="scss">
	.faq {
		background: var(--white);
		padding: 64px 0;

		&__inner {
			max-width: var(--container-4xl);
		}

		@media (min-width: 768px) {
			padding: 96px 0;
		}
	}
</style>
