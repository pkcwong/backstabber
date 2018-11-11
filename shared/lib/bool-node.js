import { BasicNode } from "./basic-node";

/**
 * A constant node that outputs boolean.
 */
export class BoolNode extends BasicNode {

    constructor(bool) {
        super({
            cache: {
                class: BoolNode.name,
                args: arguments
            },
            meta: {
                label: 'Bool'
            },
            props: {
                bool: bool
            },
            input: {},
            output: {
                bool: {
                    meta: {
                        label: 'bool'
                    }
                }
            },
            execute: (props, input) => {
                return new Promise((resolve, reject) => {
                    resolve({
                        bool: props['bool']
                    });
                });
            }
        });
    }
}