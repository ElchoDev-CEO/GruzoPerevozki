export const site = {
	brand: 'Cargo KG',
	phones: ['+996 555 123 456', '+996 700 987 654'],
	whatsapp: '996555123456',
	email: 'info@cargo-kg.com',
	address: 'г. Бишкек, ул. Ахунбаева 123\nКыргызская Республика',
	addressShort: 'г. Бишкек, ул. Ахунбаева 123',
	social: {
		facebook: '#',
		instagram: '#'
	},
	// Координаты центра Бишкека для встраивания карты Яндекс (lazy iframe)
	map: {
		src: 'https://yandex.ru/map-widget/v1/?ll=74.590416%2C42.874621&z=12',
		title: 'Карта: г. Бишкек'
	}
} as const;
