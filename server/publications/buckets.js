import { Meteor } from 'meteor/meteor';
import { buckets_db } from "../../shared/collections/buckets";

Meteor.publish('buckets_db', () => {
	return buckets_db.find({
		owner: Meteor.userId()
	});
});

buckets_db.allow({
	insert: (userId, doc) => {
		return false;
	},
	update: (userId, doc, fieldNames, modifier) => {
		return false;
	},
	remove: (userId, doc) => {
		return false;
	}
});
