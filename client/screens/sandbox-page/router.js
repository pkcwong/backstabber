import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { SandboxPage } from "./sandbox-page";

FlowRouter.route('/sandbox', {
	action: (params) => {
		if (!Meteor.userId() && FlowRouter.current().path === '/sandbox') {
			FlowRouter.go('/');
		}
		mount(SandboxPage, {
			store: store,
			params: params
		});
	}
});
