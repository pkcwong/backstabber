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
import { Button, ControlLabel, Form, FormControl, FormGroup, Modal, InputGroup } from "react-bootstrap";
import { Program } from "../../../shared/lib/program";

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			show: false,
			run_modal: false,
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
									Object.keys(bsNode.class.ports.outputs).map((port_name, index)=>{
										if (err) {
											alert(err);
											this.props.dispatch(CanvasAction.addLabel(bsNode, index, port_name, err));
											return;
										}
										if(typeof bsNode.getOutboundPort(port_name).getter() !== 'undefined'){
											this.props.dispatch(CanvasAction.addLabel(bsNode, index, port_name, bsNode.getOutboundPort(port_name).getter()));
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
								this.props.dispatch(CanvasAction.create(program, canvas));
							} else {
								this.props.dispatch(CanvasAction.update(_id, program, canvas));
							}
							this.setState({
								show: true
							});
						}}
					>
						Save Project
					</Button>

					<Button
						bsStyle="warning"
						onClick={() => {
							this.props.dispatch(CanvasAction.generateApiKey(this.props.CanvasReducer._id));
							this.setState({
								show: true
							});
						}}
					>
						Generate API
					</Button>
					<Button
						bsStyle="success"
						onClick={() => {
							// TODO: Execute Program
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
							console.log('hi');
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
					padding: "0"
				}
			}>
				<div style={
					{
						width: "12vw",
						background: "#22313F",
						// borderColor: "white",
						borderStyle: "solid",
						// borderWidth: "1vh"
					}
				}>
					<TrayWidget style={
						{
							margin: "10pt"
						}
					}>
						{
							Object.keys(this.props.CanvasReducer.nodeTypes).map((item, index) => {
								return (
									<React.Fragment
										key={index}
									>
										<TrayItemWidget
											model={{
												type: item,

											}}
											name={item}
											color='peru'
										/>
									</React.Fragment>
								)
							})
						}
					</TrayWidget>
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
								if (index === Object.keys(bsNode.props).length - 1) {
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
															bsNode.setProps(props);
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
												(()=>{
													if(bsNode.props[key] === true){
														return 'true'
													}
													else if(bsNode.props[key] === false){
														return 'false'
													}
													else{
														return bsNode.props[key]
													}
												})()

											}
											<Form inline>
												<FormGroup>
													<ControlLabel>{key} value:</ControlLabel>{' '}
													<FormControl type="text" id={key}/>
												</FormGroup>{' '}
											</Form>
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
