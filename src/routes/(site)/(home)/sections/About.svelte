<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import IconBox from '@/components/ui/IconBox.svelte';
	import { aboutStats } from '@/lib/data/about';
</script>

<section id="about" class="about">
	<div class="container">
		<SectionHeading
			title={$_('home.about.h2')}
			subtitle={$_('home.about.sub')}
			subtitleMaxWidth={768}
		/>
		<div class="about__grid">
			{#each aboutStats as stat}
				<div class="about__card">
					<IconBox icon={stat.icon} bg={stat.bg} iconColor="var(--white)" size={56} />
					<div class="about__value">{$_(stat.valueKey)}</div>
					<div class="about__label">{$_(stat.labelKey)}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.about {
		background: var(--gray-50);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			background: var(--white);
			border-radius: var(--radius-2xl);
			padding: 24px;
			box-shadow: var(--shadow-lg);
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-xl);
				transform: translateY(-4px);
			}

			:global(.icon-box) {
				margin-bottom: 16px;
			}
		}

		&__value {
			font-size: 30px;
			font-weight: 700;
			color: var(--gray-900);
			margin-bottom: 4px;
		}

		&__label {
			color: var(--gray-600);
		}

		@media (min-width: 768px) {
			padding: 96px 0;
			&__grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: repeat(4, 1fr);
			}
		}
	}
</style>
