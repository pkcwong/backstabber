import { BasicNode } from "../basic-node";
import _ from 'lodash';

export class ArrayFindNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array: (x) => {
				if (!Array.isArray(x)) {
					throw 'Invalid array';
				}
				return x;
			},
			value: (x) => {
				return x;
			}
		},
		outputs: {
			found: (x) => {
				return true;
			},
			index: (x) => {
				return (typeof x === 'number');
			}
		}
	};

	static executor = (props = ArrayFindNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			if (typeof inputs.value === 'object') {
				const found = inputs.array.find((x) => {
					return _.isEqual(x, inputs.value);
				});
				if (found !== undefined) {
					resolve({
						found: found,
						index: inputs.array.indexOf(found)
					});
					return;
				}
				const match = inputs.array.find((x) => {
					return _.isMatch(x, inputs.value);
				});
				if (match !== undefined) {
					resolve({
						found: match,
						index: inputs.array.indexOf(match)
					});
					return;
				}
				resolve({
					found: undefined,
					index: -1
				});
				return;
			}
			const found = inputs.array.find((x) => {
				return (x === inputs.value);
			});
			if (found !== undefined) {
				resolve({
					found: found,
					index: inputs.array.indexOf(found)
				});
				return;
			}
			resolve({
				found: undefined,
				index: -1
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayFindNode,
			props: props
		});
	}

}
