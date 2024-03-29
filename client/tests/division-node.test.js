import { DivisionNode } from "../../shared/lib/arithmetics/division-node";

describe('DivisionNode', function () {
	it('should return quotient', async function () {
		expect(await DivisionNode.executor({}, {
			dividend: 45,
			divisor: 9
		})).toEqual({
			quotient: 5
		});
	});
	it('should return quotient of positive and negative numbers', async function () {
		expect(await DivisionNode.executor({}, {
			dividend: 23,
			divisor: -1
		})).toEqual({
			quotient: -23
		});
	});
});
