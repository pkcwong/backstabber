import { DefaultNodeModel, DefaultPortModel } from 'storm-react-diagrams';
import { CanvasAction } from "../actions/canvas-action";
import { AdditionNode } from "../../../shared/lib/arithmetics/addition-node";
import { AndNode } from "../../../shared/lib/logic/and-node";
import { ArrayNode } from "../../../shared/lib/array/array-node";
import { ArrayFilterNode } from "../../../shared/lib/array/array-filter-node";
import { ArrayGetNode } from "../../../shared/lib/array/array-get-node";
import { ArrayLengthNode } from "../../../shared/lib/array/array-length-node";
import { ArrayMapNode } from "../../../shared/lib/array/array-map-node";
import { ArrayPushNode } from "../../../shared/lib/array/array-push-node";
import { ArrayReduceNode } from "../../../shared/lib/array/array-reduce-node";
import { BoolNode } from "../../../shared/lib/primitive/bool-node";
import { BranchNode } from "../../../shared/lib/logic/branch-node";
import { DatabaseNode } from "../../../shared/lib/database/database-node";
import { DatabaseFetchNode } from "../../../shared/lib/database/database-fetch-node";
import { DatabaseInsertNode } from "../../../shared/lib/database/database-insert-node";
import { DatabaseRemoveNode } from "../../../shared/lib/database/database-remove-node";
import { DivisionNode } from "../../../shared/lib/arithmetics/division-node";
import { EntryNode } from "../../../shared/lib/api/entry-node";
import { EqualityNode } from "../../../shared/lib/logic/equality-node";
import { ExecuteNode } from "../../../shared/lib/functional/execute-node";
import { ExponentialNode } from "../../../shared/lib/arithmetics/exponential-node";
import { GreaterThanNode } from "../../../shared/lib/logic/greater-than-node";
import { KestrelNode } from "../../../shared/lib/functional/kestrel-node";
import { LessThanNode } from "../../../shared/lib/logic/less-than-node";
import { MultiplicationNode } from "../../../shared/lib/arithmetics/multiplication-node";
import { ModuloNode } from "../../../shared/lib/arithmetics/modulo-node";
import { NegateNode } from "../../../shared/lib/logic/negate-node";
import { NullNode } from "../../../shared/lib/primitive/null-node";
import { NumberNode } from "../../../shared/lib/primitive/number-node";
import { ObjectNode } from "../../../shared/lib/object/object-node";
import { ObjectGetNode } from "../../../shared/lib/object/object-get-node";
import { ObjectPutNode } from "../../../shared/lib/object/object-put-node";
import { OrNode } from "../../../shared/lib/logic/or-node";
import { ProgramNode } from "../../../shared/lib/functional/program-node";
import { ReturnNode } from "../../../shared/lib/api/return-node";
import { StringNode } from "../../../shared/lib/primitive/string-node";
import { SubtractionNode } from "../../../shared/lib/arithmetics/subtraction-node";

const initialState = {
	dispatcher: null,
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
			DatabaseRemoveNode
		}
	},
	select_id: ""
};

