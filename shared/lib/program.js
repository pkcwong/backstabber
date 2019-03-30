import { AdditionNode } from "./arithmetics/addition-node";
import { AndNode } from "./logic/and-node";
import { ArrayNode } from "./array/array-node";
import { ArrayFilterNode } from "./array/array-filter-node";
import { ArrayGetNode } from "./array/array-get-node";
import { ArrayLengthNode } from "./array/array-length-node";
import { ArrayMapNode } from "./array/array-map-node";
import { ArrayPushNode } from "./array/array-push-node";
import { ArrayReduceNode } from "./array/array-reduce-node";
import { BoolNode } from "./primitive/bool-node";
import { BranchNode } from "./logic/branch-node";
import { DatabaseNode } from "./database/database-node";
import { DatabaseFetchNode } from "./database/database-fetch-node";
import { DatabaseInsertNode } from "./database/database-insert-node";
import { DatabaseRemoveNode } from "./database/database-remove-node";
import { DivisionNode } from "./arithmetics/division-node";
import { EntryNode } from "./api/entry-node";
import { EqualityNode } from "./logic/equality-node";
import { ExecuteNode } from "./functional/execute-node";
import { ExponentialNode } from "./arithmetics/exponential-node";
import { GreaterThanNode } from "./logic/greater-than-node";
import { HttpGetNode } from "./web/http-get-node";
import { KestrelNode } from "./functional/kestrel-node";
import { LessThanNode } from "./logic/less-than-node";
import { MultiplicationNode } from "./arithmetics/multiplication-node";
import { ModuloNode } from "./arithmetics/modulo-node";
import { NegateNode } from "./logic/negate-node";
import { NullNode } from "./primitive/null-node";
import { NumberNode } from "./primitive/number-node";
import { ObjectNode } from "./object/object-node";
import { ObjectGetNode } from "./object/object-get-node";
import { ObjectPutNode } from "./object/object-put-node";
import { OrNode } from "./logic/or-node";
import { ProgramNode } from "./functional/program-node";
import { ReturnNode } from "./api/return-node";
import { StringNode } from "./primitive/string-node";
import { SubtractionNode } from "./arithmetics/subtraction-node";

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
				}, 10000);
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
			AndNode,
			ArrayNode,
			ArrayFilterNode,
			ArrayGetNode,
			ArrayLengthNode,
			ArrayMapNode,
			ArrayPushNode,
			ArrayReduceNode,
			BoolNode,
			BranchNode,
			DatabaseNode,
			DatabaseFetchNode,
			DatabaseInsertNode,
			DatabaseRemoveNode,
			DivisionNode,
			EntryNode,
			EqualityNode,
			ExecuteNode,
			ExponentialNode,
			HttpGetNode,
			GreaterThanNode,
			KestrelNode,
			LessThanNode,
			MultiplicationNode,
			ModuloNode,
			NegateNode,
			NullNode,
			NumberNode,
			ObjectNode,
			ObjectGetNode,
			ObjectPutNode,
			OrNode,
			ProgramNode,
			ReturnNode,
			StringNode,
			SubtractionNode
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
