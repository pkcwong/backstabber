import { Program } from "../../shared/lib/program";
import { StringNode } from "../../shared/lib/string-node";
import { ReturnNode } from "../../shared/lib/return-node";

const mock = () => {
	let myStringNode = new StringNode();
	myStringNode.setProps({
		string: 'hello world'
	});
	let myReturnNode = new ReturnNode();
	myStringNode.sendOnReady(myStringNode.getOutboundPort('string'), myReturnNode.getInboundPort('result'));
	return new Program([
		myStringNode,
		myReturnNode
	]);
};

describe('BasicNode', function () {
	it('should return a string', async function () {
		let testProgram = mock();
		expect(await testProgram.execute()).toEqual('hello world');
	});
	it('should serialize', function () {
		let testProgram = mock();
		let json = testProgram.serialize();
		expect(json.length).toEqual(2);
		expect(Object.keys(json[0])).toEqual([
			'_id',
			'class',
			'props',
			'observers'
		]);
		expect(json[0]._id).toEqual(expect.anything());
		expect(json[0].class).toEqual(StringNode.name);
		expect(json[0].props).toEqual({
			string: 'hello world'
		});
		expect(json[0].observers.length).toEqual(1);
		expect(json[0].observers[0].outbound).toEqual('string');
		expect(json[0].observers[0].inbound).toEqual('result');
	});
	it('should deserialize', async function () {
		let testProgram = mock();
		expect(await Program.deserialize(JSON.parse(JSON.stringify(testProgram.serialize()))).execute()).toEqual('hello world');
	});
});
