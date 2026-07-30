<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import { site } from '@/lib/config/site';
	import { footerNav, footerServiceKeys } from '@/lib/data/footer';
	import { telHref, waHref } from '@/lib/utils/contact';
	import IconBox from '@/components/ui/IconBox.svelte';
</script>

<footer class="footer">
	<div class="container">
		<div class="footer__grid">
			<div class="footer__col">
				<div class="footer__brand">
					<IconBox icon="lucide:truck" bg="var(--brand)" size={40} />
					<span>{site.brand}</span>
				</div>
				<p class="footer__desc">{$_('home.footer.desc')}</p>
			</div>

			<div class="footer__col">
				<h3>{$_('home.footer.navTitle')}</h3>
				<ul>
					{#each footerNav as link}
						<li>
							<a href={link.href}>{$_(link.labelKey)}</a>
						</li>
					{/each}
				</ul>
			</div>

			<div class="footer__col">
				<h3>{$_('home.footer.servicesTitle')}</h3>
				<ul class="footer__plain">
					{#each footerServiceKeys as key}
						<li>{$_(key)}</li>
					{/each}
				</ul>
			</div>

			<div class="footer__col">
				<h3>{$_('home.footer.contactsTitle')}</h3>
				<ul class="footer__contacts">
					<li>
						<Icon icon="lucide:phone" width="20" height="20" />
						<a href={telHref(site.phones[0])}>{site.phones[0]}</a>
					</li>
					<li>
						<a href={waHref(site.whatsapp)} target="_blank" rel="noopener noreferrer"> WhatsApp </a>
					</li>
				</ul>
			</div>
		</div>

		<div class="footer__bottom">
			<div class="footer__copy">{$_('home.footer.copyright')}</div>
		</div>
	</div>
</footer>

<style lang="scss">
	.footer {
		background: var(--gray-900);
		color: var(--white);
		padding-top: 64px;
		padding-bottom: 32px;

		&__grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 32px;
			margin-bottom: 48px;
		}

		&__brand {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 16px;
			font-size: 20px;
			font-weight: 700;
		}

		&__desc {
			color: var(--gray-400);
			line-height: 1.625;
		}

		&__col {
			h3 {
				font-size: 18px;
				font-weight: 600;
				margin-bottom: 16px;
			}

			ul {
				list-style: none;
				margin: 0;
				padding: 0;
				display: flex;
				flex-direction: column;
				gap: 8px;
			}

			a {
				color: var(--gray-400);
				transition: color 0.2s ease;

				&:hover {
					color: var(--brand);
				}
			}
		}

		&__plain {
			li {
				color: var(--gray-400);
			}
		}

		&__contacts {
			li {
				display: flex;
				align-items: flex-start;
				gap: 8px;
				color: var(--gray-400);

				:global(svg) {
					color: var(--brand);
					flex-shrink: 0;
					margin-top: 2px;
				}
			}
		}

		&__bottom {
			border-top: 1px solid var(--gray-800);
			padding-top: 32px;
			text-align: center;
		}

		&__copy {
			color: var(--gray-400);
			font-size: 14px;
		}

		@media (min-width: 768px) {
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
