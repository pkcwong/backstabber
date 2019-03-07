import { AdditionNode } from "./arithmetics/addition-node";
import { BoolNode } from "./primitive/bool-node";
import { BranchNode } from "./logic/branch-node";
import { EntryNode } from "./api/entry-node";
import { ExecuteNode } from "./functional/execute-node";
import { NegateNode } from "./logic/negate-node";
import { NullNode } from "./primitive/null-node";
import { NumberNode } from "./primitive/number-node";
import { ObjectNode } from "./object/object-node";
import { ProgramNode } from "./functional/program-node";
import { ReturnNode } from "./api/return-node";
import { StringNode } from "./primitive/string-node";

export class Program {

	constructor(nodes) {
		this.nodes = nodes;
		this.status = nodes.reduce((status, bsNode) => {
			return Object.assign({}, status, {
				[bsNode._id]: 'idle'
			});
		}, {});
	}

	/**
	 * Executes a Program.
	 * @param args
	 * @returns {Promise<any>}
	 */
	execute(args = {}) {
		return Promise.race([
			new Promise((resolve, reject) => {
				this.nodes.forEach((node) => {
					node.reset();
				});
				this.nodes.filter((bsNode) => {
					return !(bsNode instanceof ReturnNode);
				}).forEach((bsNode) => {
					bsNode.bindProgram({
						execute: (bsNode) => {
							this.status[bsNode._id] = 'executed';
						},
						resolve: (bsNode) => {
							this.status[bsNode._id] = 'resolved';
						},
						reject: (bsNode) => {
							this.status[bsNode._id] = 'rejected';
							reject('Exception');
						},
						monitor: () => {
							return !Object.keys(this.status).map((_id) => {
								return this.status[_id];
							}).includes('rejected');
						}
					});
				});
				this.nodes.filter((node) => {
					return (node instanceof EntryNode);
				}).forEach((node) => {
					node.props = args;
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
			}),
			new Promise((resolve, reject) => {
				const _id = setTimeout(() => {
					clearTimeout(_id);
					this.halt();
					reject('Timeout');
				}, 1000);
			})
		]);
	}

	/**
	 * Halts a Program.
	 */
	halt() {
		Object.keys(this.status).filter((_id) => {
			return (this.nodes.find((bsNode) => {
				return (bsNode._id === _id);
			}) instanceof EntryNode);
		}).forEach((_id) => {
			this.status[_id] = 'rejected';
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
			AdditionNode,
			BoolNode,
			BranchNode,
			EntryNode,
			ExecuteNode,
			NegateNode,
			NullNode,
			NumberNode,
			ObjectNode,
			ProgramNode,
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
