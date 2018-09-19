import { EntryNode } from "../../shared/lib/entry-node";
import { ReturnNode } from "../../shared/lib/return-node";
import { Program } from "../../shared/lib/program";
import { ArrayMapNode } from "../../shared/lib/array-map-node";

const mock0 = () => {
	return new ArrayMapNode();
};

const mock1 = () => {
	let myEntryNode = new EntryNode();
	let myReturnNode = new ReturnNode();
	myEntryNode.sendOnReady(Object.assign({}, myEntryNode.getOutboundPort('props'), {
		func: (() => {
			return myEntryNode.getOutboundPort('props').func() * 2
		})
	}), myReturnNode.getInboundPort('result'));
	return new Program([
		myEntryNode,
		myReturnNode
	]);
};

describe('ArrayMapNode', () => {
	it('should multiply elements', async () => {
		let myProgram = mock1();
		let myArrayMapNode = mock0();
		myArrayMapNode.receive('array', [1, 2, 3, 4], false);
		myArrayMapNode.receive('function', myProgram);
		expect(await myArrayMapNode.execute()).toEqual([2, 4, 6, 8]);
	});
});
