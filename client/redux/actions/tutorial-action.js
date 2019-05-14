export class TutorialAction {

	static SET_TEST = 'Tutorial/SET-TEST';

	static setTest = (title, tests, expect, solution) => {
		return {
			type: TutorialAction.SET_TEST,
			payload: {
				title: title,
				tests: tests,
				expect: expect,
				solution: solution
			}
		};
	};

}
