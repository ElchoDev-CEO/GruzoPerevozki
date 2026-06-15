<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { capacities } from '@/lib/data/capacity';
</script>

<section class="capacity">
	<div class="container">
		<SectionHeading title={$_('home.capacity.h2')} subtitle={$_('home.capacity.sub')} />
		<div class="capacity__grid">
			{#each capacities as tier}
				<div class="capacity__card" class:capacity__card--popular={tier.popular}>
					{#if tier.popular}
						<div class="capacity__badge">{$_('home.capacity.popular')}</div>
					{/if}
					<div class="capacity__head">
						<div class="capacity__icon">
							<Icon icon="lucide:truck" width="32" height="32" />
						</div>
						<div class="capacity__weight">{$_(tier.weightKey)}</div>
						<div class="capacity__vehicle">{$_(tier.vehicleKey)}</div>
					</div>
					<div class="capacity__list">
						{#each tier.exampleKeys as ex}
							<div class="capacity__row">
								<Icon icon="lucide:check" width="16" height="16" />
								<span>{$_(ex)}</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.capacity {
		background: var(--gray-50);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			position: relative;
			background: var(--white);
			border: 1px solid var(--gray-100);
			border-radius: var(--radius-2xl);
			padding: 24px;
			box-shadow: var(--shadow-lg);
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-2xl);
				transform: translateY(-4px);
			}

			&--popular {
				border: 2px solid var(--brand);
			}
		}

		&__badge {
			position: absolute;
			top: -12px;
			left: 50%;
			transform: translateX(-50%);
			background: var(--brand);
			color: var(--gray-900);
			padding: 4px 16px;
			border-radius: var(--radius-full);
			font-size: 14px;
			font-weight: 600;
		}

		&__head {
			text-align: center;
			margin-bottom: 24px;
		}

		&__icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 64px;
			height: 64px;
			margin: 0 auto 16px;
			background: var(--gray-100);
			border-radius: var(--radius-2xl);
			color: var(--brand);
		}

		&__weight {
			font-size: 24px;
			font-weight: 700;
			color: var(--gray-900);
			margin-bottom: 8px;
		}

		&__vehicle {
			font-size: 14px;
			color: var(--gray-500);
		}

		&__list {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		&__row {
			display: flex;
			align-items: flex-start;
			gap: 8px;
			font-size: 14px;
			color: var(--gray-600);

			:global(svg) {
				color: var(--brand);
				flex-shrink: 0;
				margin-top: 2px;
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

		@media (min-width: 1280px) {
			&__grid {
				grid-template-columns: repeat(5, 1fr);
			}
		}
	}
</style>
