import { Meteor } from "meteor/meteor";
import { Random } from 'meteor/random';
import { buckets_db } from "../../shared/collections/buckets";
import { documents_db } from "../../shared/collections/documents";

Meteor.methods({
	'Buckets/CREATE': (json) => {
		return new Promise((resolve, reject) => {
			const key = Random.id();
			const _id = buckets_db.insert({
				meta: json.meta,
				owner: Meteor.userId(),
				token: key
			});
			resolve({
				_id: _id,
				token: key
			});
		});
	},
	'Buckets/DELETE': (json) => {
		return new Promise((resolve, reject) => {
			const bucket = buckets_db.findOne({
				_id: json._id
			});
			if (!bucket) {
				reject('404 Not Found');
			}
			documents_db.remove({
				bucket: bucket._id
			});
			resolve(buckets_db.remove({
				_id: bucket._id
			}));
		}).catch((err) => {
			throw new Meteor.Error(err);
		});
	}
});
