class BasicNode {

	constructor(args) {
		this.instance = {
			props: args.props,
			input: args.input.reduce((accumulator, current) => {
				return Object.assign({}, accumulator, {
					[current]: undefined
				});
			}, {}),
			execute: args.execute
		};
		this.observers = [];
		this.output = {};
	}

	execute() {
		this.output = this.instance.execute({
			props: this.instance.props,
			input: this.instance.input
		});
		this.observers.forEach((item) => {
			item(this.output);
		});
		return this.output;
	}

	ready() {
		return !Object.keys(this.instance.input).some((item) => {
			return (this.instance.input[item] === undefined);
		});
	}

}

export class ConstantNode extends BasicNode {

	constructor(constant) {
		super({
			meta: {
				label: 'Constant'
			},
			props: {
				constant: constant
			},
			input: [],
			execute: (instance) => {
				return {
					value: instance.props.constant
				}
			}
		});
	}

}
