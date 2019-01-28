import { DefaultNodeModel, DefaultPortModel } from 'storm-react-diagrams';
import { CanvasAction } from "../actions/canvas-action";
import { EntryNode } from "../../../shared/lib/entry-node";
import { StringNode } from "../../../shared/lib/string-node";
import { ReturnNode } from "../../../shared/lib/return-node";

const initialState = {
	_id: null,
	bsNodes: [],
	srdNodes: [],
	srdLinks: [],
	lookup: {},
	nodeTypes: {
		EntryNode,
		StringNode,
		ReturnNode
	},
	select_id: ""
};

export const CanvasReducer = (state = initialState, action) => {
	switch (action.type) {
		case CanvasAction.RESET: {
			return initialState;
		}
		case CanvasAction.ADD_NODE: {
			let bsNode = new state.nodeTypes[action.payload.nodeType]();
			let stormNode = new DefaultNodeModel(bsNode.class.name);
			stormNode.setPosition(action.payload.coordinates.x, action.payload.coordinates.y);
			Object.keys(bsNode.class.ports.inputs).forEach((key) => {
				stormNode.addPort(new DefaultPortModel(true, key));
			});
			Object.keys(bsNode.class.ports.outputs).forEach((key) => {
				stormNode.addPort(new DefaultPortModel(false, key));
			});
			stormNode.addListener({
				entityRemoved: () => {
					action.payload.dispatcher(CanvasAction.purgeNode(stormNode));
				},
				selectionChanged: () => {
					action.payload.dispatcher(CanvasAction.nodeSelected(stormNode.id))
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
			return Object.assign({}, state, {
				bsNodes: state.bsNodes.filter((bsNode) => {
					return !(bsNode._id === Object.keys(state.lookup).find((key) => {
						return (state.lookup[key] === action.payload._id);
					}));
				}),
				srdNodes: state.srdNodes.filter((srdNode) => {
					return !(srdNode.id === action.payload._id);
				}),
				select_id: ""
			});
		}
		case CanvasAction.ADD_LINK: {
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
			bsNodeOutbound.sendOnReady(bsNodeOutbound.getOutboundPort(action.payload.outbound.port), bsNodeInbound.getInboundPort(action.payload.inbound.port));
			const srdPortOutbound = state.srdNodes.find((srdNode) => {
				return (srdNode.id === action.payload.outbound._id);
			}).ports[action.payload.outbound.port];
			const srdPortInbound = state.srdNodes.find((srdNode) => {
				return (srdNode.id === action.payload.inbound._id);
			}).ports[action.payload.inbound.port];
			const srdLink = srdPortOutbound.link(srdPortInbound);
			srdLink.addListener({
				entityRemoved: () => {
					action.payload.dispatcher(CanvasAction.deleteLink(srdLink));
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
		case CanvasAction.NODE_SELECT:{
			return Object.assign({}, state, {
				select_id: Object.keys(state.lookup).find((bs_id)=>{
					return(state.lookup[bs_id] === action.payload._id)
				})
			})
		}
		case CanvasAction.LOAD_COMPLETE: {
			return Object.assign({}, state, {
				_id: action.payload._id,
				program: action.payload.program,
				canvas: action.payload.canvas
			});
		}
		default: {
			return state;
		}
	}
};
