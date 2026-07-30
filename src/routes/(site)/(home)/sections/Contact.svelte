<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from '@/components/ui/Button.svelte';
	import Icon from '@/components/ui/Icon.svelte';
	import SectionHeading from '@/components/ui/SectionHeading.svelte';
	import { site } from '@/lib/config/site';
	import { telHref, waHref } from '@/lib/utils/contact';

	const whatsappHref = $derived(waHref(site.whatsapp, $_('home.contact.whatsappMessage')));
	const briefKeys = [
		'home.contact.brief1',
		'home.contact.brief2',
		'home.contact.brief3',
		'home.contact.brief4'
	] as const;
</script>

<section id="contact" class="contact section-space" tabindex="-1">
	<div class="container">
		<div class="contact__panel">
			<div class="contact__content motion-reveal">
				<SectionHeading
					eyebrow={$_('home.contact.eyebrow')}
					title={$_('home.contact.h2')}
					subtitle={$_('home.contact.sub')}
					theme="dark"
				/>

				<div class="contact__actions">
					<Button
						variant="primary"
						size="large"
						href={whatsappHref}
						target="_blank"
						rel="noopener noreferrer"
						ariaLabel="{$_('home.contact.btnWhatsapp')}, {$_('home.a11y.newWindow')}"
					>
						<Icon name="message" size={20} />
						{$_('home.contact.btnWhatsapp')}
					</Button>
					<Button variant="secondary" size="large" href={telHref(site.phones[0])}>
						<Icon name="phone" size={20} />
						{$_('home.contact.btnPhone')}
					</Button>
				</div>

				<p class="contact__note">{$_('home.contact.note')}</p>

				<dl class="contact__meta">
					<div class="contact__meta-card">
						<dt>
							<Icon name="phone" size={18} />
							<span>{$_('home.contact.phoneLabel')}</span>
						</dt>
						<dd>
							<a href={telHref(site.phones[0])}>{site.phones[0]}</a>
						</dd>
					</div>
					<div class="contact__meta-card">
						<dt>
							<Icon name="pin" size={18} />
							<span>{$_('home.contact.areaLabel')}</span>
						</dt>
						<dd>{$_('home.contact.areaValue')}</dd>
					</div>
				</dl>
			</div>

			<aside class="contact__brief motion-reveal">
				<div class="contact__brief-head" aria-hidden="true">
					<span>{$_('home.contact.briefLabel')} / 0{briefKeys.length}</span>
					<Icon name="truck" size={30} strokeWidth={1.5} />
				</div>
				<h3>{$_('home.contact.briefTitle')}</h3>
				<ol>
					{#each briefKeys as key, index}
						<li>
							<span>0{index + 1}</span>
							<p>{$_(key)}</p>
						</li>
					{/each}
				</ol>
			</aside>
		</div>
	</div>
</section>

<style lang="scss">
	.contact {
		background: var(--color-canvas);

		&__panel {
			position: relative;
			display: grid;
			gap: clamp(2.5rem, 6vw, 6rem);
			padding: clamp(1.5rem, 6vw, 5rem);
			overflow: hidden;
			color: var(--color-on-dark);
			background:
				radial-gradient(circle at 95% 5%, rgb(var(--rgb-accent) / 0.12), transparent 22rem),
				var(--color-ink);
			border-radius: var(--radius-xl);
			box-shadow: var(--shadow-md);

			&::before {
				position: absolute;
				top: 0;
				right: 12%;
				width: 20rem;
				height: 4px;
				background: var(--color-accent);
				content: '';
			}
		}

		&__content {
			align-self: center;
		}

		&__actions {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			margin-top: 36px;
		}

		&__note {
			max-width: 62ch;
			margin-top: 16px;
			color: var(--color-on-dark-muted);
			font-size: 0.75rem;
		}

		&__meta {
			display: grid;
			gap: 24px;
			margin: clamp(2.5rem, 6vw, 4.5rem) 0 0;
			padding-top: 28px;
			border-top: 1px solid var(--color-line-dark);

			&-card {
				display: grid;
				align-content: start;
				min-width: 0;

				dt {
					display: flex;
					align-items: center;
					gap: 9px;
					color: var(--color-on-dark-muted);

					span {
						font-family: var(--font-mono);
						font-size: 0.625rem;
						font-weight: 700;
						letter-spacing: 0.1em;
						text-transform: uppercase;
					}

					:global(.icon) {
						color: var(--color-accent);
					}
				}

				dd {
					margin: 14px 0 0 27px;
					color: var(--color-on-dark);
					font-size: clamp(1rem, 1.65vw, 1.1875rem);
					font-weight: 700;
					line-height: 1.35;
					text-wrap: pretty;
				}

				a {
					border-bottom: 1px solid transparent;
					transition: border-color var(--motion-fast) var(--ease-standard);

					&:hover {
						border-color: var(--color-accent);
					}
				}
			}
		}

		&__brief {
			align-self: stretch;
			padding: clamp(1.5rem, 4vw, 2.5rem);
			color: var(--color-ink);
			background: var(--color-accent);
			border-radius: var(--radius-lg);

			h3 {
				max-width: 13ch;
				margin-top: clamp(2rem, 5vw, 4rem);
				font-size: clamp(1.75rem, 3.4vw, 3rem);
				font-weight: 750;
			}

			ol {
				margin-top: 30px;
				list-style: none;

				li {
					display: grid;
					grid-template-columns: 2rem minmax(0, 1fr);
					gap: 14px;
					padding-block: 14px;
					border-bottom: 1px solid rgb(var(--rgb-ink) / 0.2);

					&:last-child {
						border-bottom: 0;
					}

					span {
						font-family: var(--font-mono);
						font-size: 0.6875rem;
						font-weight: 700;
					}

					p {
						font-weight: 650;
						line-height: 1.45;
					}
				}
			}
		}

		&__brief-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			padding-bottom: 16px;
			border-bottom: 1px solid rgb(var(--rgb-ink) / 0.2);

			span {
				font-family: var(--font-mono);
				font-size: 0.6875rem;
				font-weight: 700;
				letter-spacing: 0.1em;
			}
		}

		@media (min-width: 60rem) {
			&__panel {
				grid-template-columns: minmax(0, 1.12fr) minmax(19rem, 0.88fr);
			}

			&__meta {
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 0;

				&-card {
					padding-right: 28px;

					& + .contact__meta-card {
						padding-right: 0;
						padding-left: 28px;
						border-left: 1px solid var(--color-line-dark);
					}
				}
			}
		}

		@media (max-width: 39.99rem) {
			&__panel {
				margin-inline: calc(var(--container-gutter) * -0.45);
				border-radius: var(--radius-lg);
			}

			&__actions {
				flex-direction: column;

				:global(.button) {
					width: 100%;
				}
			}
		}
	}
</style>
