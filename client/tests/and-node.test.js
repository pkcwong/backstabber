import { AndNode } from "../../shared/lib/logic/and-node";

describe('AndNode', function () {
	it('should return true', async function () {
		expect(await AndNode.executor({}, {
			a: true,
			b: true
		})).toEqual({
			truthy: true,
			falsy: undefined
		});
	});
	it('should return false', async function () {
		expect(await AndNode.executor({}, {
			a: true,
			b: false
		})).toEqual({
			truthy: undefined,
			falsy: false
		});
	});
});
