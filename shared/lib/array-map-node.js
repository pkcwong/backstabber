import { BasicNode } from "./basic-node";

export class ArrayMapNode extends BasicNode {

	static ports = {
		input: {
			array: [],
			function: (() => {
				return null;
			})
		},
		output: {
			array: []
		}
	};

	constructor() {
		super({
			cache: {
				class: ArrayMapNode.name,
				args: arguments
			},
			props: {},
			...ArrayMapNode.ports,
			execute: (props, input) => {
				return new Promise(async (resolve, reject) => {
					let result = [];
					for (let i = 0; i !== input['array'].length; i++) {
						result.push(await input['function'].execute(input['array'][i]));
					}
					resolve({
						array: result
					});
				});
			}
		});
	}

}
