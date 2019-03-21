import { ArrayLengthNode } from "../../shared/lib/array/array-length-node";

describe('ArrayLengthNode', function () {
	it('should return array', async function () {
		expect(await ArrayLengthNode.executor({}, {
			array: []
		})).toEqual({
			length: 0
		});
	});
	it('should return length', async function () {
		expect(await ArrayLengthNode.executor({}, {
			array: [1,2]
		})).toEqual({
			length: 2
		});
	});
});
