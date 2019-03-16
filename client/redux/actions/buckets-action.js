export class BucketsAction {

	static CREATE = 'Buckets/CREATE';
	static DELETE = 'Buckets/DELETE';

	static create = (meta = {}) => {
		return {
			type: BucketsAction.CREATE,
			payload: {
				meta: meta
			}
		};
	};

	static delete = (_id) => {
		return {
			type: BucketsAction.DELETE,
			payload: {
				_id: _id
			}
		};
	}

}
