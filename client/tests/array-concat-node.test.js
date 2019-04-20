import { ArrayConcatNode } from "../../shared/lib/array/array-concat-node";

describe('ArrayConcatNode', function () {
	it('should return array', async function () {
		expect(await ArrayConcatNode.executor({}, {
			array1: [1, 2],
			array2: [3, 4],
		})).toEqual({
			array: [1, 2, 3, 4],
		});
	});
});
