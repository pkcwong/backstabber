import { EntryNode } from "./entry-node";
import { ReturnNode } from "./return-node";

export class Program {

	constructor(nodes) {
		this.nodes = nodes;
	}

	execute(args = {}) {
		return new Promise((resolve, reject) => {
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
				return node.isReady();
			}).forEach((node) => {
				node.execute();
			});
		});
	}

}
