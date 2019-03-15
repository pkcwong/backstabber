import { Mongo } from 'meteor/mongo';

Buckets = new Mongo.Collection('buckets');

export const buckets_db = Buckets;
