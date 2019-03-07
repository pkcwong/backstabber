import { NegateNode } from "../../shared/lib/logic/negate-node";

describe('NegateNode', function () {
	it('should return negative number', async function () {
		expect(await NegateNode.executor({}, {
			negate: 87
		})).toEqual({
			result: -87
		});
	});
	it('should return true', async function () {
		expect(await NegateNode.executor({}, {
			negate: false
		})).toEqual({
			result: true
		});
	});
	it('should return falsy', async function () {
		expect(await NegateNode.executor({}, {
			negate: "test"
		})).toEqual({
			result: false
		});
	});
	it('should return truthy', async function () {
		expect(await NegateNode.executor({}, {
			negate: ""
		})).toEqual({
			result: true
		});
	});
});
