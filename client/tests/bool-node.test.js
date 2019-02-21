import { BoolNode } from "../../shared/lib/primitive/bool-node";

describe('BoolNode', function() {
	it('should return a boolean', async function () {
		expect(await BoolNode.executor({
			bool: true
		}, {})).toEqual({
			bool: true
		});
	});
});
