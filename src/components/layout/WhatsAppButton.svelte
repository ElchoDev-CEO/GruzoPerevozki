<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Icon from '@/components/ui/Icon.svelte';
	import { site } from '@/lib/config/site';
	import { waHref } from '@/lib/utils/contact';

	const whatsappHref = $derived(waHref(site.whatsapp, $_('home.contact.whatsappMessage')));
</script>

<a
	class="whatsapp-button"
	href={whatsappHref}
	target="_blank"
	rel="noopener noreferrer"
	aria-label={$_('home.a11y.floatingWhatsapp')}
>
	<Icon name="message" size={22} strokeWidth={2} />
	<span>{$_('home.contact.whatsappLabel')}</span>
</a>

<style lang="scss">
	.whatsapp-button {
		position: fixed;
		right: max(14px, env(safe-area-inset-right));
		bottom: max(14px, env(safe-area-inset-bottom));
		z-index: var(--z-floating);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		min-width: 52px;
		height: 52px;
		padding-inline: 15px;
		color: var(--color-ink);
		background: var(--color-accent);
		border: 1px solid rgb(var(--rgb-ink) / 0.18);
		border-radius: var(--radius-full);
		box-shadow: var(--shadow-md);
		font-size: 0.8125rem;
		font-weight: 750;
		transition:
			background-color var(--motion-fast) var(--ease-standard),
			transform var(--motion-fast) var(--ease-out);

		span {
			display: none;
		}

		&:hover {
			background: var(--color-accent-hover);
		}

		&:active {
			transform: scale(0.97);
		}

		@media (min-width: 48rem) {
			right: 24px;
			bottom: 24px;

			span {
				display: inline;
			}
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				transform: translateY(-2px);
			}
		}

		@media (prefers-reduced-motion: reduce) {
			transition: background-color var(--motion-fast) var(--ease-standard);

			&:hover,
			&:active {
				transform: none;
			}
		}
	}
</style>
