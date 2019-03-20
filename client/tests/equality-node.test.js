import { EqualityNode } from "../../shared/lib/logic/equality-node";

describe('EqualityNode', function () {
	it('should return typecheck', async function () {
		expect(await EqualityNode.executor({}, {
			a: 87,
			b: "87"
		})).toEqual({
			truthy: undefined,
			falsy: false
		});
	});
	it('should return equal', async function () {
		expect(await EqualityNode.executor({}, {
			a: 87,
			b: 87
		})).toEqual({
			truthy: true,
			falsy: undefined
		});
	});
});
