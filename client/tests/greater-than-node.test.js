import { GreaterThanNode } from "../../shared/lib/logic/greater-than-node";

describe('GreaterThanNode', function () {
	it('should return true', async function () {
		expect(await GreaterThanNode.executor({}, {
			a: 87,
			b: 86
		})).toEqual({
			truthy: true,
			falsy: undefined
		});
	});
	it('should return false', async function () {
		expect(await GreaterThanNode.executor({}, {
			a: 87,
			b: 87
		})).toEqual({
			truthy: undefined,
			falsy: false
		});
	});
});
