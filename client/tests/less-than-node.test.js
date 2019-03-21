import { LessThanNode } from "../../shared/lib/logic/less-than-node";

describe('LessThanNode', function () {
	it('should return true', async function () {
		expect(await LessThanNode.executor({}, {
			a: 86,
			b: 87
		})).toEqual({
			truthy: true,
			falsy: undefined
		});
	});
	it('should return false', async function () {
		expect(await LessThanNode.executor({}, {
			a: 87,
			b: 87
		})).toEqual({
			truthy: undefined,
			falsy: false
		});
	});
});
