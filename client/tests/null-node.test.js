import { NullNode } from "../../shared/lib/primitive/null-node";

describe('NullNode', function() {
	it('should return null', async function () {
		expect(await NullNode.executor({}, {})).toEqual({
			null: null
		});
	});
});
