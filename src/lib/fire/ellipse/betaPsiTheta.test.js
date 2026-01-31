import { expect, test } from 'vitest';

function multiplier(a,b) { return a*b}

test('Multiplier', () => {
	let double = multiplier(0, 2)
	expect(double).toEqual(0)

	double = 5
	expect(double).toEqual(10)
})