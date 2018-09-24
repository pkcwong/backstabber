import { EntryNode } from "../../shared/lib/entry-node";
import { ReturnNode } from "../../shared/lib/return-node";
import { Program } from "../../shared/lib/program";
import { ArrayReduceNode } from "../../shared/lib/array-reduce-node";

const mock0 = () => {
	return new ArrayReduceNode();
};

const mock1 = () => {
	let myEntryNode = new EntryNode();
	let myReturnNode = new ReturnNode();
	myEntryNode.sendOnReady(Object.assign({}, myEntryNode.getOutboundPort('props'), {
		func: (() => {
			return myEntryNode.getOutboundPort('props').func()['accumulator'] +  myEntryNode.getOutboundPort('props').func()['current'];
		})
	}), myReturnNode.getInboundPort('result'));
	return new Program([
		myEntryNode,
		myReturnNode
	]);
};

describe('ArrayReduceNode', () => {
	it('should sum array elements', async () => {
		let myProgram = mock1();
		let myArrayReduceNode = mock0();
		myArrayReduceNode.receive('array', [
			1,
			2,
			3,
			4
		], false);
		myArrayReduceNode.receive('init', 100);
		myArrayReduceNode.receive('function', myProgram);
		expect(await myArrayReduceNode.execute()).toEqual({
			result: 110
		});
	});
});
