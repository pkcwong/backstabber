import { app } from "../express";
import bodyParser from 'body-parser';
import { sketches_db } from "/shared/collections/sketches";
import { Program } from "/shared/lib/program";

app.get('/api/program/:_id', [], Meteor.bindEnvironment((request, response) => {
	response.writeHead(200, {
		'Content-Type': 'application/json'
	});
	response.end(JSON.stringify(request.params));
}));

app.post('/api/program/:_id', [
	bodyParser.json()
], Meteor.bindEnvironment((request, response, next) => {
	const json = sketches_db.findOne({
		_id: request.params['_id']
	});
	if (json === undefined) {
		response.writeHead(404, {
			'Content-Type': 'application/json'
		});
		response.end();
		return;
	}
	if (!json.tokens.includes(request.header('token'))) {
		response.writeHead(403, {
			'Content-Type': 'application/json'
		});
		response.end();
		return;
	}
	const program = Program.deserialize(json['program']);
	program.execute(request.body).then((result) => {
		sketches_db.update({
			_id: request.params['_id']
		}, {
			$push: {
				logs: {
					timestamp: new Date(),
					token: request.header('token'),
					args: request.body,
					result: result
				}
			}
		});
		response.writeHead(200, {
			'Content-Type': 'application/json'
		});
		response.end(JSON.stringify({
			result: result
		}));
	}).catch((err) => {
		response.writeHead(500, {
			'Content-Type': 'application/json'
		});
		response.end(JSON.stringify({
			error: err
		}));
	});
}));
