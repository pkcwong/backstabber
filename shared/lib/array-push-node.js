import { BasicNode } from "./basic-node";

/**
 * Array builder that appends or create a new array.
 */
export class ArrayPushNode extends BasicNode {

	constructor() {
		super({
			cache: {
				class: ArrayPushNode.name,
				args: arguments
			},
			meta: {
				label: 'Array Push'
			},
			props: {},
			input: {
				array: {
					meta: {
						label: 'array'
					}
				},
				value: {
					meta: {
						label: 'value'
					}
				}
			},
			output: {
				array: {
					meta: {
						label: 'array'
					}
				}
			},
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					if (input['array'] !== null) {
						if (input['value'] !== null) {
							resolve({
								array: [
									...input['array'],
									input['value']
								]
							});
						} else {
							resolve({
								array: input['array'].slice()
							});
						}
					} else {
						if (input['value'] !== null) {
							resolve({
								array: [
									input['value']
								]
							})
						} else {
							resolve({
								array: []
							});
						}
					}
				});
			}
		});
	}

}
