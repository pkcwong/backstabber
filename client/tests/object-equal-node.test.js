import { ObjectEqualNode } from "../../shared/lib/object/object-equal-node";

describe('ObjectEqualNode', function () {
	it('should return true', async function () {
		expect(await ObjectEqualNode.executor({}, {
			a: {
				'0': 1
			},
			b:  {
				'0': 1
			}
		})).toEqual({
			truthy: true,
			falsy: undefined
		});
	});
	it('should return false', async function () {
		expect(await ObjectEqualNode.executor({}, {
			a: {
				'0': 11
			},
			b:  {
				'0': 1
			}
		})).toEqual({
			truthy: undefined,
			falsy: false
		});
	});
});
