import { ObjectID } from 'bson';

/**
 * A BasicNode represents one command of a program.
 */
export class BasicNode {

	constructor(args) {
		this.args = args;
		this.reset();
		this.observers = [];
		this._id = new ObjectID().toHexString();
	}

	/**
	 * Resets the Node to initial state.
	 */
	reset() {
		this.instance = {
			cache: this.args.cache,
			props: this.args.props,
			input: Object.keys(this.args.input).reduce((accumulator, current) => {
				return Object.assign({}, accumulator, {
					[current]: undefined
				});
			}, {}),
			execute: this.args.execute,
			output: Object.keys(this.args.output).reduce((accumulator, current) => {
				return Object.assign({}, accumulator, {
					[current]: undefined
				});
			}, {})
		};
	}

	setID(id){
		this._id = id;
	}

	setObservers(observers){
		this.observers = observers;
	}

	/**
	 * Executes the Node and send outputs to observers
	 * @returns {*}
	 */
	execute() {
		return new Promise((resolve, reject) => {
			this.instance.execute(this.instance.props, this.instance.input).then((result) => {
				Object.keys(this.instance.output).forEach((key) => {
					this.instance.output[key] = result[key];
				});
				this.observers.forEach((item) => {
					item.func();
				});
				resolve(result);
			});
		});
	}

	/**
	 * Returns the ready state of a Node
	 * @returns {boolean}
	 */
	ready() {
		return !Object.keys(this.instance.input).some((item) => {
			return (this.instance.input[item] === undefined);
		});
	}

	/**
	 * Registers an observer
	 * @param input
	 * @param output
	 */
	sendOnReady(output, input) {
		this.observers = [
			...this.observers,
			{
				_id: input._id,
				outbound: output.port,
				inbound: input.port,
				func: (() => {
					input.func(output.func());
				})
			}
		];
	}

	/**
	 * Receives data on an input port and executes on ready
	 * @param port
	 * @param data
	 * @param propagate
	 */
	receive(port, data, propagate = true) {
		if (this.instance.input[port] === undefined) {
			this.instance.input[port] = data;
			if (propagate && this.ready()) {
				this.execute();
			}
		}
	}

	/**
	 * Gets a setter function for a Node's input port
	 * @param port
	 * @returns {Function}
	 */
	getInboundPort(port) {
		return {
			_id: this._id,
			port: port,
			func: ((output) => {
				this.receive(port, output);
			})
		};
	}

	/**
	 * Gets a function that returns the value of the output port
	 * @param port
	 * @returns {function(): *}
	 */
	getOutboundPort(port) {
		return {
			_id: this._id,
			port: port,
			func: (() => {
				return this.instance.output[port];
			})
		};
	}

	/**
	 * Serializes a BasicNode
	 * @returns {{_id: (string|*), class: *, args: *, observers: {_id: *, port: *}[]}}
	 */
	serialize() {
		return {
			_id: this._id,
			class: this.class,
			args: this.args,
			observers: this.observers.map((item) => {
				return {
					_id: item._id,
					outbound: item.outbound,
					inbound: item.inbound
				};
			})
		}
	}

	/*
	 * Deserializes a Json
	 *
	 */
	deserialize(json){
        var bNode;
            bNode = new BasicNode(json.args);
            bNode.setID(json._id);
            bNode.setObservers(json.observers);
		return bNode;
	}

}
