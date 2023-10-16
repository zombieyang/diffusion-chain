import { ExtraPayload } from "../lib/schema.mjs"
import Session from "./Session.mjs"

export default class ExtraSession extends Session<ExtraPayload> {
    resizeMode: number = 0
    gfpganVisibility: number = 0
    codeformerVisibility: number = 0
    codeformerWeight: number = 0
    upscalingResize: number = 0
    upscalingResizeW: number = 0
    upscalingResizeH: number = 0
    upscalingCrop: boolean = false
    upscaler1: string = 'None'

    upscaler2: string = 'None'
    extrasUpscaler2Visibility: number = 0

    upscaleFirst: boolean = false
    imageBase64: string[] = []

    public makeSDParam() {
        return Object.assign({}, this.additionParams, {
            resize_mode: this.resizeMode,
            show_extras_results: false,
            gfpgan_visibility: this.gfpganVisibility,
            codeformer_visibility: this.codeformerVisibility,
            codeformer_weight: this.codeformerWeight,
            upscaling_resize: this.upscalingResize,
            upscaling_resize_h: this.upscalingResizeH,
            upscaling_resize_w: this.upscalingResizeW,
            upscaling_crop: this.upscalingCrop,
            upscaler_1: this.upscaler1,
            upscaler_2: this.upscaler2,
            extras_upscaler_2_visibility: this.extrasUpscaler2Visibility,
            upscale_first: this.upscaleFirst,
            imageList: this.imageBase64.map((imageBase64, index)=> {
                return {
                    name: `image${index}`,
                    data: imageBase64
                }
            })
        });
    }
}
