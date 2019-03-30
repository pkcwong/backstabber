import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import { buckets_db } from "../../../shared/collections/buckets";
import {Button} from 'antd';
import 'antd/dist/antd.css';
import { BucketsAction } from "../../redux/actions/buckets-action";

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
						Data Buckets
					</div>
					<Button
						style={
							{

							}
						}
						size={"large"}
						icon="arrow-left"
						onClick={
							()=>{
								FlowRouter.go("/create")
							}
						}>
						Back
					</Button>
					<Button
						style={
							{
								marginLeft: "1vw"
							}
						}
						size={"large"}
						icon="plus"
						onClick={
							()=>{
								this.props.dispatch(BucketsAction.create());
							}
						}>
						New Database
					</Button>
					{
						this.props.Meteor.collection.buckets.map((bucket, index) => {
							return (
								<React.Fragment
									key={index}
								>
									<div style={
										{
											color: "white"
										}
									}>
										{
											JSON.stringify(bucket)
										}
										<Button
											onClick={() => {
												this.props.dispatch(BucketsAction.delete(bucket._id));
											}}
										>
											delete
										</Button>
									</div>
								</React.Fragment>
							);
						})
					}
				</div>
			</React.Fragment>
		)
	}

}

const Tracker = withTracker(() => {
	Meteor.subscribe('buckets_db');
	return {
		Meteor: {
			collection: {
				buckets: buckets_db.find().fetch()
			},
			user: Meteor.user(),
			userId: Meteor.userId(),
			status: Meteor.status(),
			loggingIn: Meteor.loggingIn()
		}
	}
})(Component);

export const BucketsPage = connect((store) => {
	return {};
})(Tracker);
