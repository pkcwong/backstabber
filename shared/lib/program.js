import { EntryNode } from "./entry-node";
import { ReturnNode } from "./return-node";
import { StringNode } from "./string-node";

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

	serialize() {
		return this.nodes.map((node) => {
			return node.serialize();
		});
	}

	static deserialize(json) {
		const constructor = {
			EntryNode,
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
