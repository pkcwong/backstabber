import { Meteor } from "meteor/meteor";
import { Random } from 'meteor/random';
import { buckets_db } from "../../shared/collections/buckets";
import { documents_db } from "../../shared/collections/documents";

Meteor.methods({
	'Documents/FETCH': (json) => {
		return new Promise((resolve, reject) => {
			const bucket = buckets_db.findOne({
				_id: json.bucket
			});
			if (!bucket) {
				reject('404 Not Found');
				return;
			}
			if (bucket.token !== json.token) {
				reject('401 Unauthorized');
				return;
			}
			const documents = documents_db.find({
				bucket: bucket._id
			}).fetch().map((item) => {
				return Object.assign({}, {
					_id: item._id
				}, item.document);
			});
			resolve({
				documents: documents
			});
		}).catch((err) => {
			throw new Meteor.Error(err);
		});
	},
	'Documents/INSERT': (json) => {
		return new Promise((resolve, reject) => {
			const bucket = buckets_db.findOne({
				_id: json.bucket
			});
			if (!bucket) {
				reject('404 Not Found');
				return;
			}
			if (bucket.token !== json.token) {
				reject('401 Unauthorized');
				return;
			}
			const _id = documents_db.insert({
				bucket: bucket._id,
				document: json.document
			});
			resolve({
				_id: _id
			});
		}).catch((err) => {
			throw new Meteor.Error(err);
		});
	},
	'Documents/UPDATE': (json) => {
		return new Promise((resolve, reject) => {
			const bucket = buckets_db.findOne({
				_id: json.bucket
			});
			if (!bucket) {
				reject('404 Not Found');
				return;
			}
			if (bucket.token !== json.token) {
				reject('401 Unauthorized');
				return;
			}
			documents_db.update({
				bucket: bucket._id,
				_id: json._id
			}, {
				$set: {
					document: json.document
				}
			});
			resolve({
				document: json.document
			});
		});
	},
	'Documents/REMOVE': (json) => {
		return new Promise((resolve, reject) => {
			const bucket = buckets_db.findOne({
				_id: json.bucket
			});
			if (!bucket) {
				reject('404 Not Found');
				return;
			}
			if (bucket.token !== json.token) {
				reject('401 Unauthorized');
				return;
			}
			const document = Object.assign({}, {
				_id: json._id
			}, documents_db.findOne({
				_id: json._id,
				bucket: json.bucket
			}).document);
			documents_db.remove({
				_id: json._id,
				bucket: json.bucket
			});
			resolve({
				document: document
			});
		});
	}
});
