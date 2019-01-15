import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import {
	DiagramWidget,
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel
} from 'storm-react-diagrams';
import { CanvasAction } from "../../redux/actions/canvas-action";
import "./srd.css";
import { StringNode } from "../../../shared/lib/string-node";
import { EntryNode } from "../../../shared/lib/entry-node";
import { ReturnNode } from "../../../shared/lib/return-node";
import TrayWidget from './components/TrayWidget';
import TrayItemWidget from './components/TrayItemWidget';
import Lodash from 'lodash';
import { sketches_db } from "../../../shared/collections/sketches";
import { Button, ControlLabel, Form, FormControl, FormGroup } from "react-bootstrap";
import { Program } from "../../../shared/lib/program";

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			_id: '',
			remove_id: ''
		};
		this.engine = new DiagramEngine();
		this.engine.registerNodeFactory(new DefaultNodeFactory());
		this.engine.registerLinkFactory(new DefaultLinkFactory());
		this.nodeType = {
			"StringNode": ()=>{
				return new StringNode();
			},
			"EntryNode": ()=>{
				return new EntryNode();
			},
			"ReturnNode": ()=>{
				return new ReturnNode();
			}
		};

	}


	render() {
		this.engine.setDiagramModel(this.configModel(this.createModel(this.props.nodes, this.props.links)));
		return (
			<React.Fragment>
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
							onClick={
								// TODO: Save Project
								()=>{
									let myProgram = new Program(this.props.nodeClass);
								}
							}>
							Save Project
						</Button>

						<Button
							bsStyle="warning"
							onClick={
								// TODO: Generate API
								()=>{
									let myProgram = new Program(this.props.nodeClass);
								}
							}>
							Generate API
						</Button>

						<Button
							bsStyle="success"
							onClick={
								// TODO: Run the Program
								()=>{
									let myProgram = new Program(this.props.nodeClass);
								}
							}
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
								[
									EntryNode,
									StringNode,
									ReturnNode,
								].map((item, index) => {
									return (
										<React.Fragment
											key={index}
										>
											<TrayItemWidget
												model={{
													type: item.name,

												}}
												name={item.name}
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
							onDrop={event => {
								let data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
								let nodeType = this.nodeType[data.type]();
								let node = new DefaultNodeModel(data.type);
								for(let key in nodeType.class.ports.inputs){
									node.addPort(new DefaultPortModel(true, key));
								}
								for(let key in nodeType.class.ports.outputs){
									node.addPort(new DefaultPortModel(false, key));
								}
								let points = this.engine.getRelativeMousePoint(event);
								node.x = points.x;
								node.y = points.y;
								this.props.store.dispatch(CanvasAction.addNode(node, nodeType));

							}}
							onDragOver={event => {
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
									if(this.state._id !== ''){
										return Object.keys(this.props.nodeClass[this.state._id].props)
									}
									else{
										return [];
									}
								})().map((key, index)=>{
									let button = ({});
									if(index === Object.keys(this.props.nodeClass[this.state._id].props).length-1){
										button = (
											<div>
												<Button
													onClick={
														()=>{
															let props={};
															Object.keys(this.props.nodeClass[this.state._id].props).map((key, index)=> {
																props = Object.assign({}, props, {
																	[key]: $("#"+key).val()
																});
																this.props.nodeClass[this.state._id].setProps(props)
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

			</React.Fragment>
		);
	}

	componentDidMount() {
		// /* TODO demo code */
		// const node1 = new DefaultNodeModel('Function Node 1');
		// node1.addPort(new DefaultPortModel(true, 'out-1', 'IN'));
		// node1.addPort(new DefaultPortModel(false, 'out-2', 'Out'));
		// this.props.store.dispatch(ReactDiagramsAction.addNode(node1));
		// const node2 = new DefaultNodeModel('Function Node 2');
		// node2.addPort(new DefaultPortModel(true, 'out-1', 'IN'));
		// node2.addPort(new DefaultPortModel(false, 'out-2', 'Out'));
		// this.props.store.dispatch(ReactDiagramsAction.addNode(node2));
		// /* TODO construct a program */
		// let myEntryNode = new EntryNode();
		// let myReturnNode = new ReturnNode();
		// let myNullNode = new NullNode();
		// let myJsonNode = new JsonAssignNode();
		// let myKey = new StringNode('framework');
		// let myJsonCollapseNode = new JsonCollapseNode();
		// let myUserInput = new StringNode('userInput');
		// myEntryNode.sendOnReady(myEntryNode.getOutboundPort('props'), myJsonCollapseNode.getInboundPort('json'));
		// myUserInput.sendOnReady(myUserInput.getOutboundPort('string'), myJsonCollapseNode.getInboundPort('key'));
		// myJsonCollapseNode.sendOnReady(myJsonCollapseNode.getOutboundPort('value'), myJsonNode.getInboundPort('value'));
		// myNullNode.sendOnReady(myNullNode.getOutboundPort('value'), myJsonNode.getInboundPort('json'));
		// myKey.sendOnReady(myKey.getOutboundPort('string'), myJsonNode.getInboundPort('key'));
		// myJsonNode.sendOnReady(myJsonNode.getOutboundPort('json'), myReturnNode.getInboundPort('result'));
		// let nodes = [myEntryNode, myReturnNode, myNullNode, myJsonNode, myKey, myJsonCollapseNode, myUserInput];
		// let myProgram = new Program(nodes);
		// this.props.dispatch(CanvasAction.create(myProgram, null));
		// /* TODO demo program */
		// (async () => {
		// 	console.log(await myProgram.execute({
		// 		userInput: 'MeteorJS'
		// 	}));
		// 	console.log(await myProgram.execute({
		// 		userInput: 'ReactJS'
		// 	}));
		// })();
	}

	/**
	 * Creates a model graph
	 * @param nodes node components
	 * @param links node links
	 * @returns {DiagramModel} a diagram model
	 */
	createModel = (nodes, links) => {
		console.log(nodes);
		let model = new DiagramModel();
		Object.keys(nodes).map((key)=>{
			// check if the property/key is defined in the object itself, not in parent
			nodes[key].addListener({
				selectionChanged: () => {
					this.setState({
						_id: this.props.nodeDict[key]
					})
				},
				entityRemoved: () => {
					this.setState({
						_id: ''
					});
					this.props.store.dispatch(CanvasAction.deleteNode(key));
				}
			});
			model.addNode(nodes[key]);
		});
		links.forEach((item) => {
			model.addLink(item);
		});
		return model;
	};

	/**
	 * Initializes a model with listeners
	 * @param model
	 * @returns {*} original model instance
	 */
	configModel = (model) => {
		model.setGridSize(0);
		model.clearListeners();
		model.addListener({
			linksUpdated: ({ link }) => {
				link.addListener({
					targetPortChanged: ({ entity, port }) => {
						entity.addListener({
							entityRemoved: ({ entity }) => {
								/* TODO link removed */
								console.log({
									link: entity
								});
							}
						});
						/* TODO link created */
						console.log({
							sourcePort: link['sourcePort'],
							targetPort: port
						});
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
		nodes: store['CanvasReducer']['nodes'],
		links: store['CanvasReducer']['links'],
		nodeClass: store['CanvasReducer']['nodeClass'],
		nodeDict: store['CanvasReducer']['nodeDict']
	};
})(Tracker);
