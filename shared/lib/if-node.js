import { BasicNode } from "./basic-node";

/**
 * IF-ELSE switcher that executes one of 'if' or 'else' Program with 'args', given 'condition'.
 */
export class IfNode extends BasicNode {

	constructor() {
		super({
			meta: {
				label: 'If'
			},
			props: {},
			input: {
				args: {
					meta: {
						label: 'args'
					}
				},
				condition: {
					meta: {
						label: 'condition'
					}
				},
				if: {
					meta: {
						label: 'if'
					}
				},
				else: {
					meta: {
						label: 'else'
					}
				}
			},
			output: {
				result: {
					meta: {
						label: 'result'
					}
				}
			},
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					if (input['condition']) {
						input['if'].execute(input['args']).then((res) => {
							resolve(res);
						}).catch((err) => {
							reject(err);
						});
					} else {
						input['else'].execute(input['args']).then((res) => {
							resolve(res);
						}).catch((err) => {
							reject(err);
						});
					}
				});
			}
		});
	}

}
