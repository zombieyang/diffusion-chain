import CLIPTextEncode from "./CLIPTextEncode.mjs";
import CheckpointLoaderSimple from "./CheckpointLoaderSimple.mjs";
import EmptyLatentImage from "./EmptyLatentImage.mjs";
import LoadImage from "./LoadImage.mjs";
import VAEEncode from "./VAEEncode.mjs";
import ComfyNode, { transferNodeOutputToInputIfMatch } from "./_Base.mjs";

export default class KSampler extends ComfyNode<{
    seed: number,
    steps: number,
    cfg: number,
    sampler_name: string,
    scheduler: string,
    denoise: number,
    model: CheckpointLoaderSimple,
    positivePrompt: CLIPTextEncode,
    negativePrompt: CLIPTextEncode,
    latent_image: EmptyLatentImage | VAEEncode | KSampler
}> {

    constructor(id: number, properties: {
        seed: number,
        steps: number,
        cfg: number,
        sampler_name: string,
        scheduler: string,
        denoise: number,
        model: CheckpointLoaderSimple,
        positivePrompt: CLIPTextEncode,
        negativePrompt: CLIPTextEncode,
        latent_image: EmptyLatentImage | VAEEncode | KSampler
    }) {
        super(id, properties);
    }

    public getPayload(): any {
        return {
            inputs: {
                seed: this.properties.seed,
                steps: this.properties.steps,
                cfg: this.properties.cfg,
                sampler_name: this.properties.sampler_name,
                scheduler: this.properties.scheduler,
                denoise: this.properties.denoise,
                model: transferNodeOutputToInputIfMatch(
                    this.properties.model, [
                    { type: CheckpointLoaderSimple, outputIndex: 0}
                ]),
                positive: transferNodeOutputToInputIfMatch(
                    this.properties.positivePrompt, [
                    { type: CLIPTextEncode, outputIndex: 0}
                ]),
                negative: transferNodeOutputToInputIfMatch(
                    this.properties.negativePrompt, [
                    { type: CLIPTextEncode, outputIndex: 0}
                ]),
                latent_image: transferNodeOutputToInputIfMatch(
                    this.properties.latent_image, [
                    { type: EmptyLatentImage, outputIndex: 0},
                    { type: VAEEncode, outputIndex: 0},
                    { type: KSampler, outputIndex: 0},
                ])
            },
            class_type: "KSampler"
        }
    }

}