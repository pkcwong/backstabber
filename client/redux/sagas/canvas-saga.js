import { Meteor } from 'meteor/meteor';
import { call, put, takeLatest } from 'redux-saga/effects';
import { sketches_db } from "../../../shared/collections/sketches";

export const CanvasSaga = function* () {
	yield takeLatest('Canvas/LOAD', function* (action) {
		try {
			let res = yield call((payload) => {
				return new Promise((resolve, reject) => {
					resolve(sketches_db.findOne({
						_id: payload['_id']
					}));
				});
			}, {
				_id: action['payload']['_id']
			});
			if (res !== undefined) {
				yield put({
					type: 'Canvas/LOAD-COMPLETE',
					payload: {
						meta: res['meta'],
						program: res['program'],
						position: res['position'],
						tokens: res['tokens'],
						logs: res['logs']
					}
				});
			}
		} catch (err) {
			console.error(err);
		}
	});
	yield takeLatest('Canvas/CREATE', function* (action) {
		try {
			let res = yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/CREATE', {
						program: payload['program'],
						position: payload['position']
					}, (err, res) => {
						if (!err) {
							resolve(res);
						} else {
							reject(err);
						}
					});
				});
			}, {
				program: action['payload']['program'],
				position: action['payload']['position']
			});
			yield put({
				type: 'Canvas/LOAD',
				payload: {
					_id: res
				}
			});
		} catch (err) {
			console.error(err);
		}
	});
};
