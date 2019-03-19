import { MultiplicationNode } from "../../shared/lib/arithmetics/multiplication-node";

describe('MultiplicationNode', function () {
	it('should return product', async function () {
		expect(await MultiplicationNode.executor({}, {
			multiplier: 23,
			multiplicand: 3
		})).toEqual({
			product: 69
		});
	});
	it('should return product of positive and negative number', async function () {
		expect(await MultiplicationNode.executor({}, {
			multiplier: 23,
			multiplicand: -3
		})).toEqual({
			product: -69
		});
	});
	it('should return product of zeros', async function () {
		expect(await MultiplicationNode.executor({}, {
			multiplier: 0,
			multiplicand: 0
		})).toEqual({
			product: 0
		});
	});
});
