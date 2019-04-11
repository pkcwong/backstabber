import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import {
	DiagramWidget,
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DefaultLabelFactory,
	DiagramModel
} from 'storm-react-diagrams';
import { CanvasAction } from "../../redux/actions/canvas-action";
import "./srd.css";
import TrayWidget from './components/TrayWidget';
import TrayItemWidget from './components/TrayItemWidget';
import { sketches_db } from "../../../shared/collections/sketches";
import { Program } from "../../../shared/lib/program";
import { buckets_db } from "../../../shared/collections/buckets";
import { Menu, Dropdown, Button, Input, Drawer, message, Modal, Radio, Icon, Spin } from 'antd';
import 'antd/dist/antd.css';


class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selected_category: Object.keys(this.props.CanvasReducer.nodeTypes).reduce((obj, current) => {
				return Object.assign(obj, {
					[current]: false
				})
			}, {}),
			drawer: false,
			save_modal: false,
			save_as_modal: false,
			delete_modal: false,
			debug_modal: false,
			program: {},
			canvas: {},
			props: {},
			zoom: 100,
			offsetX: 0,
			offsetY: 0,
			bsNode: {},
			loading: false,
			// Auto dispatch ID and token for Program Node
			program_node_modal: false,
			selected_program_id: null,
			selected_program_token: null,
			program_node: null,
			program_coor: {},
			id_coor: {},
			token_coor: {},
			canvas_nodes: null,
			pending: [],
			error: null,
			// Auto dispatch for Database Node
			database_modal: false,
			selected_database_id: null,
			selected_database_token: null,
			database_node: null,
			database_coor: {},
			// Showing the returnNode value
			result: "",
			result_modal: false

		};
		this.engine = new DiagramEngine();
		this.engine.registerNodeFactory(new DefaultNodeFactory());
		this.engine.registerLinkFactory(new DefaultLinkFactory());
		this.engine.registerLabelFactory(new DefaultLabelFactory());
	}

	render() {
		this.engine.setDiagramModel(this.createModel(this.props.CanvasReducer.srdNodes, this.props.CanvasReducer.srdLinks));
		return (
			<React.Fragment>
				<Spin
					tip="Program executing..."
					spinning={this.state.loading}
					size="large"
					style={
						{
							position: "fixed",
							height: "100vh",
							width: "100vw",
							paddingTop: "45vh",
							zIndex: "3",
							background: "white",
							opacity: "0.8"
						}
					}
				/>
				<div style={
					{
						minHeight: "7vh",
						maxHeight: "7vh",
						background: "#22313F",
						// background: "#3B5B93",
						padding: 0,
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
							fontSize: "2vh"
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
									FlowRouter.go("/create");
								}
							}>
							<b>B </b> a c k<b> S </b> t a b b e r
						</Button>
						<Dropdown overlay={
							() => {
								return (
									<Menu style={
										{
											position: "absolute",
											// marightLeft: "1.3vw"
										}
									}>
										<Menu.Item>
											<a onClick={() => {
												this.setState({
													save_modal: true
												})
											}}>
												Save & Generate API
											</a>
										</Menu.Item>
										<Menu.Item>
											<a onClick={() => {
												this.setState({
													save_as_modal: true
												})
											}}>
												Save as
											</a>
										</Menu.Item>
										<Menu.Item>
											<a onClick={() => {
												this.setState({
													delete_modal: true
												})
											}}>
												Delete
											</a>
										</Menu.Item>
										<Menu.Item>
											<a onClick={
												() => {
													(() => {
														const upload = document.createElement('input');
														upload.type = 'file';
														upload.onchange = (e) => {
															const reader = new FileReader();
															reader.onload = (e) => {
																this.props.dispatch(CanvasAction.render(JSON.parse(e.target.result)));
															};
															reader.readAsText(e.target.files[0]);
														};
														upload.click();
													})();
												}
											}>
												Import
											</a>
										</Menu.Item>
										<Menu.Item>
											<a onClick={
												() => {
													const program = new Program(this.props.CanvasReducer.bsNodes);
													let canvas = {};
													this.props.CanvasReducer.bsNodes.map((bsNode) => {
														const srdNode = this.props.CanvasReducer.srdNodes.find((srdNode) => {
															return (this.props.CanvasReducer.lookup[bsNode._id] === srdNode.id)
														});
														canvas = Object.assign({}, canvas, {
															[bsNode._id]: {
																coordinates: {
																	x: srdNode.x,
																	y: srdNode.y
																}
															}
														});
													});
													((uri, filename) => {
														const link = document.createElement('a');
														link.href = uri;
														link.download = filename;
														document.body.appendChild(link);
														link.click();
														document.body.removeChild(link);
													})('data:application/octet-stream;charset=utf-8,' + encodeURIComponent(JSON.stringify({
														program: program.serialize(),
														canvas: canvas
													})), (() => {
														if (this.props.CanvasReducer._id !== null) {
															return this.props.Meteor.collection.sketches.find((sketch) => {
																return sketch._id === this.props.CanvasReducer._id
															}).meta.title + ".bs";
														} else {
															return "export.bs";
														}
													})());
												}
											}>
												Export
											</a>
										</Menu.Item>
									</Menu>
								);
							}
						}
						          placement="bottomCenter">
							<Button
								ghost
								style={
									{
										border: "None",
										marginLeft: "1.3vw",
										// position: "absolute"
									}
								}>
								File
							</Button>
						</Dropdown>
						<Dropdown overlay={
							() => {
								return (
									<Menu>
										<Menu.Item>
											<a onClick={() => {
												this.setState({debug_modal: true});
											}}>Debug</a>
										</Menu.Item>
										<Menu.Item>
											<a onClick={() => {
												this.props.dispatch(CanvasAction.deleteLabel());
											}}
											>Stop</a>
										</Menu.Item>
									</Menu>
								);
							}
						} placement="bottomCenter">
							<Button
								ghost
								style={
									{
										border: "None"
									}
								}>
								Run
							</Button>
						</Dropdown>
						<Button ghost
						        style={
							        {
								        border: "None",
							        }
						        }
						        onClick={
							        () => {
								        alert("Try drag and drop nodes from the selection bar on the right hand side")
							        }
						        }>

							Help
						</Button>
					</div>
				</div>
				<div style={
					{
						height: "93vh",
						display: "flex",
						flexDirection: "row",
						margin: "0",
						padding: "0",
					}
				}>
					<div style={
						{
							width: "12vw",
							background: "#22313F",
							overflowY: 'scroll',
						}
					}>
						{
							Object.keys(this.props.CanvasReducer.nodeTypes).map((category, idx) => {
								return (
									<React.Fragment
										key={idx}
									>
										<div
											style={
												{
													color: this.props.CanvasReducer.colorLookup[category],
													padding: "2vh",
													textAlign: "center",
													borderRadius: "1vh",
													margin: "1vh",
													fontWeight: "bold"
												}
											}
											onClick={
												() => {
													let selected_category = this.state.selected_category;
													selected_category[category] = !this.state.selected_category[category];
													this.setState({
														selected_category: selected_category
													});
												}
											}
										>
											{category}
										</div>
										<TrayWidget>
											{
												(() => {
													if (this.state.selected_category[category]) {
														return Object.keys(this.props.CanvasReducer.nodeTypes[category]).map((node) => {
															return node
														})
													} else {
														return []
													}
												})().map((node, index) => {
													return (
														<React.Fragment
															key={index}
														>
															<TrayItemWidget
																model={{
																	type: node,
																	category: category
																}}
																color={this.props.CanvasReducer.colorLookup[category]}
																name={node}
															/>
														</React.Fragment>
													)
												})
											}
										</TrayWidget>
									</React.Fragment>
								)
							})
						}
					</div>
					<div
						style={
							{
								background: "black",
								width: "88vw",
							}
						}
					>
						<div
							className="diagram-layer"
							onDrop={(event) => {
								this.props.dispatch(CanvasAction.addNode(JSON.parse(event.dataTransfer.getData('storm-diagram-node')).type, this.engine.getRelativeMousePoint(event), 0, 0, (bsNode) => {
									if (JSON.parse(event.dataTransfer.getData('storm-diagram-node')).type === "ProgramNode") {
										this.setState({
											program_node_modal: true,
											selected_program_id: null,
											selected_program_token: null,
											program_node: bsNode,
											program_coor: {
												x: this.engine.getRelativeMousePoint(event).x,
												y: this.engine.getRelativeMousePoint(event).y
											},
											token_coor: {
												x: this.engine.getRelativeMousePoint(event).x - 220,
												y: this.engine.getRelativeMousePoint(event).y + 19
											},
											id_coor: {
												x: this.engine.getRelativeMousePoint(event).x - 120,
												y: this.engine.getRelativeMousePoint(event).y - 4
											}
										})
									} else if (JSON.parse(event.dataTransfer.getData('storm-diagram-node')).type === "DatabaseNode") {
										this.setState({
											database_modal: true,
											selected_database_id: null,
											selected_database_token: null,
											database_node: bsNode,
											database_coor: {
												x: this.engine.getRelativeMousePoint(event).x,
												y: this.engine.getRelativeMousePoint(event).y
											},
											token_coor: {
												x: this.engine.getRelativeMousePoint(event).x - 220,
												y: this.engine.getRelativeMousePoint(event).y + 19
											},
											id_coor: {
												x: this.engine.getRelativeMousePoint(event).x - 120,
												y: this.engine.getRelativeMousePoint(event).y - 4
											}
										})

									}
								}));

							}}
							onDragOver={(event) => {
								event.preventDefault();
							}}
						>
							<DiagramWidget
								allowLooseLinks={false}
								maxNumberPointsPerLink={0}
								diagramEngine={this.engine}
								deleteKeys={[46]}
							/>
						</div>
					</div>
					<Drawer
						title="Set Parameters"
						placement={'bottom'}
						closable={false}
						onClose={() => {
							this.props.dispatch(CanvasAction.drawerStateChange());
						}}
						visible={this.props.CanvasReducer.drawer_modal}
					>
						<div style={
							{
								flex: 1,
								flexDirection: 'row'
							}
						}>
							{
								(() => {
									let bsNode = this.props.CanvasReducer.bsNodes.find((bsNode) => {
										return (bsNode._id === this.props.CanvasReducer.select_id)
									});
									return ((bsNode) => {
										if (bsNode) {
											return Object.keys(bsNode.class.props);
										} else {
											return []
										}
									})(bsNode).map((prop) => {
										return (
											<div
												key={bsNode._id}
												style={
													{
														width: "20vw",
													}
												}
											>
												{prop.charAt(0).toUpperCase() + prop.slice(1) + ": "}
												{
													(() => {
														if (typeof bsNode.class.props[prop] === "boolean") {
															return (
																<Radio.Group
																	style={
																		{
																			marginLeft: "0.5vw"
																		}
																	}
																	onChange={
																		(event) => {
																			this.props.dispatch(CanvasAction.updateProps(prop, event.target.value));
																		}
																	}
																	value={this.props.CanvasReducer.node_props[prop]}>
																	<Radio value={true}>true</Radio>
																	<Radio value={false}>false</Radio>
																</Radio.Group>
															)
														} else {
															return (
																<input
																	id={prop}
																	onChange={
																		(event) => {
																			let value = event.target.value;
																			if (typeof bsNode.class.props[prop] === "number" && !isNaN(Number(value))) {
																				value = Number(value);
																			}
																			this.props.dispatch(CanvasAction.updateProps(prop, value));
																		}
																	}
																	value={(typeof this.props.CanvasReducer.node_props[prop] === 'string') ? this.props.CanvasReducer.node_props[prop] : JSON.stringify(this.props.CanvasReducer.node_props[prop])}
																/>
															);
														}
													})()
												}
												{
													(() => {
														if (this.props.CanvasReducer.node_props[prop] === bsNode.props[prop]) {
															return (
																<Icon
																	style={
																		{
																			color: "green",
																			marginLeft: "0.2vw"
																		}
																	}
																	type="check-circle"/>
															);
														} else {
															return (
																<Icon
																	style={
																		{
																			color: "red",
																			marginLeft: "0.2vw"
																		}
																	}
																	type="edit"/>

															);
														}
													})()
												}
											</div>
										);
									});
								})()
							}
							<Button
								type="primary"
								style={
									{
										float: "right"
									}
								}
								onClick={
									() => {
										if (Object.keys(this.props.CanvasReducer.node_props)[0] === 'array' &&
											Object.keys(this.props.CanvasReducer.node_props).length === 1 &&
											typeof this.props.CanvasReducer.node_props["array"] !== "object"
										) {
											this.props.CanvasReducer.node_props["array"] = JSON.parse(this.props.CanvasReducer.node_props["array"]);
										}
										let bsNode = this.props.CanvasReducer.bsNodes.find((bsNode) => {
											return (bsNode._id === this.props.CanvasReducer.select_id)
										});
										try {
											bsNode.setProps(this.props.CanvasReducer.node_props)
										} catch (e) {
											alert("Parameter Error");
										}
										this.props.dispatch(CanvasAction.drawerStateChange());
									}
								}
							>
								Submit
							</Button>
						</div>
					</Drawer>
					{/*Debug Modal*/}
					<Modal
						title="Debug Input"
						visible={this.state.debug_modal}
						onOk={
							() => {
								this.setState({
									loading: true,
									debug_modal: false,
								});
								this.props.dispatch(CanvasAction.deleteLabel());
								const program = new Program(this.props.CanvasReducer.bsNodes);
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
									program.execute(JSON.parse($("#user_input").val())).then((result) => {
										this.setState({
											result: result,
											result_modal: true,
											loading: false
										})
									}).catch(() => {
										alert("Program takes too long to run");
										this.setState({
											loading: false
										})
									})
								} catch (e) {
									alert(e.message);
									this.setState({
										loading: false
									})
								}

							}
						}
						onCancel={
							() => {
								this.setState({
									debug_modal: false,
								})
							}
						}
					>
					<textarea
						style={
							{
								width: '100%',
								resize: 'vertical'
							}
						}
						id="user_input"
						rows="10"
						defaultValue="{}"
					/>
					</Modal>
					{/*Save & Generate API Modal*/}
					<Modal
						title="Program"
						visible={this.state.save_modal}
						onOk={() => {
							const _id = this.props.CanvasReducer._id;
							const program = new Program(this.props.CanvasReducer.bsNodes);
							let canvas = {};
							this.props.CanvasReducer.bsNodes.map((bsNode) => {
								const srdNode = this.props.CanvasReducer.srdNodes.find((srdNode) => {
									return (this.props.CanvasReducer.lookup[bsNode._id] === srdNode.id)
								});
								canvas = Object.assign({}, canvas, {
									[bsNode._id]: {
										coordinates: {
											x: srdNode.x,
											y: srdNode.y
										}
									}
								});
							});
							let meta = {
								title: $("#program_name").val(),
								description: $("#program_description").val()
							};
							if (_id === null) {
								this.props.dispatch(CanvasAction.create(program, canvas, meta));
							} else {
								this.props.dispatch(CanvasAction.update(_id, program, canvas, meta));
							}
							this.setState({
								save_modal: false
							})
						}}
						onCancel={() => {
							this.setState({
								save_modal: false
							})
						}}
					>
						{
							(() => {
								return (
									<div style={
										{
											fontSize: "1.5vh"
										}
									}>
										<b>Program Name:</b>
										<br/>
										{
											(() => {
												if (this.props.CanvasReducer._id === null) {
													return (<Input id={"program_name"}/>);
												} else {
													let sketch = this.props.Meteor.collection.sketches.find((sketch) => {
														return sketch._id === this.props.CanvasReducer._id
													});
													return (
														<Input id={"program_name"} placeholder={sketch.meta.title}/>);
												}
											})()

										}
										<br/>
										<br/>
										<b>Description (optional):</b>
										<br/>
										{
											(() => {
												if (this.props.CanvasReducer._id === null) {
													return (<Input id={"program_description"}/>);
												} else {
													let sketch = this.props.Meteor.collection.sketches.find((sketch) => {
														return sketch._id === this.props.CanvasReducer._id
													});
													return (<Input id={"program_description"}
													               placeholder={sketch.meta.description}/>);
												}
											})()

										}
										{
											(() => {
												const sketch = this.props.Meteor.collection.sketches.find((sketch) => {
													return (sketch._id === this.props.CanvasReducer._id);
												});
												if (sketch !== undefined) {
													return (
														<React.Fragment>
															<br/>
															<br/>
															<b>API URL:</b>
															<br/>
															{window.location.protocol + "//" + window.location.host + '/api/program/' + this.props.CanvasReducer._id}
															<br/>
															<br/>
															<div style={
																{
																	marginBottom: "1vh"
																}
															}>
																<b>API Key(s):</b>
																<Button
																	style={
																		{
																			marginLeft: "1vw"
																		}
																	}
																	onClick={() => {
																		this.props.dispatch(CanvasAction.generateApiKey(this.props.CanvasReducer._id));
																		this.setState({
																			save_modal: true
																		});
																	}}>
																	Generate API Key
																</Button>
															</div>
														</React.Fragment>
													)
												} else {
													return (
														<div>
															**Note: save first to obtain API key and URL.
														</div>
													)
												}
											})()
										}
										{
											(() => {
												const sketch = this.props.Meteor.collection.sketches.find((sketch) => {
													return (sketch._id === this.props.CanvasReducer._id);
												});
												if (sketch === undefined) {
													return [];
												}
												return sketch.tokens
											})().map((item, index) => {
												return (
													<React.Fragment
														key={index}
													>
														<p>
															{item}
															<Button
																size={"small"}
																style={
																	{
																		marginLeft: "2vw"
																	}
																}
																onClick={() => {
																	this.props.dispatch(CanvasAction.revokeApiKey(this.props.CanvasReducer._id, item));
																}}
															>
																Revoke
															</Button>
														</p>
													</React.Fragment>
												);
											})
										}
									</div>
								);
							})()
						}
					</Modal>
					{/*Save As Modal*/}
					<Modal
						title="Program"
						visible={this.state.save_as_modal}
						onOk={() => {
							const _id = null;
							const program = new Program(this.props.CanvasReducer.bsNodes);
							let canvas = {};
							this.props.CanvasReducer.bsNodes.map((bsNode) => {
								const srdNode = this.props.CanvasReducer.srdNodes.find((srdNode) => {
									return (this.props.CanvasReducer.lookup[bsNode._id] === srdNode.id)
								});
								canvas = Object.assign({}, canvas, {
									[bsNode._id]: {
										coordinates: {
											x: srdNode.x,
											y: srdNode.y
										}
									}
								});
							});
							if (_id === null) {
								let meta = {
									title: $("#program_name").val(),
									description: $("#program_description").val()
								};
								this.props.dispatch(CanvasAction.create(program, canvas, meta));
							}
							this.setState({
								save_as_modal: false
							})
						}}
						onCancel={() => {
							this.setState({
								save_as_modal: false
							})
						}}
					>
						{
							(() => {
								return (
									<div style={
										{
											fontSize: "1.5vh"
										}
									}>
										<b>Program Name:</b>
										<br/>
										{
											(() => {
												return (<Input id={"program_name"}/>);
											})()
										}
										<br/>
										<br/>
										<b>Description (optional):</b>
										<br/>
										{
											(() => {
												return (<Input id={"program_description"}/>);
											})()
										}
									</div>
								);
							})()
						}
					</Modal>
					{/*Delete Modal*/}
					<Modal
						title="Delete Program"
						visible={this.state.delete_modal}
						onOk={
							() => {
								if (this.props.CanvasReducer._id !== null) {
									this.props.store.dispatch(CanvasAction.delete(this.props.CanvasReducer._id));
								}
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
					{/*Program Node Modal*/}
					<Modal
						title="Program Node Initialization Helper"
						visible={this.state.program_node_modal}
						onOk={() => {
							if (this.state.selected_program_id !== null && this.state.selected_program_token !== null) {
								this.setState({
									program_node_modal: !this.state.program_node_modal
								})
								this.props.dispatch(CanvasAction.addNode("StringNode", this.state.id_coor, 0, 0, (bsNode) => {
									bsNode.setProps({
										string: this.state.selected_program_id
									});
									let temp = this.state.pending;
									temp.push(CanvasAction.addLink(bsNode._id, "string", this.state.program_node._id, "_id"))
									this.setState({
										pending: temp
									})
								}));
								this.props.dispatch(CanvasAction.addNode("StringNode", this.state.token_coor, 0, 0, (bsNode) => {
									bsNode.setProps({
										string: this.state.selected_program_token
									});
									let temp = this.state.pending;
									temp.push(CanvasAction.addLink(bsNode._id, "string", this.state.program_node._id, "token"))
									this.setState({
										pending: temp
									})
								}));
							} else if ($("#program_id").val() !== undefined && $("#program_token").val() !== "") {
								let input_id = $("#program_id").val();
								let input_token = $("#program_token").val();
								this.setState({
									program_node_modal: !this.state.program_node_modal
								});
								this.props.dispatch(CanvasAction.addNode("StringNode", this.state.id_coor, 0, 0, (bsNode) => {
									bsNode.setProps({
										string: input_id
									});
									let temp = this.state.pending;
									temp.push(CanvasAction.addLink(bsNode._id, "string", this.state.program_node._id, "_id"))
									this.setState({
										pending: temp
									})
								}));
								this.props.dispatch(CanvasAction.addNode("StringNode", this.state.token_coor, 0, 0, (bsNode) => {
									bsNode.setProps({
										string: input_token
									});
									let temp = this.state.pending;
									temp.push(CanvasAction.addLink(bsNode._id, "string", this.state.program_node._id, "token"))
									this.setState({
										pending: temp
									})
								}));
							} else {
								this.setState({
									error: "Please input program ID and token",
									error_modal: true
								})
							}
						}}
						onCancel={() => {
							this.setState({
								program_node_modal: !this.state.program_node_modal
							})
						}}
					>
						<b>Program ID:</b>
						<br/>
						<div style={
							{
								display: "flex",
								flexWrap: "wrap",
								flexDirection: "row"
							}
						}>
							<Input
								id="program_id"
								style={
									{
										width: "47%"
									}
								}/>
							<div style={
								{
									width: "6%",
									textAlign: "center",
									fontWeight: "bold",
									paddingTop: "1%"
								}
							}>
								or
							</div>
							<select
								style={
									{
										width: "47%"
									}
								}
								id="program_select_id" title={"Program ID"} defaultValue="default" onChange={(e) => {
								this.setState({
									selected_program_id: e.target.value,
									selected_program_token: null
								});
							}}>
								{(() => {
									if (this.state.selected_program_id === null) {
										return (
											<option value="default">
												Program IDs
											</option>
										)
									}
								})()}
								{Object.values(this.props.Meteor.collection.sketches.filter(sketch => sketch.owner === this.props.Meteor.userId && sketch._id !== this.props.CanvasReducer._id)).map((sketch, index) => {
									return (sketch._id);
								}).map((item, index) => {
									return (
										<React.Fragment key={item}>
											<option value={item}>
												{this.props.Meteor.collection.sketches.find((sketch) => {
													return (sketch._id === item);
												}).meta.title}
											</option>
										</React.Fragment>
									)
								})}
							</select>
						</div>
						<br/>
						<b>Program token:</b>
						<div style={
							{
								display: "flex",
								flexWrap: "wrap",
								flexDirection: "row"
							}
						}>
							<Input
								id="program_token"
								style={
									{
										width: "47%"
									}
								}/>
							<div style={
								{
									width: "6%",
									textAlign: "center",
									fontWeight: "bold",
									paddingTop: "1%"
								}
							}>
								or
							</div>
							<select
								style={
									{
										width: "47%"
									}
								}
								id="program_select_token" title={"Program token"} defaultValue="default"
								onChange={(e) => {
									this.setState({
										selected_program_token: e.target.value
									});
								}}>
								{(() => {
									if (this.state.selected_program_token === null) {
										return (
											<option value="default">
												Token(s)
											</option>
										)
									}
								})()}
								{
									(() => {
										const sketch = this.props.Meteor.collection.sketches.find((sketch) => {
											return (sketch._id === this.state.selected_program_id);
										});
										if (sketch) {
											return sketch.tokens.map((token) => {
												return (
													<React.Fragment key={token}>
														<option value={token}>
															{token}
														</option>
													</React.Fragment>
												);
											})
										}
									})()
								}
							</select>
						</div>
					</Modal>
					{/*Modal for Database Node*/}
					<Modal
						title="Database Node Initialization Helper"
						visible={this.state.database_modal}
						onOk={() => {
							if (this.state.selected_database_id !== null && this.state.selected_database_token !== null) {
								this.setState({
									database_modal: false
								})
								this.props.dispatch(CanvasAction.addNode("StringNode", this.state.id_coor, 0, 0, (bsNode) => {
									bsNode.setProps({
										string: this.state.selected_database_id
									});
									let temp = this.state.pending;
									temp.push(CanvasAction.addLink(bsNode._id, "string", this.state.database_node._id, "_id"))
									this.setState({
										pending: temp
									})
								}));
								this.props.dispatch(CanvasAction.addNode("StringNode", this.state.token_coor, 0, 0, (bsNode) => {
									bsNode.setProps({
										string: this.state.selected_database_token
									});
									let temp = this.state.pending;
									temp.push(CanvasAction.addLink(bsNode._id, "string", this.state.database_node._id, "token"))
									this.setState({
										pending: temp
									})
								}));
							} else if ($("#database_id").val() !== undefined && $("#database_token").val() !== "") {
								let input_id = $("#database_id").val();
								let input_token = $("#database_token").val();
								this.setState({
									database_modal: false
								})
								this.props.dispatch(CanvasAction.addNode("StringNode", this.state.id_coor, 0, 0, (bsNode) => {
									bsNode.setProps({
										string: input_id
									});
									let temp = this.state.pending;
									temp.push(CanvasAction.addLink(bsNode._id, "string", this.state.database_node._id, "_id"))
									this.setState({
										pending: temp
									})
								}));
								this.props.dispatch(CanvasAction.addNode("StringNode", this.state.token_coor, 0, 0, (bsNode) => {
									bsNode.setProps({
										string: input_token
									});
									let temp = this.state.pending;
									temp.push(CanvasAction.addLink(bsNode._id, "string", this.state.database_node._id, "token"))
									this.setState({
										pending: temp
									})
								}));
							} else {
								this.setState({
									error: "Please input database ID and token",
									error_modal: true
								})
							}
						}}
						onCancel={
							() => {
								this.setState({
									database_modal: !this.state.database_modal
								})
							}
						}

					>
						<b>Database ID:</b>
						<br/>
						<div style={
							{
								display: "flex",
								flexWrap: "wrap",
								flexDirection: "row"
							}
						}>
							<Input
								id="database_id"
								style={
									{
										width: "47%"
									}
								}/>
							<div style={
								{
									width: "6%",
									textAlign: "center",
									fontWeight: "bold",
									paddingTop: "1%"
								}
							}>
								or
							</div>
							<select style={
								{
									width: "47%"
								}
							} id="database_select_id" title={"Database ID"} defaultValue="default" onChange={(e) => {
								this.setState({
									selected_database_id: e.target.value,
									selected_database_token: null
								});
							}}>
								{(() => {
									if (this.state.selected_database_id === null) {
										return (
											<option value="default">
												Database ID
											</option>
										)
									}
								})()}
								{Object.values(this.props.Meteor.collection.buckets.filter(bucket => bucket.owner === this.props.Meteor.userId && bucket._id !== this.props.CanvasReducer._id)).map((bucket, index) => {
									return (bucket._id);
								}).map((item, index) => {
									//TODO rename title when database has name
									return (
										<React.Fragment key={item}>
											<option value={item}>
												{this.props.Meteor.collection.buckets.find((bucket) => {
													return (bucket._id === item);
												}).meta.title}
											</option>
										</React.Fragment>
									)
								})}
							</select>
						</div>
						<br/>
						<b>Database token:</b>
						<div style={
							{
								display: "flex",
								flexWrap: "wrap",
								flexDirection: "row"
							}
						}>
							<Input
								id="database_token"
								style={
									{
										width: "47%"
									}
								}/>
							<div style={
								{
									width: "6%",
									textAlign: "center",
									fontWeight: "bold",
									paddingTop: "1%"
								}
							}>
								or
							</div>
							<select
								style={
									{
										width: "47%"
									}
								}
								id="database_select_token" title={"Database token"} defaultValue="default"
								onChange={(e) => {
									this.setState({
										selected_database_token: e.target.value
									});
								}}>
								{(() => {
									if (this.state.selected_database_token === null) {
										return (
											<option value="default">
												Please select your database token
											</option>
										)
									}
								})()}
								{
									(() => {
										const bucket = this.props.Meteor.collection.buckets.find((bucket) => {
											return (bucket._id === this.state.selected_database_id);
										});
										if (bucket) {
											return (
												<React.Fragment key={bucket.token}>
													<option value={bucket.token}>
														{bucket.token}
													</option>
												</React.Fragment>
											)
										}
									})()
								}
							</select>
						</div>
					</Modal>
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
						{
							(() => {
								return (
									<React.Fragment>
										Return Value:
										<Input.TextArea
											cols={4}
											rows={8}
											contentEditable={false}
											value={JSON.stringify({
												result: this.state.result
											}, null, 4)}
										/>
										{
											(() => {
												if (this.props.CanvasReducer._id !== null) {
													return (
														<Dropdown
															overlay={
																<React.Fragment>
																	<Menu>
																		{
																			this.props.Meteor.collection.sketches.find((sketch) => {
																				return (sketch._id === this.props.CanvasReducer._id);
																			}).tokens.map((token) => {
																				return (
																					<Menu.Item
																						key={token}
																						onClick={() => {
																							((string) => {
																								const e = document.createElement('textarea');
																								e.value = string;
																								document.body.appendChild(e);
																								e.select();
																								document.execCommand('copy');
																								document.body.removeChild(e);
																							})('curl -X POST -H \"Content-Type: application/json\" --header \"token: ' + token + '\" --data ' + JSON.stringify(JSON.stringify(JSON.parse($("#user_input").val()))) + ' ' + window.location.protocol + "//" + window.location.host + '/api/program/' + this.props.CanvasReducer._id);
																							message.success('copied CURL command to clipboard');
																						}}
																					>
																						<Icon
																							type='key'
																						/>
																						{token}
																					</Menu.Item>
																				);
																			})
																		}
																	</Menu>
																</React.Fragment>
															}
														>
															<Button>
																Export cURL command
															</Button>
														</Dropdown>
													);
												}
											})()
										}
									</React.Fragment>
								);
							})()

						}
					</Modal>
				</div>
			</React.Fragment>);
	}

	componentDidMount() {
		this.props.dispatch(CanvasAction.init(this.props.dispatch));
		this.engine.zoomToFit();
	}

	componentDidUpdate(prevProps) {
		this.engine.diagramModel.setZoomLevel(this.state.zoom);
		this.engine.diagramModel.setOffset(this.state.offsetX, this.state.offsetY);
		if (this.state.pending.length !== 0) {
			this.props.dispatch(this.state.pending.splice(0, 1)[0]);
		}
	}

	/**
	 * Creates a model graph
	 * @param nodes
	 * @param links
	 * @returns {DiagramModel}
	 */
	createModel = (nodes, links) => {
		let model = new DiagramModel();
		nodes.forEach((node) => {
			model.addNode(node);
		});
		links.forEach((item) => {
			model.addLink(item);
		});
		model.setGridSize(0);
		model.clearListeners();
		model.addListener({
			linksUpdated: ({link}) => {
				link.addListener({
					targetPortChanged: () => {
						const ports = [
							link.sourcePort,
							link.targetPort
						];
						const sourcePort = ports.find((item) => {
							return (item.in === false);
						});
						const targetPort = ports.find((item) => {
							return (item.in === true);
						});
						if (sourcePort === undefined || targetPort === undefined) {
							return;
						}
						const bsNodeSource = this.props.CanvasReducer.bsNodes.find((bsNode) => {
							return (bsNode._id === Object.keys(this.props.CanvasReducer.lookup).find((key) => {
								return (this.props.CanvasReducer.lookup[key] === sourcePort.parent.id);
							}));
						});
						const bsNodeTarget = this.props.CanvasReducer.bsNodes.find((bsNode) => {
							return (bsNode._id === Object.keys(this.props.CanvasReducer.lookup).find((key) => {
								return (this.props.CanvasReducer.lookup[key] === targetPort.parent.id);
							}));
						});
						this.props.dispatch(CanvasAction.addLink(bsNodeSource._id, sourcePort.name, bsNodeTarget._id, targetPort.name));
					}
				});
			},
			zoomUpdated: (event) => {
				if (event.zoom !== this.state.zoom) {
					this.setState({
						zoom: event.zoom
					});
				}
			},
			offsetUpdated: (event) => {
				if (event.offsetX !== this.state.offsetX || event.offsetY !== this.state.offsetY) {
					this.setState({
						offsetX: event.offsetX,
						offsetY: event.offsetY
					});
				}
			}
		});
		return model;
	};

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

export const CanvasPage = connect((store) => {
	return {
		CanvasReducer: store['CanvasReducer']
	};
})(Tracker);
