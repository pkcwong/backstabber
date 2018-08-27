import { BasicNode } from "./basic-node";

export class JsonCollapseNode extends BasicNode {

	constructor() {
		super({
			meta: {
				label: 'Json Collapse'
			},
			props: {},
			input: {
				json: {
					meta: {
						label: 'json'
					}
				},
				key: {
					meta: {
						label: 'key'
					}
				}
			},
			output: {
				value: {
					meta: {
						label: 'value'
					}
				}
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
