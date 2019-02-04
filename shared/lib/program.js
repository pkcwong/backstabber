import { BoolNode } from "./primitive/bool-node";
import { EntryNode } from "./api/entry-node";
import { NumberNode } from "./primitive/number-node";
import { ReturnNode } from "./api/return-node";
import { StringNode } from "./primitive/string-node";

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
				node.registerReturnCallback((result) => {
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

	/**
	 * Serializes a Program to JSON.
	 * @returns {*}
	 */
	serialize() {
		return this.nodes.map((node) => {
			return node.serialize();
		});
	}

	/**
	 * Constructs a Program from JSON.
	 * @param json
	 * @returns {Program}
	 */
	static deserialize(json) {
		const constructor = {
			BoolNode,
			EntryNode,
			NumberNode,
			ReturnNode,
			StringNode
		};
		let map = json.reduce((accumulator, current) => {
			let node = new constructor[current.class](current.props);
			node._id = current._id;
			accumulator[current._id] = node;
			return accumulator;
		}, {});
		return new Program(Object.keys(map).map((item) => {
			json.find((element) => {
				return (element._id === item);
			}).observers.forEach((observer) => {
				map[item].sendOnReady(map[item].getOutboundPort(observer.outbound), map[observer._id].getInboundPort(observer.inbound));
			});
			return map[item];
		}));
	}

}
