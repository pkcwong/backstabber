import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { TutorialPage } from "./tutorial-page";

FlowRouter.route('/tutorial', {
	action: (params) => {
		if (!Meteor.userId() && FlowRouter.current().path === '/tutorial') {
			FlowRouter.go('/');
		}
		mount(TutorialPage, {
			store: store,
			params: params
		});
	}
});
