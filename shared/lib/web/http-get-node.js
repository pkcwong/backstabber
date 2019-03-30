import { BasicNode } from "../basic-node";

export class HttpGetNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			url: (x) => {
				if (!((x) => {
					return (/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/).test(x);
				})(x)) {
					throw 'Invalid url';
				}
				return x;
			},
			header: (x) => {
				if (typeof x !== 'object') {
					throw 'Invalid header';
				}
				return (x !== null ? x : {});
			}
		},
		outputs: {
			status: (x) => {
				return (typeof x === 'number');
			},
			response: (x) => {
				return true;
			}
		}
	};

	static executor = (props = HttpGetNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			Meteor.call('Request/GET', {
				url: inputs.url,
				header: inputs.header
			}, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve({
					status: res.statusCode,
					response: res.data ? res.data : res.content
				});
			});
		});
	};

	constructor(props) {
		super({
			class: HttpGetNode,
			props: props
		});
	}

}
