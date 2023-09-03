import { DetectPayload, Img2imgPayload, Txt2imgPayload, ExtraPayload } from "../lib/schema";
import SDServer from "./SDServer";


export class SDApi {
    public static async txt2img(sd: SDServer, param: Txt2imgPayload) {
        // console.log(param)
        return await sd.post("/sdapi/v1/txt2img", param);
    }
    public static async img2img(sd: SDServer, param: Img2imgPayload) {
        // console.log(param)
        return await sd.post("/sdapi/v1/img2img", param)

    }
    public static async progress(sd: SDServer, param: { skip_current_image: boolean } = { skip_current_image: true }) {
        return await sd.get("/sdapi/v1/progress" + (param.skip_current_image ? `?skip_current_image=1` : '?skip_current_image=0'))

    }
    public static async sdModels(sd: SDServer) {
        return await sd.get("/sdapi/v1/sd-models")

    }
    public static async samplers(sd: SDServer) {
        return await sd.get("/sdapi/v1/samplers")

    }
    public static async options(sd: SDServer, params: any) {
        if (params) {
            return await sd.post("/sdapi/v1/options", params)
        } else {
            return await sd.get("/sdapi/v1/options")
        }
    }
    public static async interrupt(sd: SDServer) {
        return await sd.post("/sdapi/v1/interrupt", {})

    }
    public static async extraBatchImages(sd: SDServer, param: ExtraPayload) {
        return await sd.post("/sdapi/v1/extra-batch-images", param)

    }
    public static async upscalers(sd: SDServer) {
        return await sd.get("/sdapi/v1/upscalers")

    }
    public static async loras(sd: SDServer) {
        return await sd.get("/sdapi/v1/loras")
    }

    public static async controlnetModelList(sd: SDServer) {
        return await sd.get("/controlnet/model_list")
    }
    public static async controlnetModuleList(sd: SDServer) {
        return await sd.get("/controlnet/module_list");
    }
    public static async controlnetDetect(sd: SDServer, param: DetectPayload): Promise<string[]> {
        return await sd.post("/controlnet/detect", param)
    }
}