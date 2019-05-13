import { TutorialAction } from "../actions/tutorial-action";

const initialState = {
	title: '',
	tests: [],
	expect: []
};

export const TutorialReducer = (state = initialState, action) => {
	switch (action.type) {
		case TutorialAction.SET_TEST: {
			return Object.assign({}, state, {
				title: action.payload.title,
				tests: action.payload.tests,
				expect: action.payload.expect
			});
		}
		default: {
			return state;
		}
	}
};
