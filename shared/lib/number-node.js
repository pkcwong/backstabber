import { BasicNode } from "./basic-node";

/**
 * A constant node that outputs a number based on prop.
 */
export class NumberNode extends BasicNode {

    constructor(number) {
        super({
            cache: {
                class: NumberNode.name,
                args: arguments
            },
            props: {
                number: number
            },
            input: {},
            output: {
                number: 0
            },
            execute: (props, input) => {
                return new Promise((resolve, reject) => {
                    resolve({
                        number: props['number']
                    });
                });
            }
        });
    }

}
