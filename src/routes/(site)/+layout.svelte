<script lang="ts">
	import type { Snippet } from 'svelte';
	import Header from '@/components/layout/Header.svelte';
	import Footer from '@/components/layout/Footer.svelte';
	import WhatsAppButton from '@/components/layout/WhatsAppButton.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<Header />
<main>{@render children?.()}</main>
<Footer />
<WhatsAppButton />
