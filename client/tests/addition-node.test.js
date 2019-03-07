import { AdditionNode } from "../../shared/lib/arithmetics/addition-node";

describe('AdditionNode', function () {
	it('should return sum', async function () {
		expect(await AdditionNode.executor({
			addend: 23,
			augend: 32
		}, {})).toEqual({
			sum: 55
		});
	});
	it('should return sum of positive and negative number', async function () {
		expect(await AdditionNode.executor({
			addend: 23,
			augend: -23
		}, {})).toEqual({
			sum: 0
		});
	});
	it('should return sum of zero', async function () {
		expect(await AdditionNode.executor({
			addend: 0,
			augend: 0
		}, {})).toEqual({
			sum: 0
		});
	});
});
