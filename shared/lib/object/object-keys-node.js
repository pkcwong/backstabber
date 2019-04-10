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
            try{
                let result = Object.keys(inputs.object)
                resolve({
                    keys: result
                });
            }
            catch (e){
                reject(e)
            }
        });
    };

    constructor(props) {
        super({
            class: ObjectKeysNode,
            props: props
        });
    }

}
