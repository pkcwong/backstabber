import { ArrayIncludesNode } from "../../shared/lib/array/array-includes-node";

describe('ArrayIncludesNode', function () {
	it('should return false', async function () {
		expect(await ArrayIncludesNode.executor({}, {
			array: [],
			value: 0
		})).toEqual({
			truthy: undefined,
			falsy: false
		});
	});
	it('should return true', async function () {
		expect(await ArrayIncludesNode.executor({}, {
			array: [1,2],
			value: 1
		})).toEqual({
			truthy: true,
			falsy: undefined
		});
	});
});
