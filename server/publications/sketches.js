import { Meteor } from 'meteor/meteor';
import { sketches_db } from "/shared/collections/sketches";

Meteor.publish('sketches_db', () => {
	// TODO enforce auth
	return sketches_db.find();
});

sketches_db.allow({
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
