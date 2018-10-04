export class CanvasAction {

	static addNode = (node) => {
		return {
			type: 'Canvas/ADD_NODE',
			payload: {
				node: node
			}
		};
	};

	static addLink = (link) => {
		return {
			type: 'Canvas/ADD_LINK',
			payload: {
				link: link
			}
		};
	}

}