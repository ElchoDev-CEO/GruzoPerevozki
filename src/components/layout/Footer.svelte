<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@/components/ui/Icon.svelte';
	import Logo from '@/components/ui/Logo.svelte';
	import { site } from '@/lib/config/site';
	import { navLinks } from '@/lib/data/nav';
	import { telHref, waHref } from '@/lib/utils/contact';

	const year = new Date().getFullYear();
	const whatsappHref = $derived(waHref(site.whatsapp, $_('home.contact.whatsappMessage')));
</script>

<footer class="footer">
	<div class="container">
		<div class="footer__grid">
			<div class="footer__brand">
				<Logo inverse />
				<p>{$_('home.footer.desc')}</p>
			</div>

			<nav class="footer__nav" aria-label={$_('home.footer.navTitle')}>
				<h2>{$_('home.footer.navTitle')}</h2>
				<ul>
					{#each navLinks as link}
						<li><a href={link.href}>{$_(link.labelKey)}</a></li>
					{/each}
				</ul>
			</nav>

			<div class="footer__contacts">
				<h2>{$_('home.footer.contactTitle')}</h2>
				<a href={telHref(site.phones[0])}>
					<Icon name="phone" size={18} />
					<span>{site.phones[0]}</span>
				</a>
				<a
					href={whatsappHref}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="{$_('home.contact.whatsappLabel')}, {$_('home.a11y.newWindow')}"
				>
					<Icon name="message" size={18} />
					<span>{$_('home.contact.whatsappLabel')}</span>
				</a>
			</div>
		</div>

		<div class="footer__bottom">
			<span>© {year} {site.brand}</span>
			<span>{$_('home.footer.copyright')}</span>
		</div>
	</div>
</footer>

<style lang="scss">
	.footer {
		padding-block: clamp(3.5rem, 7vw, 6rem) 28px;
		color: var(--color-on-dark);
		background: var(--color-ink);
		border-top: 1px solid var(--color-line-dark);

		&__grid {
			display: grid;
			gap: 40px;
			padding-bottom: clamp(3rem, 6vw, 5rem);
		}

		&__brand {
			max-width: 31rem;

			p {
				margin-top: 22px;
				color: var(--color-on-dark-muted);
			}
		}

		&__nav,
		&__contacts {
			h2 {
				margin-bottom: 18px;
				color: var(--color-on-dark-muted);
				font-family: var(--font-mono);
				font-size: 0.6875rem;
				font-weight: 700;
				letter-spacing: 0.1em;
				text-transform: uppercase;
			}

			a {
				color: var(--color-on-dark-muted);
				transition: color var(--motion-fast) var(--ease-standard);

				&:hover {
					color: var(--color-on-dark);
				}
			}
		}

		&__nav {
			ul {
				display: grid;
				gap: 10px;
				list-style: none;
			}
		}

		&__contacts {
			display: grid;
			align-content: start;
			gap: 12px;

			h2 {
				margin-bottom: 6px;
			}

			a {
				display: inline-flex;
				align-items: center;
				gap: 10px;
				justify-self: start;

				:global(.icon) {
					color: var(--color-accent);
				}
			}
		}

		&__bottom {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			gap: 10px 24px;
			padding-top: 24px;
			color: var(--color-on-dark-muted);
			border-top: 1px solid var(--color-line-dark);
			font-family: var(--font-mono);
			font-size: 0.6875rem;
			letter-spacing: 0.04em;
		}

		@media (min-width: 48rem) {
			&__grid {
				grid-template-columns: minmax(0, 1.5fr) minmax(10rem, 0.65fr) minmax(12rem, 0.85fr);
			}
		}
	}
</style>
