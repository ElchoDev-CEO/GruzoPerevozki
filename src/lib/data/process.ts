export interface ProcessStep {
	code: string;
	titleKey: string;
	descKey: string;
}

export const processSteps: ProcessStep[] = [
	{ code: '01', titleKey: 'home.process.s1t', descKey: 'home.process.s1d' },
	{ code: '02', titleKey: 'home.process.s2t', descKey: 'home.process.s2d' },
	{ code: '03', titleKey: 'home.process.s3t', descKey: 'home.process.s3d' },
	{ code: '04', titleKey: 'home.process.s4t', descKey: 'home.process.s4d' }
];
