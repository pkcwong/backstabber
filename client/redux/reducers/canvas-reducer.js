const initialState = {
	nodes: [],
	links: []
};

export const CanvasReducer = (state = initialState, action) => {
	switch (action['type']) {
		case 'Canvas/INIT': {
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
		default: {
			return state;
		}
	}
};
