import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { BucketsPage } from "./buckets-page";

FlowRouter.route('/buckets', {
	action: (params) => {
		if (!Meteor.userId() && FlowRouter.current().path === '/buckets') {
			FlowRouter.go('/login');
		}
		mount(BucketsPage, {
			store: store,
			params: params
		});
	}
});
