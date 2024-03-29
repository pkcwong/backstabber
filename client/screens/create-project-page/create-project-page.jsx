import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { sketches_db } from "../../../shared/collections/sketches";
import { Button, Card, Dropdown, Input, Menu, message, Modal, Table } from 'antd';
import lunr from 'lunr';
import 'antd/dist/antd.css';
import { CanvasAction } from "../../redux/actions/canvas-action";

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open_modal: false,
			delete_modal: false,
			setting_modal: false,
			delete: "",
			program_info: {},
			edit_title: null,
			edit_description: null,
			search: ''
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
						<div onClick={
							() => {
								FlowRouter.go('/');
							}
						}>
							<b>B </b> a c k<b> S </b> t a b b e r
						</div>
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
								() => {
									this.props.store.dispatch(CanvasAction.reset());
									FlowRouter.go("/canvas")
								}
							}>
							New Program
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
								() => {
									FlowRouter.go("/buckets")
								}
							}>
							Data Buckets
						</Button>
						<Input.Search
							size={'large'}
							style={{
								width: '20%',
								marginLeft: "1vw"
							}}
							placeholder="Program Search"
							onChange={(e) => {
								this.setState({
									search: e.target.value
								});
							}}
						/>
						<Button
							style={
								{
									float: "right"
								}
							}
							icon="logout"
							size="large"
							onClick={
								() => {
									Meteor.logout();
									FlowRouter.go("/")
								}
							}
						>
							Logout
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
							flexDirection: "row",
							// justifyContent: "center"
						}
					}>
						{
							(() => {
								const sketches = this.props.Meteor.collection.sketches.filter((sketch) => {
									return (sketch.owner === this.props.Meteor.userId);
								});
								if (sketches.length === 0) {
									return (
										<React.Fragment>
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
												No Programs
											</div>
										</React.Fragment>
									);
								} else {
									const idx = ((sketches) => {
										return lunr(function () {
											this.ref('_id');
											this.field('_id');
											this.field('title');
											this.field('description');
											sketches.map((sketch) => {
												return {
													_id: sketch._id,
													title: sketch.meta.title,
													description: sketch.meta.description
												};
											}).forEach((sketch) => {
												this.add(sketch);
											});
										});
									})(sketches);
									return sketches.filter((sketch) => {
										return idx.search(this.state.search).map((search) => {
											return search.ref;
										}).includes(sketch._id);
									}).map((value, index) => {
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
															() => {
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
																() => {
																	this.setState({
																		setting_modal: !this.state.setting_modal,
																		program_info: this.props.Meteor.collection.sketches.find((sketch) => {
																			return (sketch._id === item)
																		}),
																		edit_title: this.props.Meteor.collection.sketches.find((sketch) => {
																			return (sketch._id === item)
																		}).meta.title,
																		edit_description: this.props.Meteor.collection.sketches.find((sketch) => {
																			return (sketch._id === item)
																		}).meta.description
																	})
																}
															}
															icon="setting"
														>
														</Button>
													}
												>
													{
														(() => {
															if (this.props.Meteor.collection.sketches.find((sketch) => {
																return (sketch._id === item);
															}).meta.description === "") {
																return (
																	<div style={
																		{
																			fontStyle: "italic",
																			opacity: 0.3,
																			wordWrap: "break-word"
																		}
																	}>
																		No description
																	</div>
																)
															} else {
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
															() => {
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
									});
								}
							})()
						}
					</div>
				</div>
				{/*Delete Modal*/}
				<Modal
					title="Delete Program"
					visible={this.state.delete_modal}
					onOk={
						() => {
							this.props.store.dispatch(CanvasAction.delete(this.state.delete));
							this.setState({
								delete_modal: !this.state.delete_modal
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
					<p>Are you sure you want to delete this program?</p>
				</Modal>
				{/*Setting Modal*/}
				<Modal
					title="Program Configuration"
					visible={this.state.setting_modal}
					onOk={
						() => {
							let sketch= this.props.Meteor.collection.sketches.find((sketch) => {
								return sketch._id === this.state.program_info._id
							});
							let meta = {
								title: $("#"+this.state.program_info._id+"edit_title").val(),
								description: $("#"+this.state.program_info._id+"edit_description").val()
							};
							this.props.store.dispatch(CanvasAction.updateMeta(sketch._id, meta));
							this.setState({
								setting_modal: !this.state.setting_modal
							})
						}
					}
					onCancel={
						() => {
							this.setState({
								setting_modal: !this.state.setting_modal
							})
						}
					}
				>
					<div>
						{
							<React.Fragment>
								<b>Program Title:</b>
								<br/>
								{
									(() => {
										if(this.state.program_info._id !== undefined){
											return <Input id={this.state.program_info._id+"edit_title"} value={this.state.edit_title} onChange={
												(event) => {
													this.setState({
														edit_title: event.target.value
													})
												}
											}/>
										}
									})()

								}
								<b>Program Description:</b>
								<br/>
								{
									(() => {
										if(this.state.program_info._id !== undefined){
											return <Input id={this.state.program_info._id+"edit_description"} value={this.state.edit_description} onChange={
												(event) => {
													this.setState({
														edit_description: event.target.value
													})
												}
											}/>
										}
									})()
								}
								<b>Program ID:</b>
								<br/>
								{
									this.state.program_info._id
								}
								<br/>
								<br/>
								<b>API URL:</b>
								<br/>
								{window.location.protocol + '//' + window.location.host + '/api/program/' + this.state.program_info._id}
								<br/>
								<br/>
								<b>API Key(s):</b>
								<br/>
								{
									(() => {
										if (this.state.program_info.tokens === undefined) {
											return []
										} else {
											return this.state.program_info.tokens
										}
									})().map((token, index) => {
										return (
											<React.Fragment
												key={index}
											>
												<Dropdown
													overlay={(
														<Menu>
															<Menu.Item
																onClick={() => {
																	((string) => {
																		const e = document.createElement('textarea');
																		e.value = string;
																		document.body.appendChild(e);
																		e.select();
																		document.execCommand('copy');
																		document.body.removeChild(e);
																	})('curl -X POST -H \"Content-Type: application/json\" --header \"token: ' + token + '\" --data ' + JSON.stringify(JSON.stringify({})) + ' ' + window.location.protocol + "//" + window.location.host + '/api/program/' + this.state.program_info._id);
																	message.success('copied cURL command to clipboard');
																}}
															>
																export cURL
															</Menu.Item>
															<Menu.Item
																onClick={() => {
																	((string) => {
																		const e = document.createElement('textarea');
																		e.value = string;
																		document.body.appendChild(e);
																		e.select();
																		document.execCommand('copy');
																		document.body.removeChild(e);
																	})('<script>\n' +
																		'function _' + this.state.program_info._id + '(entry, callback) {\n' +
																		'\t(function(_id, token, entry) {\n' +
																		'\t\tvar HTTP = new XMLHttpRequest();\n' +
																		'\t\tHTTP.open("POST", "' +
																		window.location.protocol + '//' + window.location.host + '/api/program/"' +
																		' + _id);\n' +
																		'\t\tHTTP.setRequestHeader("Content-Type", "application/json");\n' +
																		'\t\tHTTP.setRequestHeader("token", token);\n' +
																		'\t\tHTTP.send(JSON.stringify(entry));\n' +
																		'\t\tHTTP.onreadystatechange = function() {\n' +
																		'\t\t\tif (this.readyState === 4 && this.status === 200) {\n' +
																		'\t\t\t\tcallback(JSON.parse(HTTP.responseText));\n' +
																		'\t\t\t}\n' +
																		'\t\t}\n' +
																		'\t})("' +
																		this.state.program_info._id +
																		'", "' +
																		token +
																		'", entry);\n' +
																		'};\n' +
																		'</script>');
																	message.success('copied HTML5 script to clipboard');
																}}
															>
																export HTML5
															</Menu.Item>
															<Menu.Item
																onClick={() => {
																	((string) => {
																		const e = document.createElement('textarea');
																		e.value = string;
																		document.body.appendChild(e);
																		e.select();
																		document.execCommand('copy');
																		document.body.removeChild(e);
																	})(
																		'public static JSONObject _' + this.state.edit_title.replace(/[^a-zA-Z0-9-_]/g,'') + '(JSONObject json) {\n' +

																		'\treturn Backstabber.spawnConnection(\"' + this.state.program_info._id+ '\", \"' + token + '\").execute(json);\n' +

																		'}'
																	);
																	message.success('copied Java Class to clipboard');
																}}
															>
																export Java Class
														</Menu.Item>
														</Menu>
													)}
												>
													<Button>
														{token}
													</Button>
												</Dropdown>
											</React.Fragment>
										);
									})
								}
								<br/>
								<b>Log(s):</b>
								<br/>
								<Table
									pagination={
										{
											pageSize: 3
										}
									}
									columns={
										[
											{
												title: 'Timestamp',
												dataIndex: 'timestamp',
												key: 'timestamp',
												render: (timestamp) => {
													return new Date(timestamp).toString();
												}
											},
											{
												title: 'Token',
												dataIndex: 'token',
												key: 'token'
											},
											{
												title: 'Result',
												dataIndex: 'result',
												key: 'result',
												render: (result) => {
													return JSON.stringify(result);
												}
											}
										]
									}
									dataSource={
										(() => {
											if (this.state.program_info.logs === undefined) {
												return [];
											} else {
												return this.state.program_info.logs.map((log, index) => {
													return Object.assign({}, log, {
														key: index
													});
												});
											}
										})()
									}
								/>
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
