<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import IconBox from '@/components/ui/IconBox.svelte';
	import { services } from '@/lib/data/services';
</script>

<section id="services" class="services">
	<div class="container">
		<SectionHeading title={$_('home.services.h2')} subtitle={$_('home.services.sub')} />
		<div class="services__grid">
			{#each services as item}
				<div class="services__card">
					<IconBox icon={item.icon} bg="var(--brand)" iconColor="var(--gray-900)" size={56} />
					<h3>{$_(item.titleKey)}</h3>
					<p>{$_(item.descKey)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.services {
		background: var(--white);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			background: var(--gray-50);
			border: 1px solid var(--gray-100);
			border-radius: var(--radius-2xl);
			padding: 24px;
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-xl);
				transform: translateY(-4px);
				border-color: var(--brand);
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
