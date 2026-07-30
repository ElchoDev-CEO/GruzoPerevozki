<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Hero from './sections/Hero.svelte';
	import Services from './sections/Services.svelte';
	import Process from './sections/Process.svelte';
	import Regions from './sections/Regions.svelte';
	import Fleet from './sections/Fleet.svelte';
	import WhyChooseUs from './sections/WhyChooseUs.svelte';
	import Faq from './sections/Faq.svelte';
	import Contact from './sections/Contact.svelte';
	import { site } from '@/lib/config/site';

	const socialImage = new URL('images/og-cargo-kg.jpg', site.url).href;
	const structuredData = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': `${site.url}#organization`,
				name: site.brand,
				url: site.url,
				telephone: site.phones[0],
				areaServed: {
					'@type': 'Country',
					name: site.areaServed
				},
				contactPoint: {
					'@type': 'ContactPoint',
					telephone: site.phones[0],
					contactType: 'customer service',
					areaServed: 'KG',
					availableLanguage: ['ru']
				}
			},
			{
				'@type': 'WebSite',
				'@id': `${site.url}#website`,
				url: site.url,
				name: site.brand,
				inLanguage: 'ru',
				publisher: {
					'@id': `${site.url}#organization`
				}
			}
		]
	}).replace(/</g, '\\u003c');
</script>

<svelte:head>
	<title>{$_('home.meta.title')}</title>
	<meta name="description" content={$_('home.meta.description')} />
	<link rel="canonical" href={site.url} />

	<meta property="og:type" content="website" />
	<meta property="og:locale" content={site.locale} />
	<meta property="og:site_name" content={site.brand} />
	<meta property="og:url" content={site.url} />
	<meta property="og:title" content={$_('home.meta.ogTitle')} />
	<meta property="og:description" content={$_('home.meta.ogDescription')} />
	<meta property="og:image" content={socialImage} />
	<meta property="og:image:alt" content={$_('home.meta.ogImageAlt')} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={$_('home.meta.ogTitle')} />
	<meta name="twitter:description" content={$_('home.meta.ogDescription')} />
	<meta name="twitter:image" content={socialImage} />

	{@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

<Hero />
<Services />
<Process />
<Regions />
<Fleet />
<WhyChooseUs />
<Faq />
<Contact />
