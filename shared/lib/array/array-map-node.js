import { BasicNode } from "../basic-node";
import { sketches_db } from "../../collections/sketches";
import { Program } from "../program";

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
				result: await Promise.all(inputs.array.map((x, index) => {
					return new Promise((resolve) => {
						const sketch = sketches_db.findOne({
							_id: inputs.program._id
						});
						if (sketch !== undefined) {
							Program.deserialize(sketch.program).execute(Object.assign({}, inputs.program.entry, {
								current: x,
								index: index
							})).then((res) => {
								resolve(res.current);
							}).catch((err) => {
								reject(err);
							});
						} else {
							Meteor.call('sketches/EXECUTE', {
								_id: inputs.program._id,
								token: inputs.program.token,
								entry: Object.assign({}, inputs.program.entry, {
									current: x,
									index: index
								})
							}, (err, res) => {
								if (err) {
									reject(err);
									return;
								}
								resolve(res.current);
							});
						}
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
