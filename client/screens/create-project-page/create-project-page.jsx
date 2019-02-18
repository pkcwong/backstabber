import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { sketches_db } from "../../../shared/collections/sketches";
import { Modal } from 'react-bootstrap';

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false,
			open_modal: {}
		};
	}

	render() {
		return (
			<React.Fragment>
				<Modal
					show={this.state.open}
					container={this}
					onHide={() => {
						this.setState({
							open: false
						})
					}}
					aria-labelledby="contained-modal-title"
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title">
							Open Existing Program
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<br/>
					</Modal.Body>

				</Modal>
				<div style={
					{
					}
				}>
					<h1 style={
						{
							margin: "2%"
						}
					}>
						Welcome To BackStabber
					</h1>

					<div className="Dialog"
						style={
						{
							align: "center",
							width: "360px",
							height: "240px",
							margin: "0 auto",
							borderWidth: "5px",
							borderStyle: "outset double",
							borderColor: "purple"
						}
					}>
						<div style={
						     	{
									textAlign: "center",
									maxHeight: "100%"
						     	}
						    }>
							<div title="Language"
							     style={
								     {
									     position: "absolute",
									     cursor: "pointer",
									     bottom: "19px",
									     right: "24px",
									     direction: "rtl",
									     textAlign: "right"
								     }
							     }>
							        <span style={
								        {
									        display: "inline-block",
									        fontSize: "12px",
									        margin: "5px 24px 0px 0px",
									        color: "gray"
								        }
							        }>
								        Language
							        </span>
							</div>
							<a href="https://github.com/pkcwong/backstabber/issues"
							   title="Help"
							   target="_blank"
							   style={
								   {
									   position: "absolute",
									   fontSize: "12px",
									   textDecoration: "none",
									   cursor: "pointer",
									   bottom: "22px",
									   left: "26px",
									   color: "gray"
								   }
							   }>
								Help
							</a>
							<p style={
								{
									fontSize: "16pt",
									padding: "2px 0px 0px",
									margin: "0px",
									color: "gray"
								}
							}>
								BackStabber
							</p>
							<div style={
								{
									margin: "4px 0px 0px",
									borderWidth: "1px 0px",
									borderStyle: "solid" ,
									borderColor: "rgb(211, 211, 211)",
									borderImage: "initial",
									padding: "18px 0px"
								}
							}>
								<button style={
									{
						                overflow: "hidden",
								        width: "340px",
								        marginBottom: "8px"
									}
								}>
									Create New Program
								</button>
								<br></br>
								<button style={
							        {
								        overflow: "hidden",
								        width: "340px",
								        marginBottom: "8px"
							        }
						        } onClick={
									() => {
										this.setState({
											open: true,
											open_modal: this.props.Meteor.collection
										});
						        	    console.log(this.props.Meteor.collection);
									}
								}
								>
									Open Existing Program
								</button>
								<a href="javascript:void(0)"
								   style={
									   {
										   display: "inline-block",
										   marginTop: "6px"
									   }
								   }>
									Sign out
								</a>
							</div>
						</div>
					</div>
				</div>

			</React.Fragment>
		);
	}
}

const TrackerSketches = withTracker(() => {
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

const Tracker = withTracker(() => {
	Meteor.subscribe('users_db');
	return {
		Meteor: {
			collection: {
				users: Meteor.users.find().fetch()
			},
			user: Meteor.user(),
			userId: Meteor.userId(),
			status: Meteor.status(),
			loggingIn: Meteor.loggingIn()
		}
	};
})(Component);

export const CreateProjectPage = Tracker;
