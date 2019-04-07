import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { DatabasePage } from "./database-page";

FlowRouter.route('/buckets/:_id', {
	action: (params) => {
		if(!Meteor.userId() && FlowRouter.current().path === '/buckets/:_id'){
			FlowRouter.go('/login');
		}
		document.title = 'meteor-react-starter';
		mount(DatabasePage, {
			store: store,
			params: params
		});
	}
});
