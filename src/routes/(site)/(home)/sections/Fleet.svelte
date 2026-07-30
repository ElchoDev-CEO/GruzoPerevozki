<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { fleetPhotos } from '@/lib/data/fleet';
	import FleetCarousel from './FleetCarousel.svelte';
</script>

<section id="transport" class="fleet section-space" tabindex="-1">
	<div class="container">
		<div class="fleet__heading motion-reveal">
			<SectionHeading
				eyebrow={$_('home.fleet.eyebrow')}
				title={$_('home.fleet.h2')}
				subtitle={$_('home.fleet.sub')}
			/>

			<div class="fleet__mark" aria-hidden="true">
				<span>{$_('home.fleet.mark')}</span>
				<strong>{String(fleetPhotos.length).padStart(2, '0')}</strong>
			</div>
		</div>

		<div class="motion-reveal">
			<FleetCarousel photos={fleetPhotos} />
		</div>
	</div>
</section>

<style lang="scss">
	.fleet {
		overflow: clip;
		background: var(--color-canvas);

		&__heading {
			display: grid;
			gap: 28px;
			align-items: end;
			margin-bottom: clamp(2.5rem, 5vw, 4.5rem);
		}

		&__mark {
			display: none;
			align-items: end;
			justify-items: end;
			color: var(--color-ink-muted);

			span {
				font-family: var(--font-mono);
				font-size: 0.6875rem;
				font-weight: 700;
				letter-spacing: 0.12em;
				text-transform: uppercase;
			}

			strong {
				color: var(--color-ink);
				font-size: 2rem;
				font-weight: 740;
				line-height: 1;
			}
		}

		@media (min-width: 48rem) {
			&__heading {
				grid-template-columns: minmax(0, 1fr) auto;
			}

			&__mark {
				display: grid;
				gap: 8px;
			}
		}
	}
</style>
