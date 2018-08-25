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
				return {
					value: input['json'][input['key']]
				}
			}
		});
	}

}
