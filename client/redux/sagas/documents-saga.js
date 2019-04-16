import { Meteor } from "meteor/meteor"
import { call, takeEvery } from 'redux-saga/effects';
import { DocumentsAction } from "../actions/documents-action";

export const DocumentsSaga = function* () {
	yield takeEvery(DocumentsAction.INSERT, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Documents/INSERT', {
						bucket: payload.bucket,
						token: payload.token,
						document: payload.document
					}, (err, res) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(res);
					});
				});
			}, {
				bucket: action.payload.bucket,
				token: action.payload.token,
				document: action.payload.document
			});
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(DocumentsAction.UPDATE, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Documents/UPDATE', {
						bucket: payload.bucket,
						token: payload.token,
						_id: payload._id,
						document: payload.document
					}, (err, res) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(res);
					});
				});
			}, {
				bucket: action.payload.bucket,
				token: action.payload.token,
				_id: action.payload._id,
				document: action.payload.document
			});
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(DocumentsAction.REMOVE, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Documents/REMOVE', {
						bucket: payload.bucket,
						token: payload.token,
						_id: payload._id
					}, (err, res) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(res);
					});
				});
			}, {
				bucket: action.payload.bucket,
				token: action.payload.token,
				_id: action.payload._id
			});
		} catch (err) {
			console.error(err);
		}
	});
};
