import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { LoginPage } from "./login-page";

FlowRouter.route('/login', {
	action: (params) => {
		if(Meteor.userId() && FlowRouter.current().path === "/login"){
			FlowRouter.go('/create');
		}
		document.title = 'meteor-react-starter';
		mount(LoginPage, {
			store: store,
			params: params
		});
	}
});