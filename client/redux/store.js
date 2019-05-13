import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, call, fork } from 'redux-saga/effects';
import { LoggerReducer } from "./reducers/logger-reducer";
import { LocaleReducer } from "./reducers/locale-reducer";
import { FilesReducer } from "./reducers/files-reducer";
import { CanvasReducer } from "./reducers/canvas-reducer";
import { TutorialReducer } from "./reducers/tutorial-reducer";
import { LoggerSaga } from "./sagas/logger-saga";
import { FilesSaga } from "./sagas/files-saga";
import { CanvasSaga } from "./sagas/canvas-saga";
import { BucketsSaga } from "./sagas/buckets-saga";
import { DocumentsSaga } from "./sagas/documents-saga";

const saga = createSagaMiddleware();

export const store = createStore(combineReducers({
	LoggerReducer,
	LocaleReducer,
	FilesReducer,
	CanvasReducer,
	TutorialReducer
}), applyMiddleware(saga));

saga.run(function* () {
	yield all([
		call(LoggerSaga),
		...[
			FilesSaga,
			CanvasSaga,
			BucketsSaga,
			DocumentsSaga
		].map(fork)
	]);
});
