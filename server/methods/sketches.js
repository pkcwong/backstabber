import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random'
import { sketches_db } from "/shared/collections/sketches";
import { Program } from "../../shared/lib/program";

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
				meta: json['meta'],
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
				owner: Meteor.userId()
			}, {
				$set: {
					program: json['program'],
					canvas: json['canvas'],
					meta: json['meta']
				}
			}));
		});
	},
	'Sketches/UPDATE-PROGRAM-META': (json) => {
		return new Promise((resolve, reject) => {
			resolve(sketches_db.update({
				_id: json['_id'],
				owner: Meteor.userId()
			}, {
				$set: {
					meta: json['meta']
				}
			}));
		});
	},
	'Sketches/DELETE': (json) => {
		return new Promise((resolve, reject) => {
			resolve(sketches_db.remove({
				_id: json._id,
				owner: Meteor.userId()
			}));
		});
	},
	'Sketches/GENERATE-KEY': (json) => {
		return new Promise((resolve, reject) => {
			const key = Random.id();
			sketches_db.update({
				_id: json['_id'],
				owner: Meteor.userId()
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
	},
	'sketches/EXECUTE': (json) => {
		return new Promise((resolve, reject) => {
			const sketch = sketches_db.findOne({
				_id: json._id
			});
			if (sketch === undefined) {
				reject("404 Not Found");
				return;
			}
			if (!sketch.tokens.includes(json.token)) {
				reject("401 Unauthorized");
				return;
			}
			const program = Program.deserialize(sketch.program);
			program.execute(json.entry).then((result) => {
				sketches_db.update({
					_id: json._id
				}, {
					$push: {
						logs: {
							timestamp: new Date(),
							token: json.token,
							args: json.entry,
							result: result
						}
					}
				});
				resolve(result);
			}).catch((err) => {
				reject(err);
			});
		}).catch((err) => {
			throw new Meteor.Error(err);
		});
	},
	'Sketches/WRITE-TEST': (json) => {
		return new Promise((resolve, reject) => {
			const sketch = sketches_db.findOne({
				_id: json._id
			});
			if (sketch === undefined) {
				reject("404 Not Found");
				return;
			}
			if (sketch.owner !== Meteor.userId()) {
				reject("401 Unauthorized");
				return;
			}
			const test = {
				_id: Random.id(),
				entry: json.entry,
				return: json.return
			};
			sketches_db.update({
				_id: json._id
			}, {
				$push: {
					tests: test
				}
			});
			resolve(test);
		});
	},
	'Sketches/DELETE-TEST': (json) => {
		return new Promise((resolve, reject) => {
			const sketch = sketches_db.findOne({
				_id: json._id
			});
			if (sketch === undefined) {
				reject("404 Not Found");
				return;
			}
			if (sketch.owner !== Meteor.userId()) {
				reject("401 Unauthorized");
				return;
			}
			sketches_db.update({
				_id: json._id
			}, {
				$set: {
					tests: sketch.tests.filter((test) => {
						return (test._id !== json.test);
					})
				}
			});
			resolve(sketch.tests.find((test) => {
				return (test._id === json.test);
			}));
		});
	}
});
