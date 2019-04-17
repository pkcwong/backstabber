import { TypeOfNode } from "../../shared/lib/utility/type-of-node";

describe('SubtractionNode', function () {
	it('should return object', async function () {
		expect(await TypeOfNode.executor({}, {
			inputs: {"key": "value"}
		})).toEqual({
			object: true,
			string: false,
			number: false,
			boolean: false
		});
	});
	it('should return string', async function () {
		expect(await TypeOfNode.executor({}, {
			inputs: "af2kl"
		})).toEqual({
			object: false,
			string: true,
			number: false,
			boolean: false
		});
	});
	it('should return string for string number', async function () {
		expect(await TypeOfNode.executor({}, {
			inputs: "1234"
		})).toEqual({
			object: false,
			string: true,
			number: false,
			boolean: false
		});
	});
	it('should return number', async function () {
		expect(await TypeOfNode.executor({}, {
			inputs: 123
		})).toEqual({
			object: false,
			string: false,
			number: true,
			boolean: false
		});
	});
	it('should return boolean', async function () {
		expect(await TypeOfNode.executor({}, {
			inputs: true
		})).toEqual({
			object: false,
			string: false,
			number: false,
			boolean: true
		});
	});
});
