import { CanvasReducer } from "../redux/reducers/canvas-reducer";
import { CanvasAction } from "../redux/actions/canvas-action";
import { StringNode } from "../../shared/lib/string-node";

import {DefaultNodeModel} from 'storm-react-diagrams';

describe('CanvasReducer', ()=>{
	const node =  new DefaultNodeModel("StringNode");
	const nodeClass = new StringNode();
	it('Should reset states', ()=>{
		expect(CanvasReducer({
			nodes: Object.assign({},{}, {
				[node.id]: node
			}),
			links: [],
			nodeClass: Object.assign({},{}, {
				[nodeClass._id]: nodeClass
			}),
			nodeDict: Object.assign({},{}, {
				[node.id]: nodeClass._id
			}),
		}, CanvasAction.reset())).toEqual({
			document: {
				_id: null
			},
			nodes: {},
			links: [],
			nodeClass: {},
			nodeDict: {}
		});
	});
	it('Should add Nodes', ()=>{
		expect(CanvasReducer({
			nodes: {},
			links: [],
			nodeClass: {},
			nodeDict: {}
		}, CanvasAction.addNode(node,nodeClass))).toEqual({
			nodes: Object.assign({},{}, {
				[node.id]: node
			}),
			links: [],
			nodeClass: Object.assign({},{}, {
				[nodeClass._id]: nodeClass
			}),
			nodeDict: Object.assign({},{}, {
				[node.id]: nodeClass._id
			}),
		});
	});
	it('Should Delete Node', ()=>{
		expect(CanvasReducer({
			nodes: Object.assign({},{}, {
				[node.id]: node
			}),
			links: [],
			nodeClass: Object.assign({},{}, {
				[nodeClass._id]: nodeClass
			}),
			nodeDict: Object.assign({},{}, {
				[node.id]: nodeClass._id
			}),
		}, CanvasAction.deleteNode(node.id))).toEqual({
			nodes: {},
			links: [],
			nodeClass: {},
			nodeDict: {},
		});
	});
});
