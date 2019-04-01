import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { CanvasPage } from "./canvas-page";

FlowRouter.route('/canvas', {
	action: (params) => {
		if(!Meteor.userId() && FlowRouter.current().path === '/canvas'){
			FlowRouter.go('/');
		}
		mount(CanvasPage, {
			store: store,
			params: params
		});
	}
});
