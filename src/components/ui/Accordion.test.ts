/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Accordion from '@/components/ui/Accordion.svelte';

const items = [
	{ id: 'a', question: 'Вопрос 1', answer: 'Ответ 1' },
	{ id: 'b', question: 'Вопрос 2', answer: 'Ответ 2' }
];

describe('Accordion', () => {
	it('рендерит все вопросы и ответы в DOM', () => {
		const { container } = render(Accordion, { items });

		expect(container.querySelectorAll('details')).toHaveLength(items.length);
		expect(container.querySelectorAll('summary')).toHaveLength(items.length);
		expect(screen.getByText('Ответ 1')).toBeInTheDocument();
		expect(screen.getByText('Ответ 2')).toBeInTheDocument();
	});

	it('открывает первый пункт по умолчанию', () => {
		const { container } = render(Accordion, { items });
		const details = container.querySelectorAll('details');

		expect(details[0]).toHaveAttribute('open');
		expect(details[1]).not.toHaveAttribute('open');
	});

	it('связывает каждый summary с соответствующей панелью', () => {
		const { container } = render(Accordion, { items });

		for (const item of items) {
			const summary = container.querySelector(`#accordion-question-${item.id}`);
			const panel = container.querySelector(`#accordion-panel-${item.id}`);

			expect(summary).toHaveAttribute('aria-controls', `accordion-panel-${item.id}`);
			expect(panel).toHaveAttribute('role', 'region');
			expect(panel).toHaveAttribute('aria-labelledby', `accordion-question-${item.id}`);
		}
	});
});
