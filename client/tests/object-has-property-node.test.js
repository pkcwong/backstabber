import { ObjectHasPropertyNode } from "../../shared/lib/object/object-has-property-node";

describe('ObjectHasPropertyNode', function () {
	it('should return true', async function () {
		expect(await ObjectHasPropertyNode.executor({}, {
			object: {
				'0': 1
			},
			property: '0'
		})).toEqual({
			truthy: true,
			falsy: undefined
		});
	});
	it('should return false', async function () {
		expect(await ObjectHasPropertyNode.executor({}, {
			object: {
				'0': 1
			},
			property: "error"
		})).toEqual({
			truthy: undefined,
			falsy: false
		});
	});
});
