export interface ServiceItem {
	code: string;
	titleKey: string;
	descKey: string;
	imageBase: string;
	imageLargeWidth: number;
	imageWidth: number;
	imageHeight: number;
	featured?: boolean;
}

export const services: ServiceItem[] = [
	{
		code: '01',
		titleKey: 'home.services.s1t',
		descKey: 'home.services.s1d',
		imageBase: '/images/hero-truck',
		imageLargeWidth: 960,
		imageWidth: 1080,
		imageHeight: 1440,
		featured: true
	},
	{
		code: '02',
		titleKey: 'home.services.s2t',
		descKey: 'home.services.s2d',
		imageBase: '/images/cargo-furniture',
		imageLargeWidth: 800,
		imageWidth: 1080,
		imageHeight: 716
	},
	{
		code: '03',
		titleKey: 'home.services.s3t',
		descKey: 'home.services.s3d',
		imageBase: '/images/cargo-appliances',
		imageLargeWidth: 800,
		imageWidth: 1080,
		imageHeight: 720
	},
	{
		code: '04',
		titleKey: 'home.services.s4t',
		descKey: 'home.services.s4d',
		imageBase: '/images/cargo-construction',
		imageLargeWidth: 800,
		imageWidth: 1080,
		imageHeight: 904
	},
	{
		code: '05',
		titleKey: 'home.services.s5t',
		descKey: 'home.services.s5d',
		imageBase: '/images/cargo-oversized',
		imageLargeWidth: 800,
		imageWidth: 1080,
		imageHeight: 719
	}
];
