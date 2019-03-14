import { ArrayPushNode } from "../../shared/lib/array/array-push-node";

describe('ArrayPushNode', function () {
	it('should return array', async function () {
		expect(await ArrayPushNode.executor({}, {
			array: [],
			item: 0
		})).toEqual({
			result: [
				0
			]
		});
	});
	it('should return nested array', async function () {
		expect(await ArrayPushNode.executor({}, {
			array: [],
			item: []
		})).toEqual({
			result: [
				[]
			]
		});
	});
});
