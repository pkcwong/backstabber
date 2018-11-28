import { BasicNode } from "./basic-node";

/**
 * A JSON builder that constructs a new JSON object based on a key/value pair and an old JSON.
 */
export class JsonAssignNode extends BasicNode {


	static ports = {
		input: {
			json: {},
			key: null,
			value: null
		},
		output: {
			json: {}
		}
	};

	constructor() {
		super({
			cache: {
				class: JsonAssignNode.name,
				args: arguments
			},
			props: {},
			...JsonAssignNode.ports,
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
