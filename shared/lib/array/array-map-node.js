import { BasicNode } from "../basic-node";

export class ArrayMapNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array: (x) => {
				return x;
			},
			program: (x) => {
				if(typeof x !== "object"){
					throw "Incorrect Test"
				}else{
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
							_id: inputs.function._id,
							token: inputs.function.token,
							entry: {
								current: x
							}
						}, (err, res) => {
							if (err) {
								reject(err);
								return;
							}
							resolve(res.current);
						})}
					);}
				))
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
