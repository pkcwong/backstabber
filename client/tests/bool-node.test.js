import { BoolNode } from "../../shared/lib/primitive/bool-node";

const mock = () => {
	return new BoolNode({
		bool: true
	});
};

describe('BoolNode', function() {
	it('should return a boolean', async function () {
		expect(await mock().execute()).toEqual({
			bool: true
		});
	});
});
