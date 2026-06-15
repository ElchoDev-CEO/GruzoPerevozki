<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import IconBox from '@/components/ui/IconBox.svelte';
	import { regions } from '@/lib/data/regions';
</script>

<section id="regions" class="regions">
	<div class="container">
		<SectionHeading title={$_('home.regions.h2')} subtitle={$_('home.regions.sub')} />
		<div class="regions__grid">
			{#each regions as region}
				<div class="regions__card">
					<IconBox
						icon="lucide:map-pin"
						bg={region.bg}
						iconColor="var(--white)"
						size={48}
						hoverScale
					/>
					<div class="regions__name">{$_(region.nameKey)}</div>
				</div>
			{/each}
		</div>

		<div class="regions__map">
			<div class="regions__map-inner">
				<Icon icon="lucide:map-pin" width="64" height="64" />
				<p class="regions__map-title">{$_('home.regions.mapTitle')}</p>
				<p class="regions__map-sub">{$_('home.regions.mapSub')}</p>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.regions {
		background: var(--gray-50);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 16px;
			margin-bottom: 48px;
		}

		&__card {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			background: var(--white);
			border-radius: var(--radius-2xl);
			padding: 24px;
			box-shadow: var(--shadow-lg);
			cursor: pointer;
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-xl);
				transform: translateY(-4px);

				:global(.icon-box--hover) {
					transform: scale(1.1);
				}
			}

			:global(.icon-box) {
				margin-bottom: 12px;
			}
		}

		&__name {
			font-weight: 600;
			color: var(--gray-900);
		}

		&__map {
			background: var(--white);
			border-radius: var(--radius-3xl);
			box-shadow: var(--shadow-xl);
			overflow: hidden;
		}

		&__map-inner {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 400px;
			background: linear-gradient(to bottom right, var(--gray-100), var(--gray-200));
			text-align: center;

			:global(svg) {
				color: var(--brand);
				margin-bottom: 16px;
			}
		}

		&__map-title {
			font-weight: 500;
			color: var(--gray-600);
		}

		&__map-sub {
			font-size: 14px;
			color: var(--gray-500);
			margin-top: 8px;
		}

		@media (min-width: 768px) {
			padding: 96px 0;
			&__grid {
				grid-template-columns: repeat(4, 1fr);
			}
		}
	}
</style>
