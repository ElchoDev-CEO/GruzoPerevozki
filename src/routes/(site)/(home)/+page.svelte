<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Hero from './sections/Hero.svelte';
	import About from './sections/About.svelte';
	import Services from './sections/Services.svelte';
	import Regions from './sections/Regions.svelte';
	import CargoTypes from './sections/CargoTypes.svelte';
	import Capacity from './sections/Capacity.svelte';
	import WhyChooseUs from './sections/WhyChooseUs.svelte';
	import Reviews from './sections/Reviews.svelte';
	import Faq from './sections/Faq.svelte';
	import Contact from './sections/Contact.svelte';
	import { site } from '@/lib/config/site';

	const socialImage = new URL('images/hero-truck.jpg', site.url).href;
	const structuredData = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': `${site.url}#organization`,
				name: site.brand,
				url: site.url,
				image: socialImage,
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
					availableLanguage: ['ru', 'ky']
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

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={$_('home.meta.ogTitle')} />
	<meta name="twitter:description" content={$_('home.meta.ogDescription')} />
	<meta name="twitter:image" content={socialImage} />

	{@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

<Hero />
<About />
<Services />
<Regions />
<CargoTypes />
<Capacity />
<WhyChooseUs />
<Reviews />
<Faq />
<Contact />
