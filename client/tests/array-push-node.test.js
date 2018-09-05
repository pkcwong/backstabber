import { ArrayPushNode } from "../../shared/lib/array-push-node";

const mock = () => {
	return new ArrayPushNode();
};

describe('ArrayPushNode', () => {
	it('should return empty array', async () => {
		let myArrayPushNode = mock();
		expect(myArrayPushNode.ready()).toEqual(false);
		myArrayPushNode.receive('array', null, false);
		myArrayPushNode.receive('value', null, false);
		expect(myArrayPushNode.ready()).toEqual(true);
		expect(await myArrayPushNode.execute()).toEqual({
			array: []
		});
	});
	it('should return array of a single item', async () => {
		let myArrayPushNode = mock();
		expect(myArrayPushNode.ready()).toEqual(false);
		myArrayPushNode.receive('array', null, false);
		myArrayPushNode.receive('value', [
			Math.PI,
			[
				Math.PI
			]
		], false);
		expect(myArrayPushNode.ready()).toEqual(true);
		expect(await myArrayPushNode.execute()).toEqual({
			array: [
				[
					Math.PI,
					[
						Math.PI
					]
				]
			]
		});
	});
	it('should return original array', async () => {
		let myArrayPushNode = mock();
		expect(myArrayPushNode.ready()).toEqual(false);
		myArrayPushNode.receive('array', [
			Math.PI,
			[
				Math.PI
			]
		], false);
		myArrayPushNode.receive('value', null, false);
		expect(myArrayPushNode.ready()).toEqual(true);
		expect(await myArrayPushNode.execute()).toEqual({
			array: [
				Math.PI,
				[
					Math.PI
				]
			]
		});
	});
	it('should return pushed array', async () => {
		let myArrayPushNode = mock();
		expect(myArrayPushNode.ready()).toEqual(false);
		myArrayPushNode.receive('array', [
			Math.PI,
			[
				Math.PI
			]
		], false);
		myArrayPushNode.receive('value', [
			Math.PI,
			[
				Math.PI
			]
		], false);
		expect(myArrayPushNode.ready()).toEqual(true);
		expect(await myArrayPushNode.execute()).toEqual({
			array: [
				Math.PI,
				[
					Math.PI
				],
				[
					Math.PI,
					[
						Math.PI
					]
				]
			]
		});
	});
});
