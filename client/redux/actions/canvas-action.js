export class CanvasAction {

	static RESET = 'Canvas/RESET';
	static ADD_NODE = 'Canvas/ADD_NODE';
	static ADD_LINK = 'Canvas/ADD_LINK';
	static LOAD = 'Canvas/LOAD';
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

	static addNode = (node) => {
		return {
			type: CanvasAction.ADD_NODE,
			payload: {
				node: node
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
		}
	};

	/**
	 * Stores a new sketch into database
	 * @param program
	 * @param position
	 * @returns {{type: string, payload: {program: *, position: *}}}
	 */
	static create = (program, position) => {
		return {
			type: CanvasAction.CREATE,
			payload: {
				program: program.serialize(),
				position: position
			}
		};
	};

}
