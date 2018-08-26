import { BasicNode } from "../../shared/lib/basic-node";

const mock = () => {
	return new BasicNode({
		meta: {
			label: 'Repeater Node'
		},
		props: {},
		input: [
			{
				port: 'value',
				meta: {
					label: 'value'
				}
			}
		],
		output: [
			{
				port: 'value',
				meta: {
					label: 'value'
				}
			}
		],
		execute: (props, input) => {
			return new Promise((resolve, reject) => {
				resolve({
					value: input['value']
				});
			});
		}
	});
};

describe('BasicNode', () => {
	it('should handle execution', async () => {
		let myBasicNode = mock();
		myBasicNode.instance.input['value'] = Math.PI;
		expect((await myBasicNode.execute())['value']).toEqual(Math.PI);
	});
	it('should handle reset', async () => {
		let myBasicNode = mock();
		myBasicNode.instance.input['value'] = Math.PI;
		expect(myBasicNode.ready()).toEqual(true);
		await myBasicNode.execute();
		myBasicNode.reset();
		expect(myBasicNode.ready()).toEqual(false);
		myBasicNode.instance.input['value'] = Math.PI;
		expect((await myBasicNode.execute())['value']).toEqual(Math.PI);
	});
});
