import { DefaultNodeModel } from 'storm-react-diagrams';
import { CanvasReducer } from "../redux/reducers/canvas-reducer";
import { CanvasAction } from "../redux/actions/canvas-action";
import { BoolNode } from "../../shared/lib/bool-node";
import { StringNode } from "../../shared/lib/string-node";
import { EntryNode } from "../../shared/lib/entry-node";
import { ReturnNode } from "../../shared/lib/return-node";

describe('CanvasReducer', () => {
	const node = new DefaultNodeModel("StringNode");
	const nodeClass = new StringNode();
	it('Should reset states', () => {
		expect(CanvasReducer({}, CanvasAction.reset())).toEqual({
			_id: null,
			bsNodes: [],
			srdNodes: [],
			srdLinks: [],
			lookup: {},
			nodeTypes: {
				BoolNode,
				EntryNode,
				StringNode,
				ReturnNode
			},
			select_id: ""
		});
	});
	it('Should add Nodes', () => {
		const initialState = CanvasReducer({}, CanvasAction.reset());
		let state = Object.assign({}, initialState);
		state = CanvasReducer(state, CanvasAction.addNode(StringNode.name, {
			x: 0,
			y: 0
		}));
		expect(state['bsNodes'].length).toEqual(1);
		expect(state['srdNodes'].length).toEqual(1);
	});
});
