import { BasicNode } from "../basic-node";

export class ObjectParseNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			string: (x) => {
				return (x);
			}
		},
		outputs: {
			json: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = ObjectParseNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			try{
				let result = JSON.parse(inputs.string)
				resolve({
					json: result
				});
			}
			catch (e){
				reject(e)
			}
		});
	};

	constructor(props) {
		super({
			class: ObjectParseNode,
			props: props
		});
	}

}
