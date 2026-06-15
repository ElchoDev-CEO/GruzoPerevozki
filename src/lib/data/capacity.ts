export interface CapacityTier {
	weightKey: string;
	vehicleKey: string;
	exampleKeys: string[];
	popular: boolean;
}

export const capacities: CapacityTier[] = [
	{
		weightKey: 'home.capacity.cap1w',
		vehicleKey: 'home.capacity.cap1v',
		exampleKeys: ['home.capacity.cap1e1', 'home.capacity.cap1e2', 'home.capacity.cap1e3'],
		popular: false
	},
	{
		weightKey: 'home.capacity.cap2w',
		vehicleKey: 'home.capacity.cap2v',
		exampleKeys: ['home.capacity.cap2e1', 'home.capacity.cap2e2', 'home.capacity.cap2e3'],
		popular: true
	},
	{
		weightKey: 'home.capacity.cap3w',
		vehicleKey: 'home.capacity.cap3v',
		exampleKeys: ['home.capacity.cap3e1', 'home.capacity.cap3e2', 'home.capacity.cap3e3'],
		popular: false
	},
	{
		weightKey: 'home.capacity.cap4w',
		vehicleKey: 'home.capacity.cap4v',
		exampleKeys: ['home.capacity.cap4e1', 'home.capacity.cap4e2', 'home.capacity.cap4e3'],
		popular: false
	},
	{
		weightKey: 'home.capacity.cap5w',
		vehicleKey: 'home.capacity.cap5v',
		exampleKeys: ['home.capacity.cap5e1', 'home.capacity.cap5e2', 'home.capacity.cap5e3'],
		popular: false
	}
];
