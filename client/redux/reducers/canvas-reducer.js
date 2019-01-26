import { CanvasAction } from "../actions/canvas-action";
import { Program } from "../../../shared/lib/program";

const initialState = {
	document: {
		_id: null
	},
	nodes: {},
	links: [],
	nodeClass: {},
	nodeDict: {}
};

const remove = (json, key) => {
	let map = Object.assign({}, json);  // pure function, make a copy
	delete map[key];
	return map;
};


export const CanvasReducer = (state = initialState, action) => {
	switch (action['type']) {
		case CanvasAction.RESET: {
			return initialState;
		}
		case CanvasAction.ADD_NODE: {
			return Object.assign({}, state, {
				// nodes: [...state.nodes, action['payload']['node']],
				nodes: Object.assign({},state.nodes, {
					[action['payload']['node'].id]: action['payload']['node']
				}),
				nodeClass: Object.assign({}, state.nodeClass, {
					[action['payload']['nodeClass']._id]: action['payload']['nodeClass']
				}),
				nodeDict: Object.assign({},state.nodeDict, {
					[action['payload']['node'].id]: action['payload']['nodeClass']._id
				})
			});
		}
		case CanvasAction.DELETE_NODE: {
			let id = action['payload']['key'];
			let _id = state.nodeDict[action['payload']['key']];
			return Object.assign({}, state, {
				nodes: remove(state.nodes, id),
				nodeClass: remove(state.nodeClass, _id),
				nodeDict: remove(state.nodeDict, id)
			})
		}
        case CanvasAction.ADD_LINK: {
			if(!action.payload.link.sourcePort.in){
                let outbound = state.nodeClass[state.nodeDict[action.payload.link.sourcePort.parent.id]]
                let inbound = state.nodeClass[state.nodeDict[action.payload.link.targetPort.parent.id]]
                let outboundName = action.payload.link.sourcePort.label
                let inboundName = action.payload.link.targetPort.label
                outbound.sendOnReady(outbound.getOutboundPort(outboundName), inbound.getInboundPort(inboundName))
			}else{
                let outbound = state.nodeClass[state.nodeDict[action.payload.link.targetPort.parent.id]]
                let inbound = state.nodeClass[state.nodeDict[action.payload.link.sourcePort.parent.id]]
                let outboundName = action.payload.link.targetPort.label
                let inboundName = action.payload.link.sourcePort.label
                outbound.sendOnReady(outbound.getOutboundPort(outboundName), inbound.getInboundPort(inboundName))
			}
            return Object.assign({}, state, {
                links: [...state.links, action['payload']['link']]
            });
        }
        case CanvasAction.DELETE_LINK: {
            if(!action.payload.link.sourcePort.in){
                let outbound = state.nodeClass[state.nodeDict[action.payload.link.sourcePort.parent.id]]
                let inbound = state.nodeClass[state.nodeDict[action.payload.link.targetPort.parent.id]]
                let outboundName = action.payload.link.sourcePort.label
                let inboundName = action.payload.link.targetPort.label
                outbound.revokeSendOnReady(outbound.getOutboundPort(outboundName), inbound.getInboundPort(inboundName))
            }else{
                let outbound = state.nodeClass[state.nodeDict[action.payload.link.targetPort.parent.id]]
                let inbound = state.nodeClass[state.nodeDict[action.payload.link.sourcePort.parent.id]]
                let outboundName = action.payload.link.targetPort.label
                let inboundName = action.payload.link.sourcePort.label
                outbound.revokeSendOnReady(outbound.getOutboundPort(outboundName), inbound.getInboundPort(inboundName))
            }
            return Object.assign({}, state, {
                links: state.links.filter(links => links.id !== action.payload.link.id)
            });
        }
		case CanvasAction.LOAD_COMPLETE: {
			// TODO: parse into react diagram nodes
			const program = Program.deserialize(action['payload']['program']);
			const canvas = action['payload']['canvas'];
			return Object.assign({}, state, {
				document: {
					_id: action['payload']['_id']
				}
			});
		}
		default: {
			return state;
		}
	}
};
