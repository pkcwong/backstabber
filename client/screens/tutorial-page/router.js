import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { TutorialPage } from "./tutorial-page";

FlowRouter.route('/tutorial', {
	action: (params) => {
		mount(TutorialPage, {
			store: store,
			params: params
		});
	}
});
