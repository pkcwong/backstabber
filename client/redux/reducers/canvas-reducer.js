import { CanvasAction } from "../actions/canvas-action";

const initialState = {
	nodes: [],
	links: [],
	nodeClass: [],
	nodeDict: {}
};

export const CanvasReducer = (state = initialState, action) => {
	switch (action['type']) {
		case CanvasAction.RESET: {
			return initialState;
		}
		case CanvasAction.ADD_NODE: {
			return Object.assign({}, state, {
				nodes: [...state.nodes, action['payload']['node']],
				nodeClass: [...state.nodeClass, action['payload']['nodeClass']],
				nodeDict: Object.assign({},state.nodeDict, {
					[action['payload']['node'].id]: action['payload']['nodeClass'].uid
				})
			});
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
