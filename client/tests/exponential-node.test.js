import { ExponentialNode } from "../../shared/lib/arithmetics/exponential-node";

describe('ExponentialNode', function () {
	it('should return product', async function () {
		expect(await ExponentialNode.executor({}, {
			base: 13,
			exponent: 2
		})).toEqual({
			product: 169
		});
	});
	it('should return product of positive and negative number', async function () {
		expect(await ExponentialNode.executor({}, {
			base: 2,
			exponent: -2
		})).toEqual({
			product: 0.25
		});
	});
	it('should return product of negative base', async function () {
		expect(await ExponentialNode.executor({}, {
			base: -2,
			exponent: 2
		})).toEqual({
			product: 4
		});
	});
});
