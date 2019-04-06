import React from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Button, Divider, Modal, Input, Icon, Table } from 'antd';
import 'antd/dist/antd.css';
import { buckets_db } from "../../../shared/collections/buckets";
import { documents_db } from "../../../shared/collections/documents";
import { DocumentsAction } from "../../redux/actions/documents-action";


class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			document_modal: false,
			document: {},
			textArea: ""
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
							(() => {
								if (this.props.Meteor.collection.buckets.filter((bucket) => {
									return (bucket._id === FlowRouter.getParam("_id"));
								}).length === 0) {
									return ("Sorry, Bucket Does Not Exist")
								} else {
									return this.props.Meteor.collection.buckets.filter((bucket) => {
										return (bucket._id === FlowRouter.getParam("_id"));
									}).map((bucket, index) => {
										return (
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
									FlowRouter.go("/buckets");
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
										document_modal: true,
										document: (() => {
											const doc = this.props.Meteor.collection.documents.filter((document) => {
												return (document.bucket === FlowRouter.getParam('_id'));
											}).map((document) => {
												return Object.assign({}, {
													_id: document._id
												}, document.document);
											}).reduce((accumulator, current) => {
												return Object.assign({}, accumulator, Object.keys(current).reduce((acc, cur) => {
													return Object.assign({}, acc, {
														[cur]: null
													})
												}, {}));
											}, {
												_id: null
											});
											delete doc['_id'];
											return doc;
										})(),
										textArea: ""
									});
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
							overflowX: 'scroll',
							display: "flex",
							flexWrap: "wrap",
							flexDirection: "column",
						}
					}>
						{
							<Table
								onRow={(record, rowIndex) => {
									return {
										onClick: (event) => {
											console.log(record)
										}
									};
								}}
								bordered
								pagination = {false}
								rowKey='_id'
								dataSource={
									this.props.Meteor.collection.documents.filter((document) => {
										return (document.bucket === FlowRouter.getParam('_id'));
									}).map((document) => {
										return Object.assign({}, {
											_id: document._id
										}, document.document);
									})
								}
								columns={
									Object.keys(this.props.Meteor.collection.documents.filter((document) => {
										return (document.bucket === FlowRouter.getParam('_id'));
									}).map((document) => {
										return Object.assign({}, {
											_id: document._id
										}, document.document);
									}).reduce((accumulator, current) => {
										return Object.assign({}, accumulator, current);
									}, {
										_id: null
									})).map((key) => {
										return {
											title: key,
											dataIndex: key,
											key: key,
										};
									})
								}
							/>
						}
					</div>
				</div>
				<Modal
					title="Insert New Document"
					visible={this.state.document_modal}
					onOk={() => {
						if (this.state.textArea === '') {
							this.props.dispatch(DocumentsAction.insert(FlowRouter.getParam('_id'), this.props.Meteor.collection.buckets.find((bucket) => {
								return (bucket._id === FlowRouter.getParam('_id'));
							}).token, Object.assign({}, this.state.document)));
						} else {
							this.props.dispatch(DocumentsAction.insert(FlowRouter.getParam('_id'), this.props.Meteor.collection.buckets.find((bucket) => {
								return (bucket._id === FlowRouter.getParam('_id'));
							}).token, Object.assign({}, JSON.parse(this.state.textArea))));
						}
						this.setState({
							document_modal: false
						});
					}}
					onCancel={() => {
						this.setState({
							document_modal: false
						});
					}}
				>
					{
						(() => {
							return (Object.keys(this.state.document).map((key, index) => {
								return (
									<React.Fragment key={index}>
										<div style={
											{
												display: "flex",
												flexWrap: "wrap",
												flexDirection: "row"
											}
										}>
											{key}
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
												id={"value" + index}
												style={
													{
														width: "62%"
													}
												}
												onChange={(e) => {
													this.setState({
														document: Object.assign({}, this.state.document, {
															[key]: e.target.value
														})
													});
												}}
											/>
										</div>
									</React.Fragment>
								);
							}))
						})()
					}
					<Divider>
						or json
					</Divider>
					<Input.TextArea
						rows={4}
						onChange={(e) => {
							this.setState({
								textArea: e.target.value
							});
						}}
						defaultValue=''
					/>
				</Modal>
			</React.Fragment>
		);
	}

}

const Tracker = withTracker(() => {
	Meteor.subscribe('buckets_db');
	Meteor.subscribe('documents_db');
	return {
		Meteor: {
			collection: {
				users: Meteor.users.find().fetch(),
				buckets: buckets_db.find().fetch(),
				documents: documents_db.find().fetch()
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
