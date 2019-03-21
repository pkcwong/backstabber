import { BasicNode } from "../basic-node";

export class ArrayMapNode extends BasicNode {

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
				} else {
					return x;
				}
			}
		},
		outputs: {
			result: (x) => {
				return Array.isArray(x);
			}
		}
	};

	static executor = (props = ArrayMapNode.props, inputs) => {
		return new Promise(async (resolve, reject) => {
			resolve({
				result: await Promise.all(inputs.array.map(x => {
					return new Promise((resolve, reject) => {
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
							resolve(res.current);
						})
					});
				}))
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayMapNode,
			props: props
		});
	}

}
