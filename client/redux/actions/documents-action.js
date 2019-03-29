export class DocumentsAction {

	static INSERT = 'Documents/INSERT';
	static UPDATE = 'Documents/UPDATE';
	static REMOVE = 'Documents/REMOVE';

	static insert = (bucket, token, document) => {
		return {
			type: DocumentsAction.INSERT,
			payload: {
				bucket: bucket,
				token: token,
				document: document
			}
		};
	};

	static update = (bucket, token, _id, document) => {
		return {
			type: DocumentsAction.UPDATE,
			payload: {
				bucket: bucket,
				token: token,
				_id: _id,
				document: document
			}
		};
	};

	static remove = (bucket, token, _id) => {
		return {
			type: DocumentsAction.REMOVE,
			payload: {
				bucket: bucket,
				token: token,
				_id: _id
			}
		};
	};

}
