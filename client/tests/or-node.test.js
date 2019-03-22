import { OrNode } from "../../shared/lib/logic/or-node";

describe('OrNode', function () {
	it('should return true', async function () {
		expect(await OrNode.executor({}, {
			a: true,
			b: true
		})).toEqual({
			truthy: true,
			falsy: undefined
		});
	});
	it('should return true if either one is true', async function () {
		expect(await OrNode.executor({}, {
			a: true,
			b: false
		})).toEqual({
			truthy: true,
			falsy: undefined
		});
	});
	it('should return false', async function () {
		expect(await OrNode.executor({}, {
			a: false,
			b: false
		})).toEqual({
			truthy: undefined,
			falsy: false
		});
	});
});
