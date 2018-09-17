import { EntryNode } from "./entry-node";
import { ReturnNode } from "./return-node";
import {BasicNode} from "./basic-node";

/**
 * A program is a array of BasicNode
 */
export class Program {

	constructor(nodes) {
		this.nodes = nodes;
	}

	execute(args = {}) {
		return new Promise((resolve, reject) => {
			this.nodes.forEach((node) => {
				node.reset();
			});
			this.nodes.filter((node) => {
				return (node instanceof EntryNode);
			}).forEach((node) => {
				node.instance.props = args;
			});
			this.nodes.filter((node) => {
				return (node instanceof ReturnNode);
			}).forEach((node) => {
				node.registerCallback((result) => {
					resolve(result);
				});
			});
			this.nodes.filter((node) => {
				return node.ready();
			}).forEach((node) => {
				node.execute();
			});
		});
	}

	jsonify(node){
		return{
			class: node.constructor.name,
			_id: node.getID(),
			observers: node.getObservers(),
			args: node.getArgs()
		}
	}

	nodify(json){
		var node;
		if(json.class == "BasicNode"){
			node = new BasicNode(json.args);
			node.modifyID(json._id);
			node.modifyObservers(json.observers);
		}
		return node;
	}

}
