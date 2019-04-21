import { ArrayFindNode } from "../../shared/lib/array/array-find-node";

describe('ArrayFindNode', function () {
	it('should return exact match for primitives', async function () {
		expect(await ArrayFindNode.executor({}, {
			array: [
				1,
				2,
				3
			],
			value: 2
		})).toEqual({
			found: 2,
			index: 1
		});
	});
	it('should return no match for primitives', async function () {
		expect(await ArrayFindNode.executor({}, {
			array: [
				1,
				2,
				3
			],
			value: 0
		})).toEqual({
			found: undefined,
			index: -1
		});
	});
	it('should return exact match for objects', async function () {
		expect(await ArrayFindNode.executor({}, {
			array: [
				{},
				{
					a: 1
				}
			],
			value: {
				a: 1
			}
		})).toEqual({
			found: {
				a: 1
			},
			index: 1
		});
	});
	it('should return partial match for objects', async function () {
		expect(await ArrayFindNode.executor({}, {
			array: [
				{},
				{
					a: 1,
					b: 2
				}
			],
			value: {
				a: 1
			}
		})).toEqual({
			found: {
				a: 1,
				b: 2
			},
			index: 1
		});
	});
	it('should return no match for objects', async function () {
		expect(await ArrayFindNode.executor({}, {
			array: [
				{},
				{
					a: 1
				}
			],
			value: {
				a: 1,
				b: 2
			}
		})).toEqual({
			found: undefined,
			index: -1
		});
	});
	it('should return exact match for nulls', async function () {
		expect(await ArrayFindNode.executor({}, {
			array: [
				{},
				null
			],
			value: null
		})).toEqual({
			found: null,
			index: 1
		});
	});
});
