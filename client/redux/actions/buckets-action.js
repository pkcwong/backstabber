export class BucketsAction {

	static CREATE = 'Buckets/CREATE';
	static DELETE = 'Buckets/DELETE';
	static UPDATE = 'Buckets/UPDATE';

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
	};

	static update = (_id, meta = {}) => {
		return {
			type: BucketsAction.UPDATE,
			payload: {
				_id: _id,
				meta: meta
			}
		};
	};

}
