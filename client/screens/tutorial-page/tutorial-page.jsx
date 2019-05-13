import React from 'react';
import { connect } from 'react-redux';
import { Button, Collapse } from "antd";
import 'antd/dist/antd.css';
import { TutorialAction } from "../../redux/actions/tutorial-action";
import { TutorialHelloWorld } from "./tutorial-hello-world";

class Component extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<div style={
					{
						background: "#202124",
						paddingTop: "0.5%",
						paddingBottom: "0.5%",
						paddingLeft: "2%",
						paddingRight: "2%",
					}
				}>
					<div style={
						{
							fontSize: "3em",
							color: "white",
							minHeight: "8%",
						}
					}>
						<div onClick={
							() => {
								FlowRouter.go('/');
							}
						}>
							<b>B </b> a c k<b> S </b> t a b b e r
						</div>
					</div>
				</div>
				<Collapse
					accordion={true}
				>
					{
						[
							TutorialHelloWorld
						].map((tutorial, index) => {
							return (
								<Collapse.Panel
									key={index}
									header={tutorial.title}
								>
									<p>
										{tutorial.description}
									</p>
									<Button
										type='primary'
										onClick={() => {
											this.props.dispatch(TutorialAction.setTest(tutorial.title, tutorial.tests, tutorial.expect));
											FlowRouter.go('/sandbox');
										}}
									>
										Start Lesson
									</Button>
								</Collapse.Panel>
							);
						})
					}
				</Collapse>
			</React.Fragment>
		);
	}

}

export const TutorialPage = connect((store) => {
	return {
		TutorialReducer: store['TutorialReducer']
	};
})(Component);
