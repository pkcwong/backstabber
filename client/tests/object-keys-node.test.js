import { ObjectKeysNode } from "../../shared/lib/object/object-keys-node";

describe('ObjectKeysNode', function() {
    it('should return an array of keys', async function () {
        expect(await ObjectKeysNode.executor({}, {
            object: { "name":"John", "age":30, "city":"New York"}
        })).toEqual({
            keys: ["name", "age", "city"]
        });
    });
    it('should return an array of keys for array', async function () {
        expect(await ObjectKeysNode.executor({}, {
            object: [
                'apple',
                'microsoft',
                'amazon',
                'alphabet',
                'tencent',
                'alibaba'
            ]
        })).toEqual({
            keys: ["0", "1", "2", "3", "4", "5"]
        });
    });
});
