import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import { sketches_db } from "/shared/collections/sketches";

Meteor.methods({
	'Sketches/LOAD': (json) => {
		return new Promise((resolve, reject) => {
			resolve(sketches_db.findOne({
				_id: json['_id']
			}));
		});
	},
	'Sketches/CREATE': (json) => {
		return new Promise((resolve, reject) => {
			resolve(sketches_db.insert({
				owner: Meteor.userId(),
				meta: {},
				program: json['program'],
				canvas: json['canvas'],
				tokens: [],
				logs: []
			}));
		});
	},
	'Sketches/UPDATE-PROGRAM': (json) => {
		return new Promise((resolve, reject) => {
			resolve(sketches_db.update({
				_id: json['_id'],
				owner: Meteor.user()
			}, {
				$set: {
					program: json['program'],
					canvas: json['canvas']
				}
			}))
		});
	},
	'Sketches/GENERATE-KEY': (json) => {
		return new Promise((resolve, reject) => {
			const key = Random.id();
			sketches_db.update({
				_id: json['_id'],
				owner: Meteor.user()
			}, {
				$push: {
					tokens: key
				}
			});
			resolve(key);
		});
	},
	'Sketches/REVOKE-KEY': (json) => {
		return new Promise((resolve, reject) => {
			sketches_db.update({
				_id: json['_id'],
				owner: Meteor.userId()
			}, {
				$pull: {
					tokens: json['key']
				}
			});
		});
	}
});
