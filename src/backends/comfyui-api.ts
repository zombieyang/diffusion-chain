import { readFileSync } from "fs";
import { DetectPayload, Img2imgPayload, Txt2imgPayload, ExtraPayload } from "../lib/schema";
import ComfyServer from "./ComfyServer";
import makeComfyTxt2ImgPayload from "./comfy/workflows/txt2img";

export interface ComfyPromptNode {
    "inputs": any,
    "class_type": string
}

export interface ComfyPrompt {
    client_id: string,
    prompt: {
        [id: number]: ComfyPromptNode
    }
}
interface ComfyError {
    type: string
    message: string
    details: string
    extra_info: any
}

interface NodeError {
    errors: ComfyError[]
    dependent_outputs: string[]
    class_type: string
}
export interface ComfyResult {
    error?: ComfyError
    node_errors?: { [key: string]: NodeError }
}

export class ComfyApi {
    public static async prompt(comfyui: ComfyServer, payload: ComfyPrompt) {
        return await comfyui.postJSON("/prompt", payload);
    }
    public static async queue(comfyui: ComfyServer) {
        return await comfyui.get("/queue");
    }
    public static async history(comfyui: ComfyServer) {
        return await comfyui.get("/history");
    }
    public static async view(comfyui: ComfyServer, filename: string, type: string="output",subfolder: string=""): Promise<string> {
        const ab: ArrayBuffer = await comfyui.get(`/view?subfolder=${subfolder}&type=${type}&filename=${filename}` );
        return Buffer.from(ab).toString('base64');
    }
    public static async progress(comfyui: ComfyServer, param: { skip_current_image: boolean } = { skip_current_image: true }) {
        return { progress: 0 };
        // return await comfyui.get("/sdapi/v1/progress" + (param.skip_current_image ? `?skip_current_image=1` : '?skip_current_image=0'))

    }

    public static async interrupt(comfyui: ComfyServer) {
        return await comfyui.postJSON("/interrupt", {})

    }
    // public static async extraBatchImages(comfyui: ComfyServer, param: ExtraParam) {
    //     return await comfyui.post("/sdapi/v1/extra-batch-images", param)

    // }
    public static async objectInfo(comfyui: ComfyServer): Promise<string[]> {
        return await comfyui.get("/object_info")
    }
    public static async uploadImage(comfyui: ComfyServer, imgBase64: string): Promise<any> {
        return await comfyui.postForm('/upload/image', {
            image: new Blob([Buffer.from(imgBase64, 'base64')])
        })
    }
}