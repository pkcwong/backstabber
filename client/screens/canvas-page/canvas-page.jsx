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
import { ConstantNode } from "../../../shared/lib/functions";

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
			<div
				style={styles.canvas}
			>
				<DiagramWidget
					allowLooseLinks={false}
					maxNumberPointsPerLink={0}
					diagramEngine={this.engine}
				/>
			</div>
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
		/* TODO demo functions */
		const constSix = new ConstantNode(6);
		console.log(constSix);
		constSix.execute();
		console.log(constSix);
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
