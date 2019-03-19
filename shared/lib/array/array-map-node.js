import { BasicNode } from "../basic-node";

export class ArrayMapNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array: (x) => {
				return x;
			},
			function: (x) => {
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
		return new Promise((resolve, reject) => {
			resolve({
				result: Promise.all(inputs.array.map(x => 
					new Promise(
						Meteor.call('sketches/EXECUTE', {
							_id: inputs.function._id,
							token: inputs.function.token,
							entry: x
						}, (err, res) => {
							if (err) {
								reject(err);
								return;
							}
							resolve({
								result: res
							});
						})
					)
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
