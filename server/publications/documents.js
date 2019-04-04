import { Meteor } from 'meteor/meteor';
import { documents_db } from "../../shared/collections/documents";

Meteor.publish('documents_db', () => {
	return documents_db.find();
});

documents_db.allow({
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
