import React from 'react';
import { StringNode } from "../../../../shared/lib/primitive/string-node";

export const TutorialString = {
	title: 'String Literals',
	description: (
		<React.Fragment>
			<p>
				A string literal is a piece of predefined text which is essential in every simple program. It belongs to
				the category of primitive data types.
			</p>
			<p>
				In this tutorial we will learn to create a StringNode and set its value.
			</p>
			<p>
				A StringNode can be created by dragging it on to the canvas.
				<br/>
				<img
					src="res/img/tutorial-string-drag.gif"
				/>
			</p>
			<p>
				Its property can be set by clicking on it.
				<br/>
				<img
					src="res/img/tutorial-string-prop.gif"
				/>
			</p>
		</React.Fragment>
	),
	tests: [
		{
			task: 'Create a StringNode.',
			hint: 'Click on the category \"Primitives\" and drag out a StringNode.',
			jest: (bsNodes) => {
				return (bsNodes.find((bsNode) => {
					return (bsNode instanceof StringNode);
				}) !== undefined);
			}
		},
		{
			task: 'Set StringNode prop to \"Hello World!\"',
			hint: 'Click on the created StringNode. A drawer will appear at the bottom of the screen. Enter \"Hello World!\" (without quotes) for the input box named \"string\". Click \"submit\" when ready.',
			jest: (bsNodes) => {
				const target = bsNodes.find((bsNode) => {
					return (bsNode instanceof StringNode);
				});
				return (target !== undefined && target.props.string === 'Hello World!');
			}
		}
	],
	expect: [],
	solution: require('./tutorial-string.json')
};
