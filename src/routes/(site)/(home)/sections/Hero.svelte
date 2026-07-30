<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
</script>

<section class="hero">
	<div class="container hero__grid">
		<div class="hero__content">
			<div class="hero__badge">
				<Icon icon="lucide:truck" width="20" height="20" />
				<span>{$_('home.hero.badge')}</span>
			</div>
			<h1 class="hero__heading">{$_('home.hero.heading')}</h1>
			<p class="hero__sub">{$_('home.hero.sub')}</p>

			<div class="hero__actions">
				<a class="hero__cta hero__cta--primary" href="#contact">
					{$_('home.hero.btnPrimary')}
				</a>
				<a class="hero__cta hero__cta--outline" href="#contact">
					<Icon icon="lucide:phone" width="20" height="20" />
					{$_('home.hero.btnSecondary')}
				</a>
			</div>
		</div>

		<div class="hero__media">
			<div class="hero__image-wrap">
				<img
					src="/images/hero-truck.jpg"
					alt={$_('home.meta.ogImageAlt')}
					width="1080"
					height="1440"
					fetchpriority="high"
				/>
				<div class="hero__overlay"></div>
			</div>
			<div class="hero__stats">
				<div>
					<div class="hero__stat-v">{$_('home.hero.stat1v')}</div>
					<div class="hero__stat-l">{$_('home.hero.stat1l')}</div>
				</div>
				<div>
					<div class="hero__stat-v">{$_('home.hero.stat2v')}</div>
					<div class="hero__stat-l">{$_('home.hero.stat2l')}</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.hero {
		background: var(--white);
		padding: 80px 0 64px;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 48px;
			align-items: center;
		}

		&__badge {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 8px 16px;
			border-radius: var(--radius-full);
			background: rgba(255, 193, 7, 0.1);
			font-size: 14px;
			font-weight: 500;
			color: var(--gray-700);

			:global(svg) {
				color: var(--brand);
			}
		}

		&__heading {
			font-size: 36px;
			font-weight: 700;
			color: var(--gray-900);
			line-height: 1.1;
			margin: 16px 0;
		}

		&__sub {
			font-size: 18px;
			color: var(--gray-600);
			line-height: 1.625;
		}

		&__actions {
			display: flex;
			flex-direction: column;
			gap: 16px;
			margin-top: 32px;
		}

		&__cta {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
			font-size: 18px;
			font-weight: 500;
			padding: 16px 32px;
			border-radius: var(--radius-2xl);
			border: none;
			transition: all 0.3s ease;

			&--primary {
				background: var(--brand);
				color: var(--gray-900);
				box-shadow: var(--shadow-lg);

				&:hover {
					background: var(--brand-hover);
					box-shadow: var(--shadow-xl);
				}
			}

			&--outline {
				background: transparent;
				color: var(--gray-900);
				border: 2px solid var(--gray-300);

				&:hover {
					border-color: var(--brand);
				}
			}
		}

		&__media {
			position: relative;
		}

		&__image-wrap {
			position: relative;
			border-radius: var(--radius-3xl);
			overflow: hidden;
			box-shadow: var(--shadow-2xl);

			img {
				display: block;
				width: 100%;
				height: 400px;
				object-fit: cover;
			}
		}

		&__overlay {
			position: absolute;
			inset: 0;
			background: linear-gradient(to top, rgba(17, 24, 39, 0.2), transparent);
		}

		&__stats {
			position: absolute;
			left: 32px;
			right: 32px;
			bottom: -32px;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 16px;
			padding: 24px;
			background: var(--white);
			border-radius: var(--radius-2xl);
			box-shadow: var(--shadow-xl);
		}

		&__stat-v {
			font-size: 30px;
			font-weight: 700;
			color: var(--brand);
		}

		&__stat-l {
			font-size: 14px;
			color: var(--gray-600);
		}

		@media (min-width: 768px) {
			padding: 112px 0 96px;

			&__heading {
				font-size: 48px;
			}
			&__sub {
				font-size: 20px;
			}
			&__actions {
				flex-direction: row;
			}
			&__image-wrap img {
				height: 500px;
			}
		}

		@media (min-width: 1024px) {
			&__grid {
				grid-template-columns: 1fr 1fr;
			}
			&__heading {
				font-size: 60px;
			}
		}
	}
</style>
