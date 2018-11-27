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
			props: {},
			input: {
				array: [],
				value: null
			},
			output: {
				array: []
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
