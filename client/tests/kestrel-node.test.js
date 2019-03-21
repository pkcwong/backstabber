import { KestrelNode } from "../../shared/lib/functional/kestrel-node";

describe('KestrelNode', function () {
	it('should return kestrel', async function () {
		expect(await KestrelNode.executor({}, {
			kestrel: 87,
			trigger: "87"
		})).toEqual({
			output: 87
		});
	});
});
