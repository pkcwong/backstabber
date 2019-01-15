export class CanvasAction {

	static RESET = 'Canvas/RESET';
	static ADD_NODE = 'Canvas/ADD_NODE';
	static DELETE_NODE = 'Canvas/DELETE_NODE';
	static ADD_LINK = 'Canvas/ADD_LINK';
	static LOAD = 'Canvas/LOAD';
	static LOAD_COMPLETE = 'Canvas/LOAD-COMPLETE';
	static CREATE = 'Canvas/CREATE';

	/**
	 * Resets the canvas
	 * @returns {{type: string}}
	 */
	static reset = () => {
		return {
			type: CanvasAction.RESET
		};
	};

	static addNode = (node, nodeClass) => {
		return {
			type: CanvasAction.ADD_NODE,
			payload: {
				node: node,
				nodeClass: nodeClass,
			}
		};
	};

	static deleteNode = (key) => {
		return {
			type: CanvasAction.DELETE_NODE,
			payload: {
				key: key,
			}
		};
	};


	static addLink = (link) => {
		return {
			type: CanvasAction.ADD_LINK,
			payload: {
				link: link
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
	 * @param callback
	 * @returns {{type: string, payload: {program: *, position: *}}}
	 */
	static create = (program, canvas, callback) => {
		return {
			type: CanvasAction.CREATE,
			payload: {
				program: program.serialize(),
				canvas: canvas
			},
			callback: callback
		};
	};

}
