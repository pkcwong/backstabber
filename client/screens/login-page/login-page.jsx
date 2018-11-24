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
							}
						}>
							<div style={
								{
									textAlign: "center",
									fontSize: "300%",
									paddingTop: "5%"
								}
							}>
								Create Account
							</div>
							<div>

								<Form>
									<div style={
										{
											paddingTop: "10%",
											paddingLeft: "8%",
											width: "40%",
											fontSize: "100%",
										}
									}>
										First Name:
										<FormControl
											id="first_name"
											type="text"
											placeholder="First Name"
										/>
									</div>
									<div style={
										{
											paddingTop: "2%",
											width: "50%",
											paddingLeft: "8%",
											fontSize: "100%",
										}
									}>
										Last Name:
										<FormControl
											id="last_name"
											type="text"
											placeholder="Last Name"
										/>
									</div>
									<div style={
										{
											paddingTop: "2%",
											width: "60%",
											paddingLeft: "8%",
											fontSize: "100%",
										}
									}>
										Username:
										<FormControl
											id="create_user_name"
											type="text"
											placeholder="Create a username"
										/>
									</div>
									<div style={
										{
											paddingTop: "2%",
											width: "80%",
											paddingLeft: "8%",
											fontSize: "100%",
										}
									}>
										Password:
										<FormControl
											id="create_password"
											type="password"
											placeholder="Password"
										/>
									</div>
									<div style={
										{
											paddingLeft: "8%",
											paddingTop: "5%"
										}
									}>
                                        <Button
                                            style={
                                                {

                                                }
                                            } onClick={
                                            ()=>{
                                                // Todo: Create account
                                                var firstName = $('[id=first_name]').val();
                                                var lastName = $('[id=last_name]').val();
                                                var userName = $('[id=create_user_name]').val();
                                                var password = $('[id=create_password]').val();
                                                Accounts.createUser({
                                                    username: userName,
                                                    password: password,
                                                    profile: {
                                                        firstname: firstName,
                                                        lastname: lastName
                                                    }
                                                }, (callback)=>{
                                                });
                                            }
                                        }>Create an Account</Button>
									</div>
								</Form>
							</div>
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
											type="password"
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
										<Checkbox id="rememberme">
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
