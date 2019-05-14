import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Typography, Card, Carousel, Icon, Button, Modal, Input, Checkbox} from 'antd';
import 'antd/dist/antd.css';
import { styles } from "./styles";

const { Paragraph } = Typography;
const { Text } = Typography;
const { Meta } = Card;

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			login: false,
			account: false,
		};
	}

	render() {
		return (
			<React.Fragment>
				<div style={
					{
						background: "#202124",
						paddingTop: "0.5%",
						paddingBottom: "0.5%",
						paddingLeft: "2%",
						paddingRight: "2%",
					}
				}>
						<div style={
							{
								fontSize: "3em",
								color: "white",
								minHeight: "8%",
							}
						}>
							<b>B </b> a c k<b> S </b> t a b b e r
							<Button
								style={
									{
										float: "right",
										marginTop: "1vh",
										marginRight: "1vw"
									}
								}
								icon="login"
								size="large"
								onClick={
									()=>{
										if(Meteor.userId() === null){
											this.setState(
												{
													login: !this.state.login
												}
											)
										}
										else{
											FlowRouter.go("/create");
										}
									}
								}
							>
								{
									(()=>{
										if(Meteor.user() === null) {
											return "Login";
										}
										else {
											return "Go To App"
										}
									})()
								}

							</Button>

						</div>

				</div>
				<div style={
					{
						paddingTop: "1%",
						paddingRight: "2%",
						paddingLeft: "2%",
						backgroundColor: "rgb(242, 241, 239)",
					}
				}>
					<Text code style={
						{
							fontWeight: "bold",
							fontSize: "1.8em"
						}
					}>Coding through Visualization</Text>
					<Paragraph
						style={
							{
								paddingLeft: "1em",
								fontSize: "1.3em"
							}
						}>
						Our aim is to create a platform for our block-based programming language to help users share
						and deploy their backend code through generated API keys and tokens. Through our experience and
						common coding conventions, we carefully picked and created nodes that we feel would make coding
						more simple without sacrificing any limitation of what conventional coding languages can do.
						We hope that by doing these, would make it easier for users to learn and choose our language.
					</Paragraph>
					<div
						style={
							{
								height: '72vh'
							}
						}
					>
						<div
							style={
								{
									width: '50%',
									float: 'left'
								}
							}
						>
							<Carousel
								autoplay={true}
								autoplaySpeed={7000}
							>
								<div>
									<div
										style={styles.container}
									>
										<div
											style={styles.header}
										>
											<img
												style={styles.image}
												src='/res/img/drag_drop.gif'
											/>
										</div>
										<div
											style={styles.footer}
										>
											Drag, Drop and Connect to write a Program
										</div>
									</div>
								</div>
								<div>
									<div
										style={styles.container}
									>
										<div
											style={styles.header}
										>
											<img
												style={styles.image}
												src='/res/img/props.gif'
											/>
										</div>
										<div
											style={styles.footer}
										>
											Customize an output value
										</div>
									</div>
								</div>
								<div>
									<div
										style={styles.container}
									>
										<div
											style={styles.header}
										>
											<img
												style={styles.image}
												src='/res/img/debugging.gif'
											/>
										</div>
										<div
											style={styles.footer}
										>
											Realtime Execution and Debugging
										</div>
									</div>
								</div>
								<div>
									<div
										style={styles.container}
									>
										<div
											style={styles.header}
										>
											<img
												style={styles.image}
												src='/res/img/unit_test.gif'
											/>
										</div>
										<div
											style={styles.footer}
										>
											Easily writing Test Cases
										</div>
									</div>
								</div>
							</Carousel>
						</div>
						<div
							style={
								{
									width: '50%',
									float: 'right'
								}
							}
						>
							<Text code style={
								{
									fontWeight: "bold",
									fontSize: "1.8em",
								}
							}>Current Supporting Features:</Text>
							<br/>
							<Paragraph
								style={
									{
										paddingLeft: "1em",
										fontSize: "1.3em"
									}
								}>
								<b>1.</b> Drag and Drop <br/>
								<b>2.</b> Program Deployment using APIs<br/>
								<b>3.</b> Real Time Debugging <br/>
								<b>4.</b> Program Sharing <br/>
								<b>5.</b> Program Management System <br/>
								<b>6.</b> Database Management System <br/>
								<b>7. </b>
								<a onClick={() => {
									FlowRouter.go('/tutorial');
								}}>
									Interactive Tutorial
								</a><br/>
							</Paragraph>
						</div>
					</div>
					<br/>
					<br/>
					<Text code style={
						{
							fontWeight: "bold",
							fontSize: "1.8em"
						}
					}>About us:</Text>
					<div style={
						{
							paddingTop: "1em",
							display: "flex",
							flexWrap: "wrap",
							flexDirection: "row",
							paddingBottom: "3vh",
							alignItems: "center"

						}
					}>
						<Card
							hoverable
							style={
								{
									width: "20vw",
									marginRight:"5vw"
								}
							}
							cover={<img alt="Christopher" src="/res/img/Chris.jpg" />}
							actions={
								[
									<Icon
										type="github"
										onClick={
											()=>{
												window.location.href= "https://github.com/pkcwong"
											}
										}/>,
									<Icon type="linkedin"
									      onClick={
										      ()=>{
											      window.location.href= "https://www.linkedin.com/in/pkcwong/"
										      }
									      }/>,
								]
							}
						>
							<Meta
								title={
									<div style={
										{
											textAlign: "center"
										}
									}>
										Christopher PK Wong
									</div>
								}
								description={
									<React.Fragment>
										<div style={
											{
												fontWeight: "bold",
												textAlign: "center"
											}
										}>
											Bachelor's Degree in Computer Science<br/>
											Minor in Robotics & Mathematics<br/>
											@HKUST
										</div>
										<div
											style={
												{
													fontStyle: "italic",
													textAlign: "center"
												}
											}
										>
											<br/>
											"Debugging is twice as hard as coding. If you write the code as cleverly as
											possible, you are, by definition, not smart enough to debug it."
										</div>
									</React.Fragment>
								}
							/>
						</Card>
						<Card
							hoverable
							style={
								{
									width: "20vw",
									marginRight:"5vw"
								}
							}
							actions={
								[
									<Icon
										type="github"
										onClick={
											()=>{
												window.location.href= "https://github.com/cjwku1209"
											}
										}/>,
									<Icon type="linkedin"
									      onClick={
										      ()=>{
											      window.location.href= "https://www.linkedin.com/in/calvin-ku-12-09/"
										      }
									      }/>,
								]
							}
							cover={<img alt="Calvin" src="/res/img/calvin.jpg" />}
						>
							<Meta
								title={
									<div style={
										{
											textAlign: "center",
										}
									}>
										Calvin Ku
									</div>
								}
								description={
									<React.Fragment>
										<div style={
											{
												fontWeight: "bold",
												textAlign: "center"
											}
										}>
											Bachelor's Degree in Computer Science<br/>
											Minor in Robotics<br/>
											@HKUST
										</div>
										<div
											style={
												{
													fontStyle: "italic",
													textAlign: "center"
												}
											}
										>
											<br/>
											"The only one who can tell you "you can't" is you. And you don't have to listen."
										</div>
									</React.Fragment>
								}
							/>
						</Card>
						<Card
							hoverable
							style={
								{
									width: "20vw",
									marginRight:"5vw"
								}
							}
							actions={
								[
									<Icon
										type="github"
										onClick={
											()=>{
												window.location.href= "https://github.com/httpak"
											}
										}/>,
									<Icon type="linkedin"
									      onClick={
										      ()=>{
											      window.location.href= "https://www.linkedin.com/in/timothy-pak-94bab3136/"
										      }
									      }/>,
								]
							}
							cover={<img alt="Timothy" src="/res/img/Timothy.jpg" />}
						>
							<Meta
								title={
									<div style={
										{
											textAlign: "center"
										}
									}>
										Timothy Pak
									</div>
								}
								description={
									<React.Fragment>
										<div style={
											{
												fontWeight: "bold",
												textAlign: "center"
											}
										}>
											Bachelor's Degree in Computer Science<br/>
											Minor in Mathematics<br/>
											@HKUST
										</div>
										<div
											style={
												{
													fontStyle: "italic",
													textAlign: "center"
												}
											}
										>
											<br/>
											"I don't have anything clever to say"
										</div>
									</React.Fragment>
								}
							/>
						</Card>
					</div>
					{/*Login Modal*/}
					<Modal
						title="Login"
						visible={this.state.login}
						onOk={
							()=>{
								Meteor.loginWithPassword($("#username").val(), $("#password").val(), (error)=>{
									if(error){
										alert("Username does not exist or wrong password")
									}
									else{
										FlowRouter.go("/create");
									}
								});
								this.setState({
									login: !this.state.login
								});
							}
						}
						onCancel={()=>{
							this.setState({
								login: !this.state.login
							})
						}}
					>
						<div>
							<Input
								style={
									{
										marginBottom: "1.5vh"
									}
								}
								id='username' size='large' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
							<Input id='password' size='large' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
						</div>
						<div style={
							{
								paddingTop: '4%',
								paddingBottom: "2%"
							}
						}>
							<Checkbox>Remember me</Checkbox>
						</div>
						Or <a onClick={
						()=>{
							this.setState({
								login: !this.state.login,
								account: !this.state.account
							});
						}
					}>register now!</a>
					</Modal>
					{/*Account Modal*/}
					<Modal
						title="Create Account"
						visible={this.state.account}
						onOk={
							()=>{
								Accounts.createUser({
									username: $("#account_username").val(),
									password: $("#account_password").val(),
									profile: {
										firstname: $("#first_name").val(),
										lastname: $("last_name").val()
									}
								},(callback)=>{
									if(callback){
										alert(callback.reason);
									}
									else{
										alert("Account created successfully!");
										FlowRouter.go("/create");
									}
								});
							}
						}
						onCancel={()=>{
							this.setState({
								account: !this.state.account
							})
						}}
					>
						<div>
							First Name:
							<Input
								style={
									{
										marginBottom: "1.5vh"
									}
								}
								id='first_name' size='large' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="First Name" />
							Last Name:
							<Input
								style={
									{
										marginBottom: "1.5vh"
									}
								}
								id='last_name' size='large' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Last Name" />
							Username:
							<Input
								style={
									{
										marginBottom: "1.5vh"
									}
								}
								id='account_username' size='large' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
							Password:
							<Input
								style={
									{
										marginBottom: "1.5vh"
									}
								}
								id='account_password' size='large' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
						</div>
					</Modal>
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
