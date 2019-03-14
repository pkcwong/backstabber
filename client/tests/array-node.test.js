import { ArrayNode } from "../../shared/lib/array/array-node";

describe('ArrayNode', function () {
	it('should return an array', async function () {
		expect(await ArrayNode.executor({
			array: [
				0,
				1
			]
		}, {})).toEqual({
			json: [
				0,
				1
			]
		});
	});
	it('should parse an array', async function () {
		expect(await ArrayNode.executor({
			array: {
				0: 1
			}
		}, {})).toEqual({
			json: [
				{
					0: 1
				}
			]
		});
	});
});
