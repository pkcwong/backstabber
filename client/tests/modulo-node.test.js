import { ModuloNode } from "../../shared/lib/arithmetics/modulo-node";

describe('ModuloNode', function () {
	it('should return remainder', async function () {
		expect(await ModuloNode.executor({}, {
			dividend: 45,
			divisor: 9
		})).toEqual({
			remainder: 0
		});
	});
	it('should return remainder of positive and negative numbers', async function () {
		expect(await ModuloNode.executor({}, {
			dividend: 23,
			divisor: -2
		})).toEqual({
			remainder: 1
		});
	});
});
