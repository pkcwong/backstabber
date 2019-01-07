import { BasicNode } from "./basic-node";

export class JsonCollapseNode extends BasicNode {


	static ports = {
		input: {
			json: {},
			key: null
		},
		output: {
			value: null
		}
	};

	constructor() {
		super({
			cache: {
				class: JsonCollapseNode.name,
				args: arguments
			},
			props: {},
			...JsonCollapseNode.ports,
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
