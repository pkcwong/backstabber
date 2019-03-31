import { Meteor } from 'meteor/meteor';

Meteor.methods({
	'Request/GET': (json) => {
		return new Promise((resolve, reject) => {
			HTTP.call('GET', json.url, {
				headers: json.header
			}, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(res);
			});
		});
	},
	'Request/POST': (json) => {
		return new Promise((resolve, reject) => {
			HTTP.call('POST', json.url, {
				headers: json.header,
				body: (typeof json.body === 'string' ? json.body : JSON.stringify(json.body))
			}, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(res);
			});
		});
	}
});
