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
				{
					port: 'json',
					meta: {
						label: 'json'
					}
				},
				{
					port: 'key',
					meta: {
						label: 'key'
					}
				},
				{
					port: 'value',
					meta: {
						label: 'value'
					}
				}
			],
			output: [
				{
					port: 'json',
					meta: {
						label: 'json'
					}
				}
			],
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					if (input['json'] !== null) {
						if (input['key'] !== null) {
							resolve({
								json: Object.assign({}, input['json'], {
									[input['key']]: input['value']
								})
							});
						} else {
							resolve({
								json: Object.assign({}, input['json'])
							});
						}
					} else {
						if (input['key'] !== null) {
							resolve({
								json: Object.assign({}, {
									[input['key']]: input['value']
								})
							});
						} else {
							resolve({});
						}
					}
				});
			}
		});
	}

}
