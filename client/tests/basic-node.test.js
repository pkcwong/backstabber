import { Program } from "../../shared/lib/program";
import { StringNode } from "../../shared/lib/primitive/string-node";
import { ReturnNode } from "../../shared/lib/api/return-node";

const mock = () => {
	let myStringNode = new StringNode();
	let myStringNode0 = new StringNode();
	myStringNode.setProps({
		string: 'bye world'
	});
	myStringNode0.setProps({
		string: 'hello world'
	});
	let myReturnNode = new ReturnNode();
	myStringNode.sendOnReady(myStringNode.getOutboundPort('string'), myReturnNode.getInboundPort('result'));
	myStringNode.revokeSendOnReady(myStringNode.getOutboundPort('string'), myReturnNode.getInboundPort('result'));
	myStringNode0.sendOnReady(myStringNode0.getOutboundPort('string'), myReturnNode.getInboundPort('result'));
	return new Program([
		myStringNode,
		myStringNode0,
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
		expect(json.length).toEqual(3);
		expect(Object.keys(json[0])).toEqual([
			'_id',
			'class',
			'category',
			'props',
			'observers'
		]);
		expect(json[1]._id).toEqual(expect.anything());
		expect(json[1].class).toEqual(StringNode.name);
		expect(json[1].props).toEqual({
			string: 'hello world'
		});
		expect(json[1].observers.length).toEqual(1);
		expect(json[1].observers[0].outbound).toEqual('string');
		expect(json[1].observers[0].inbound).toEqual('result');
	});
	it('should deserialize', async function () {
		let testProgram = mock();
		expect(await Program.deserialize(JSON.parse(JSON.stringify(testProgram.serialize()))).execute()).toEqual('hello world');
	});
});
