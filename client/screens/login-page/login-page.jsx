import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Form, FormControl, Checkbox, Button } from 'react-bootstrap';

class Component extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<div style={
					{
					}
				}>
					<h1 style={
						{
							margin: "2%"
						}
					}>
						Login To BackStabber
					</h1>
					<div style={
						{
							marginTop: "8vh",
							alignContent: "center",
							align: "center",
							width: "80vw",
							display: "flex",
							flexDirection: "row",
							paddingLeft: "20vw",
							minHeight: "70vh"
						}
					}>
						<div style={
							{
								flexGrow: "4",
								background: "#ffeaa7",
								fontSize: "300%",
								textAlign: "center",
								paddingTop: "3%"
							}
						}>
							Create Account
						</div>
						<div style={
							{
								flexGrow: "2",
								background: "#03A9F4",
								color: "white",
							}
						}>
							<div style={
								{
									textAlign: "center",
									fontSize: "300%",
									paddingTop: "10%"
								}
							}>
								Login
							</div>
							<div>
								<Form>
									<div style={
										{
											paddingTop: "30%",
											paddingLeft: "8%",
											width: "90%",
											fontSize: "100%"
										}
									}>
										Username:
										<FormControl
											id="username"
											type="text"
											placeholder="Username"
											width="50%"
										/>
									</div>
									<div style={
										{
											paddingTop: "3%",
											paddingLeft: "8%",
											width: "90%"
										}
									}>
										Password:
										<FormControl
											id="password"
											type="text"
											placeholder="Password"
											width="50%"
										/>
									</div>
									<div style={
										{
											paddingTop: "3%",
											paddingLeft: "12%",
											width: "90%"
										}
									}>
										<Checkbox>
											Remember Me
										</Checkbox>
									</div>
									<div style={
										{
											paddingTop: "3%",
											paddingLeft: "18%"
										}
									}>
										<Button
											id="remember me"
											style={
											{
												width: "80%"
											}
										} onClick={
											()=>{
												// Todo: Remember Me function
												Meteor.loginWithPassword($("#username").val(), $("#password").val(), (error)=>{
													if(error){
														alert("Username does not exist or wrong password")
													}
												});
											}
										}>Login</Button>
									</div>

								</Form>
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
