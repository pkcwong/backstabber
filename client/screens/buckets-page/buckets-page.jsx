import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import { buckets_db } from "../../../shared/collections/buckets";
import { Button } from "react-bootstrap";
import { BucketsAction } from "../../redux/actions/buckets-action";

class Component extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<Button
					bsStyle="success"
					onClick={() => {
						this.props.dispatch(BucketsAction.create());
					}}
				>
					create new data bucket
				</Button>
				{
					this.props.Meteor.collection.buckets.map((bucket, index) => {
						return (
							<React.Fragment
								key={index}
							>
								<p>
									{
										JSON.stringify(bucket)
									}
									<Button
										bsStyle="danger"
										onClick={() => {
											this.props.dispatch(BucketsAction.delete(bucket._id));
										}}
									>
										delete
									</Button>
								</p>
							</React.Fragment>
						);
					})
				}
			</React.Fragment>
		)
	}

}

const Tracker = withTracker(() => {
	Meteor.subscribe('buckets_db');
	return {
		Meteor: {
			collection: {
				buckets: buckets_db.find().fetch()
			},
			user: Meteor.user(),
			userId: Meteor.userId(),
			status: Meteor.status(),
			loggingIn: Meteor.loggingIn()
		}
	}
})(Component);

export const BucketsPage = connect((store) => {
	return {};
})(Tracker);
