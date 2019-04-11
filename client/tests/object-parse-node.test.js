import { ObjectParseNode } from "../../shared/lib/object/object-parse-node";

describe('ObjectParseNode', function() {
	it('should return a json', async function () {
		expect(await ObjectParseNode.executor({}, {
			string: '{ "name":"John", "age":30, "city":"New York"}'
		})).toEqual({
			json: {
				name: "John",
				age:30,
				city:"New York"
			}
		});
	});
});
