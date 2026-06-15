export interface ServiceItem {
	icon: string;
	titleKey: string;
	descKey: string;
}

export const services: ServiceItem[] = [
	{ icon: 'lucide:armchair', titleKey: 'home.services.s1t', descKey: 'home.services.s1d' },
	{ icon: 'lucide:hammer', titleKey: 'home.services.s2t', descKey: 'home.services.s2d' },
	{
		icon: 'lucide:monitor-smartphone',
		titleKey: 'home.services.s3t',
		descKey: 'home.services.s3d'
	},
	{ icon: 'lucide:store', titleKey: 'home.services.s4t', descKey: 'home.services.s4d' },
	{ icon: 'lucide:navigation', titleKey: 'home.services.s5t', descKey: 'home.services.s5d' },
	{ icon: 'lucide:zap', titleKey: 'home.services.s6t', descKey: 'home.services.s6d' }
];
