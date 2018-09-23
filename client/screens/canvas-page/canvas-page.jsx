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
import { ReactDiagramsAction } from "../../redux/actions/react-diagrams-action";
import { styles } from "./styles";
import "./srd.css";
import { NullNode } from "../../../shared/lib/null-node";
import { StringNode } from "../../../shared/lib/string-node";
import { JsonAssignNode } from "../../../shared/lib/json-assign-node";
import { EntryNode } from "../../../shared/lib/entry-node";
import { ReturnNode } from "../../../shared/lib/return-node";
import { Program } from "../../../shared/lib/program";
import { JsonCollapseNode } from "../../../shared/lib/json-collapse-node";
import { Navbar, Glyphicon, ListGroup, ListGroupItem, Panel } from 'react-bootstrap';

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.engine = new DiagramEngine();
		this.engine.registerNodeFactory(new DefaultNodeFactory());
		this.engine.registerLinkFactory(new DefaultLinkFactory());
	}

	render() {
		this.engine.setDiagramModel(this.configModel(this.createModel(this.props.nodes, this.props.links)));
		return (
			<React.Fragment>
				<Navbar>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#home">React-Bootstrap</a>
						</Navbar.Brand>
					</Navbar.Header>
				</Navbar>
				<div
					style={
						{
							background: "black",
							minHeight: "82vh"
						}
					}
				>
					<DiagramWidget
						allowLooseLinks={false}
						maxNumberPointsPerLink={0}
						diagramEngine={this.engine}
					/>
				</div>
			</React.Fragment>
		);
	}

	componentDidMount() {
		/* TODO demo code */
		const node1 = new DefaultNodeModel('Function Node 1');
		node1.addPort(new DefaultPortModel(true, 'out-1', 'IN'));
		node1.addPort(new DefaultPortModel(false, 'out-2', 'Out'));
		this.props.store.dispatch(ReactDiagramsAction.addNode(node1));
		const node2 = new DefaultNodeModel('Function Node 2');
		node2.addPort(new DefaultPortModel(true, 'out-1', 'IN'));
		node2.addPort(new DefaultPortModel(false, 'out-2', 'Out'));
		this.props.store.dispatch(ReactDiagramsAction.addNode(node2));
		/* TODO construct a program */
		let myEntryNode = new EntryNode();
		let myReturnNode = new ReturnNode();
		let myNullNode = new NullNode();
		let myJsonNode = new JsonAssignNode();
		let myKey = new StringNode('framework');
		let myJsonCollapseNode = new JsonCollapseNode();
		let myUserInput = new StringNode('userInput');
		myEntryNode.sendOnReady(myEntryNode.getOutboundPort('props'), myJsonCollapseNode.getInboundPort('json'));
		myUserInput.sendOnReady(myUserInput.getOutboundPort('string'), myJsonCollapseNode.getInboundPort('key'));
		myJsonCollapseNode.sendOnReady(myJsonCollapseNode.getOutboundPort('value'), myJsonNode.getInboundPort('value'));
		myNullNode.sendOnReady(myNullNode.getOutboundPort('value'), myJsonNode.getInboundPort('json'));
		myKey.sendOnReady(myKey.getOutboundPort('string'), myJsonNode.getInboundPort('key'));
		myJsonNode.sendOnReady(myJsonNode.getOutboundPort('json'), myReturnNode.getInboundPort('result'));
		let nodes = [myEntryNode, myReturnNode, myNullNode, myJsonNode, myKey, myJsonCollapseNode, myUserInput];
		let myProgram = new Program(nodes);
		/* TODO demo program */
		(async () => {
			console.log(await myProgram.execute({
				userInput: 'MeteorJS'
			}));
			console.log(await myProgram.execute({
				userInput: 'ReactJS'
			}));
		})();
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
	return {
		Meteor: {
			collection: {},
			user: Meteor.user(),
			userId: Meteor.userId(),
			status: Meteor.status(),
			loggingIn: Meteor.loggingIn()
		}
	};
})(Component);

export const CanvasPage = connect((store) => {
	return {
		nodes: store['ReactDiagramsReducer']['nodes'],
		links: store['ReactDiagramsReducer']['links']
	};
})(Tracker);
