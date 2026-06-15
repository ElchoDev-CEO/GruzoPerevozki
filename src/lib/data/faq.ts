export interface FaqEntry {
	id: string;
	questionKey: string;
	answerKey: string;
}

export const faqEntries: FaqEntry[] = [
	{ id: 'q1', questionKey: 'home.faq.q1', answerKey: 'home.faq.a1' },
	{ id: 'q2', questionKey: 'home.faq.q2', answerKey: 'home.faq.a2' },
	{ id: 'q3', questionKey: 'home.faq.q3', answerKey: 'home.faq.a3' },
	{ id: 'q4', questionKey: 'home.faq.q4', answerKey: 'home.faq.a4' },
	{ id: 'q5', questionKey: 'home.faq.q5', answerKey: 'home.faq.a5' }
];
