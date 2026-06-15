export interface AboutStat {
	icon: string;
	bg: string;
	valueKey: string;
	labelKey: string;
}

export const aboutStats: AboutStat[] = [
	{
		icon: 'lucide:trending-up',
		bg: 'var(--brand)',
		valueKey: 'home.about.stat1v',
		labelKey: 'home.about.stat1l'
	},
	{
		icon: 'lucide:map-pin',
		bg: 'var(--accent-blue)',
		valueKey: 'home.about.stat2v',
		labelKey: 'home.about.stat2l'
	},
	{
		icon: 'lucide:clock',
		bg: 'var(--accent-green)',
		valueKey: 'home.about.stat3v',
		labelKey: 'home.about.stat3l'
	},
	{
		icon: 'lucide:weight',
		bg: 'var(--accent-purple)',
		valueKey: 'home.about.stat4v',
		labelKey: 'home.about.stat4l'
	}
];
