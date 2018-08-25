export class ReactDiagramsAction {

	static addNode = (node) => {
		return {
			type: 'ReactDiagrams/ADD_NODE',
			payload: {
				node: node
			}
		};
	};

	static addLink = (link) => {
		return {
			type: 'ReactDiagrams/ADD_LINK',
			payload: {
				link: link
			}
		};
	}

}