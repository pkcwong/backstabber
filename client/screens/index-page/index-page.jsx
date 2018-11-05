import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Glyphicon } from 'react-bootstrap';
import { styles } from "./styles";

class Component extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<div style={
					{
						minHeight: "100vh"
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
									{this.props.strings['welcome']}
								</h1>
							</div>
							<div>

							</div>
							<Button bsStyle="success" style={
								{
									marginTop: "2vh",
									height: "5vh"
								}
							} onClick={
								() => {
									FlowRouter.go('/login');
								}
							}>
								{this.props.strings['login_txt']}
							</Button>
						</div>
						<p>
							{this.props.strings['brief']}
						</p>
						<div
							style={styles.hyperlink}
						>
							<a
								href='https://github.com/pkcwong/backstabber'
							>
								{this.props.strings['github'] + '\t'}
								<Glyphicon
									glyph='new-window'
								/>
							</a>
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

export const IndexPage = connect((store) => {
	return {
		logs: store['LoggerReducer']['logs'],
		strings: store['LocaleReducer']['strings']
	};
})(Tracker);
