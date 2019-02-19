import { CanvasReducer } from "../redux/reducers/canvas-reducer";
import { CanvasAction } from "../redux/actions/canvas-action";
import { BoolNode } from "../../shared/lib/primitive/bool-node";
import { EntryNode } from "../../shared/lib/api/entry-node";
import { ExecuteNode } from "../../shared/lib/functional/execute-node";
import { NumberNode } from "../../shared/lib/primitive/number-node";
import { ProgramNode } from "../../shared/lib/functional/program-node";
import { ReturnNode } from "../../shared/lib/api/return-node";
import { StringNode } from "../../shared/lib/primitive/string-node";

describe('CanvasReducer', () => {
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
				ExecuteNode,
				NumberNode,
				ProgramNode,
				ReturnNode,
				StringNode
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
