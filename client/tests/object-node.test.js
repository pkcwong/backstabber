import { ObjectNode } from "../../shared/lib/object/object-node";

describe('ObjectNode', function() {
	it('should return an object', async function () {
		expect(await ObjectNode.executor({
			json: {
				pi: 3.14
			}
		}, {})).toEqual({
			json: {
				pi: 3.14
			}
		});
	});
});
