export interface NavLink {
	labelKey: string;
	targetId: string | null; // null => scrollToTop
}

export const navLinks: NavLink[] = [
	{ labelKey: 'home.nav.home', targetId: null },
	{ labelKey: 'home.nav.services', targetId: 'services' },
	{ labelKey: 'home.nav.regions', targetId: 'regions' },
	{ labelKey: 'home.nav.contact', targetId: 'contact' }
];
