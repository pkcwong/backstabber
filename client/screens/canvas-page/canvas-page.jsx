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
import { styles } from "./styles";
import "./srd.css";
import { NullNode } from "../../../shared/lib/null-node";
import { StringNode } from "../../../shared/lib/string-node";
import { JsonAssignNode } from "../../../shared/lib/json-assign-node";
import { EntryNode } from "../../../shared/lib/entry-node";
import { ReturnNode } from "../../../shared/lib/return-node";
import { Program } from "../../../shared/lib/program";
import { JsonCollapseNode } from "../../../shared/lib/json-collapse-node";
import TrayWidget from './components/TrayWidget';
import TrayItemWidget from './components/TrayItemWidget';
import Lodash from 'lodash';
import { sketches_db } from "../../../shared/collections/sketches";
import { BasicNode } from "../../../shared/lib/basic-node";
import { ArrayMapNode } from "../../../shared/lib/array-map-node";
import { ArrayPushNode } from "../../../shared/lib/array-push-node";
import { ArrayReduceNode } from "../../../shared/lib/array-reduce-node";
import { BoolNode } from "../../../shared/lib/bool-node";
import { NumberNode } from "../../../shared/lib/number-node";

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.engine = new DiagramEngine();
		this.engine.registerNodeFactory(new DefaultNodeFactory());
		this.engine.registerLinkFactory(new DefaultLinkFactory());
		this.nodeType = {
			"StringNode": ()=>{
				return new StringNode()
			},
			"EntryNode": ()=>{
				return new EntryNode()
			},
			"ReturnNode": ()=>{
				return new ReturnNode()
			},
			"ArrayMapNode": ()=>{
				return new ArrayMapNode()
			},
			"ArrayPushNode": ()=>{
				return new ArrayPushNode()
			},
			"ArrayReduceNode": ()=>{
				return new ArrayReduceNode()
			},
			"BoolNode": ()=>{
				return new BoolNode()
			},
			"JsonAssignNode": ()=> {
				return new JsonAssignNode()
			},
			"JsonCollapseNode": ()=> {
				return new JsonCollapseNode()
			},
			"NullNode": ()=> {
				return new NullNode()
			},
			"NumberNode": ()=> {
				return new NumberNode()
			},
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
					<div>
						{/*<img style={*/}
						{/*{*/}
						{/*height: "6vh",*/}
						{/*marginLeft: "2vh",*/}
						{/*marginTop: "0.5vh"*/}
						{/*}*/}
						{/*}*/}
						{/*src={"/res/img/BackStabber_logo.png"}*/}
						{/*/>*/}
					</div>
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
							width: "10vw",
							background: "#22313F",
							// borderColor: "white",
							borderStyle: "solid",
							overflowY: "scroll"
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
									ArrayMapNode,
									ArrayPushNode,
									ArrayReduceNode,
									BoolNode,
									JsonAssignNode,
									JsonCollapseNode,
									NullNode,
									NumberNode,
									ReturnNode,
									StringNode
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
								width: "90vw"
							}
						}
					>
						<div
							className="diagram-layer"
							onDrop={event => {
								var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
								var nodesCount = Lodash.keys(this.engine.getDiagramModel().getNodes()).length;
								//console.log(nodesCount);
								let nodeType = this.nodeType[data.type]();
								let node = new DefaultNodeModel(data.type);

								for(let key in nodeType.args.input){
									console.log(key);
									node.addPort(new DefaultPortModel(true, key));
								}
								for(let key in nodeType.args.output){
									console.log(key);
									node.addPort(new DefaultPortModel(false, key));
								}
								let points = this.engine.getRelativeMousePoint(event);
								node.x = points.x;
								node.y = points.y;
								// // TODO: request user initializations
								let params = null;
								this.props.store.dispatch(CanvasAction.addNode(node, EntryNode, params));
								// // TODO: forceUpdate is discouraged
								this.forceUpdate();
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
							{/*<DiagramWidget className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />*/}
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
		let model = new DiagramModel();
		nodes.forEach((item) => {
			model.addNode(item);
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
		nodes: store['CanvasReducer']['nodes'],
		links: store['CanvasReducer']['links']
	};
})(Tracker);
