import { NumberNode } from "../../shared/lib/primitive/number-node";

describe('NumberNode', function () {
	it('should return a number', async function () {
		expect(await NumberNode.executor({
			number: 0.618
		}, {})).toEqual({
			number: 0.618
		});
	});
});
