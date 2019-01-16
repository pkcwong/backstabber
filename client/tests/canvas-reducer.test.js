import { CanvasReducer } from "../redux/reducers/canvas-reducer";
import { CanvasAction } from "../redux/actions/canvas-action";
import { DefaultNodeModel } from "storm-react-diagrams/dist/@types/src/main";
import { StringNode } from "../../shared/lib/string-node";

const node =  new DefaultNodeModel("string");
const nodeClass = new StringNode();

describe('CanvasReducer', ()=>{
	it('Should reset states', ()=>{
		expect(CanvasReducer({
			nodes: {},
			links: [],
			nodeClass: {},
			nodeDict: {}
		}, CanvasAction.RESET())).toEqual({
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
		}, CanvasAction.ADD_NODE({
			node: node,
			nodeClass: new nodeClass
		}))).toEqual({
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
		}, CanvasAction.DELETE_NODE({
			key: node.id,
		}))).toEqual({
			nodes: {},
			links: [],
			nodeClass: {},
			nodeDict: {},
		});
	});
});