import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { sketches_db } from "../../../shared/collections/sketches";
import { Button, Card, Modal } from 'antd';
import 'antd/dist/antd.css';
import {CanvasAction} from "../../redux/actions/canvas-action";

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open_modal: false,
			delete_modal: false,
			setting_modal: false,
			delete: "",
			program_info: {},
		};
	}

	render() {
		return (
			<React.Fragment>
				<div style={
					{
						background: "#202124",
						height: "100vh",
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
					</div>
					<div
						style={
							{
								minHeight: "6%"
							}
						}>
						<Button
							size={"large"}
							icon="plus"
							onClick={
								()=>{
									this.props.store.dispatch(CanvasAction.reset());
									FlowRouter.go("/canvas")
								}
							}>
							Create New Program
						</Button>
						<Button
							style={
								{
									marginLeft: "1vw"
								}
							}
							size={"large"}
							icon="file-text"
							onClick={
								()=>{
									FlowRouter.go("/buckets")
								}
							}>
							Data Buckets
						</Button>
					</div>
					<div style={
						{
							height: "82%",
							backgroundColor: "#C5C6C7",
							background: "white",
							padding: 0,
							overflowY: 'scroll',
							display: "flex",
							flexWrap: "wrap",
							flexDirection: "row"
							// alignItems: "center",
							// justifyContent: "center"
						}
					}>
						{
							Object.values(this.props.Meteor.collection.sketches.filter(user => user.owner == this.props.Meteor.userId)).map((value, index) =>{
								return (value._id)
							}).map((item, index) => {
								return (
									<React.Fragment key={item}>
										<Card
											style={
												{
													margin: "1em",
													width: "30vw",
													border: "none",
												}
											}
											type="inner"
											title={
												<a onClick={
													()=>{
														const sketch = this.props.Meteor.collection.sketches.find((sketch) => {
															return (sketch._id === item);
														});
														this.props.store.dispatch(CanvasAction.load(sketch._id));
														FlowRouter.go("/canvas")
													}
												}
												style={
													{
														color: "white"
													}
												}>
													{
														this.props.Meteor.collection.sketches.find((sketch) => {
															return (sketch._id === item);
														}).meta.title
													}
												</a>
											}
											headStyle={
												{
													// backgroundColor: "#C5C6C7",
													backgroundColor: '#607D8B',
													color: 'white'
												}
											}
											bodyStyle={
												{
													backgroundColor: "#1F2833",
													color: 'white'
												}
											}
											extra={
												<Button
													onClick={
														()=>{
															this.setState({
																setting_modal: !this.state.setting_modal,
																program_info: this.props.Meteor.collection.sketches.find((sketch) => {
																	return (sketch._id === item)
																})
															})
														}
													}
													icon="setting"
												>
											 	</Button>
											}
										>
											{
												(()=>{
													if(this.props.Meteor.collection.sketches.find((sketch) => {
															return (sketch._id === item);
														}).meta.description === ""){
														return (
															<div style={
																{
																	fontStyle: "italic",
																	opacity: 0.3
																}
															}>
																No description
															</div>
														)
													}
													else{
														return (
															<div>
																{
																	this.props.Meteor.collection.sketches.find((sketch) => {
																		return (sketch._id === item);
																	}).meta.description
																}
															</div>
														)
													}
												})()
											}
										<Button
											style={
												{
													float: "right",
													bottom: 0,
													color: "red",
													borderColor: "red"
												}
											}
											onClick={
												()=>{
													this.setState({
														delete: item,
														delete_modal: true,
													});
												}
											}
											icon="delete">
										</Button>
										</Card>
									</React.Fragment>
								)
							})
						}
					</div>
				</div>
				{/*Delete Modal*/}
				<Modal
					title="Delete Program"
					visible={this.state.delete_modal}
					onOk={
						()=>{
							this.props.store.dispatch(CanvasAction.delete(this.state.delete));
							this.setState({
								delete_modal: !this.state.delete_modal
							})
						}
					}
					onCancel={
						()=>{
							this.setState({
								delete_modal: !this.state.delete_modal
							})
						}
					}
				>
					<p>Are you sure you want to delete this program?</p>
				</Modal>
				{/*Setting Modal*/}
				<Modal
					title="Extra Program Information"
					visible={this.state.setting_modal}
					onOk={
						()=>{
							this.setState({
								setting_modal: !this.state.setting_modal
							})
						}
					}
					onCancel={
						()=>{
							this.setState({
								setting_modal: !this.state.setting_modal
							})
						}
					}
				>
					<div>
						{
							<React.Fragment>
								<b>Program ID:</b>
								<br/>
								{
									this.state.program_info._id
								}
								<br/>
								<br/>
								<b>API URL:</b>
								<br/>
								{window.location.protocol + "//" + window.location.host + '/api/program/'+ this.state.program_info._id}
								<br/>
								<br/>
								<b>API Key(s):</b>
								<br/>
								{
									(()=>{
										if(this.state.program_info.tokens === undefined){
											return []
										}
										else{
											return this.state.program_info.tokens
										}
									})().map((token, index)=>{
										console.log(token);
										return(
											<React.Fragment
												key={index}>
												<div>
													{
														token
													}
												</div>
											</React.Fragment>
										);
									})
								}
								<br/>
								<b>Log(s):</b>
								<br/>
								{
									(()=>{
										if(this.state.program_info.logs === undefined){
											return []
										}
										else{
											return this.state.program_info.logs
										}
									})().map((log, index)=>{
										return(
											<React.Fragment
												key={index}>
												<div>
													{
														log
													}
												</div>
											</React.Fragment>
										);
									})
								}
							</React.Fragment>
						}
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

const Tracker = withTracker(() => {
	Meteor.subscribe('users_db');
	Meteor.subscribe('sketches_db');
	return {
		Meteor: {
			collection: {
				users: Meteor.users.find().fetch(),
				sketches: sketches_db.find().fetch()
			},
			user: Meteor.user(),
			userId: Meteor.userId(),
			status: Meteor.status(),
			loggingIn: Meteor.loggingIn()
		}
	};
})(Component);

export const CreateProjectPage = Tracker;
