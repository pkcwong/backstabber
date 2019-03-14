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
import { Button, ControlLabel, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, MenuItem, Modal  } from "react-bootstrap";
import { Program } from "../../../shared/lib/program";

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selected_category: Object.keys(this.props.CanvasReducer.nodeTypes).reduce((obj, current)=>{
				return Object.assign(obj, {
					[current]: false
				})
			}, {}),
			show: false,
			run_modal: false,
			API_KEY: false,
			error_modal: false,
			config_modal: false,
			title_modal: false,
			program: {},
			canvas: {},
			delete_modal: false,
			error: ""
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

				<Modal
					show={this.state.error_modal}
					container={this}
					onHide={() => {
						this.setState({
							error_modal: false
						})
					}}
					aria-labelledby="contained-modal-title"
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">
							Error
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{'ERROR MESSAGE:'}
						<br/>
						{this.state.error}
						<br/>
					</Modal.Body>
				</Modal>

				<Modal
					show={this.state.title_modal}
					container={this}
					onHide={() => {
						this.setState({
							title_modal: false
						})
					}}
				>
					<Modal.Header closeButton>
						<Modal.Title>
							Title
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{'Please enter the title:'}
						<br/>
						<FormGroup>
							<FormControl type="text" id="title_input"/>
						</FormGroup>{' '}
						{'Please enter the description:'}
						<br/>
						<FormGroup>
							<FormControl type="text" id="description_input"/>
						</FormGroup>{' '}
						<button onClick={() => {
							if($("#title_input").val() !== undefined && $("#title_input").val() !== ""){
								this.setState({
									title_modal: false
								})
								let meta = {
									title: $("#title_input").val(),
									description: $("#description_input").val()
								}
								this.props.dispatch(CanvasAction.create(this.state.program, this.state.canvas, meta));
							}
						}}>
							Confirm
						</button>
						<button onClick={() => {
							this.setState({
								title_modal: false
							})
						}}>
							Cancel
						</button>
						<br/>
					</Modal.Body>
				</Modal>
				<Modal
					show={this.state.show}
					container={this}
					onHide={() => {
						this.setState({
							show: false
						})
					}}
					aria-labelledby="contained-modal-title"
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">
							API Key
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{'API URL:'}
						<br/>
						{window.location.protocol + "//" + window.location.host + '/api/program/' + this.props.CanvasReducer._id}
						<br/>
						{'API Key:'}
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
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={
							() => {
								this.setState({
									show: false
								})
							}
						}>Close</Button>
					</Modal.Footer>
				</Modal>
				<Modal
					show={this.state.run_modal}
					container={this}
					onHide={() => {
						this.setState({
							run_modal: false
						})
					}}
					aria-labelledby="contained-modal-title"
				>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title">
						Real Time Debugging
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<label>
							Input JSON
						</label>
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
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={
							() => {
								this.setState({
									run_modal: false
								})
							}
						}>Close</Button>
					<Button onClick={
						() => {
							this.props.dispatch(CanvasAction.deleteLabel());
							const program = new Program(this.props.CanvasReducer.bsNodes);
							this.props.CanvasReducer.bsNodes.forEach((bsNode) => {
								bsNode.callbacks = [];
								bsNode.registerCallback((err, res) => {
									if (err) {
										alert(err);
									}
									bsNode.observers.forEach((observer, index) => {
										if (err) {
											this.props.dispatch(CanvasAction.addLabel(bsNode, index, observer.outbound, err));
											return;
										}
										if (typeof bsNode.getOutboundPort(observer.outbound).getter() !== 'undefined') {
											this.props.dispatch(CanvasAction.addLabel(bsNode, index, observer.outbound, bsNode.getOutboundPort(observer.outbound).getter()));
										}
									});
								});
							});
							program.execute(JSON.parse($("#user_input").val())).then((result) => {

							});
							this.setState({
								run_modal: false
							});
						}
					}>Submit</Button>
				</Modal.Footer>
			</Modal>
			<Modal
				show={this.state.delete_modal}
				container={this}
				onHide={() => {
					this.setState({
						delete_modal: false
					})
				}}
			>
				<Modal.Header closeButton>
					<Modal.Title>
						Delete Program
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{'Please confirm deleting the program:'}
					<br/>
					<button onClick={() => {
						this.props.store.dispatch(CanvasAction.delete(this.props.CanvasReducer._id));
						this.setState({
							delete_modal: false
						})
					}}>
						Delete
					</button>
					<button onClick={() => {
						this.setState({
							delete_modal: false
						})
					}}>
						Cancel
					</button>
					<br/>
				</Modal.Body>
			</Modal>
			<div style={
				{
					minHeight: "7vh",
					background: "#22313F",
					display: "flex",
					flexDirection: "row",
				}
			}>
				<div style={
					{
						marginTop: "1vh",
						paddingLeft: "1.3vw",
						fontSize: "3vh",
						color: "#ECECEC",
						fontStyle: "italic"
					}
				}>
					Welcome to <b>B</b>ack<b>S</b>tabber
					<br></br>
					{
						(() => {
							let sketch = this.props.Meteor.collection.sketches.find((sketch) => {
								return sketch._id === this.props.CanvasReducer._id
							});
							if (sketch !== undefined) {
								return sketch.meta.title;
							}
						})()
					}
					<br></br>
					{
						(() => {
							let sketch = this.props.Meteor.collection.sketches.find((sketch) => {
								return sketch._id === this.props.CanvasReducer._id
							});
							if (sketch !== undefined) {
								return sketch.meta.description;
							}
						})()
					}
				</div>
				<div style={
					{
						margin: "1vh",
						paddingLeft: "1.3vw",
					}
				}>
					<Button
						bsStyle="primary"
						onClick={() => {
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
							if (_id === null) {
								this.setState({
									title_modal: true,
									program: program,
									canvas: canvas
								})
							} else {
								this.props.dispatch(CanvasAction.update(_id, program, canvas));
								this.setState({
									show: true,
									API_KEY: false
								});
							}
					}}>
						Save Project
					</Button>
					<Button
						bsStyle="danger"
						disabled={(this.props.CanvasReducer._id === null)}
						onClick={() => {
							this.setState({
								delete_modal: true
							})
						}}
					>
						Delete Project
					</Button>
					<Button
						bsStyle="warning"
						onClick={() => {
							this.props.dispatch(CanvasAction.generateApiKey(this.props.CanvasReducer._id));
							this.setState({
								show: true,
								API_KEY: true
							});
						}}
					>
						Generate API
					</Button>
					<Button
						bsStyle="success"
						onClick={() => {
							this.setState({
								run_modal: true
							})
						}}
					>
						Run
					</Button>
					<Button
						bsStyle="danger"
						onClick={() => {
							this.props.dispatch(CanvasAction.deleteLabel());
						}}
					>
						Finish
					</Button>
				</div>
			</div>
			<div style={
				{
					display: "flex",
					flexDirection: "row",
					height: "93vh",
					margin: "0",
					padding: "0",
				}
			}>
				<div style={
					{
						width: "15vw",
						background: "#22313F",
						// borderColor: "white",
						borderStyle: "solid",
						// borderWidth: "1vh"
						overflowY: 'scroll',
						// overflow: 'auto'
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
							width: "90vw",
							minHeight: "93vh"
						}
					}
				>
					<div
						className="diagram-layer"
						onDrop={(event) => {
							console.log(JSON.parse(event.dataTransfer.getData('storm-diagram-node')).type);
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
							smartRouting={true}
						/>
					</div>
				</div>
				<div style={
					{
						fontSize: "2em",
						backgroundColor: "grey",
						width: '30vw',
						padding: "0.5em",
						minHeight: '93vh'
					}
				}>
					Parameter Setting
					<div style={
						{
							paddingTop: '0.2em'
						}
					}>
						{

							(() => {
								if (this.props.CanvasReducer.select_id !== '') {
									let bsNode = this.props.CanvasReducer.bsNodes.find((bsNode) => {
										return (bsNode._id === this.props.CanvasReducer.select_id)
									});
									return (Object.keys(bsNode.props))
								}
								else {
									return [];
								}
							})().map((key, index) => {
								let bsNode = this.props.CanvasReducer.bsNodes.find((bsNode) => {
									return (bsNode._id === this.props.CanvasReducer.select_id)
								});
								let button = (<React.Fragment/>);
								let input = (<React.Fragment/>);
								if (index === Object.keys(bsNode.props).length - 1) {
									if(typeof bsNode.class.props[key] === "boolean"){
										input = (
											<React.Fragment>
												<div>
													<ControlLabel>{key} value:</ControlLabel>{' '}
													<select id={key} title={"Boolean Value"} onClick={() => {

													}}>
														<option value="false">False</option>
														<option value="true">True</option>
													</select>
												</div>
											</React.Fragment>
										);
									}else{
										input = (
											<React.Fragment>
												<FormGroup>
													<ControlLabel>{key} value:</ControlLabel>{' '}
													<FormControl type="text" id={key}/>
												</FormGroup>{' '}
											</React.Fragment>
										);
									}
									button = (
										<React.Fragment>
											<Button
												onClick={
													() => {
														let props = {};
														Object.keys(bsNode.props).map((key, index) => {
															if(typeof bsNode.class.props[key] === "number" && !isNaN(Number($("#" + key).val()))){
																props = Object.assign({}, props, {
																	[key]: Number($("#" + key).val())
																});
															}
															else if(typeof bsNode.class.props[key] === "boolean"){
																if($("#" + key).val() === 'true'){
																	props = Object.assign({}, props, {
																		[key]: true
																	});
																}
																else{
																	props = Object.assign({}, props, {
																		[key]: false
																	});
																}
															}
															else{
																props = Object.assign({}, props, {
																	[key]: $("#" + key).val()
																});
															}
															try{
																bsNode.setProps(props);
															}
															catch(e){
																this.setState({
																	error: e.message,
																	error_modal: true
																})
															}
															this.setState({
																_id: ""
															})
														});
													}
												}
											>
												Submit
											</Button>
										</React.Fragment>)
									;
								}
								return (
									<React.Fragment key={index}>
										<div style={
											{
												"fontSize": '0.8em'
											}
										}>
											<ControlLabel>Current {key} value:</ControlLabel>{' '}
											{
												JSON.stringify(bsNode.props[key])
											}
											{input}
											{button}
										</div>
									</React.Fragment>
								);
							})
						}
						<div style={
							{
								color: "white"
							}
						}>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>);
	}

	componentDidMount() {
		this.props.dispatch(CanvasAction.init(this.props.dispatch));
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
