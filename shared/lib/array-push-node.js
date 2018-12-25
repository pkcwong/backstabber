import { BasicNode } from "./basic-node";

/**
 * Array builder that appends or create a new array.
 */
export class ArrayPushNode extends BasicNode {

	static ports = {
		input: {
			array: [],
			value: null
		},
		output: {
			array: []
		}
	};

	constructor() {
		super({
			cache: {
				class: ArrayPushNode.name,
				args: arguments
			},
			props: {},
			...ArrayPushNode.ports,
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
