import CheckpointLoaderSimple from "./CheckpointLoaderSimple";
import KSampler from "./KSampler";
import ComfyNode, { transferNodeOutputToInputIfMatch } from "./_Base";

export default class VAEDecode extends ComfyNode<{
    vae: CheckpointLoaderSimple,
    samples: KSampler
}> {
    constructor(id: number, props: {
        vae: CheckpointLoaderSimple,
        samples: KSampler
    }) {
        super(id, props);
    }

    public getPayload() {
        return {
            inputs: {
                samples: transferNodeOutputToInputIfMatch(
                    this.properties.samples, [
                    { type: KSampler, outputIndex: 0}
                ]),
                vae: transferNodeOutputToInputIfMatch(
                    this.properties.vae, [
                    { type: CheckpointLoaderSimple, outputIndex: 2}
                ])
            },
            class_type: "VAEDecode"
        }
    }
    
}