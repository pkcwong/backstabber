import { BasicNode } from "../basic-node";

export class ArrayReduceNode extends BasicNode {

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
			},
			accumulator: (x) => {
				return x;
			}
		},
		outputs: {
			result: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = ArrayReduceNode.props, inputs) => {
		return new Promise(async (resolve, reject) => {
			resolve({
				result: await Promise.resolve(inputs.array.reduce(async (accumulator, current, index) => {
					return Promise.resolve(await new Promise(async (resolve) => {
						Meteor.call('sketches/EXECUTE', {
							_id: inputs.program._id,
							token: inputs.program.token,
							entry: Object.assign({}, inputs.program.entry, {
								accumulator: await Promise.resolve(accumulator),
								current: current,
								index: index
							})
						}, (err, res) => {
							if (err) {
								reject(err);
								return;
							}
							resolve(res.accumulator);
						});
					}));
				}, Promise.resolve(inputs.accumulator)))
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayReduceNode,
			props: props
		});
	}

}
