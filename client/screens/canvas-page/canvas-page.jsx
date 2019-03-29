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
import { Menu, Dropdown, Button, Input, Drawer, Modal, Radio, Icon} from 'antd';
import 'antd/dist/antd.css';


class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selected_category: Object.keys(this.props.CanvasReducer.nodeTypes).reduce((obj, current)=>{
				return Object.assign(obj, {
					[current]: false
				})
			}, {}),
			drawer: false,
			save_modal: false,
			debug_modal: false,
			program: {},
			canvas: {},
			props: {},
			error: "",
			zoom: 100,
			offsetX: 0,
			offsetY: 0,
			bsNode:{}
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
			<div style={
				{
					minHeight: "7vh",
					background: "#22313F",
					// background: "#3B5B93",
					padding: 0,
				}
			}>
				<div style={
					{
						margin:"auto",
						paddingTop: "1.5vh",
						paddingBottom: "1.5vh",
						paddingLeft: "1vw",
						color: "#ECECEC",
						fontStyle: "italic",
						fontSize: "2vh"
					}
				}>
					<Button
						size="large"
						onClick={
						()=>{
							FlowRouter.go("/create");
						}
					}>
						<b>B </b> a c k<b> S </b> t a b b e r
					</Button>
					{/*<Input*/}
						{/*id={"program_name"}*/}
						{/*size = {"large"}*/}
						{/*style = {*/}
							{/*{*/}
								{/*width: "25vw",*/}
								{/*marginLeft: "1.5%",*/}
								{/*height: "4vh"*/}
							{/*}*/}
						{/*}*/}
						{/*placeholder={*/}
							{/*(()=>{*/}
								{/*if(this.props.Meteor.collection.sketches.find((sketch) => {*/}
										{/*return sketch._id === this.props.CanvasReducer._id*/}
									{/*})){*/}
									{/*return this.props.Meteor.collection.sketches.find((sketch) => {*/}
										{/*return sketch._id === this.props.CanvasReducer._id*/}
									{/*});*/}
								{/*}*/}
								{/*else{*/}
									{/*return "Untitled"*/}
								{/*}*/}
							{/*})()*/}
						{/*}*/}
					{/*/>*/}
					{/*<Button*/}
						{/*ghost*/}
						{/*onClick={*/}
							{/*()=>{*/}
								{/*FlowRouter.go("/create");*/}
							{/*}*/}
						{/*}*/}
						{/*style={*/}
							{/*{*/}
								{/*border: "None",*/}
								{/*marginLeft: "2vw"*/}
							{/*}*/}
						{/*}>*/}
							{/*Home*/}
					{/*</Button>*/}
					<Dropdown overlay={
						()=>{
							return(
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
											Save
										</a>
									</Menu.Item>
									<Menu.Item>
										<a>
											Save as
										</a>
									</Menu.Item>
									<Menu.Item>
										<a onClick={()=>{console.log("Delete")}}>Delete</a>
									</Menu.Item>
									<Menu.Item>
										<a onClick={()=> {
											this.props.dispatch(CanvasAction.generateApiKey(this.props.CanvasReducer._id));
											this.setState({
												save_modal: true
											});
										}}>Generate API</a>
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
												})), 'export.bs');
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
						()=>{
							return(
								<Menu>
									<Menu.Item>
										<a onClick={()=>{
											this.setState({debug_modal:true});
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
						    ()=>{
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
											()=>{
												let selected_category = this.state.selected_category;
												selected_category[category]= !this.state.selected_category[category];
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
											(()=>{
												if(this.state.selected_category[category]){
													return Object.keys(this.props.CanvasReducer.nodeTypes[category]).map((node)=>{
														return node
													})
												}
												else{
													return []
												}
											})().map((node, index)=>{
												return (
													<React.Fragment
														key={index}
													>
														<TrayItemWidget
															model={{
																type: node,
																category: category
															}}
															color= {this.props.CanvasReducer.colorLookup[category]}
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
							this.props.dispatch(CanvasAction.addNode(JSON.parse(event.dataTransfer.getData('storm-diagram-node')).type, this.engine.getRelativeMousePoint(event)));
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
					onClose={()=>{
						this.setState({
							drawer: false
						});
					}}
					visible={this.state.drawer}
				>
					<div style={
						{
							flex: 1,
							flexDirection: 'row'
						}
					}>
						{
							(()=>{
								let bsNode = this.props.CanvasReducer.bsNodes.find((bsNode) => {
									return (bsNode._id === this.props.CanvasReducer.select_id)
								});
								return ((bsNode) => {
									if(bsNode){
										return Object.keys(bsNode.props);
									}
									else{
										return []
									}
								})(bsNode).map((prop) => {
									return (
										<React.Fragment
											key={bsNode._id}
										>
											<div style={
												{
													width: "20vw",
												}
											}>
												{prop.charAt(0).toUpperCase() + prop.slice(1) + ": "}
												{
													(()=>{
														if(typeof bsNode.class.props[prop] === "boolean"){
															return(
																<Radio.Group
																	style={
																		{
																			marginLeft: "0.5vw"
																		}
																	}
																	onChange={
																		(event)=>{
																			this.setState({
																				props: Object.assign({}, this.state.props, {
																					[prop]: event.target.value
																				})
																			})
																		}
																	}
																	value={this.state.props[prop]}>
																	<Radio value={true}>true</Radio>
																	<Radio value={false}>false</Radio>
																</Radio.Group>
															)
														}
														else{
															return(
																	<input
																		id={prop}
																		onChange={
																			(event)=>{
																				let value = event.target.value;
																				if(typeof bsNode.class.props[prop] === "number" && !isNaN(Number(value))){
																					value = Number(value);
																				}
																				else if (typeof bsNode.class.props[prop] === 'object') {
																					value = JSON.parse(value);
																				}
																				this.setState({
																					props: Object.assign({}, this.state.props, {
																						[prop]: value
																					})
																				})
																			}
																		}
																		value={(typeof this.state.props[prop] === 'string') ? this.state.props[prop] : JSON.stringify(this.state.props[prop])}
																	/>
															);
														}
													})()
												}
												{
													(()=>{
														if(this.state.props[prop] === bsNode.props[prop]){
															return(
																<Icon
																	style={
																		{
																			color: "green",
																			marginLeft: "0.2vw"
																		}
																	}
																	type="check-circle"/>
															);
														}
														else{
															return(
																<Icon
																	style={
																		{
																			color: "red",
																			marginLeft: "0.2vw"
																		}
																	}
																	type="edit" />

															);
														}
													})()
												}
											</div>
										</React.Fragment>
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
								()=>{
									let bsNode = this.props.CanvasReducer.bsNodes.find((bsNode) => {
										return (bsNode._id === this.props.CanvasReducer.select_id)
									});
									try{
										bsNode.setProps(this.state.props)
									}
									catch(e){
										alert("Parameter Error");
									}
									this.setState(
										{
											drawer: false
										}
									)
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
						()=>{
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
							program.execute(JSON.parse($("#user_input").val())).then((result) => {

							});
							this.setState({
								debug_modal: false,
							})
						}
					}
					onCancel={
						()=>{
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
					onOk={()=>{
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
						if(_id === null){
							let meta = {
								title: $("#program_name").val(),
								description: $("#program_description").val()
							};
							this.props.dispatch(CanvasAction.create(program, canvas, meta));
						}
						else{
							this.props.dispatch(CanvasAction.update(_id, program, canvas));
						}
						this.setState({
							save_modal: false
						})
					}}
					onCancel={()=>{
						this.setState({
							save_modal: false
						})
					}}
				>
					{
						(()=>{
							return(
								<div style={
									{
										fontSize: "1.5vh"
									}
								}>
									<b>Program Name:</b>
									<br/>
									{
										(()=>{
											if(this.props.CanvasReducer._id === null){
												return(<Input id={"program_name"}/>);
											}
											else{
												let sketch= this.props.Meteor.collection.sketches.find((sketch) => {
													return sketch._id === this.props.CanvasReducer._id
												});
												return(sketch.meta.title);
											}
										})()

									}
									<br/>
									<br/>
									<b>Description (optional):</b>
									<br/>
									{
										(()=>{
											if(this.props.CanvasReducer._id === null){
												return(<Input id={"program_description"}/>);
											}
											else{
												let sketch= this.props.Meteor.collection.sketches.find((sketch) => {
													return sketch._id === this.props.CanvasReducer._id
												});
												return(sketch.meta.description);
											}
										})()

									}
									<br/>
									<br/>
									<b>API URL:</b>
									<br/>
									{window.location.protocol + "//" + window.location.host + '/api/program/' + this.props.CanvasReducer._id}
									<br/>
									<br/>
									<b>API Key(s):</b>
									<br/>
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
		if(this.props !== prevProps && this.props.CanvasReducer.select_id !== ""){
			let bsNode = this.props.CanvasReducer.bsNodes.find((bsNode) => {
				return (bsNode._id === this.props.CanvasReducer.select_id)
			});
			if(Object.keys(bsNode.props).length !== 0){
				if(this.props.CanvasReducer.select_id === prevProps.CanvasReducer.select_id %2 == 0){

				}
				this.setState(
					{
						props: bsNode.props,
						drawer: !this.state.props.drawer,
					}
				);
			}
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
			linksUpdated: ({ link }) => {
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
	return {
		Meteor: {
			collection: {
				sketches: sketches_db.find().fetch()
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
