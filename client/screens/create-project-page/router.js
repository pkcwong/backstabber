import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { CreateProjectPage } from "./create-project-page";

FlowRouter.route('/create', {
	action: (params) => {
		if(!Meteor.userId() && FlowRouter.current().path === '/create'){
			FlowRouter.go('/login');
		}
		document.title = 'meteor-react-starter';
		mount(CreateProjectPage, {
			store: store,
			params: params
		});
	}
});