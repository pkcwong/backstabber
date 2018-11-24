import { EntryNode } from "./entry-node";
import { ReturnNode } from "./return-node";
import { ArrayMapNode } from "./array-map-node";
import { ArrayPushNode } from "./array-push-node";
import { ArrayReduceNode } from "./array-reduce-node";
import { JsonAssignNode } from "./json-assign-node";
import { JsonCollapseNode } from "./json-collapse-node";
import { NullNode } from "./null-node";
import { StringNode } from "./string-node";
import { NumberNode } from "./number-node";

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
		let map = json.reduce((accumulator, current) => {
			let constructor = {
				ArrayMapNode,
				ArrayPushNode,
				ArrayReduceNode,
				EntryNode,
				JsonAssignNode,
				JsonCollapseNode,
				NullNode,
				ReturnNode,
				StringNode,
				NumberNode
			};
			let node = new constructor[current.class](...Object.keys(current.args).map((key) => {
				return current.args[key];
			}));
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
