import { BasicNode } from "./basic-node";

export class JsonCollapseNode extends BasicNode {

	constructor() {
		super({
			meta: {
				label: 'Json Collapse'
			},
			props: {},
			input: [
				'json',
				'key'
			],
			output: [
				'value'
			],
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
