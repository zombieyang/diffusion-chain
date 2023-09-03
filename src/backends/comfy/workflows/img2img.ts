import { Img2imgPayload } from "../../../lib/schema";
import CLIPTextEncode from "../nodes/CLIPTextEncode";
import CheckpointLoaderSimple from "../nodes/CheckpointLoaderSimple";
import EmptyLatentImage from "../nodes/EmptyLatentImage";
import KSampler from "../nodes/KSampler";
import LoadImage from "../nodes/LoadImage";
import SaveImage from "../nodes/SaveImage";
import VAEDecode from "../nodes/VAEDecode";
import VAEEncode from "../nodes/VAEEncode";
import ComfyWorkflow from "./_Base";

export default function makeComfyImg2ImgPayload(payload: Img2imgPayload, ckpt: string, ckptRefiner: string | null) {
    const workflow = new ComfyWorkflow();
    const checkpointLoaderSimple = workflow.addNode<CheckpointLoaderSimple>(CheckpointLoaderSimple, {
        ckpt_name: ckpt
    })
    const checkpointLoaderSimpleForRefiner = !ckptRefiner ? null : workflow.addNode<CheckpointLoaderSimple>(CheckpointLoaderSimple, {
        ckpt_name: ckptRefiner
    })

    const positivePrompt = workflow.addNode<CLIPTextEncode>(CLIPTextEncode, {
        text: payload.prompt,
        clip: checkpointLoaderSimple
    })
    const negativePrompt = workflow.addNode<CLIPTextEncode>(CLIPTextEncode, {
        text: payload.negative_prompt,
        clip: checkpointLoaderSimple
    })
    const positivePromptForRefiner = !checkpointLoaderSimpleForRefiner ? null : workflow.addNode<CLIPTextEncode>(CLIPTextEncode, {
        text: payload.prompt,
        clip: checkpointLoaderSimpleForRefiner
    })
    const negativePromptForRefiner = !checkpointLoaderSimpleForRefiner ? null : workflow.addNode<CLIPTextEncode>(CLIPTextEncode, {
        text: payload.negative_prompt,
        clip: checkpointLoaderSimpleForRefiner
    })
    const loadImage = workflow.addNode<LoadImage>(LoadImage, {
        image: payload.init_images[0]
    })
    const vaeEncode = workflow.addNode<VAEEncode>(VAEEncode, {
        pixels: loadImage,
        vae: checkpointLoaderSimple
    })
    const sampler = workflow.addNode<KSampler>(KSampler, {
        cfg: payload.cfg_scale,
        seed: payload.seed == -1 ? Math.round(Math.random() * 1000000000000000) : payload.seed,
        steps: payload.steps,
        sampler_name: payload.sampler_index,
        scheduler: "normal",
        denoise: payload.denoising_strength,
        model: checkpointLoaderSimple,
        positivePrompt,
        negativePrompt,
        latent_image: vaeEncode,
    })
    const samplerRefiner = !checkpointLoaderSimpleForRefiner || !positivePromptForRefiner || !negativePromptForRefiner ? null : workflow.addNode<KSampler>(KSampler, {
        cfg: payload.cfg_scale,
        seed: payload.seed == -1 ? Math.round(Math.random() * 1000000000000000) : payload.seed,
        steps: payload.steps,
        sampler_name: payload.sampler_index,
        scheduler: "normal",
        denoise: 1,
        model: checkpointLoaderSimpleForRefiner,
        positivePrompt: positivePromptForRefiner,
        negativePrompt: negativePromptForRefiner,
        latent_image: sampler,
    })
    const vaeDecode = workflow.addNode<VAEDecode>(VAEDecode, {
        vae: checkpointLoaderSimpleForRefiner || checkpointLoaderSimple,
        samples: samplerRefiner || sampler
    })
    workflow.addNode<SaveImage>(SaveImage, {
        image: vaeDecode
    })
    return workflow.getPayload()

}