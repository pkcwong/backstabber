import { BranchNode } from "../../shared/lib/logic/branch-node";

describe('BranchNode', function () {
	it('should return true', async function () {
		expect(await BranchNode.executor({}, {
			condition: true,
			true: true,
			false: false
		})).toEqual({
			result: true
		});
	});
	it('should return false', async function () {
		expect(await BranchNode.executor({}, {
			condition: false,
			true: true,
			false: false
		})).toEqual({
			result: false
		});
	});
});
