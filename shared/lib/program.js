import { EntryNode } from "./entry-node";
import { ReturnNode } from "./return-node";

/**
 * A program is a array of BasicNode
 */
export class Program {

	constructor(nodes) {
		this.nodes = nodes;
	}

	/**
	 * Executes the program
	 * @param args
	 * @returns {Promise<any>}
	 */
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
				return node.ready();
			}).forEach((node) => {
				node.execute();
			});
		});
	}

	/**
	 * Serializes a program to JSON
	 * @returns {*}
	 */
	serialize() {
		return this.nodes.map((node) => {
			return node.serialize();
		});
	}

	/**
	 * Deserialize json to Program
	 * @param json
	 * @returns {Program}
	 */
	static deserialize(json) {
		// TODO deserialize
		return new Program([]);
	}

}
