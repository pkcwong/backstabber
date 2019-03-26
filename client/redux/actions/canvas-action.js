export class CanvasAction {

	static INIT = 'Canvas/INIT';
	static RESET = 'Canvas/RESET';
	static ADD_NODE = 'Canvas/ADD_NODE';
	static DELETE_NODE = 'Canvas/DELETE_NODE';
	static PURGE_NODE = 'Canvas/PURGE-NODE';
	static ADD_LINK = 'Canvas/ADD_LINK';
	static DELETE_LINK = 'Canvas/DELETE_LINK';
	static LOAD = 'Canvas/LOAD';
	static LOAD_COMPLETE = 'Canvas/LOAD-COMPLETE';
	static CREATE = 'Canvas/CREATE';
	static UPDATE_PROGRAM = 'Canvas/UPDATE-PROGRAM';
	static DELETE = 'Canvas/DELETE';
	static GENERATE_KEY = 'Canvas/GENERATE-KEY';
	static REVOKE_KEY = 'Canvas/REVOKE-KEY';
	static NODE_SELECT = 'canvas/NODE_SELECT';
	static ADD_LABEL = 'canvas/ADD_LABEL';
	static DELETE_LABEL = 'canvas/DELETE_LABEL';

	static init = (dispatcher) => {
		return {
			type: CanvasAction.INIT,
			payload: {
				dispatcher: dispatcher
			}
		};
	};

	/**
	 * Resets the canvas
	 * @returns {{type: string}}
	 */
	static reset = () => {
		return {
			type: CanvasAction.RESET
		};
	};

	static addNode = (nodeType, points, bsNodeID = 0, props = 0, callback = null) => {
		return {
			type: CanvasAction.ADD_NODE,
			payload: {
				nodeType: nodeType,
				coordinates: {
					x: points.x,
					y: points.y
				},
				_id: bsNodeID,
				props: props
			},
			callback: callback ? callback : () => {}
		};
	};

	static deleteNode = (bsNodeID) => {
		return {
			type: CanvasAction.DELETE_NODE,
			payload: {
				_id: bsNodeID
			}
		}
	};

	static purgeNode = (bsNodeID) => {
		return {
			type: CanvasAction.PURGE_NODE,
			payload: {
				_id: bsNodeID
			}
		}
	};

	static addLink = (sourceNodeID, outboundPort, targetNodeID, inboundPort) => {
		return {
			type: CanvasAction.ADD_LINK,
			payload: {
				outbound: {
					_id: sourceNodeID,
					port: outboundPort
				},
				inbound: {
					_id: targetNodeID,
					port: inboundPort
				}
			}
		};
	};

	static nodeSelected = (_id)=>{
		return {
			type: CanvasAction.NODE_SELECT,
			payload: {
				_id: _id
			}
		}
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

	static addLabel = (bsNode, portName, label) => {
		return {
			type: CanvasAction.ADD_LABEL,
			payload: {
				bsNode: bsNode,
				label: JSON.stringify(label),
				portName: portName,
			}
		}
	};

	static deleteLabel = () => {
		return {
			type: CanvasAction.DELETE_LABEL,
			payload:{}
		}
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

	static loadComplete = (_id) => {
		return {
			type: CanvasAction.LOAD_COMPLETE,
			payload: {
				_id: _id
			}
		};
	};

	/**
	 * Stores a new sketch into database
	 * @param program
	 * @param canvas
	 * @returns {{type: string, payload: {program: *, position: *, title *}}}
	 */
	static create = (program, canvas, title) => {
		return {
			type: CanvasAction.CREATE,
			payload: {
				program: program.serialize(),
				canvas: canvas,
				meta: title
			}
		};
	};

	/**
	 * Updates an existing Sketch on database
	 * @param _id
	 * @param program
	 * @param canvas
	 * @returns {{type: string, payload: {_id: *, program: *, canvas: *}}}
	 */
	static update = (_id, program, canvas) => {
		return {
			type: CanvasAction.UPDATE_PROGRAM,
			payload: {
				_id: _id,
				program: program.serialize(),
				canvas: canvas
			}
		};
	};

	/**
	 * Deletes an existing Sketch on database
	 * @param _id
	 * @returns {{payload: {_id: *}, type: string}}
	 */
	static delete = (_id) => {
		return {
			type: CanvasAction.DELETE,
			payload: {
				_id: _id
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

	/**
	 * Revokes an existing API key.
	 * @param _id
	 * @param key
	 * @returns {{type: string, payload: {_id: *, key: *}}}
	 */
	static revokeApiKey = (_id, key) => {
		return {
			type: CanvasAction.REVOKE_KEY,
			payload: {
				_id: _id,
				key: key
			}
		};
	};

}
