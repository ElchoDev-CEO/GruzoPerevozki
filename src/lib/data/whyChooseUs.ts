export interface Feature {
	icon: string;
	titleKey: string;
	descKey: string;
}

export const features: Feature[] = [
	{ icon: 'lucide:shield', titleKey: 'home.why.w1t', descKey: 'home.why.w1d' },
	{ icon: 'lucide:truck', titleKey: 'home.why.w2t', descKey: 'home.why.w2d' },
	{ icon: 'lucide:map', titleKey: 'home.why.w3t', descKey: 'home.why.w3d' },
	{ icon: 'lucide:users', titleKey: 'home.why.w4t', descKey: 'home.why.w4d' },
	{ icon: 'lucide:eye', titleKey: 'home.why.w5t', descKey: 'home.why.w5d' },
	{ icon: 'lucide:headphones', titleKey: 'home.why.w6t', descKey: 'home.why.w6d' }
];
