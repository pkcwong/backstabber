import { BasicNode } from "./basic-node";

export class JsonCollapseNode extends BasicNode {

	constructor() {
		super({
			cache: {
				class: JsonCollapseNode.name,
				args: arguments
			},
			props: {},
			input: {
				json: {},
				key: null
			},
			output: {
				value: null
			},
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					resolve({
						value: input['json'][input['key']]
					});
				});
			}
		});
	}

}
