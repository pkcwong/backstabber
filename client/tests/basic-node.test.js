import { BasicNode } from "../../shared/lib/basic-node";

const mock = () => {
	return new BasicNode({
		meta: {
			label: 'Repeater Node'
		},
		props: {},
		input: {
			value: {
				port: 'value',
				meta: {
					label: 'value'
				}
			}
		},
		output: {
			value: {
				port: 'value',
				meta: {
					label: 'value'
				}
			}
		},
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
	it('should generate an _id', function () {
		let myBasicNode = mock();
		expect(typeof myBasicNode._id === 'string' || myBasicNode._id instanceof String).toEqual(true);
	});
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
    it('should serialize', async () => {
        let myBasicNode = mock();
        myBasicNode.instance.input['value'] = Math.PI;
        expect(myBasicNode.ready()).toEqual(true);
        await myBasicNode.execute();
        myBasicNode.reset();
        var json = myBasicNode.serialize();
        console.log(json);
        var node = myBasicNode.deserialize(json);
        console.log(node);
        console.log(myBasicNode);
        node.instance.input['value'] = Math.PI;
        expect(node.ready()).toEqual(true);
        await node.execute();
        node.reset();
        expect(node.ready()).toEqual(false);
        node.instance.input['value'] = Math.PI;
        expect((await node.execute())['value']).toEqual(Math.PI);
    });
});
