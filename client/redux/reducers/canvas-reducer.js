import { CanvasAction } from "../actions/canvas-action";

const initialState = {
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
			return Object.assign({}, state, {
				links: [...state.links, action['payload']['link']]
			});
		}
		case CanvasAction.LOAD_COMPLETE: {
			// TODO: parse into react diagram nodes
			const sketch = action['payload'];
			return state;
		}
		default: {
			return state;
		}
	}
};
