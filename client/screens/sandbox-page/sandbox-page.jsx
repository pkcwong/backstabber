import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { CanvasComponent } from "../../components/canvas-component/canvas-component";
import { sketches_db } from "../../../shared/collections/sketches";
import { buckets_db } from "../../../shared/collections/buckets";
import {
	Avatar,
	Menu,
	Dropdown,
	Button,
	Input,
	Drawer,
	List,
	message,
	Modal,
	Progress,
	Radio,
	Icon,
	Spin,
	Tooltip
} from 'antd';
import { CanvasAction } from "../../redux/actions/canvas-action";
import { Program } from "../../../shared/lib/program";
import { JsonEditorComponent } from "../../components/json-editor-component/json-editor-component";
import 'antd/dist/antd.css';

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			// selected_category: Object.keys(this.props.CanvasReducer.nodeTypes).reduce((obj, current) => {
			// 	return Object.assign(obj, {
			// 		[current]: false
			// 	})
			// }, {}),
			// drawer: false,
			// save_modal: false,
			// save_as_modal: false,
			// delete_modal: false,
			// debug_modal: false,
			// create_test_input_modal: false,
			// create_test_result_modal: false,
			// test_input: {},
			// test_result: {},
			program: null,
			// canvas: {},
			// props: {},
			// zoom: 100,
			// offsetX: 0,
			// offsetY: 0,
			// bsNode: {},
			loading: false,
			// // Auto dispatch ID and token for Program Node
			// program_node_modal: false,
			// selected_program_id: null,
			// program_search_id: null,
			// program_node: null,
			// program_coor: {},
			// id_coor: {},
			// token_coor: {},
			// canvas_nodes: null,
			// pending: [],
			// error: null,
			// // Auto dispatch for Database Node
			// database_modal: false,
			// selected_database_id: null,
			// selected_database_token: null,
			// database_node: null,
			// database_coor: {},
			// // Showing the returnNode value
			result: "",
			result_modal: false,
			debug_input: {},
			tests_modal: false,
			tests_programs: {}
		};
	}

	render() {
		return (
			<React.Fragment>
				<JsonEditorComponent
					title="Debug Input"
					document={this.state.debug_input}
					fallbackKeys={[]}
					visible={this.state.debug_modal}
					onOk={
						(json) => {
							this.setState({
								loading: true,
								debug_modal: false,
								debug_input: json
							});
							this.props.dispatch(CanvasAction.deleteLabel());
							const program = new Program(this.props.CanvasReducer.bsNodes);
							this.setState({
								program: program
							});
							this.props.CanvasReducer.bsNodes.forEach((bsNode) => {
								bsNode.callbacks = [];
								bsNode.registerCallback((err, res) => {
									if (err) {
										alert(err.message);
										alert(JSON.stringify(err, undefined, 4));
									}
									bsNode.observers.forEach((observer) => {
										if (err) {
											this.props.dispatch(CanvasAction.addLabel(bsNode, observer.outbound, err));
											return;
										}
										if (typeof bsNode.getOutboundPort(observer.outbound).getter() !== 'undefined') {
											this.props.dispatch(CanvasAction.addLabel(bsNode, observer.outbound, bsNode.getOutboundPort(observer.outbound).getter()));
										}
									});
								});
							});
							try {
								program.execute(json).then((result) => {
									this.setState({
										result: result,
										result_modal: true,
										loading: false
									})
								}).catch((e) => {
									alert(e);
									this.setState({
										loading: false
									});
								})
							} catch (e) {
								alert(e.message);
								this.setState({
									loading: false
								});
							}
						}
					}
					onCancel={
						() => {
							this.setState({
								debug_modal: false,
							});
						}
					}
				/>
				<Modal
					title="Execution Complete"
					visible={this.state.result_modal}
					onOk={
						() => {
							this.setState({
								result_modal: false
							})
						}
					}
					onCancel={
						() => {
							this.setState({
								result_modal: false
							})
						}
					}
				>
					Return Value:
					<Input.TextArea
						cols={4}
						rows={8}
						contentEditable={false}
						value={
							JSON.stringify({
								result: this.state.result
							}, null, 4)
						}
					/>
				</Modal>
				<Modal
					title='Unit Tests'
					visible={this.state.tests_modal}
					onOk={
						() => {
							this.setState({
								tests_modal: false
							});
						}
					}
					onCancel={
						() => {
							this.setState({
								tests_modal: false
							});
						}
					}
				>
					<div>
						<div
							style={
								{
									textAlign: 'center'
								}
							}
						>
							<Progress
								type='dashboard'
								strokeColor='red'
								percent={
									(() => {
										if (Object.keys(this.state.tests_programs).length === 0) {
											return 0;
										}
										return Math.floor((Object.keys(this.state.tests_programs).filter((test) => {
											if (this.state.tests_programs[test].result !== undefined) {
												return true;
											}
											return (Object.keys(this.state.tests_programs[test].status).filter((key) => {
												return (this.state.tests_programs[test].status[key] === 'rejected');
											}).length !== 0);
										}).length / Object.keys(this.state.tests_programs).length * 100));
									})()
								}
								successPercent={
									(() => {
										if (Object.keys(this.state.tests_programs).length === 0) {
											return 0;
										}
										return Math.floor(Object.keys(this.state.tests_programs).filter((test) => {
											return _.isEqual(this.state.tests_programs[test].result, this.props.TutorialReducer.expect[test].return);
										}).length / Object.keys(this.state.tests_programs).length * 100);
									})()
								}
								format={
									() => {
										return (Object.keys(this.state.tests_programs).filter((test) => {
											return _.isEqual(this.state.tests_programs[test].result, this.props.TutorialReducer.expect[test].return);
										}).length + ' / ' + Object.keys(this.state.tests_programs).length + ' passed');
									}
								}
								status={
									(() => {
										if (Object.keys(this.state.tests_programs).length === 0) {
											return 'normal';
										}
										if (Object.keys(this.state.tests_programs).filter((test) => {
											return _.isEqual(this.state.tests_programs[test].result, this.props.TutorialReducer.expect[test].return);
										}).length === Object.keys(this.state.tests_programs).length) {
											return 'success';
										}
										if (Object.keys(this.state.tests_programs).filter((test) => {
											if (this.state.tests_programs[test].result !== undefined) {
												return true;
											}
											return (Object.keys(this.state.tests_programs[test].status).filter((key) => {
												return (this.state.tests_programs[test].status[key] === 'rejected');
											}).length !== 0);
										}).length === Object.keys(this.state.tests_programs).length) {
											return 'exception';
										}
										return 'active';
									})()
								}
							/>
						</div>
						<div
							style={
								{
									textAlign: 'center'
								}
							}
						>
							{
								(() => {
									return (
										<Button
											type='primary'
											onClick={
												() => {
													this.setState({
														tests_programs: this.props.TutorialReducer.expect.map((test, index) => {
															return {
																_id: index,
																...test
															};
														}).reduce((accumulator, test) => {
															const program = Program.deserialize(new Program(this.props.CanvasReducer.bsNodes).serialize());
															program.registerCallback(() => {
																this.forceUpdate();
															});
															program.execute(test.entry).then((result) => {
																this.forceUpdate();
															}).catch((err) => {
																this.forceUpdate();
															});
															accumulator[test._id] = program;
															return accumulator;
														}, {})
													});
												}
											}
										>
											Run all tests
										</Button>
									);
								})()
							}
						</div>
						{
							(() => {
								return (
									<List
										itemLayout='horizontal'
										dataSource={
											this.props.TutorialReducer.expect.map((test, index) => {
												return {
													_id: index,
													...test
												};
											})
										}
										renderItem={
											(item) => {
												return (
													<React.Fragment
														key={item._id}
													>
														<List.Item>
															<div
																style={
																	{
																		display: 'flex',
																		flexDirection: 'column',
																		width: '100%'
																	}
																}
															>
																<div
																	style={
																		{
																			display: 'flex',
																			flexDirection: 'row',
																			textAlign: 'center'
																		}
																	}
																>
																	<div
																		style={
																			{
																				flex: 1,
																				margin: 'auto'
																			}
																		}
																	>
																		{JSON.stringify(item.entry)}
																	</div>
																	<div
																		style={
																			{
																				flex: 1,
																				margin: 'auto'
																			}
																		}
																	>
																		<Icon type="arrow-right"/>
																	</div>
																	<div
																		style={
																			{
																				flex: 1,
																				margin: 'auto'
																			}
																		}
																	>
																		{this.state.tests_programs[item._id] ? JSON.stringify(this.state.tests_programs[item._id].result) : ''}
																	</div>
																	<div
																		style={
																			{
																				flex: 1,
																				margin: 'auto'
																			}
																		}
																	>
																		<Icon type="swap"/>
																	</div>
																	<div
																		style={
																			{
																				flex: 1,
																				margin: 'auto'
																			}
																		}
																	>
																		{JSON.stringify(item.return)}
																	</div>
																</div>
																<div
																	style={
																		{
																			width: '100%',
																			flex: 1
																		}
																	}
																>
																	<Progress
																		percent={
																			(() => {
																				if (this.state.tests_programs[item._id]) {
																					if (Object.keys(this.state.tests_programs[item._id].status).length !== 0) {
																						return (Object.keys(this.state.tests_programs[item._id].status).filter((key) => {
																							return (this.state.tests_programs[item._id].status[key] === 'resolved');
																						}).length / Object.keys(this.state.tests_programs[item._id].status).length * 100);
																					}
																				}
																				return 0;
																			})()
																		}
																		status={
																			(() => {
																				if (this.state.tests_programs[item._id]) {
																					if (Object.keys(this.state.tests_programs[item._id].status).filter((key) => {
																						return (this.state.tests_programs[item._id].status[key] === 'rejected');
																					}).length !== 0) {
																						return 'exception';
																					} else if (this.state.tests_programs[item._id].result !== undefined) {
																						if (_.isEqual(this.state.tests_programs[item._id].result, item.return)) {
																							return 'success';
																						} else {
																							return 'exception';
																						}
																					} else {
																						return 'active';
																					}
																				}
																				return 'normal';
																			})()
																		}
																	/>
																	<Button
																		onClick={
																			() => {
																				const program = Program.deserialize(new Program(this.props.CanvasReducer.bsNodes).serialize());
																				this.setState({
																					tests_programs: Object.assign({}, this.state.tests_programs, {
																						[item._id]: program
																					})
																				});
																				program.registerCallback(() => {
																					this.forceUpdate();
																				});
																				program.execute(item.entry).then((result) => {
																					this.forceUpdate();
																				}).catch((err) => {
																					this.forceUpdate();
																				});
																			}
																		}
																	>
																		{
																			(() => {
																				if (this.state.tests_programs[item._id] === undefined) {
																					return 'Test';
																				} else if (_.isEqual(this.state.tests_programs[item._id].result, item.return)) {
																					return 'Test Passed';
																				} else if (this.state.tests_programs[item._id].result !== undefined) {
																					return 'Test Failed';
																				} else if (Object.keys(this.state.tests_programs[item._id].status).filter((key) => {
																					return (this.state.tests_programs[item._id].status[key] === 'rejected');
																				}).length === 0) {
																					return 'Test Running';
																				} else {
																					return 'Test Failed';
																				}
																			})()
																		}
																	</Button>
																	<Button
																		icon='share-alt'
																		type='primary'
																		onClick={
																			() => {
																				this.setState({
																					debug_modal: true,
																					debug_input: item.entry,
																					tests_modal: false
																				});
																			}
																		}
																	/>
																</div>
															</div>
														</List.Item>
													</React.Fragment>
												)
											}
										}
									/>
								);
							})()
						}
					</div>
				</Modal>
				<div style={
					{
						minHeight: "7vh",
						maxHeight: "7vh",
						background: "#22313F",
						// background: "#3B5B93",
						padding: 0,
						display: 'flex'
					}
				}>
					<div style={
						{
							margin: "auto",
							paddingTop: "1.5vh",
							paddingBottom: "1.5vh",
							paddingLeft: "1vw",
							color: "#ECECEC",
							fontStyle: "italic",
							fontSize: "2vh",
							flex: 1
						}
					}>
						<Button
							style={
								{
									height: "4vh"
								}
							}
							onClick={
								() => {
									FlowRouter.go("/tutorial");
								}
							}>
							<b>B </b> a c k<b> S </b> t a b b e r
						</Button>
					</div>
					<div
						style={
							{
								margin: 'auto',
								paddingTop: "1.5vh",
								paddingBottom: "1.5vh",
								paddingLeft: "1vw",
								color: "#ECECEC",
								fontStyle: "italic",
								fontSize: "2vh",
								flex: 1,
								justifyContent: 'flex-end',
								display: 'flex'
							}
						}
					>
						{
							(() => {
								if (this.state.program !== null) {
									return (
										<Progress
											percent={
												(() => {
													if (this.state.program !== null) {
														if (Object.keys(this.state.program.status).length !== 0) {
															return (Object.keys(this.state.program.status).filter((key) => {
																return (this.state.program.status[key] === 'resolved');
															}).length / Object.keys(this.state.program.status).length * 100);
														}
													}
													return 0;
												})()
											}
											showInfo={false}
											status={
												(() => {
													if (this.state.program !== null) {
														if (Object.keys(this.state.program.status).filter((key) => {
															return (this.state.program.status[key] === 'rejected');
														}).length !== 0) {
															return 'exception';
														} else if (this.state.program.result !== undefined) {
															return 'success';
														} else {
															return 'active';
														}
													}
													return 'normal';
												})()
											}
										/>
									);
								}
							})()
						}
						{
							(() => {
								if (!this.state.loading) {
									return (
										<Button
											style={
												{
													border: 'Node',
													margin: '3px'
												}
											}
											type='primary'
											onClick={() => {
												this.setState({
													debug_modal: true
												});
											}}
										>
											<Icon type="play-circle"/>
											Debug
										</Button>
									);
								} else {
									return (
										<Button
											style={
												{
													border: 'Node',
													margin: '3px'
												}
											}
											type='danger'
											onClick={() => {
												if (this.state.program !== null) {
													this.state.program.halt();
												}
											}}
										>
											<Icon type="close-square"/>
											Halt
										</Button>
									)
								}
							})()
						}
					</div>
					<div
						style={
							{
								width: '1vw'
							}
						}
					/>
				</div>
				<div
					style={{
						display: 'flex'
					}}
				>
					<Spin
						tip="Program executing..."
						spinning={this.state.loading}
						size="large"
						style={
							{
								position: "fixed",
								height: "93vh",
								width: "100vw",
								paddingTop: "45vh",
								zIndex: "3",
								background: "white",
								opacity: "0.8"
							}
						}
					/>
					<CanvasComponent
						store={this.props.store}
						height='93vh'
						width='80vw'
					/>
					<div
						style={{
							height: '93vh',
							width: '20vw',
							padding: '2%',
							background: 'grey'
						}}
					>
						<h2>
							Task: {this.props.TutorialReducer.title}
						</h2>
						<List
							dataSource={this.props.TutorialReducer.tests}
							renderItem={(test) => {
								return (
									<List.Item>
										<List.Item.Meta
											avatar={
												(() => {
													if (test.jest(this.props.CanvasReducer.bsNodes)) {
														return (
															<Avatar
																style={{
																	backgroundColor: 'green'
																}}
																icon='check-circle'
															/>
														);
													} else {
														return (
															<Tooltip
																placement="bottomLeft"
																title={test.hint}
															>
																<Avatar
																	style={{
																		backgroundColor: 'orange'
																	}}
																	icon='info-circle'
																/>
															</Tooltip>
														)
													}
												})()
											}
											title={test.task}
										>
										</List.Item.Meta>
									</List.Item>
								);
							}}
						/>
						<Button
							type='danger'
							disabled={(this.props.TutorialReducer.solution === null)}
							onClick={() => {
								this.props.dispatch(CanvasAction.render(this.props.TutorialReducer.solution));
							}}
						>
							View Solution
						</Button>
						<Button
							type='primary'
							style={{
								float: 'right'
							}}
							onClick={() => {
								this.setState({
									tests_modal: true
								});
							}}
						>
							Verify Program
						</Button>
					</div>
				</div>
			</React.Fragment>
		);
	}

	componentDidMount() {
		if (this.props.TutorialReducer.tests.length === 0) {
			FlowRouter.go('/tutorial');
		}
	}

}

const Tracker = withTracker(() => {
	Meteor.subscribe('sketches_db');
	Meteor.subscribe('buckets_db');
	return {
		Meteor: {
			collection: {
				sketches: sketches_db.find().fetch(),
				buckets: buckets_db.find().fetch()
			},
			user: Meteor.user(),
			userId: Meteor.userId(),
			status: Meteor.status(),
			loggingIn: Meteor.loggingIn()
		}
	};
})(Component);

export const SandboxPage = connect((store) => {
	return {
		CanvasReducer: store['CanvasReducer'],
		TutorialReducer: store['TutorialReducer']
	};
})(Tracker);
