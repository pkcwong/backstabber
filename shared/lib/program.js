import { AdditionNode } from "./arithmetics/addition-node";
import { AndNode } from "./logic/and-node";
import { ArrayNode } from "./array/array-node";
import { ArrayConcatNode } from "./array/array-concat-node";
import { ArrayFilterNode } from "./array/array-filter-node";
import { ArrayGetNode } from "./array/array-get-node";
import { ArrayLengthNode } from "./array/array-length-node";
import { ArrayIncludesNode } from "./array/array-includes-node";
import { ArrayMapNode } from "./array/array-map-node";
import { ArrayPushNode } from "./array/array-push-node";
import { ArrayReduceNode } from "./array/array-reduce-node";
import { BoolNode } from "./primitive/bool-node";
import { BranchNode } from "./logic/branch-node";
import { DatabaseNode } from "./database/database-node";
import { DatabaseFetchNode } from "./database/database-fetch-node";
import { DatabaseInsertNode } from "./database/database-insert-node";
import { DatabaseRemoveNode } from "./database/database-remove-node";
import { DatabaseUpdateNode } from "./database/database-update-node";
import { DivisionNode } from "./arithmetics/division-node";
import { EntryNode } from "./api/entry-node";
import { EqualityNode } from "./logic/equality-node";
import { ExecuteNode } from "./functional/execute-node";
import { ExponentialNode } from "./arithmetics/exponential-node";
import { GreaterThanNode } from "./logic/greater-than-node";
import { HttpGetNode } from "./web/http-get-node";
import { HttpPostNode } from "./web/http-post-node";
import { KestrelNode } from "./functional/kestrel-node";
import { LessThanNode } from "./logic/less-than-node";
import { MultiplicationNode } from "./arithmetics/multiplication-node";
import { ModuloNode } from "./arithmetics/modulo-node";
import { NegateNode } from "./logic/negate-node";
import { NullNode } from "./primitive/null-node";
import { NumberNode } from "./primitive/number-node";
import { ObjectNode } from "./object/object-node";
import { ObjectEqualNode } from "./object/object-equal-node";
import { ObjectGetNode } from "./object/object-get-node";
import { ObjectKeysNode } from "./object/object-keys-node";
import { ObjectParseNode } from "./object/object-parse-node";
import { ObjectPutNode } from "./object/object-put-node";
import { OrNode } from "./logic/or-node";
import { ProgramNode } from "./functional/program-node";
import { ReturnNode } from "./api/return-node";
import { StringNode } from "./primitive/string-node";
import { SubtractionNode } from "./arithmetics/subtraction-node";
import { TimestampNode } from "./utility/timestamp-node";
import { TypeOfNode } from "./utility/type-of-node";

export class Program {

	constructor(nodes) {
		this.nodes = nodes;
		this.status = nodes.reduce((status, bsNode) => {
			return Object.assign({}, status, {
				[bsNode._id]: 'idle'
			});
		}, {});
		this.reject = null;
		this.callbacks = [];
		this.result = undefined;
	}

	registerCallback(callback) {
		this.callbacks = [
			...this.callbacks,
			callback
		]
	}

	/**
	 * Executes a Program.
	 * @param args
	 * @returns {Promise<any>}
	 */
	execute(args = {}) {
		this.result = undefined;
		return Promise.race([
			new Promise((resolve, reject) => {
				this.nodes.forEach((node) => {
					node.reset();
				});
				this.nodes.forEach((bsNode) => {
					bsNode.bindProgram({
						execute: (bsNode) => {
							this.status[bsNode._id] = 'executed';
							this.callbacks.forEach((callback) => {
								callback({
									[bsNode._id]: this.status[bsNode._id]
								});
							});
						},
						resolve: (bsNode) => {
							this.status[bsNode._id] = 'resolved';
							this.callbacks.forEach((callback) => {
								callback({
									[bsNode._id]: this.status[bsNode._id]
								});
							});
						},
						reject: (bsNode, message = 'Exception') => {
							this.status[bsNode._id] = 'rejected';
							this.callbacks.forEach((callback) => {
								callback({
									[bsNode._id]: this.status[bsNode._id]
								});
							});
							reject(message);
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
				if (this.nodes.filter((node) => {
					return (node instanceof ReturnNode);
				}).length === 0) {
					this.halt();
					reject('ReturnNode Not Found');
				}
				this.nodes.filter((node) => {
					return (node instanceof ReturnNode);
				}).forEach((node) => {
					node.registerReturnCallback((result) => {
						this.result = result;
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
			}),
			new Promise((resolve, reject) => {
				this.reject = () => {
					reject('Halted');
				}
			})
		]);
	}

	/**
	 * Halts a Program.
	 */
	halt() {
		Object.keys(this.status).filter((_id) => {
			return (this.status[_id] === 'idle');
		}).forEach((_id) => {
			this.status[_id] = 'rejected';
		});
		if (this.reject !== null) {
			this.reject();
		}
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
			ArrayConcatNode,
			ArrayFilterNode,
			ArrayGetNode,
			ArrayIncludesNode,
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
			DatabaseUpdateNode,
			DivisionNode,
			EntryNode,
			EqualityNode,
			ExecuteNode,
			ExponentialNode,
			HttpGetNode,
			HttpPostNode,
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
			ObjectKeysNode,
			ObjectParseNode,
			ObjectPutNode,
			OrNode,
			ProgramNode,
			ReturnNode,
			StringNode,
			SubtractionNode,
			TimestampNode,
			TypeOfNode
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
