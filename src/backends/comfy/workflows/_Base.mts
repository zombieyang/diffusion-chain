import { ComfyPrompt } from "../../comfyui-api.mjs";
import ComfyNode from "../nodes/_Base.mjs";

type ComfyNodeProps<Type> = Type extends ComfyNode<infer X> ? X : never



export default class ComfyWorkflow {
    protected index: number = 1;
    protected nodes: ComfyNode<any>[] = [];
    constructor() { }

    public addNode<T extends ComfyNode<any>>(
        type: { new(id: number, properties: ComfyNodeProps<T>): T },
        properties: ComfyNodeProps<T>
    ): T {
        const node = new type(this.index++, properties)
        this.nodes.push(node)
        return node;
    }

    public getPayload(): ComfyPrompt {
        return {
            "client_id": "35ce003fdaff4721b66c71c06bfcc3a3",
            prompt: this.nodes.reduce((prev: { [key: number]: any }, item) => {
                prev[item.id] = item.getPayload();
                return prev;
            }, {})
        }
        // {
            //     "client_id": "35ce003fdaff4721b66c71c06bfcc3a3",
            //     "prompt": {
            //         "3": {
            //             "inputs": {
            //                 "seed": payload.seed == -1 ? Math.round(Math.random() * 1000000000000000) : payload.seed,
            //                 "steps": payload.steps,
            //                 "cfg": payload.cfg_scale,
            //                 "sampler_name": payload.sampler_index,
            //                 "scheduler": "normal",
            //                 "denoise": 1,
            //                 "model": [
            //                     "4",
            //                     0
            //                 ],
            //                 "positive": [
            //                     "6",
            //                     0
            //                 ],
            //                 "negative": [
            //                     "7",
            //                     0
            //                 ],
            //                 "latent_image": [
            //                     "10",
            //                     0
            //                 ]
            //             },
            //             "class_type": "KSampler"
            //         },
            //         "4": {
            //             "inputs": {
            //                 "ckpt_name": ckpt.split(' ')[0]
            //             },
            //             "class_type": "CheckpointLoaderSimple"
            //         },
            //         "5": {
            //             "inputs": {
            //                 "width": payload.width,
            //                 "height": payload.height,
            //                 "batch_size": 1
            //             },
            //             "class_type": "EmptyLatentImage"
            //         },
            //         "6": {
            //             "inputs": {
            //                 "text": payload.prompt,
            //                 "clip": [
            //                     "4",
            //                     1
            //                 ]
            //             },
            //             "class_type": "CLIPTextEncode"
            //         },
            //         "7": {
            //             "inputs": {
            //                 "text": payload.negative_prompt,
            //                 "clip": [
            //                     "4",
            //                     1
            //                 ]
            //             },
            //             "class_type": "CLIPTextEncode"
            //         },
            //         "8": {
            //             "inputs": {
            //                 "samples": [
            //                     "3",
            //                     0
            //                 ],
            //                 "vae": [
            //                     "4",
            //                     2
            //                 ]
            //             },
            //             "class_type": "VAEDecode"
            //         },
            //         "9": {
            //             "inputs": {
            //                 "filename_prefix": "ComfyUI",
            //                 "images": [
            //                     "8",
            //                     0
            //                 ]
            //             },
            //             "class_type": "SaveImage"
            //         },
            //         "10": {
            //             "inputs": {
            //                 "amount": 1,
            //                 "samples": [
            //                     "5",
            //                     0
            //                 ]
            //             },
            //             "class_type": "RepeatLatentBatch"
            //         }
            //     }
            // }
        // }
    }
}