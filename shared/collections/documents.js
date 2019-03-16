import { Mongo } from 'meteor/mongo';

Documents = new Mongo.Collection('documents');

export const documents_db = Documents;
