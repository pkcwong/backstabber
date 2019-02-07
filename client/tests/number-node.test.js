import { NumberNode } from "../../shared/lib/primitive/number-node";

const mock = () => {
	return new NumberNode({
		number: 0.618
	});
};

describe('NumberNode', function () {
	it('should return a number', async function () {
		expect(await mock().execute()).toEqual({
			number: 0.618
		});
	});
});
