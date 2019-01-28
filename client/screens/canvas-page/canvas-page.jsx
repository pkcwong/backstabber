import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import {
	DiagramWidget,
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel
} from 'storm-react-diagrams';
import { CanvasAction } from "../../redux/actions/canvas-action";
import "./srd.css";
import TrayWidget from './components/TrayWidget';
import TrayItemWidget from './components/TrayItemWidget';
import { Modal } from 'react-bootstrap';
import { sketches_db } from "../../../shared/collections/sketches";
import { Button, ControlLabel, Form, FormControl, FormGroup } from "react-bootstrap";

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
		this.engine = new DiagramEngine();
		this.engine.registerNodeFactory(new DefaultNodeFactory());
		this.engine.registerLinkFactory(new DefaultLinkFactory());

	}

	render() {
		// TODO: Display the API tokens.
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
						// TODO: API Key
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
								// TODO: Create / Update Project
							}}
						>
							Save Project
						</Button>

						<Button
							bsStyle="warning"
							onClick={() => {
								// TODO: Generate API Key
							}}
						>
							Generate API
						</Button>
						<Button
							bsStyle="success"
							onClick={() => {
								// TODO: Execute Program
							}}
						>
							Run
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
								this.props.dispatch(CanvasAction.addNode(JSON.parse(event.dataTransfer.getData('storm-diagram-node')).type, this.engine.getRelativeMousePoint(event), this.props.dispatch));
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

								(()=>{
									if(this.props.CanvasReducer.select_id !== ''){
										let bsNode = this.props.CanvasReducer.bsNodes.find((bsNode) =>{
											return (bsNode._id === this.props.CanvasReducer.select_id)
										});
										return (Object.keys(bsNode.props))
									}
									else{
										return [];
									}
								})().map((key, index)=>{
										let bsNode = this.props.CanvasReducer.bsNodes.find((bsNode) =>{
											return (bsNode._id === this.props.CanvasReducer.select_id)
										});
										let button = ({});
										if(index === Object.keys(bsNode.props).length-1){
											button = (
												<div>
													<Button
														onClick={
															()=>{
																let props={};
																Object.keys(bsNode.props).map((key, index)=> {
																	props = Object.assign({}, props, {
																		[key]: $("#"+key).val()
																	});
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
												</div>)
											;
										}
										return(
											<React.Fragment key = {index}>
												<div style={
													{
														"fontSize": '0.8em'
													}
												}>
													<ControlLabel>Current {key} value:</ControlLabel>{' '}
													{
														bsNode.props[key]
													}
													<Form inline>
														<FormGroup>
															<ControlLabel>{key} value:</ControlLabel>{' '}
															<FormControl type="text" id={key} />
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

			</React.Fragment>
		);
	}

	componentDidMount() {

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
						this.props.dispatch(CanvasAction.addLink(link, this.props.dispatch));
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
