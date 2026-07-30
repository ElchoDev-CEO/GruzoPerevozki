<script lang="ts">
	import { _ } from 'svelte-i18n';
	import IconBox from '@/components/ui/IconBox.svelte';
	import { site } from '@/lib/config/site';
	import { telHref, waHref } from '@/lib/utils/contact';
</script>

<section id="contact" class="contact">
	<div class="container">
		<div class="contact__head">
			<h2>{$_('home.contact.h2')}</h2>
			<p>{$_('home.contact.sub')}</p>
		</div>

		<div class="contact__cards">
			<div class="contact__card">
				<IconBox icon="lucide:phone" bg="var(--brand)" iconColor="var(--gray-900)" size={48} />
				<div>
					<h3>{$_('home.contact.phoneTitle')}</h3>
					{#each site.phones as phone}
						<a class="contact__link contact__link--brand" href={telHref(phone)}>{phone}</a>
					{/each}
				</div>
			</div>

			<div class="contact__card">
				<div class="contact__wa-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
						/>
					</svg>
				</div>
				<div>
					<h3>{$_('home.contact.whatsappTitle')}</h3>
					<a
						class="contact__link contact__link--wa"
						href={waHref(site.whatsapp)}
						target="_blank"
						rel="noopener noreferrer"
					>
						{site.phones[0]}
					</a>
					<p class="contact__note">{$_('home.contact.whatsappNote')}</p>
				</div>
			</div>

			<div class="contact__card">
				<IconBox
					icon="lucide:map-pin"
					bg="var(--accent-purple)"
					iconColor="var(--white)"
					size={48}
				/>
				<div>
					<h3>{$_('home.contact.serviceAreaTitle')}</h3>
					<p class="contact__text">{$_('home.contact.serviceAreaValue')}</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.contact {
		background: var(--gray-50);
		padding: 64px 0;

		&__head {
			text-align: center;
			margin-bottom: 48px;

			h2 {
				font-size: 30px;
				font-weight: 700;
				color: var(--gray-900);
				margin-bottom: 16px;
			}

			p {
				font-size: 18px;
				color: var(--gray-600);
			}
		}

		&__cards {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;
		}

		&__card {
			display: flex;
			align-items: flex-start;
			gap: 16px;
			background: var(--white);
			border-radius: var(--radius-2xl);
			padding: 24px;
			box-shadow: var(--shadow-lg);
			transition: all 0.3s ease;

			&:hover {
				box-shadow: var(--shadow-xl);
			}

			h3 {
				font-weight: 600;
				color: var(--gray-900);
				margin-bottom: 8px;
			}
		}

		&__wa-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			width: 48px;
			height: 48px;
			border-radius: var(--radius-xl);
			background: var(--whatsapp);
			color: var(--white);
		}

		&__link {
			display: block;
			font-size: 18px;

			&--brand {
				color: var(--brand);
			}
			&--wa {
				color: var(--whatsapp);
			}

			&:hover {
				text-decoration: underline;
			}
		}

		&__note {
			font-size: 14px;
			color: var(--gray-500);
			margin-top: 4px;
		}

		&__text {
			color: var(--gray-600);
		}

		@media (min-width: 768px) {
			padding: 96px 0;

			&__head {
				h2 {
					font-size: 36px;
				}
			}

			&__cards {
				grid-template-columns: repeat(3, minmax(0, 1fr));
			}
		}
	}
</style>
