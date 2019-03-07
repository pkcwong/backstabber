import { NegateNode } from "../../shared/lib/logic/branch-node";

describe('NegateNode', function () {
	it('should return negative number', async function () {
		expect(await NegateNode.executor({}, {
			negate: 87
		})).toEqual({
			result: -87
		});
	});
	it('should return true', async function () {
		expect(await BranchNode.executor({}, {
			negate: false
		})).toEqual({
			result: true
		});
	});
	it('should return string', async function () {
		expect(await BranchNode.executor({}, {
			negate: "test"
		})).toEqual({
			result: "test"
		});
	});
});
