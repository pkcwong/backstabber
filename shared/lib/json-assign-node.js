import { BasicNode } from "./basic-node";

/**
 * A JSON builder that constructs a new JSON object based on a key/value pair and an old JSON.
 */
export class JsonAssignNode extends BasicNode {

	constructor() {
		super({
			meta: {
				label: 'Json Assign'
			},
			props: {},
			input: [
				'json',
				'key',
				'value'
			],
			output: [
				'json'
			],
			execute: (props, input) => {
				if (input['json'] !== null) {
					if (input['key'] !== null) {
						return {
							json: Object.assign({}, input['json'], {
								[input['key']]: input['value']
							})
						};
					} else {
						return {
							json: Object.assign({}, input['json'])
						}
					}
				} else {
					if (input['key'] !== null) {
						return {
							json: Object.assign({}, {
								[input['key']]: input['value']
							})
						};
					} else {
						return {};
					}
				}
			}
		});
	}

}
