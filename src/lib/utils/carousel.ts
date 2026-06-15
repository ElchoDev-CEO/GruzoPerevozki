export const nextIndex = (current: number, length: number): number =>
	length <= 0 ? 0 : (current + 1) % length;

export const prevIndex = (current: number, length: number): number =>
	length <= 0 ? 0 : (current - 1 + length) % length;
