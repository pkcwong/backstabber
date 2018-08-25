import { EntryNode } from "./entry-node";
import { ReturnNode } from "./return-node";

/**
 * A program is a array of BasicNode
 */
export class Program {

	constructor(nodes) {
		this.nodes = nodes;
	}

	async execute(args = {}) {
		return await new Promise((resolve, reject) => {
			this.nodes.forEach((node) => {
				node.reset();
			});
			this.nodes.filter((node) => {
				return (node instanceof EntryNode);
			}).forEach((node) => {
				node.instance.props = args;
			});
			this.nodes.filter((node) => {
				return (node instanceof ReturnNode);
			}).forEach((node) => {
				node.registerCallback((result) => {
					resolve(result);
				});
			});
			this.nodes.filter((node) => {
				return node.ready();
			}).forEach((node) => {
				node.execute();
			});
		});
	}

}
