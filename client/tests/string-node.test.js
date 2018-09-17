import { StringNode } from "../../shared/lib/string-node";
import { ReturnNode } from "../../shared/lib/return-node";
import { Program } from "../../shared/lib/program";

const mock = () => {
	let myStringNode = new StringNode('hello world');
	let myReturnNode = new ReturnNode();
	myStringNode.sendOnReady(myStringNode.getOutboundPort('string'), myReturnNode.getInboundPort('result'));
	return new Program([
		myStringNode,
		myReturnNode
	]);
};

describe('StringNode', () => {
	it('should return a string', async () => {
		let myProgram = mock();
		expect(await myProgram.execute()).toEqual('hello world');
	});
	it('should serialize', () => {
		let myProgram = mock();
		let json = myProgram.serialize();
		expect(json.length).toEqual(2);
		expect(Object.keys(json[0])).toEqual([
			'_id',
			'class',
			'args',
			'observers'
		]);
	});
});
