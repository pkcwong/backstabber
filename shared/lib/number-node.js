import { BasicNode } from "./basic-node";

/**
 * A constant node that outputs a number based on prop.
 */
export class NumberNode extends BasicNode {

    constructor(string) {
        super({
            cache: {
                class: NumberNode.name,
                args: arguments
            },
            meta: {
                label: 'Number'
            },
            props: {
                number: number
            },
            input: {},
            output: {
                number: {
                    meta: {
                        label: 'number'
                    }
                }
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