export const CanvasReducer = (state = initialState, action) => {
	switch (action.type) {
		case CanvasAction.INIT: {
			return Object.assign({}, state, {
				dispatcher: action.payload.dispatcher
			});
		}
		case CanvasAction.RESET: {
			let reset = Object.assign({}, initialState);
			delete reset['dispatcher'];
			return Object.assign({}, state, reset);
		}
		case CanvasAction.ADD_NODE: {
			let bsNode = new state.nodeTypes[Object.keys(state.nodeTypes).find((category) => {
				return Object.keys(state.nodeTypes[category]).includes(action.payload.nodeType);
			})][action.payload.nodeType]();
			if (action.payload._id !== 0) {
				bsNode._id = action.payload._id;
			}
			if (action.payload.props !== 0) {
				bsNode.setProps(action.payload.props);
			}
			let stormNode = new DefaultNodeModel(bsNode.class.name, state.colorLookup[Object.keys(state.nodeTypes).find((category) => {
				return Object.keys(state.nodeTypes[category]).includes(action.payload.nodeType);
			})]);
			stormNode.setPosition(action.payload.coordinates.x, action.payload.coordinates.y);
			Object.keys(bsNode.class.ports.inputs).forEach((key) => {
				stormNode.addPort(new DefaultPortModel(true, key));
			});
			Object.keys(bsNode.class.ports.outputs).forEach((key) => {
				stormNode.addPort(new DefaultPortModel(false, key));
			});
			stormNode.addListener({
				entityRemoved: () => {
					state.dispatcher(CanvasAction.purgeNode(bsNode._id));
				},
				selectionChanged: () => {
					state.dispatcher(CanvasAction.nodeSelected(stormNode.id))
				}
			});
			return Object.assign({}, state, {
				bsNodes: [
					...state.bsNodes,
					bsNode
				],
				srdNodes: [
					...state.srdNodes,
					stormNode
				],
				lookup: Object.assign({}, state.lookup, {
					[bsNode._id]: stormNode.getID()
				})
			});
		}
		case CanvasAction.DELETE_NODE: {
			const lookup = Object.assign({}, state.lookup);
			delete lookup[action.payload._id];
			return Object.assign({}, state, {
				bsNodes: state.bsNodes.filter((bsNode) => {
					return (bsNode._id !== action.payload._id);
				}),
				srdNodes: state.srdNodes.filter((srdNode) => {
					return (srdNode.id !== state.lookup[action.payload._id]);
				}),
				lookup: lookup,
				select_id: ""
			});
		}
		case CanvasAction.ADD_LINK: {
			const bsNodeOutbound = state.bsNodes.find((bsNode) => {
				return (bsNode._id === action.payload.outbound._id);
			});
			const bsNodeInbound = state.bsNodes.find((bsNode) => {
				return (bsNode._id === action.payload.inbound._id);
			});
			if (bsNodeOutbound === undefined || bsNodeInbound === undefined) {
				return state;
			}
			if (bsNodeOutbound.observers.find((link) => {
				return (link._id === action.payload.inbound._id && link.outbound === action.payload.outbound.port && link.inbound === action.payload.inbound.port);
			}) !== undefined) {
				return state;
			}
			bsNodeOutbound.sendOnReady(bsNodeOutbound.getOutboundPort(action.payload.outbound.port), bsNodeInbound.getInboundPort(action.payload.inbound.port));
			const srdPortOutbound = state.srdNodes.find((srdNode) => {
				return (srdNode.id === state.lookup[action.payload.outbound._id]);
			}).ports[action.payload.outbound.port];
			const srdPortInbound = state.srdNodes.find((srdNode) => {
				return (srdNode.id === state.lookup[action.payload.inbound._id]);
			}).ports[action.payload.inbound.port];
			const srdLink = srdPortOutbound.link(srdPortInbound);
			srdLink.addListener({
				entityRemoved: () => {
					state.dispatcher(CanvasAction.deleteLink(srdLink));
				}
			});
			return Object.assign({}, state, {
				srdLinks: [
					...state.srdLinks,
					srdLink
				]
			});
		}
		case CanvasAction.DELETE_LINK: {
			const bsNodeOutbound = state.bsNodes.find((bsNode) => {
				return (bsNode._id === Object.keys(state.lookup).find((key) => {
					return (state.lookup[key] === action.payload.outbound._id);
				}));
			});
			const bsNodeInbound = state.bsNodes.find((bsNode) => {
				return (bsNode._id === Object.keys(state.lookup).find((key) => {
					return (state.lookup[key] === action.payload.inbound._id);
				}));
			});
			if (bsNodeOutbound === undefined || bsNodeInbound === undefined) {
				return state;
			}
			bsNodeOutbound.revokeSendOnReady(bsNodeOutbound.getOutboundPort(action.payload.outbound.port), bsNodeInbound.getInboundPort(action.payload.inbound.port));
			const srdPortOutbound = state.srdNodes.find((srdNode) => {
				return (srdNode.id === action.payload.outbound._id);
			}).ports[action.payload.outbound.port];
			const srdPortInbound = state.srdNodes.find((srdNode) => {
				return (srdNode.id === action.payload.inbound._id);
			}).ports[action.payload.inbound.port];
			return Object.assign({}, state, {
				srdLinks: state.srdLinks.filter((link) => {
					return !(link.sourcePort === srdPortOutbound && link.targetPort === srdPortInbound);
				})
			});
		}
		case CanvasAction.ADD_LABEL: {
			let srdNode = state.srdNodes.find((srdNode) => {
				return (srdNode.id === state.lookup[action.payload.bsNode._id])
			});
			if (action.payload.label === undefined) {
				return state;
			}
			Object.keys(srdNode.ports[action.payload.portName].links).map((port) => {
				let labelPort = srdNode.ports[action.payload.portName].links[port];
				if (labelPort.labels.length === 0) {
					labelPort.addLabel(action.payload.label);
				} else {
					labelPort.labels[0].label = action.payload.label;
				}

			});
			return Object.assign({}, state, {
				srdNodes: state.srdNodes
			});
		}
		case CanvasAction.DELETE_LABEL: {
			state.srdLinks.map((srdLink) => {
				srdLink.labels = [];
			});
			return Object.assign({}, state, {
				srdLinks: state.srdLinks
			});
		}
		case CanvasAction.LOAD_COMPLETE: {
			return Object.assign({}, state, {
				_id: action.payload._id
			});
		}
		case CanvasAction.NODE_SELECT: {
			return Object.assign({}, state, {
				select_id: Object.keys(state.lookup).find((bs_id) => {
					return (state.lookup[bs_id] === action.payload._id)
				})
			});
		}
		default: {
			return state;
		}
	}
};
