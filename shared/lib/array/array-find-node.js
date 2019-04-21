import { BasicNode } from "../basic-node";
import _ from "lodash";

export class ArrayFindNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array: (x) => {
				if(Array.isArray(x)){
					return x;
				}else{
					throw "Incorrect Type"
				}
			},
			value: (x) => {
				if(typeof x === "number" || typeof x === "string"){
					return x;
				}else if(typeof x === "object"){
					try{
						return JSON.parse(JSON.stringify(x));
					}
					catch(e){
						throw e;
					}
				}
			}
		},
		outputs: {
			found: (x) => {

			},
			index: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type";
				}else{
					return x;
				}
			}
		}
	};

	static executor = (props = ArrayFindNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			if(typeof inputs.value === "object"){
				resolve({
					found: inputs.array.find((x) =>{
						return _.isMatch(x, inputs.value);
					}),
					index: inputs.array.findIndex((x) =>{
						return _.isMatch(x, inputs.value);
					})
				});
			}else{
				resolve({
					found: inputs.array.find((x) =>{
						return x === inputs.value;
					}),
					index: inputs.array.findIndex((x) =>{
						return x === inputs.value;
					})
				});
			}
		});
	};

	constructor(props) {
		super({
			class: ArrayFindNode,
			props: props
		});
	}

}
