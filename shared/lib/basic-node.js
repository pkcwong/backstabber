export class BasicNode {

	constructor(args) {
		this._id = Math.random().toString(36).substr(2, 16);
		this.class = args['class'];
		this.program = null;
		this.observers = [];
		this.instance = {};
		this.callbacks = [];
		this.setProps(args['props']);
	}

	reset() {
		this.instance = {
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
		};
		this.callbacks.forEach((callback) => {
			callback(null, this);
		});
	}

	bindProgram(program) {
		this.program = {
			execute: program.execute,
			resolve: program.resolve,
			reject: program.reject,
			monitor: program.monitor
		};
	}

	execute() {
		return new Promise((resolve, reject) => {
			if (this.program.monitor()) {
				this.program.execute(this);
				this.class.executor(this.props, this.instance.inputs).then((result) => {
					Object.keys(this.instance.outputs).forEach((key) => {
						this.instance.outputs[key] = result[key];
					});
					this.program.resolve(this);
					this.callbacks.forEach((callback) => {
						callback(null, this);
					});
					this.observers.forEach((item) => {
						item.func();
					});
					resolve(result);
				}).catch((err) => {
					this.callbacks.forEach((callback) => {
						callback(err, this);
					});
					this.program.reject(this, err);
					reject(err);
				});
			} else {
				this.program.reject(this, 'Halted');
				reject('Halted');
			}
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
					input.setter(output.getter());
				})
			}
		];
	}

	/**
	 * Revokes a connection between two ports.
	 * @param output
	 * @param input
	 */
	revokeSendOnReady(output, input) {
		this.observers = this.observers.filter((item) => {
			return !(item._id === input._id && item.outbound === output.port && item.inbound === input.port);
		});
	}

	/**
	 * Registers a callback to be notified of reset / execution state changes.
	 * @param callback
	 */
	registerCallback(callback) {
		this.callbacks = [
			...this.callbacks,
			callback
		];
	}

	receive(port, data, propagate = true) {
		if (this.instance.inputs[port] === undefined) {
			try {
				this.instance.inputs[port] = this.class.ports.inputs[port](data);
			} catch (err) {
				this.program.reject(this, err);
				console.error(err);
				throw {
					message: "invalid parameter: " + err,
					error: {
						ref: this,
						port: port,
						data: data
					}
				};
			}
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
				if (typeof this.class.props[current] !== typeof props[current]) {
					throw {
						message: "invalid property",
						error: {
							ref: this,
							prop: current,
							data: props[current]
						}
					};
				}
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
			setter: ((output) => {
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
			getter: (() => {
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
