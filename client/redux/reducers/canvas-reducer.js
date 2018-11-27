import { CanvasAction } from "../actions/canvas-action";
import { EntryNode } from "../../../shared/lib/entry-node";
import { BasicNode } from "../../../shared/lib/basic-node";

const initialState = {
	nodes: [],
	links: []
};

export const CanvasReducer = (state = initialState, action) => {
	switch (action['type']) {
		case CanvasAction.RESET: {
			return initialState;
		}
		case CanvasAction.ADD_NODE: {
			return Object.assign({}, state, {
				nodes: [...state.nodes, node, new action['payload']['constructor']()]
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
