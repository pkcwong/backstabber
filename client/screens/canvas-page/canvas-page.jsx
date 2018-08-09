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

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			nodes: [],
			links: []
		};
		// setup default engine
		this.engine = new DiagramEngine();
		this.engine.registerNodeFactory(new DefaultNodeFactory());
		this.engine.registerLinkFactory(new DefaultLinkFactory());
	}

	render() {
		// regenerate model
		const model = new DiagramModel();
		model.setGridSize(0);
		// listeners
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
		// retrieve nodes from redux
		this.props.nodes.forEach((item) => {
			model.addNode(item);
		});
		this.props.links.forEach((item) => {
			model.addLink(item);
		});
		this.engine.setDiagramModel(model);
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
		// demo code
		const node1 = new DefaultNodeModel('Function Node 1');
		node1.addPort(new DefaultPortModel(true, 'out-1', 'IN'));
		node1.addPort(new DefaultPortModel(false, 'out-2', 'Out'));
		this.props.store.dispatch(ReactDiagramsAction.addNode(node1));
		const node2 = new DefaultNodeModel('Function Node 2');
		node2.addPort(new DefaultPortModel(true, 'out-1', 'IN'));
		node2.addPort(new DefaultPortModel(false, 'out-2', 'Out'));
		this.props.store.dispatch(ReactDiagramsAction.addNode(node2));
	}

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
