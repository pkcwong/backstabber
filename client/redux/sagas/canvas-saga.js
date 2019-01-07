import { Meteor } from 'meteor/meteor';
import { call, put, takeLatest } from 'redux-saga/effects';
import { CanvasAction } from "../actions/canvas-action";
import { sketches_db } from "/shared/collections/sketches";

export const CanvasSaga = function* () {
	yield takeLatest(CanvasAction.LOAD, function* (action) {
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
				yield put(CanvasAction._LOAD_COMPLETE(res));
			}
		} catch (err) {
			console.error(err);
		}
	});
	yield takeLatest(CanvasAction.CREATE, function* (action) {
		try {
			let res = yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/CREATE', {
						program: payload['program'],
						canvas: payload['canvas']
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
				canvas: action['payload']['canvas']
			});
			yield call((payload) => {
				action.callback(payload);
			}, {
				_id: res
			});
		} catch (err) {
			console.error(err);
		}
	});
};
