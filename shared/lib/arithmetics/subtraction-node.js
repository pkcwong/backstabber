import { BasicNode } from "../basic-node";

export class SubtractionNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			minuend: (x) => {
				return x;
			},
			subtrahend: (x) => {
				return x;
			}
		},
		outputs: {
			difference: (x) => {
				return x;
			}
		}
	};

	static executor = (props = SubtractionNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				difference: (inputs.minuend === null) ? inputs.subtrahend : (inputs.subtrahend === null) ? inputs.minuend : (typeof inputs.minuend === "number" && typeof inputs.subtrahend === "number") || (typeof inputs.minuend === "boolean" && typeof inputs.subtrahend === "boolean") ? inputs.minuend - inputs.subtrahend : (typeof inputs.minuend !== "boolean" && typeof inputs.subtrahend === "boolean") || (typeof inputs.minuend === "boolean" && typeof inputs.subtrahend !== "boolean") ? null : (typeof inputs.minuend !== "boolean" && typeof inputs.minuend !== "number" && typeof inputs.minuend !== "string") || (typeof inputs.subtrahend !== "boolean" && typeof inputs.subtrahend !== "number" && typeof inputs.subtrahend !== "string") ? null : inputs.minuend.replace(inputs.subtrahend, '')
			});
		});
	};

	constructor(props) {
		super({
			class: SubtractionNode,
			props: props
		});
	}

}
