import { Meteor } from 'meteor/meteor';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { CanvasAction } from "../actions/canvas-action";

export const CanvasSaga = function* () {
	yield takeEvery(CanvasAction.PURGE_NODE, function* (action) {
		try {
			const state = yield select((state) => {
				return state.CanvasReducer;
			});
			const srdNode = state.srdNodes.find((node) => {
				return (node.id === state.lookup[action.payload._id]);
			});
			yield all(Object.keys(srdNode.ports).reduce((acc, port) => {
				return [
					...acc,
					...Object.keys(srdNode.ports[port].links).map((srdLinkId) => {
						return put(CanvasAction.deleteLink(srdNode.ports[port].links[srdLinkId]));
					})
				];
			}, []));
			yield put(CanvasAction.deleteNode(state.bsNodes.find((bsNode) => {
				return (bsNode._id === action.payload._id);
			})._id));
		} catch (err) {
			console.error(err);
		}
	});
	yield takeLatest(CanvasAction.LOAD, function* (action) {
		try {
			let res = yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/LOAD', {
						_id: payload['_id']
					}, (err, res) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(res);
					});
				});
			}, {
				_id: action['payload']['_id']
			});
			if (res !== undefined) {
				yield put(CanvasAction.render(res));
			}
		} catch (err) {
			console.error(err);
		}
	});
	yield takeLatest(CanvasAction.RENDER, function* (action) {
		const res = action.payload;
		yield put(CanvasAction.reset());
		yield all(res.program.map(node => {
			return put(CanvasAction.addNode(node.class, res.canvas[node._id].coordinates, node._id, node.props));
		}));
		yield all(res.program.reduce((accumulator, node) => {
			return [
				...accumulator,
				...node.observers.map(link => {
					return put(CanvasAction.addLink(node._id, link.outbound, link._id, link.inbound));
				})
			];
		}, []));
		yield put(CanvasAction.loadComplete(action.payload._id !== undefined ? action.payload._id : null));
	});
	yield takeLatest(CanvasAction.CREATE, function* (action) {
		try {
			let res = yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/CREATE', {
						program: payload['program'],
						canvas: payload['canvas'],
						meta: payload['meta']
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
				canvas: action['payload']['canvas'],
				meta: action['payload']['meta']
			});
			yield put(CanvasAction.load(res));
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(CanvasAction.UPDATE_PROGRAM, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/UPDATE-PROGRAM', {
						_id: payload._id,
						program: payload.program,
						canvas: payload.canvas,
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
				program: action.payload.program,
				canvas: action.payload.canvas,
				meta: action.payload.meta
			});
			yield put(CanvasAction.load(action.payload._id));
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(CanvasAction.UPDATE_PROGRAM_META, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/UPDATE-PROGRAM-META', {
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
			yield put(CanvasAction.load(action.payload._id));
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(CanvasAction.DELETE, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/DELETE', {
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
				_id: action.payload._id
			});
			yield put(CanvasAction.reset());
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(CanvasAction.GENERATE_KEY, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/GENERATE-KEY', {
						_id: payload['_id']
					}, (err, res) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(res);
					});
				})
			}, {
				_id: action['payload']['_id']
			});
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(CanvasAction.REVOKE_KEY, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/REVOKE-KEY', {
						_id: payload._id,
						key: payload.key
					}, (err, res) => {
						if (err) {
							reject(err);
						}
						resolve(res);
					});
				});
			}, {
				_id: action.payload._id,
				key: action.payload.key
			});
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(CanvasAction.WRITE_TEST, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/WRITE-TEST', {
						_id: payload._id,
						entry: payload.entry,
						return: payload.return
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
				entry: action.payload.entry,
				return: action.payload.return
			});
		} catch (err) {
			console.error(err);
		}
	});
	yield takeEvery(CanvasAction.DELETE_TEST, function* (action) {
		try {
			yield call((payload) => {
				return new Promise((resolve, reject) => {
					Meteor.call('Sketches/DELETE-TEST', {
						_id: payload._id,
						test: payload.test
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
				test: action.payload.test
			});
		} catch (err) {
			console.error(err);
		}
	});
};
