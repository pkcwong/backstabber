import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import { buckets_db } from "../../../shared/collections/buckets";
import { Button, Modal, Input, Card } from 'antd';
import 'antd/dist/antd.css';
import lunr from 'lunr';
import { BucketsAction } from "../../redux/actions/buckets-action";

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			buckets_modal: false,
			delete_modal: false,
			delete_id: "",
			search: ""
		}
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
						Data Buckets
					</div>
					<div
						style={
							{
								minHeight: "6%"
							}
						}>
						<Button
							style={
								{}
							}
							size={"large"}
							icon="arrow-left"
							onClick={
								() => {
									FlowRouter.go("/create")
								}
							}>
							Back
						</Button>
						<Button
							style={
								{
									marginLeft: "1vw"
								}
							}
							size={"large"}
							icon="plus"
							onClick={
								() => {
									this.setState({
										buckets_modal: true
									})
								}
							}>
							New Data Bucket
						</Button>
						<Input.Search
							size={'large'}
							style={{
								width: '20%',
								marginLeft: "1vw"
							}}
							placeholder="Databucket Search"
							onChange={(e) => {
								this.setState({
									search: e.target.value
								});
							}}
						/>
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
							flexDirection: "row",
						}
					}>
						{
							(() => {
								const buckets = this.props.Meteor.collection.buckets;
								if (buckets.length === 0) {
									return (
										<div style={
											{
												fontSize: "1.8em",
												fontStyle: "italic",
												opacity: 0.5,
												marginLeft: "auto",
												marginRight: "auto",
												alignSelf: "center",
											}
										}>
											No DataBuckets
										</div>
									);
								} else {
									const idx = ((buckets) => {
										return lunr(function () {
											this.ref('_id');
											this.field('_id');
											this.field('title');
											this.field('description');
											buckets.map((bucket) => {
												return {
													_id: bucket._id,
													title: bucket.meta.title,
													description: bucket.meta.description
												};
											}).forEach((bucket) => {
												this.add(bucket);
											});
										});
									})(buckets);
									return this.props.Meteor.collection.buckets.filter((bucket) => {
										return idx.search(this.state.search).map((search) => {
											return search.ref;
										}).includes(bucket._id);
									}).map((bucket, index) => {
										return (
											<React.Fragment
												key={index}
											>
												<Card
													title={bucket.meta.title}
													bordered={false}
													style={
														{
															margin: "1em",
															width: "30vw",
															border: "none",
														}
													}
													headStyle={
														{
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
																() => {
																	this.setState({
																		delete_id: bucket._id,
																		delete_modal: true
																	})
																}
															}
															icon="delete"
														>
														</Button>
													}>
													{
														<React.Fragment>
															<div>
																<b>Bucket ID:</b>
																<br/>
																{
																	" " + bucket._id
																}
																<br/>
																<br/>
																<b>Token:</b>
																<br/>
																{
																	" " + bucket.token
																}
																<br/>
																<br/>
																<b>Description:</b>
																<br/>
																{
																	(() => {
																		if (bucket.meta.description === "") {
																			return (
																				<div style={
																					{
																						fontStyle: "italic",
																						opacity: 0.3,
																					}
																				}>
																					No description
																				</div>
																			)
																		} else {
																			return (
																				<div style={
																					{
																						wordWrap: "break-word"
																					}
																				}>
																					{
																						bucket.meta.description
																					}
																				</div>
																			);
																		}
																	})()
																}
															</div>
														</React.Fragment>
													}
													<Button
														style={
															{
																float: "right",
																bottom: 0,
																color: "white",
																backgroundColor: "green",
																borderColor: "green"
															}
														}
														onClick={
															() => {
																FlowRouter.redirect("/bucket/"+ bucket._id)
															}
														}
														icon="eye">
														View Database
													</Button>
												</Card>
											</React.Fragment>
										);
									});
								}
							})()
						}
					</div>
					<Modal
						title="Delete Bucket"
						visible={this.state.delete_modal}
						onOk={
							() => {
								this.props.dispatch(BucketsAction.delete(this.state.delete_id));
								this.setState({
									delete_modal: !this.state.delete_modal,
									delete_id: ""
								})
							}
						}
						onCancel={
							() => {
								this.setState({
									delete_modal: !this.state.delete_modal
								})
							}
						}
					>
						<p>Are you sure you want to delete this data bucket?</p>
					</Modal>
					<Modal
						title="Creating Data Bucket"
						visible={this.state.buckets_modal}
						onOk={() => {
							if ($("#name").val() !== '') {
								let meta = {
									title: $("#name").val(),
									description: $("#description").val()
								};
								this.props.dispatch(BucketsAction.create(meta));
								this.setState({
									buckets_modal: !this.state.buckets_modal
								})
							} else {
								alert("Please give your bucket a name!")
							}

						}}
						onCancel={() => {
							this.setState({
								buckets_modal: !this.state.buckets_modal
							})
						}}
					>
						Bucket Name:
						<Input
							style={
								{
									marginBottom: "2vh"
								}
							}
							id='name' size='large' placeholder="data bucket name"/>
						Bucket Description (Optional)
						<Input id='description' size='large' placeholder="description"/>
					</Modal>
				</div>
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
