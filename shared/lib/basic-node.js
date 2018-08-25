/**
 * A BasicNode represents one command of a program.
 */
export class BasicNode {

	constructor(args) {
		this.args = args;
		this.reset();
		this.observers = [];
	}

	/**
	 * Resets the Node to initial state.
	 */
	reset() {
		this.instance = {
			props: this.args.props,
			input: this.args.input.reduce((accumulator, current) => {
				return Object.assign({}, accumulator, {
					[current]: undefined
				});
			}, {}),
			execute: this.args.execute,
			output: this.args.output.reduce((accumulator, current) => {
				return Object.assign({}, accumulator, {
					[current]: undefined
				});
			}, {})
		};
	}

	/**
	 * Executes the Node and send outputs to observers
	 * @returns {*}
	 */
	execute() {
		this.instance.execute(this.instance.props, this.instance.input).then((result) => {
			Object.keys(this.instance.output).forEach((key) => {
				this.instance.output[key] = result[key];
			});
			this.observers.forEach((item) => {
				item();
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