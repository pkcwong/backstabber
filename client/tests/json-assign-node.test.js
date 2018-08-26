import { EntryNode } from "../../shared/lib/entry-node";
import { ReturnNode } from "../../shared/lib/return-node";
import { JsonAssignNode } from "../../shared/lib/json-assign-node";
import { JsonCollapseNode } from "../../shared/lib/json-collapse-node";
import { NullNode } from "../../shared/lib/null-node";
import { StringNode } from "../../shared/lib/string-node";
import { Program } from "../../shared/lib/program";

const mock = () => {
	let myEntryNode = new EntryNode();
	let myReturnNode = new ReturnNode();
	let myNullNode = new NullNode();
	let myJsonNode = new JsonAssignNode();
	let myKey = new StringNode('framework');
	let myJsonCollapseNode = new JsonCollapseNode();
	let myUserInput = new StringNode('userInput');
	let myJsonAssignNode = new JsonAssignNode();
	let myProject = new StringNode('project');
	let backstabber = new StringNode('backstabber');
	myEntryNode.sendOnReady(myEntryNode.getOutboundPort('props'), myJsonCollapseNode.getInboundPort('json'));
	myUserInput.sendOnReady(myUserInput.getOutboundPort('string'), myJsonCollapseNode.getInboundPort('key'));
	myJsonCollapseNode.sendOnReady(myJsonCollapseNode.getOutboundPort('value'), myJsonNode.getInboundPort('value'));
	myNullNode.sendOnReady(myNullNode.getOutboundPort('value'), myJsonNode.getInboundPort('json'));
	myKey.sendOnReady(myKey.getOutboundPort('string'), myJsonNode.getInboundPort('key'));
	myJsonNode.sendOnReady(myJsonNode.getOutboundPort('json'), myJsonAssignNode.getInboundPort('json'));
	myProject.sendOnReady(myProject.getOutboundPort('string'), myJsonAssignNode.getInboundPort('key'));
	backstabber.sendOnReady(backstabber.getOutboundPort('string'), myJsonAssignNode.getInboundPort('value'));
	myJsonAssignNode.sendOnReady(myJsonAssignNode.getOutboundPort('json'), myReturnNode.getInboundPort('result'));
	let nodes = [myEntryNode, myReturnNode, myNullNode, myJsonNode, myKey, myJsonCollapseNode, myUserInput, myJsonAssignNode, myProject, backstabber];
	return new Program(nodes);
};

describe('JsonAssignNode', () => {
	it('should assign json', async () => {
		let myProgram = mock();
		expect(await myProgram.execute({
			userInput: 'MeteorJS'
		})).toEqual({
			project: 'backstabber',
			framework: 'MeteorJS'
		});
	});
});
