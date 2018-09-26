import React from 'react';

export interface TrayItemWidgetProps {
	model: any,
		color?: string,
		name: string
}

export interface TrayItemWidgetState {}

export default class TrayItemWidget extends React.Component<TrayItemWidgetProps, TrayItemWidgetState> {
	constructor(props: TrayItemWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div
				style={
					{
						background: this.props.color,
						margin: "1vh",
						minHeight: "5vh",
						padding: "2vh",
						textAlign: "center",
						borderRadius: "1vh"
					}
				}
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.props.model));
				}}
				className="tray-item"
			>
				{this.props.name}
			</div>
		);
	}
}