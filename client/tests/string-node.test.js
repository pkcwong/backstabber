import { StringNode } from "../../shared/lib/primitive/string-node";

describe('StringNode', function() {
	it('should return a string', async function () {
		expect(await StringNode.executor({
			string: 'hello world'
		}, {})).toEqual({
			string: 'hello world'
		});
	});
});
