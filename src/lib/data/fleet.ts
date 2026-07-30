export interface FleetPhoto {
	id: string;
	imageBase: string;
	altKey: string;
	captionKey: string;
	descriptionKey: string;
}

export const fleetPhotos: readonly FleetPhoto[] = [
	{
		id: 'route-day',
		imageBase: '/images/fleet-01',
		altKey: 'home.fleet.photo1Alt',
		captionKey: 'home.fleet.photo1Caption',
		descriptionKey: 'home.fleet.photo1Description'
	},
	{
		id: 'cargo-loaded',
		imageBase: '/images/fleet-02',
		altKey: 'home.fleet.photo2Alt',
		captionKey: 'home.fleet.photo2Caption',
		descriptionKey: 'home.fleet.photo2Description'
	},
	{
		id: 'open-platform',
		imageBase: '/images/fleet-03',
		altKey: 'home.fleet.photo3Alt',
		captionKey: 'home.fleet.photo3Caption',
		descriptionKey: 'home.fleet.photo3Description'
	},
	{
		id: 'warehouse-loading',
		imageBase: '/images/fleet-04',
		altKey: 'home.fleet.photo4Alt',
		captionKey: 'home.fleet.photo4Caption',
		descriptionKey: 'home.fleet.photo4Description'
	},
	{
		id: 'cargo-placement',
		imageBase: '/images/fleet-05',
		altKey: 'home.fleet.photo5Alt',
		captionKey: 'home.fleet.photo5Caption',
		descriptionKey: 'home.fleet.photo5Description'
	},
	{
		id: 'evening-route',
		imageBase: '/images/fleet-06',
		altKey: 'home.fleet.photo6Alt',
		captionKey: 'home.fleet.photo6Caption',
		descriptionKey: 'home.fleet.photo6Description'
	}
];
