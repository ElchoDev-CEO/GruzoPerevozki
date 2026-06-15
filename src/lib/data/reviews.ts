export interface Review {
	nameKey: string;
	roleKey: string;
	textKey: string;
	dateKey: string;
	rating: number;
}

export const reviews: Review[] = [
	{
		nameKey: 'home.reviews.r1name',
		roleKey: 'home.reviews.r1role',
		textKey: 'home.reviews.r1text',
		dateKey: 'home.reviews.r1date',
		rating: 5
	},
	{
		nameKey: 'home.reviews.r2name',
		roleKey: 'home.reviews.r2role',
		textKey: 'home.reviews.r2text',
		dateKey: 'home.reviews.r2date',
		rating: 5
	},
	{
		nameKey: 'home.reviews.r3name',
		roleKey: 'home.reviews.r3role',
		textKey: 'home.reviews.r3text',
		dateKey: 'home.reviews.r3date',
		rating: 5
	},
	{
		nameKey: 'home.reviews.r4name',
		roleKey: 'home.reviews.r4role',
		textKey: 'home.reviews.r4text',
		dateKey: 'home.reviews.r4date',
		rating: 5
	}
];
