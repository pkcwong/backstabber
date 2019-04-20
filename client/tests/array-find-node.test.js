import { ArrayFindNode } from "../../shared/lib/array/array-find-node";
import _ from "lodash"

describe('ArrayFindNode', function () {
	it('should return -1', async function () {
		expect(await ArrayFindNode.executor({}, {
			array: [1, 2],
			value: 0
		})).toEqual({
			found: undefined,
			index: -1
		});
	});
	it('should return 1', async function () {
		expect(await ArrayFindNode.executor({}, {
			array: [1, 2],
			value: 1
		})).toEqual({
			found: 1,
			index: 0
		});
	});
});
