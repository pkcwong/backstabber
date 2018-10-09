const initialState = {
	nodes: [],
	links: []
};

export const CanvasReducer = (state = initialState, action) => {
	switch (action['type']) {
		case 'Canvas/RESET': {
			return initialState;
		}
		case 'Canvas/ADD_NODE': {
			return Object.assign({}, state, {
				nodes: [...state.nodes, action['payload']['node']]
			});
		}
		case 'Canvas/ADD_LINK': {
			return Object.assign({}, state, {
				links: [...state.links, action['payload']['link']]
			});
		}
		case 'Canvas/LOAD-COMPLETE': {
			// TODO parse into react diagram nodes
			return state;
		}
		default: {
			return state;
		}
	}
};
