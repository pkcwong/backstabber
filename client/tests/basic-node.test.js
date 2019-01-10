import { Program } from "../../shared/lib/program";
import { StringNode } from "../../shared/lib/string-node";
import { ReturnNode } from "../../shared/lib/return-node";

const mock = () => {
	let myStringNode = new StringNode({
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
});
