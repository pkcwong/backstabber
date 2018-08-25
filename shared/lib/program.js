import { EntryNode } from "./entry-node";
import { ReturnNode } from "./return-node";

/**
 * A program is a array of BasicNode
 */
export class Program {

	constructor(nodes) {
		this.nodes = nodes;
	}

	execute(args = {}) {
		this.nodes.filter((node) => {
			return (node instanceof EntryNode);
		}).forEach((node) => {
			node.instance.props = args;
		});
		this.nodes.filter((node) => {
			return node.ready();
		}).forEach((node) => {
			node.execute();
		});
		let result = this.nodes.filter((node) => {
			return (node instanceof ReturnNode);
		});
		if (result.length === 0) {
			return {};
		} else {
			return result[0].instance.input.result;
		}
	}

}
