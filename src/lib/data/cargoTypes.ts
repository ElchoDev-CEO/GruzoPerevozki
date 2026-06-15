export interface CargoType {
	image: string;
	titleKey: string;
	descKey: string;
}

export const cargoTypes: CargoType[] = [
	{ image: '/images/cargo-furniture.jpg', titleKey: 'home.cargo.c1t', descKey: 'home.cargo.c1d' },
	{ image: '/images/cargo-appliances.jpg', titleKey: 'home.cargo.c2t', descKey: 'home.cargo.c2d' },
	{
		image: '/images/cargo-construction.jpg',
		titleKey: 'home.cargo.c3t',
		descKey: 'home.cargo.c3d'
	},
	{ image: '/images/cargo-commercial.jpg', titleKey: 'home.cargo.c4t', descKey: 'home.cargo.c4d' },
	{ image: '/images/cargo-furniture.jpg', titleKey: 'home.cargo.c5t', descKey: 'home.cargo.c5d' },
	{ image: '/images/cargo-oversized.jpg', titleKey: 'home.cargo.c6t', descKey: 'home.cargo.c6d' }
];
