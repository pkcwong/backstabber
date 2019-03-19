import { ArrayGetNode } from "../../shared/lib/array/array-get-node";

describe('ArrayGetNode', function () {
	it('should return result', async function () {
		expect(await ArrayGetNode.executor({}, {
			array: [1, 2],
			index: 0
		})).toEqual({
			result: 1
		});
	});
});
