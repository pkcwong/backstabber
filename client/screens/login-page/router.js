import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { LoginPage } from "./login-page";

FlowRouter.route('/login', {
	action: (params) => {
		document.title = 'meteor-react-starter';
		mount(LoginPage, {
			store: store,
			params: params
		});
	}
});