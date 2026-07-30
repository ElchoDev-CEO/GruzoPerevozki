<script lang="ts">
	import type { Snippet } from 'svelte';
	import { _ } from 'svelte-i18n';
	import Header from '@/components/layout/Header.svelte';
	import Footer from '@/components/layout/Footer.svelte';
	import WhatsAppButton from '@/components/layout/WhatsAppButton.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<a class="skip-link" href="#main-content">{$_('home.a11y.skipLink')}</a>
<Header />
<main id="main-content" tabindex="-1">{@render children?.()}</main>
<Footer />
<WhatsAppButton />
