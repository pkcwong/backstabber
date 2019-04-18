import { BasicNode } from "../basic-node";
import { Program } from "../program";
import { sketches_db } from "../../collections/sketches";

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
				result: await Promise.resolve(inputs.array.reduce(async (accumulator, current, index) => {
					const acc = await Promise.resolve(accumulator);
					return Promise.resolve(await new Promise(async (resolve) => {
						const sketch = sketches_db.findOne({
							_id: inputs.program._id
						});
						if (sketch !== undefined) {
							Program.deserialize(sketch.program).execute(Object.assign({}, inputs.program.entry, {
								current: current,
								index: index
							})).then((res) => {
								if (res.current === true) {
									resolve([
										...acc,
										current
									]);
								} else {
									resolve(acc);
								}
							}).catch((err) => {
								reject(err);
							});
						} else {
							Meteor.call('sketches/EXECUTE', {
								_id: inputs.program._id,
								token: inputs.program.token,
								entry: Object.assign({}, inputs.program.entry, {
									current: current,
									index: index
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
						}
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
