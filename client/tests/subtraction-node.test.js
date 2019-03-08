import { SubtractionNode } from "../../shared/lib/arithmetics/subtraction-node";

describe('SubtractionNode', function () {
	it('should return difference', async function () {
		expect(await SubtractionNode.executor({}, {
			minuend: 23,
			subtrahend: 32
		})).toEqual({
			difference: -9
		});
	});
	it('should return difference of positive and negative numbers', async function () {
		expect(await SubtractionNode.executor({}, {
			minuend: 23,
			subtrahend: -32
		})).toEqual({
			difference: 55
		});
	});
	it('should return difference of zeros', async function () {
		expect(await SubtractionNode.executor({}, {
			minuend: 0,
			subtrahend: 0
		})).toEqual({
			difference: 0
		});
	});
	it('should replace string', async function () {
		expect(await SubtractionNode.executor({}, {
			minuend: "Hello World",
			subtrahend: "World"
		})).toEqual({
			difference: "Hello "
		});
	});
	it('should return subtrahend', async function () {
		expect(await SubtractionNode.executor({}, {
			minuend: null,
			subtrahend: "World"
		})).toEqual({
			difference: "World"
		});
	});
	it('should return boolean subtraction', async function () {
		expect(await SubtractionNode.executor({}, {
			minuend: false,
			subtrahend: true
		})).toEqual({
			difference: -1
		});
	});
	it('should return null for non boolean and boolean', async function () {
		expect(await SubtractionNode.executor({}, {
			minuend: false,
			subtrahend: 23
		})).toEqual({
			difference: null
		});
	});
});
