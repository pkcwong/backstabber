import { EntryNode } from "../../shared/lib/entry-node";
import { StringNode } from "../../shared/lib/string-node";
import { ReturnNode } from "../../shared/lib/return-node";
import { Program } from "../../shared/lib/program";
import { IfNode } from "../../shared/lib/if-node";

const mock0 = (condition) => {
	let programIF = mock1();
	let programELSE = mock2();
	let myIfNode = new IfNode();
	myIfNode.receive('args', Math.PI.toString(), false);
	myIfNode.receive('condition', condition, false);
	myIfNode.receive('if', programIF);
	myIfNode.receive('else', programELSE);
	return myIfNode;
};

const mock1 = () => {
	let myEntryNode = new EntryNode();
	let myReturnNode = new ReturnNode();
	myEntryNode.sendOnReady(myEntryNode.getOutboundPort('props'), myReturnNode.getInboundPort('result'));
	return new Program([
		myEntryNode,
		myReturnNode
	]);
};

const mock2 = () => {
	let myStringNode = new StringNode(Math.E.toString());
	let myReturnNode = new ReturnNode();
	myStringNode.sendOnReady(myStringNode.getOutboundPort('string'), myReturnNode.getInboundPort('result'));
	return new Program([
		myStringNode,
		myReturnNode
	]);
};


describe('IfNode', () => {
	it('should return Math.PI', async () => {
		let myIfNode = mock0(true);
		expect(await myIfNode.execute()).toEqual(Math.PI.toString());
	});
	it('should return Math.E', async () => {
		let myIfNode = mock0(false);
		expect(await myIfNode.execute()).toEqual(Math.E.toString());
	});
});
