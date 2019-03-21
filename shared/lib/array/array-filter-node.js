import { BasicNode } from "../basic-node";

export class ArrayFilterNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array: (x) => {
				if (!Array.isArray(x)) {
					throw "Invalid array.";
				}
				return x;
			},
			program: (x) => {
				if (x._id === undefined || x.token === undefined) {
					throw "Invalid program.";
				}
				return x;
			}
		},
		outputs: {
			result: (x) => {
				return (Array.isArray(x));
			}
		}
	};

	static executor = (props = ArrayFilterNode.props, inputs) => {
		return new Promise(async (resolve, reject) => {
			resolve({
				result: await Promise.resolve(inputs.array.reduce(async (accumulator, current) => {
					const acc = await Promise.resolve(accumulator);
					return Promise.resolve(await new Promise(async (resolve) => {
						Meteor.call('sketches/EXECUTE', {
							_id: inputs.program._id,
							token: inputs.program.token,
							entry: Object.assign({}, inputs.program.entry, {
								current: current
							})
						}, (err, res) => {
							if (err) {
								reject(err);
								return;
							}
							if (res.current === true) {
								resolve([
									...acc,
									current
								]);
							} else {
								resolve(acc);
							}
						});
					}));
				}, Promise.resolve([])))
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayFilterNode,
			props: props
		});
	}

}
