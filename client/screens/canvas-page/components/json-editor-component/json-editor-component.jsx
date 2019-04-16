import React from 'react';
import { Divider, Modal, Icon, Input } from 'antd';
import 'antd/dist/antd.css';

class Component extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			document: {},
			json: JSON.stringify({}, null, 4),
			error_fields: [],
			error_json: false
		};
	}

	render() {
		return (
			<React.Fragment>
				<Modal
					title={this.props.title}
					visible={this.props.visible}
					onOk={
						() => {
							if (this.props.onOk !== null) {
								this.props.onOk(JSON.parse(this.state.json));
							}
						}
					}
					onCancel={
						() => {
							if (this.props.onCancel !== null) {
								this.props.onCancel();
							}
						}
					}
					okButtonProps={
						{
							disabled: (this.state.error_fields.length !== 0 || this.state.error_json)
						}
					}
				>
					{
						Object.keys(this.state.document).map((key) => {
							return (
								<React.Fragment
									key={key}
								>
									<div
										style={
											{
												display: "flex",
												flexWrap: "wrap",
												flexDirection: "row"
											}
										}
									>
										<div
											style={
												{
													width: "10%%",
													textAlign: "center",
													fontWeight: "bold",
													paddingTop: "1%",
													marginRight: "2%"
												}
											}
										>
											{key} :
										</div>
										<Input
											style={
												{
													width: "88%"
												}
											}
											suffix={
												<React.Fragment>
													{
														(() => {
															if (this.state.error_fields.includes(key)) {
																return (
																	<Icon
																		type='warning'
																		theme='twoTone'
																		twoToneColor='#ff0000'
																	/>
																)
															}
														})()
													}
												</React.Fragment>
											}
											onChange={(e) => {
												this.setState({
													document: Object.assign({}, this.state.document, {
														[key]: e.target.value
													})
												});
												try {
													const doc = Object.keys(this.state.document).reduce((accumulator, current) => {
														if (current === key) {
															accumulator[current] = JSON.parse(e.target.value);
														} else {
															accumulator[current] = JSON.parse(this.state.document[current]);
														}
														return accumulator;
													}, {});
													this.updateJson(doc);
													this.setState({
														error_fields: [],
														error_json: false
													});
												} catch (e) {
													this.setState({
														error_fields: [
															...this.state.error_fields,
															key
														]
													});
												}
											}}
											value={this.state.document[key]}
										/>
									</div>
								</React.Fragment>
							);
						})
					}
					<Divider>
						json view
					</Divider>
					<Input.TextArea
						rows={4}
						onChange={
							(e) => {
								this.setState({
									json: e.target.value
								});
								try {
									const doc = JSON.parse(e.target.value);
									this.updateFields(doc);
									this.setState({
										error_fields: [],
										error_json: false
									});
								} catch (e) {
									this.setState({
										error_json: true
									});
								}
							}
						}
						value={this.state.json}
					/>
					{
						(() => {
							if (this.state.error_json === true) {
								return (
									<Icon
										type='warning'
										theme='twoTone'
										twoToneColor='#ff0000'
										style={
											{
												float: 'right'
											}
										}
									/>
								)
							}
						})()
					}
				</Modal>
			</React.Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props !== prevProps) {
			this.setState({
				document: (() => {
					if (this.props.document !== null) {
						const doc = Object.assign({}, this.props.document);
						delete doc._id;
						return Object.keys(doc).reduce((accumulator, current) => {
							accumulator[current] = JSON.stringify(doc[current]);
							return accumulator;
						}, {});
					} else {
						return this.props.fallbackKeys.reduce((accumulator, current) => {
							accumulator[current] = JSON.stringify(null);
							return accumulator;
						}, {});
					}
				})(),
				json: (() => {
					if (this.props.document !== null) {
						const doc = Object.assign({}, this.props.document);
						delete doc._id;
						return JSON.stringify(doc, null, 4);
					} else {
						return JSON.stringify(this.props.fallbackKeys.reduce((accumulator, current) => {
							accumulator[current] = null;
							return accumulator;
						}, {}), null, 4);
					}
				})()
			});
		}
	}

	updateJson(doc) {
		this.setState({
			json: JSON.stringify(doc, null, 4)
		});
	}

	updateFields(doc) {
		this.setState({
			document: Object.keys(doc).reduce((accumulator, current) => {
				accumulator[current] = JSON.stringify(doc[current]);
				return accumulator;
			}, {})
		});
	}

}

Component.defaultProps = {
	title: 'Editor',
	document: {},
	fallbackKeys: [],
	visible: false,
	onOk: null,
	onCancel: null
};

export const JsonEditorComponent = Component;
