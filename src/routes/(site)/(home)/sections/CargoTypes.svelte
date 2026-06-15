<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { cargoTypes } from '@/lib/data/cargoTypes';
</script>

<section class="cargo">
	<div class="container">
		<SectionHeading title={$_('home.cargo.h2')} subtitle={$_('home.cargo.sub')} />
		<div class="cargo__grid">
			{#each cargoTypes as item}
				<div class="cargo__card">
					<div class="cargo__media">
						<img
							src={item.image}
							alt={$_(item.titleKey)}
							loading="lazy"
							width="1080"
							height="720"
						/>
						<div class="cargo__overlay"></div>
						<h3 class="cargo__title">{$_(item.titleKey)}</h3>
					</div>
					<div class="cargo__body">
						<p>{$_(item.descKey)}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.cargo {
		background: var(--white);
		padding: 64px 0;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			background: var(--white);
			border-radius: var(--radius-2xl);
			overflow: hidden;
			box-shadow: var(--shadow-lg);
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-2xl);
				transform: translateY(-4px);

				.cargo__media img {
					transform: scale(1.1);
				}
			}
		}

		&__media {
			position: relative;
			height: 192px;
			overflow: hidden;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				transition: transform 0.5s ease;
			}
		}

		&__overlay {
			position: absolute;
			inset: 0;
			background: linear-gradient(to top, rgba(17, 24, 39, 0.7), transparent);
		}

		&__title {
			position: absolute;
			left: 16px;
			right: 16px;
			bottom: 16px;
			font-size: 20px;
			font-weight: 700;
			color: var(--white);
		}

		&__body {
			padding: 24px;

			p {
				color: var(--gray-600);
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
