export interface NavLink {
	labelKey: string;
	href: string;
}

export const navLinks: NavLink[] = [
	{ labelKey: 'home.nav.home', href: '/' },
	{ labelKey: 'home.nav.services', href: '#services' },
	{ labelKey: 'home.nav.regions', href: '#regions' },
	{ labelKey: 'home.nav.contact', href: '#contact' }
];
