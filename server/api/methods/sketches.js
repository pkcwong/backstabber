import { Meteor } from 'meteor/meteor';
import { sketches_db } from "/shared/collections/sketches";

Meteor.methods({
	'Sketches/CREATE': (json) => {
		return new Promise((resolve, reject) => {
			// TODO enforce auth
			resolve(sketches_db.insert({
				owner: Meteor.userId(),
				meta: {},
				program: json['program'],
				position: json['position'],
				tokens: [],
				logs: []
			}));
		});
	}
});
