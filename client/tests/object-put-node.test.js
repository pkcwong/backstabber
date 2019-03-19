import { ObjectPutNode } from "../../shared/lib/object/object-put-node";

describe('ObjectPutNode', function () {
	it('should return object', async function () {
		expect(await ObjectPutNode.executor({}, {
			target: {
				pi: 3.14
			},
			source: {
				tau: 6.28
			}
		})).toEqual({
			json: {
				pi: 3.14,
				tau: 6.28
			}
		});
	});
});
