export class CanvasAction {

	static RESET = 'Canvas/RESET';
	static ADD_NODE = 'Canvas/ADD_NODE';
	static DELETE_NODE = 'Canvas/DELETE_NODE';
	static PURGE_NODE = 'Canvas/PURGE-NODE';
	static ADD_LINK = 'Canvas/ADD_LINK';
	static DELETE_LINK = 'Canvas/DELETE_LINK';
	static LOAD = 'Canvas/LOAD';
	static LOAD_COMPLETE = 'Canvas/LOAD-COMPLETE';
	static CREATE = 'Canvas/CREATE';
	static GENERATE_KEY = 'Canvas/GENERATE-KEY';

	/**
	 * Resets the canvas
	 * @returns {{type: string}}
	 */
	static reset = () => {
		return {
			type: CanvasAction.RESET
		};
	};

	static addNode = (nodeType, points, dispatcher) => {
		return {
			type: CanvasAction.ADD_NODE,
			payload: {
				nodeType: nodeType,
				coordinates: {
					x: points.x,
					y: points.y
				},
				dispatcher: dispatcher
			}
		};
	};

	static deleteNode = (node) => {
		return {
			type: CanvasAction.DELETE_NODE,
			payload: {
				_id: node.id
			}
		}
	};

	static purgeNode = (node) => {
		return {
			type: CanvasAction.PURGE_NODE,
			payload: {
				_id: node.id
			}
		}
	};

	static addLink = (link, dispatcher) => {
		const ports = [
			link.sourcePort,
			link.targetPort
		];
		const source = ports.find((item) => {
			return (item.in === false);
		});
		const target = ports.find((item) => {
			return (item.in === true);
		});
		return {
			type: CanvasAction.ADD_LINK,
			payload: {
				outbound: {
					_id: source ? source.parent.id : undefined,
					port: source ? source.name : undefined
				},
				inbound: {
					_id: target ? target.parent.id : undefined,
					port: target ? target.name : undefined
				},
				dispatcher: dispatcher
			}
		};
	};

	static deleteLink = (link) => {
		const ports = [
			link.sourcePort,
			link.targetPort
		];
		const source = ports.find((item) => {
			return (item.in === false);
		});
		const target = ports.find((item) => {
			return (item.in === true);
		});
		return {
			type: CanvasAction.DELETE_LINK,
			payload: {
				outbound: {
					_id: source.parent.id,
					port: source.name
				},
				inbound: {
					_id: target.parent.id,
					port: target.name
				}
			}
		};
	};

	/**
	 * Loads a sketch from database.
	 * @param _id
	 * @returns {{type: string, payload: {_id: *}}}
	 */
	static load = (_id) => {
		return {
			type: CanvasAction.LOAD,
			payload: {
				_id: _id
			}
		};
	};

	static _LOAD_COMPLETE = (sketch) => {
		return {
			type: CanvasAction.LOAD_COMPLETE,
			payload: {
				_id: sketch['_id'],
				meta: sketch['meta'],
				program: sketch['program'],
				canvas: sketch['canvas'],
				tokens: sketch['tokens'],
				logs: sketch['logs']
			}
		};
	};

	/**
	 * Stores a new sketch into database
	 * @param program
	 * @param canvas
	 * @returns {{type: string, payload: {program: *, position: *}}}
	 */
	static create = (program, canvas) => {
		return {
			type: CanvasAction.CREATE,
			payload: {
				program: program.serialize(),
				canvas: canvas
			}
		};
	};

	/**
	 * Generates a new API key.
	 * @param _id
	 * @returns {{type: string, payload: {_id: *}}}
	 */
	static generateApiKey = (_id) => {
		return {
			type: CanvasAction.GENERATE_KEY,
			payload: {
				_id: _id
			}
		};
	};

}
