import { BasicNode } from "../basic-node";

export class ObjectKeysNode extends BasicNode {

    static props = {};

    static ports = {
        inputs: {
            object: (x) => {
                if (typeof x !== 'string' && x !== null) {
                    throw "Invalid key";
                }
                return x;
            }
        },
        outputs: {
            keys: (x) => {
                return (x !== undefined);
            }
        }
    };

    static executor = (props = ObjectKeysNode.props, inputs) => {
        return new Promise((resolve, reject) => {
            resolve({
                keys: Object.keys(inputs.object)
            });
        });
    };

    constructor(props) {
        super({
            class: ObjectKeysNode,
            props: props
        });
    }

}
