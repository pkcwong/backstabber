import { BasicNode } from "../basic-node";

export class DatabaseUpdateNode extends BasicNode {

    static props = {};

    static ports = {
        inputs: {
			database: (x) => {
				if (x._id === undefined || x.token === undefined) {
					throw 'invalid database configuration';
				}
				return x;
			},
			target_id: (x) => {
				if (typeof x !== 'string') {
					throw 'invalid document _id';
				}
				return x;
			},
            document: (x) => {
                if (typeof x !== 'object') {
                    throw 'invalid document json';
                }
                return x;
            }
        },
        outputs: {
			document: (x) => {
				return (x !== undefined);
			}
        }
    };

    static executor = (props = DatabaseUpdateNode.props, inputs) => {
        return new Promise((resolve, reject) => {
            Meteor.call('Documents/UPDATE', {
                bucket: inputs.database._id,
                token: inputs.database.token,
				_id: inputs.target_id,
                document: inputs.document
            }, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    document: res.document
                });
            });
        });
    };

    constructor(props) {
        super({
            class: DatabaseUpdateNode,
            props: props
        });
    }

}
