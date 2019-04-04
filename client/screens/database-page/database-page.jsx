import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Button, Modal, Input, Icon } from 'antd';
import 'antd/dist/antd.css';
import { buckets_db } from "../../../shared/collections/buckets";


class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state={
			document_modal: false,
			documents: [],
		}
	}

	render() {
		return (
			<React.Fragment>
				<div style={
					{
						background: "#202124",
						height: "100vh",
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
						{
							(()=>{
								if(this.props.Meteor.collection.buckets.filter((bucket)=>{
									return(bucket._id === FlowRouter.getParam("_id"));}).length === 0){
									return("Sorry, Bucket Does Not Exist")
								}
								else{
									return this.props.Meteor.collection.buckets.filter((bucket)=>{
										return(bucket._id === FlowRouter.getParam("_id"));
									}).map((bucket, index)=>{
										console.log(bucket);
										return(
											<React.Fragment key={index}>
												<div>
													{
														bucket.meta.title
													}
												</div>
											</React.Fragment>);
									});
								}
							})()
						}
					</div>
					<div
						style={
							{
								minHeight: "6%"
							}
						}>
						<Button
							size={"large"}
							icon="arrow-left"
							onClick={
								() => {
									FlowRouter.go("/buckets")
								}
							}>
							Back
						</Button>
						<Button
							style={
								{
									marginLeft: "1vw",
									backgroundColor: "green",
									borderColor: "green",
									color: "white"
								}
							}
							size={"large"}
							icon="file-add"
							onClick={
								() => {
									this.setState({
										document_modal: true
									})
								}
							}>
							Insert Document
						</Button>
					</div>
					<div style={
						{
							height: "82%",
							backgroundColor: "#C5C6C7",
							background: "white",
							padding: 0,
							overflowY: 'scroll',
							display: "flex",
							flexWrap: "wrap",
							flexDirection: "column",
						}
					}>
						{

						}
					</div>
				</div>
				<Modal
					title="Insert New Document"
					visible={this.state.document_modal}
					onOk={()=>{
						//Todo insert Document with redux with this.state.document
						this.setState({
							document_modal: false,
							documents: []
						})

					}
					}
					onCancel={()=>{
						this.setState({
							document_modal: false,
							documents: []
						})
					}}
				>
					{
						(()=>{
							return (this.state.documents.map((document, index)=>{
								return(
									<React.Fragment key={index}>
										<div style={
											{
												display: "flex",
												flexWrap: "wrap",
												flexDirection: "row"
											}
										}>
											<Input
												id={"key"+index}
												onChange={
													(event)=>{
														let value = event.target.value;
														//Check if a string is a valid JSON string in JavaScript without using Try/Catch
														if(/^[\],:{}\s]*$/.test(value.replace(/\\["\\\/bfnrtu]/g, '@').
															replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
															replace(/(?:^|:|,)(?:\s*\[)+/g, ''))){
															value = JSON.parse(value);
														}
														//Todo set state for this.state.documents
														// this.setState(
														// 	{
														// 		documents:
														// 	}
														// )
													}
												}
												style={
													{
														width: "27%"
													}
												}/>
											<div style={
												{
													width: "6%",
													textAlign: "center",
													fontWeight: "bold",
													paddingTop: "1%"
												}
											}>
												:
											</div>
											<Input
												id={"value"+index}
												style={
													{
														width: "62%"
													}
												}/>
											<Icon
												onClick={
													()=>{
														//Todo delete the object in this.state.document
													}
												}
												type="delete"
												style={
													{
														paddingTop: "2%",
														paddingLeft: "2%",
														width: "3%",
														color: "red"
													}
												}/>
										</div>
									</React.Fragment>
								);
							}));
						})()
					}
					<div style={
						{

						}
					}>
						<Button
							onClick={
								()=>{
									this.setState({
										documents: [...this.state.documents, {}]
									})
								}
							}
							style={
								{
									marginTop: "1vh",
									marginBottom: "2vh"
								}
							}>
							Add New Field
						</Button>
					</div>

				</Modal>

			</React.Fragment>
		);
	}

}

const Tracker = withTracker(() => {
	Meteor.subscribe('buckets_db');
	return {
		Meteor: {
			collection: {
				users: Meteor.users.find().fetch(),
				buckets: buckets_db.find().fetch()
			},
			user: Meteor.user(),
			userId: Meteor.userId(),
			status: Meteor.status(),
			loggingIn: Meteor.loggingIn()
		}
	};
})(Component);

export const DatabasePage = connect((store) => {
	return {
		logs: store['LoggerReducer']['logs'],
		strings: store['LocaleReducer']['strings']
	};
})(Tracker);
