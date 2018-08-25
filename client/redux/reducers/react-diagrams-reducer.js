const initialState = {
	nodes: [],
	links: []
};

export const ReactDiagramsReducer = (state = initialState, action) => {
	switch (action['type']) {
		case 'ReactDiagrams/INIT': {
			return initialState;
		}
		case 'ReactDiagrams/ADD_NODE': {
			return Object.assign({}, state, {
				nodes: [...state.nodes, action['payload']['node']]
			});
		}
		case 'ReactDiagrams/ADD_LINK': {
			return Object.assign({}, state, {
				links: [...state.links, action['payload']['link']]
			});
		}
		default: {
			return state;
		}
	}
};
