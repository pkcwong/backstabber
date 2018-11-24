import { BoolNode } from "../../shared/lib/bool-node";
import { ReturnNode } from "../../shared/lib/return-node";
import { Program } from "../../shared/lib/program";

const mock = () => {
    let myBoolNode = new BoolNode(true);
    let myReturnNode = new ReturnNode();
    myBoolNode.sendOnReady(myBoolNode.getOutboundPort('bool'), myReturnNode.getInboundPort('result'));
    return new Program([
        myBoolNode,
        myReturnNode
    ]);
};

describe('BoolNode', () => {
    it('should return a bool', async () => {
        let myProgram = mock();
        expect(await myProgram.execute()).toEqual(true);
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
        expect(json[0].class).toEqual(BoolNode.name);
        expect(json[0].args[0]).toEqual(true);
        expect(json[0].observers.length).toEqual(1);
        expect(json[0].observers[0].outbound).toEqual('bool');
        expect(json[0].observers[0].inbound).toEqual('result');
    });
    it('should deserialize', async () => {
        let myProgram = mock();
        let deserialized = Program.deserialize(JSON.parse(JSON.stringify(myProgram.serialize())));
        expect(await myProgram.execute()).toEqual(await deserialized.execute());
    });
});
