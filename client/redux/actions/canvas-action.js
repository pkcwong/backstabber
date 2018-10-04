export class CanvasAction {

	/**
	 * Resets the canvas
	 * @returns {{type: string}}
	 */
	static reset = () => {
		return {
			type: 'Canvas/RESET'
		};
	};

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
	};

	/**
	 * Stores a new sketch into database
	 * @param program
	 * @param position
	 * @returns {{type: string, payload: {program: *, position: *}}}
	 */
	static create = (program, position) => {
		return {
			type: 'Canvas/CREATE',
			payload: {
				program: program.serialize(),
				position: position
			}
		};
	};

}
