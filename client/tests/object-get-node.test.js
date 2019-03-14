import { ObjectGetNode } from "../../shared/lib/object/object-get-node";

describe('ObjectGetNode', function () {
	it('should return a json value', async function () {
		expect(await ObjectGetNode.executor({}, {
			json: {
				'0': 1
			},
			key: '0'
		})).toEqual({
			value: 1
		});
	});
	it('should return an array value', async function () {
		expect(await ObjectGetNode.executor({}, {
			json: [
				0,
				1
			],
			key: 1
		})).toEqual({
			value: 1
		});
	});
});
