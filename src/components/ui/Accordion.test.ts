/// <reference types="@testing-library/jest-dom/vitest" />
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Accordion from '@/components/ui/Accordion.svelte';

const items = [
	{ id: 'a', question: 'Вопрос 1', answer: 'Ответ 1' },
	{ id: 'b', question: 'Вопрос 2', answer: 'Ответ 2' }
];

describe('Accordion', () => {
	it('по умолчанию все закрыты', () => {
		render(Accordion, { items });
		const triggers = screen.getAllByRole('button');
		expect(triggers[0]).toHaveAttribute('aria-expanded', 'false');
	});

	it('клик открывает элемент', async () => {
		render(Accordion, { items });
		const triggers = screen.getAllByRole('button');
		await fireEvent.click(triggers[0]);
		expect(triggers[0]).toHaveAttribute('aria-expanded', 'true');
	});

	it('открытие второго закрывает первый (single)', async () => {
		render(Accordion, { items });
		const triggers = screen.getAllByRole('button');
		await fireEvent.click(triggers[0]);
		await fireEvent.click(triggers[1]);
		expect(triggers[0]).toHaveAttribute('aria-expanded', 'false');
		expect(triggers[1]).toHaveAttribute('aria-expanded', 'true');
	});

	it('повторный клик закрывает (collapsible)', async () => {
		render(Accordion, { items });
		const triggers = screen.getAllByRole('button');
		await fireEvent.click(triggers[0]);
		await fireEvent.click(triggers[0]);
		expect(triggers[0]).toHaveAttribute('aria-expanded', 'false');
	});
});
