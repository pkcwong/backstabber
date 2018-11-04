import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { styles } from "../index-page/styles";

class Component extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<div style={
					{
						minHeight: "100vh",
						// background: "#EFE2BA"
					}
				}>
					<div
						style={styles.page}
					>
						<div style={
							{
								display: "flex",
								flexDirection: "row",
							}
						}>
							<div style={
								{
									flexGrow: "1"
								}
							}>
								<h1>
									Login!
								</h1>
							</div>
						</div>
					</div>
				</div>

			</React.Fragment>
		);
	}
}

const Tracker = withTracker(() => {
	Meteor.subscribe('users_db');
	return {
		Meteor: {
			collection: {
				users: Meteor.users.find().fetch()
			},
			user: Meteor.user(),
			userId: Meteor.userId(),
			status: Meteor.status(),
			loggingIn: Meteor.loggingIn()
		}
	};
})(Component);

export const LoginPage = Tracker;
