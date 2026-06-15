<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import IconBox from '@/components/ui/IconBox.svelte';
	import { features } from '@/lib/data/whyChooseUs';
</script>

<section class="why">
	<div class="container">
		<SectionHeading title={$_('home.why.h2')} subtitle={$_('home.why.sub')} />
		<div class="why__grid">
			{#each features as feature}
				<div class="why__card">
					<IconBox icon={feature.icon} bg="var(--brand)" iconColor="var(--gray-900)" size={56} />
					<h3>{$_(feature.titleKey)}</h3>
					<p>{$_(feature.descKey)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.why {
		background: var(--white);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			background: linear-gradient(to bottom right, var(--gray-50), var(--white));
			border: 1px solid var(--gray-100);
			border-radius: var(--radius-2xl);
			padding: 24px;
			transition: all 0.3s ease;

			&:hover {
				border-color: var(--brand);
				box-shadow: var(--shadow-xl);
			}

			:global(.icon-box) {
				margin-bottom: 16px;
			}

			h3 {
				font-size: 20px;
				font-weight: 700;
				color: var(--gray-900);
				margin-bottom: 8px;
			}

			p {
				color: var(--gray-600);
				line-height: 1.625;
			}
		}

		@media (min-width: 768px) {
			padding: 96px 0;
			&__grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: repeat(3, 1fr);
			}
		}
	}
</style>
