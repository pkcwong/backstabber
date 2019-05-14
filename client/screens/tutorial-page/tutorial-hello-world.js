import { StringNode } from "../../../shared/lib/primitive/string-node";
import { ReturnNode } from "../../../shared/lib/api/return-node";

export const TutorialHelloWorld = {
	title: 'Hello World!',
	description: 'In this tutorial we will be writing the iconic Hello World program. This will be used to illustrate the basic syntax of the Backstabber programming language.\nA Hello World program is a simple program that simply outputs \"Hello World!\" when executed.',
	tests: [
		{
			task: 'Create a StringNode.',
			hint: 'StringNode can be found under \"Primitives\".',
			jest: (bsNodes) => {
				return (bsNodes.find((bsNode) => {
					return (bsNode instanceof StringNode);
				}) !== undefined);
			}
		},
		{
			task: 'Set StringNode prop to \"Hello World!\"',
			hint: 'Click on the StringNode dragged on to the canvas which will trigger a drawer at the bottom of the screen. Enter \"Hello World!\" for the input box named \"string\". Remember to click \"submit\".',
			jest: (bsNodes) => {
				const target = bsNodes.find((bsNode) => {
					return (bsNode instanceof StringNode);
				});
				return (target !== undefined && target.props.string === 'Hello World!');
			}
		},
		{
			task: 'Create a ReturnNode.',
			hint: 'ReturnNode can be found under \"API\".',
			jest: (bsNodes) => {
				return (bsNodes.find((bsNode) => {
					return (bsNode instanceof ReturnNode);
				}) !== undefined);
			}
		},
		{
			task: 'Link the StringNode to the ReturnNode',
			hint: 'Connect StringNode\'s \"string\" port to ReturnNode\'s \"result\" port.',
			jest: (bsNodes) => {
				const stringNode = bsNodes.find((bsNode) => {
					return (bsNode instanceof StringNode);
				});
				const returnNode = bsNodes.find((bsNode) => {
					return (bsNode instanceof ReturnNode);
				});
				if (stringNode === undefined || returnNode === undefined) {
					return false;
				}
				const input = returnNode.getInboundPort('result');
				const output = stringNode.getOutboundPort('string');
				return (stringNode.observers.filter((item) => {
					return (item._id === input._id && item.outbound === output.port && item.inbound === input.port)
				}).length === 1);
			}
		}
	],
	expect: [
		{
			entry: {},
			return: 'Hello World!'
		}
	],
	solution: require('./tutorial-hello-world.json')
};
