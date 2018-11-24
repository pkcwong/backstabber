import { NumberNode } from "../../shared/lib/number-node";
import { ReturnNode } from "../../shared/lib/return-node";
import { Program } from "../../shared/lib/program";

const mock = () => {
    let myNumberNode = new NumberNode(20353295);
    let myReturnNode = new ReturnNode();
    myNumberNode.sendOnReady(myNumberNode.getOutboundPort('number'), myReturnNode.getInboundPort('result'));
    return new Program([
        myNumberNode,
        myReturnNode
    ]);
};

describe('NumberNode', () => {
    it('should return a number', async () => {
        let myProgram = mock();
        expect(await myProgram.execute()).toEqual(20353295);
    });
    it('should serialize', () => {
        let myProgram = mock();
        let json = myProgram.serialize();
        expect(json.length).toEqual(2);
        expect(Object.keys(json[0])).toEqual([
            '_id',
            'class',
            'args',
            'observers'
        ]);
        expect(json[0]._id).toEqual(expect.anything());
        expect(json[0].class).toEqual(NumberNode.name);
        expect(json[0].args[0]).toEqual(20353295);
        expect(json[0].observers.length).toEqual(1);
        expect(json[0].observers[0].outbound).toEqual('number');
        expect(json[0].observers[0].inbound).toEqual('result');
    });
    it('should deserialize', async () => {
        let myProgram = mock();
        let deserialized = Program.deserialize(JSON.parse(JSON.stringify(myProgram.serialize())));
        expect(await myProgram.execute()).toEqual(await deserialized.execute());
    });
});
