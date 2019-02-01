import { BoolNode } from "../../shared/lib/bool-node";

const mock = () => {
	return new BoolNode({
		bool: true
	});
};

describe(BoolNode.name, function() {
	it('should return a boolean', async function () {
		expect(await mock().execute()).toEqual({
			bool: true
		});
	});
});