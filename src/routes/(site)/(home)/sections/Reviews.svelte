<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { reviews } from '@/lib/data/reviews';
	import { nextIndex, prevIndex } from '@/lib/utils/carousel';

	let current = $state(0);
	const review = $derived(reviews[current]);

	const next = (): void => {
		current = nextIndex(current, reviews.length);
	};
	const prev = (): void => {
		current = prevIndex(current, reviews.length);
	};
</script>

<section class="reviews">
	<div class="container">
		<SectionHeading title={$_('home.reviews.h2')} subtitle={$_('home.reviews.sub')} />
		<div class="reviews__stage">
			<div class="reviews__card">
				<button class="reviews__nav reviews__nav--prev" aria-label="Previous review" onclick={prev}>
					<Icon icon="lucide:chevron-left" width="24" height="24" />
				</button>
				<button class="reviews__nav reviews__nav--next" aria-label="Next review" onclick={next}>
					<Icon icon="lucide:chevron-right" width="24" height="24" />
				</button>

				<div class="reviews__content">
					<div class="reviews__stars">
						{#each Array(review.rating) as _star}
							<Icon icon="lucide:star" width="24" height="24" />
						{/each}
					</div>
					<p class="reviews__text">"{$_(review.textKey)}"</p>
					<div class="reviews__name">{$_(review.nameKey)}</div>
					<div class="reviews__role">{$_(review.roleKey)}</div>
					<div class="reviews__date">{$_(review.dateKey)}</div>
				</div>

				<div class="reviews__dots">
					{#each reviews as _r, i}
						<button
							class="reviews__dot"
							class:reviews__dot--active={i === current}
							aria-label="Go to review {i + 1}"
							onclick={() => (current = i)}
						></button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.reviews {
		background: var(--gray-50);
		padding: 64px 0;

		&__stage {
			max-width: var(--container-4xl);
			margin: 0 auto;
		}

		&__card {
			position: relative;
			background: var(--white);
			border-radius: var(--radius-3xl);
			box-shadow: var(--shadow-xl);
			padding: 32px;
		}

		&__nav {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			display: inline-flex;
			padding: 12px;
			background: var(--white);
			border: 1px solid var(--gray-200);
			border-radius: var(--radius-full);
			box-shadow: var(--shadow-lg);
			color: var(--gray-700);
			transition: all 0.3s ease;

			&:hover {
				background: var(--gray-50);
				border-color: var(--brand);
			}

			&--prev {
				left: 16px;
			}
			&--next {
				right: 16px;
			}
		}

		&__content {
			text-align: center;
			margin-bottom: 24px;
		}

		&__stars {
			display: flex;
			justify-content: center;
			gap: 4px;
			margin-bottom: 16px;
			color: var(--brand);

			:global(svg) {
				fill: var(--brand);
			}
		}

		&__text {
			font-size: 18px;
			font-style: italic;
			color: var(--gray-700);
			line-height: 1.625;
			margin-bottom: 24px;
		}

		&__name {
			font-size: 18px;
			font-weight: 700;
			color: var(--gray-900);
		}

		&__role {
			color: var(--gray-600);
		}

		&__date {
			font-size: 14px;
			color: var(--gray-500);
			margin-top: 4px;
		}

		&__dots {
			display: flex;
			justify-content: center;
			gap: 8px;
			margin-top: 32px;
		}

		&__dot {
			width: 8px;
			height: 8px;
			border: none;
			border-radius: var(--radius-full);
			background: var(--gray-300);
			transition: all 0.3s ease;

			&--active {
				width: 32px;
				background: var(--brand);
			}
		}

		@media (min-width: 768px) {
			padding: 96px 0;

			&__card {
				padding: 48px;
			}
			&__text {
				font-size: 20px;
			}
		}
	}
</style>
