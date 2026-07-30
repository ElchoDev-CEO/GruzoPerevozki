export interface NavLink {
	labelKey: string;
	href: string;
}

export const navLinks: NavLink[] = [
	{ labelKey: 'home.nav.services', href: '#services' },
	{ labelKey: 'home.nav.process', href: '#about' },
	{ labelKey: 'home.nav.regions', href: '#regions' },
	{ labelKey: 'home.nav.transport', href: '#transport' },
	{ labelKey: 'home.nav.contact', href: '#contact' }
];
