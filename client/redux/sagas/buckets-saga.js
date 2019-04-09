import { Meteor } from 'meteor/meteor';
import { call, takeEvery } from 'redux-saga/effects';
import { BucketsAction } from "../actions/buckets-action";

export const BucketsSaga = function* () {
	yield takeEvery(BucketsAction.CREATE, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Buckets/CREATE', {
						meta: payload.meta
					}, (err, res) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(res);
					});
				});
			}, {
				meta: action.payload.meta
			});
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(BucketsAction.DELETE, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Buckets/DELETE', {
						_id: payload._id
					}, (err, res) => {
						if (err) {
							reject(err);
							return
						}
						resolve(res);
					});
				});
			}, {
				_id: action.payload._id
			});
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(BucketsAction.UPDATE, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Buckets/UPDATE', {
						_id: payload._id,
						meta: payload.meta
					}, (err, res) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(res);
					});
				});
			}, {
				_id: action.payload._id,
				meta: action.payload.meta
			});
		} catch (err) {
			console.error(err);
		}
	});
};
