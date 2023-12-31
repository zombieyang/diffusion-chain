import CheckpointLoaderSimple from "./CheckpointLoaderSimple.mjs";
import ComfyNode, { transferNodeOutputToInputIfMatch } from "./_Base.mjs";

export default class CLIPTextEncode extends ComfyNode<{
    text: string,
    clip: CheckpointLoaderSimple
}> {
    constructor(id: number, properties: {
        text: string,
        clip: CheckpointLoaderSimple
    }) {
        super(id, properties);
    }

    public getPayload() {
        return {
            inputs: {
                text: this.properties.text,
                clip: transferNodeOutputToInputIfMatch(
                    this.properties.clip, [
                    { type: CheckpointLoaderSimple, outputIndex: 1}
                ])
            },
            class_type: "CLIPTextEncode"
        }
    }

}