import { CanvasReducer } from "../redux/reducers/canvas-reducer";
import { CanvasAction } from "../redux/actions/canvas-action";
import { AdditionNode } from "../../shared/lib/arithmetics/addition-node";
import { ArrayNode } from "../../shared/lib/array/array-node";
import { ArrayMapNode } from "../../shared/lib/array/array-map-node";
import { ArrayPushNode } from "../../shared/lib/array/array-push-node";
import { BoolNode } from "../../shared/lib/primitive/bool-node";
import { BranchNode } from "../../shared/lib/logic/branch-node";
import { DatabaseNode } from "../../shared/lib/database/database-node";
import { DatabaseFetchNode } from "../../shared/lib/database/database-fetch-node";
import { DatabaseInsertNode } from "../../shared/lib/database/database-insert-node";
import { EntryNode } from "../../shared/lib/api/entry-node";
import { ExecuteNode } from "../../shared/lib/functional/execute-node";
import { MultiplicationNode } from "../../shared/lib/arithmetics/multiplication-node";
import { NegateNode } from "../../shared/lib/logic/negate-node";
import { NullNode } from "../../shared/lib/primitive/null-node";
import { NumberNode } from "../../shared/lib/primitive/number-node";
import { ObjectNode } from "../../shared/lib/object/object-node";
import { ObjectGetNode } from "../../shared/lib/object/object-get-node";
import { ObjectPutNode } from "../../shared/lib/object/object-put-node";
import { ProgramNode } from "../../shared/lib/functional/program-node";
import { ReturnNode } from "../../shared/lib/api/return-node";
import { StringNode } from "../../shared/lib/primitive/string-node";
import { SubtractionNode } from "../../shared/lib/arithmetics/subtraction-node";

describe('CanvasReducer', () => {
	it('Should reset states', () => {
		expect(CanvasReducer({}, CanvasAction.reset())).toEqual({
			_id: null,
			bsNodes: [],
			srdNodes: [],
			srdLinks: [],
			lookup: {},
			colorLookup: {
				API: "#f7f1e3",
				Primitives: "#D24D57",
				Arithmetics: "#4D8FAC",
				Logic: "#ffda79",
				Functional: "#218c74",
				Object: "#cd6133",
				Array: "#706fd3",
				Database: "#aaa69d"
			},
			nodeTypes: {
				API: {
					EntryNode,
					ReturnNode
				},
				Primitives: {
					NumberNode,
					BoolNode,
					StringNode,
					NullNode,
				},
				Arithmetics: {
					AdditionNode,
					SubtractionNode,
					MultiplicationNode,
					// DivideNode,
				},
				Logic: {
					BranchNode,
					NegateNode
				},
				Functional: {
					ProgramNode,
					ExecuteNode
				},
				Object: {
					ObjectNode,
					ObjectGetNode,
					ObjectPutNode,
					// ObjectKeysNode
				},
				Array: {
					ArrayNode,
					ArrayMapNode,
					ArrayPushNode,
					// ArrayFilterNode,
				},
				Database: {
					DatabaseNode,
					DatabaseFetchNode,
					DatabaseInsertNode
					// ColledctionUpdateNode,
					// ColelctionRemoveNode,
				}
			},
			select_id: "",
		});
	});
	it('Should add Nodes', () => {
		const initialState = CanvasReducer({}, CanvasAction.reset());
		let state = Object.assign({}, initialState);
		state = CanvasReducer(state, CanvasAction.addNode(StringNode.name, 'Primitives', {
			x: 0,
			y: 0
		}));
		expect(state['bsNodes'].length).toEqual(1);
		expect(state['srdNodes'].length).toEqual(1);
	});
});
