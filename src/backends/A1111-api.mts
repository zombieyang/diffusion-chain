import { DetectPayload, Img2imgPayload, Txt2imgPayload, ExtraPayload } from "../lib/schema.mjs";
import A1111Server from "./A1111Server.mjs";
import { get, head, postJSON } from "./util.mjs";


export class A1111Api {
    public static async txt2img(sd: A1111Server, param: Txt2imgPayload) {
        // console.log(param)
        return await postJSON(sd.getBaseUrl() + "/sdapi/v1/txt2img", param);
    }
    public static async img2img(sd: A1111Server, param: Img2imgPayload) {
        // console.log(param)
        return await postJSON(sd.getBaseUrl() + "/sdapi/v1/img2img", param)

    }
    public static async progress(sd: A1111Server, param: { skip_current_image: boolean } = { skip_current_image: true }) {
        return await get(sd.getBaseUrl() + "/sdapi/v1/progress" + (param.skip_current_image ? `?skip_current_image=1` : '?skip_current_image=0'))

    }
    public static async sdModels(sd: A1111Server) {
        return await get(sd.getBaseUrl() + "/sdapi/v1/sd-models")

    }
    public static async loras(sd: A1111Server) {
        return await get(sd.getBaseUrl() + "/sdapi/v1/loras")
    }
    public static async embeddings(sd: A1111Server) {
        return await get(sd.getBaseUrl() + "/sdapi/v1/embeddings")
    }
    public static async samplers(sd: A1111Server) {
        return await get(sd.getBaseUrl() + "/sdapi/v1/samplers")

    }
    public static async options(sd: A1111Server, params?: any) {
        if (params) {
            return await postJSON(sd.getBaseUrl() + "/sdapi/v1/options", params)
        } else {
            return await get(sd.getBaseUrl() + "/sdapi/v1/options")
        }
    }
    public static async interrupt(sd: A1111Server) {
        return await postJSON(sd.getBaseUrl() + "/sdapi/v1/interrupt", {})

    }
    public static async extraBatchImages(sd: A1111Server, param: ExtraPayload) {
        return await postJSON(sd.getBaseUrl() + "/sdapi/v1/extra-batch-images", param)

    }
    public static async upscalers(sd: A1111Server) {
        return await get(sd.getBaseUrl() + "/sdapi/v1/upscalers")

    }

    public static async controlnetModelList(sd: A1111Server) {
        return await get(sd.getBaseUrl() + "/controlnet/model_list")
    }
    public static async controlnetModuleList(sd: A1111Server) {
        return await get(sd.getBaseUrl() + "/controlnet/module_list");
    }
    public static async controlnetDetect(sd: A1111Server, param: DetectPayload): Promise<string[]> {
        return await postJSON(sd.getBaseUrl() + "/controlnet/detect", param)
    }

    public static async headBaseURL(sd: A1111Server): Promise<number> {
        return await head(sd.getBaseUrl())
    }
}