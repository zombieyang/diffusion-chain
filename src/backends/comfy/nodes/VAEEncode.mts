import CheckpointLoaderSimple from "./CheckpointLoaderSimple.mjs";
import KSampler from "./KSampler.mjs";
import LoadImage from "./LoadImage.mjs";
import ComfyNode, { transferNodeOutputToInputIfMatch } from "./_Base.mjs";

export default class VAEEncode extends ComfyNode<{
    pixels: LoadImage,
    vae: CheckpointLoaderSimple
}> {
    constructor(id: number, props: {
        pixels: LoadImage,
        vae: CheckpointLoaderSimple
    }) {
        super(id, props);
    }

    public getPayload() {
        return {
            inputs: {
                pixels: transferNodeOutputToInputIfMatch(
                    this.properties.pixels, [
                    { type: LoadImage, outputIndex: 0}
                ]),
                vae: transferNodeOutputToInputIfMatch(
                    this.properties.vae, [
                    { type: CheckpointLoaderSimple, outputIndex: 2}
                ])
            },
            class_type: "VAEEncode"
        }
    }
    
}