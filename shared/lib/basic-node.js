/**
 * A BasicNode represents one command of a program.
 */
export class BasicNode {

	constructor(args) {
		this.args = args;
		this.instance = {
			props: args.props,
			input: args.input.reduce((accumulator, current) => {
				return Object.assign({}, accumulator, {
					[current]: undefined
				});
			}, {}),
			execute: args.execute,
			output: args.output.reduce((accumulator, current) => {
				return Object.assign({}, accumulator, {
					[current]: undefined
				});
			}, {})
		};
		this.observers = [];
	}

	/**
	 * Executes the Node and send outputs to observers
	 * @returns {*}
	 */
	execute() {
		console.log(this.args.meta.label + " executed");
		let result = this.instance.execute(this.instance.props, this.instance.input);
		Object.keys(this.instance.output).forEach((key) => {
			this.instance.output[key] = result[key];
		});
		this.observers.forEach((item) => {
			item();
		});
		return this.instance.output;
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
			(() => {
				input(output());
			})
		];
	}

	/**
	 * Receives data on an input port and executes on ready
	 * @param port
	 * @param data
	 */
	receive(port, data) {
		if (this.instance.input[port] === undefined) {
			this.instance.input[port] = data;
			if (this.ready()) {
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
		return ((output) => {
			this.receive(port, output);
		});
	}

	/**
	 * Gets a function that returns the value of the output port
	 * @param port
	 * @returns {function(): *}
	 */
	getOutboundPort(port) {
		return (() => {
			return this.instance.output[port];
		});
	}

}
