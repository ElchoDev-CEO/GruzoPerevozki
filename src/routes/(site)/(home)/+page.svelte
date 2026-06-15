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
</script>

<svelte:head>
	<title>{$_('home.meta.title')}</title>
	<meta name="description" content={$_('home.meta.description')} />
	<meta name="keywords" content={$_('home.meta.keywords')} />
	<meta property="og:title" content={$_('home.meta.ogTitle')} />
	<meta property="og:description" content={$_('home.meta.ogDescription')} />
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
