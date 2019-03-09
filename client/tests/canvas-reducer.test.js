import { CanvasReducer } from "../redux/reducers/canvas-reducer";
import { CanvasAction } from "../redux/actions/canvas-action";
import { AdditionNode } from "../../shared/lib/arithmetics/addition-node";
import { ArrayNode } from "../../shared/lib/array/array-node";
import { BoolNode } from "../../shared/lib/primitive/bool-node";
import { BranchNode } from "../../shared/lib/logic/branch-node";
import { EntryNode } from "../../shared/lib/api/entry-node";
import { ExecuteNode } from "../../shared/lib/functional/execute-node";
import { MultiplicationNode } from "../../shared/lib/arithmetics/multiplication-node";
import { NegateNode } from "../../shared/lib/logic/negate-node";
import { NullNode } from "../../shared/lib/primitive/null-node";
import { NumberNode } from "../../shared/lib/primitive/number-node";
import { ObjectNode } from "../../shared/lib/object/object-node";
import { ObjectGetNode as ObjectGetNode } from "../../shared/lib/object/object-get-node";
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
					// MinusNode,
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
					// ObjectAssignNode,
					ObjectGetNode,
					// ObjectKeysNode
				},
				Array: {
					ArrayNode,
					// ArrayPushNode,
					// ArrayFilterNode,
					// ArrayMapNode
				},
				Database: {
					// CollectionFindNode,
					// CollectionInsertNode,
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
