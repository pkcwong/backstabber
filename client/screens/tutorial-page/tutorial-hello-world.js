import { StringNode } from "../../../shared/lib/primitive/string-node";
import { ReturnNode } from "../../../shared/lib/api/return-node";

export const TutorialHelloWorld = {
	title: 'Hello World',
	description: 'Writing a hello world program.',
	tests: [
		{
			task: 'Create a StringNode.',
			jest: (bsNodes) => {
				return (bsNodes.find((bsNode) => {
					return (bsNode instanceof StringNode);
				}) !== undefined);
			}
		},
		{
			task: 'Set StringNode prop to \"Hello World!\"',
			jest: (bsNodes) => {
				const target = bsNodes.find((bsNode) => {
					return (bsNode instanceof StringNode);
				});
				return (target !== undefined && target.props.string === 'Hello World!');
			}
		},
		{
			task: 'Create a ReturnNode.',
			jest: (bsNodes) => {
				return (bsNodes.find((bsNode) => {
					return (bsNode instanceof ReturnNode);
				}) !== undefined);
			}
		},
		{
			task: 'Link the StringNode to the ReturnNode',
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
	]
};
