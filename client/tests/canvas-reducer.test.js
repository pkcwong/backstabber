import { CanvasReducer } from "../redux/reducers/canvas-reducer";
import { CanvasAction } from "../redux/actions/canvas-action";
import { AdditionNode } from "../../shared/lib/arithmetics/addition-node";
import { AndNode } from "../../shared/lib/logic/and-node";
import { ArrayNode } from "../../shared/lib/array/array-node";
import { ArrayFilterNode } from "../../shared/lib/array/array-filter-node";
import { ArrayGetNode } from "../../shared/lib/array/array-get-node";
import { ArrayLengthNode } from "../../shared/lib/array/array-length-node";
import { ArrayMapNode } from "../../shared/lib/array/array-map-node";
import { ArrayPushNode } from "../../shared/lib/array/array-push-node";
import { ArrayReduceNode } from "../../shared/lib/array/array-reduce-node";
import { BoolNode } from "../../shared/lib/primitive/bool-node";
import { BranchNode } from "../../shared/lib/logic/branch-node";
import { DatabaseNode } from "../../shared/lib/database/database-node";
import { DatabaseFetchNode } from "../../shared/lib/database/database-fetch-node";
import { DatabaseInsertNode } from "../../shared/lib/database/database-insert-node";
import { DatabaseRemoveNode } from "../../shared/lib/database/database-remove-node";
import { DivisionNode } from "../../shared/lib/arithmetics/division-node";
import { EntryNode } from "../../shared/lib/api/entry-node";
import { EqualityNode } from "../../shared/lib/logic/equality-node";
import { ExecuteNode } from "../../shared/lib/functional/execute-node";
import { ExponentialNode } from "../../shared/lib/arithmetics/exponential-node";
import { GreaterThanNode } from "../../shared/lib/logic/greater-than-node";
import { HttpGetNode } from "../../shared/lib/web/http-get-node";
import { HttpPostNode } from "../../shared/lib/web/http-post-node";
import { KestrelNode } from "../../shared/lib/functional/kestrel-node";
import { LessThanNode } from "../../shared/lib/logic/less-than-node";
import { MultiplicationNode } from "../../shared/lib/arithmetics/multiplication-node";
import { ModuloNode } from "../../shared/lib/arithmetics/modulo-node";
import { NegateNode } from "../../shared/lib/logic/negate-node";
import { NullNode } from "../../shared/lib/primitive/null-node";
import { NumberNode } from "../../shared/lib/primitive/number-node";
import { ObjectNode } from "../../shared/lib/object/object-node";
import { ObjectGetNode } from "../../shared/lib/object/object-get-node";
import { ObjectPutNode } from "../../shared/lib/object/object-put-node";
import { OrNode } from "../../shared/lib/logic/or-node";
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
				Database: "#aaa69d",
				Web: "#00bfff"
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
					NullNode
				},
				Arithmetics: {
					AdditionNode,
					SubtractionNode,
					MultiplicationNode,
					DivisionNode,
					ExponentialNode,
					ModuloNode
				},
				Logic: {
					AndNode,
					BranchNode,
					EqualityNode,
					GreaterThanNode,
					LessThanNode,
					NegateNode,
					OrNode
				},
				Functional: {
					ProgramNode,
					ExecuteNode,
					KestrelNode
				},
				Object: {
					ObjectNode,
					ObjectGetNode,
					ObjectPutNode
					// ObjectKeysNode
				},
				Array: {
					ArrayNode,
					ArrayFilterNode,
					ArrayGetNode,
					ArrayLengthNode,
					ArrayMapNode,
					ArrayPushNode,
					ArrayReduceNode
				},
				Database: {
					DatabaseNode,
					DatabaseFetchNode,
					DatabaseInsertNode,
					// ColledctionUpdateNode,
					DatabaseRemoveNode,
				},
				Web: {
					HttpGetNode,
					HttpPostNode
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
