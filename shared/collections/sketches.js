import { Mongo } from 'meteor/mongo';

Sketches = new Mongo.Collection('sketches');

export const sketches_db = Sketches;
