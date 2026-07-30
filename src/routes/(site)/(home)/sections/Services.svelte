<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from '@/components/ui/Button.svelte';
	import Icon from '@/components/ui/Icon.svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import ServiceCard from '@/components/ui/ServiceCard.svelte';
	import { services } from '@/lib/data/services';
</script>

<section id="services" class="services section-space" tabindex="-1">
	<div class="container">
		<div class="services__heading motion-reveal">
			<SectionHeading
				eyebrow={$_('home.services.eyebrow')}
				title={$_('home.services.h2')}
				subtitle={$_('home.services.sub')}
			/>
			<Button variant="text" href="#contact">
				{$_('home.services.cta')}
				<Icon name="arrow-right" size={18} />
			</Button>
		</div>

		<div class="services__grid">
			{#each services as service (service.code)}
				<ServiceCard item={service} />
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.services {
		background: var(--color-canvas);

		&__heading {
			display: grid;
			gap: 28px;
			align-items: end;
			margin-bottom: clamp(2.5rem, 5vw, 4.5rem);

			:global(.button) {
				justify-self: start;
			}
		}

		&__grid {
			display: grid;
			gap: 16px;
		}

		@media (min-width: 48rem) {
			&__heading {
				grid-template-columns: minmax(0, 1fr) auto;
			}

			&__grid {
				grid-template-columns: repeat(2, minmax(0, 1fr));

				:global(.service-card:first-child) {
					grid-column: 1 / -1;
				}
			}
		}

		@media (min-width: 64rem) {
			&__grid {
				grid-template-columns: repeat(12, minmax(0, 1fr));

				:global(.service-card:nth-child(1)) {
					grid-column: span 7;
				}

				:global(.service-card:nth-child(2)) {
					grid-column: span 5;
				}

				:global(.service-card:nth-child(3)),
				:global(.service-card:nth-child(4)) {
					grid-column: span 4;
				}

				:global(.service-card:nth-child(5)) {
					grid-column: span 4;
				}
			}
		}
	}
</style>
