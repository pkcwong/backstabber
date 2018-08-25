import { mount } from 'react-mounter';
import { store } from "../../redux/store";
import { CanvasPage } from "./canvas-page";

FlowRouter.route('/canvas', {
	action: (params) => {
		mount(CanvasPage, {
			store: store,
			params: params
		});
	}
});
