import { ObjectID } from 'bson';

export class BasicNode {

	constructor(args) {
		this._id = new ObjectID().toHexString();
		this.class = args['class'];
		this.setProps(args['props']);
		this.observers = [];
		this.reset();
	}

	reset() {
		this.instance = {
			props: Object.assign({}, this.props),
			inputs: Object.keys(this.class.ports.inputs).reduce((accumulator, current) => {
				return Object.assign({}, accumulator, {
					[current]: undefined
				});
			}, {}),
			outputs: Object.keys(this.class.ports.outputs).reduce((accumulator, current) => {
				return Object.assign({}, accumulator, {
					[current]: undefined
				});
			}, {})
		}
	}

	execute() {
		return new Promise((resolve, reject) => {
			this.class.executor(this.instance.props, this.instance.inputs).then((result) => {
				Object.keys(this.instance.outputs).forEach((key) => {
					this.instance.outputs[key] = result[key];
				});
				this.observers.forEach((item) => {
					item.func();
				});
				resolve(result);
			});
		});
	}

	/**
	 * Connects two ports with a link.
	 * @param output
	 * @param input
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

	receive(port, data, propagate = true) {
		if (this.instance.inputs[port] === undefined) {
			this.instance.inputs[port] = data;
			if (propagate && this.isReady()) {
				this.execute();
			}
		}
	}

	/**
	 * Checks if a Node is ready to execute.
	 * @returns {boolean}
	 */
	isReady() {
		return !Object.keys(this.instance.inputs).some((item) => {
			return (this.instance.inputs[item] === undefined);
		});
	}

	/**
	 * Resets the property of a Node.
	 * @param props
	 */
	setProps(props = {}) {
		this.props = Object.keys(props).reduce((accumulator, current) => {
			if (this.class.props.hasOwnProperty(current)) {
				accumulator[current] = props[current];
			}
			return accumulator;
		}, Object.assign({}, this.class.props));
		this.reset();
	}

	/**
	 * Returns an inbound port.
	 * @param port
	 * @returns {{_id: (string|*), port: *, func: Function}}
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
	 * Returns an outbound port.
	 * @param port
	 * @returns {{_id: (string|*), port: *, func: (function(): (undefined|*))}}
	 */
	getOutboundPort(port) {
		return {
			_id: this._id,
			port: port,
			func: (() => {
				return this.instance.outputs[port];
			})
		};
	}

	/**
	 * Serializes a Node to JSON.
	 * @returns {{_id: (string|*), class: *, props: string | *, observers: {_id: *, outbound: *, inbound: *}[]}}
	 */
	serialize() {
		return {
			_id: this._id,
			class: this.class.name,
			props: this.props,
			observers: this.observers.map((item) => {
				return {
					_id: item._id,
					outbound: item.outbound,
					inbound: item.inbound
				};
			})
		}
	}

}
