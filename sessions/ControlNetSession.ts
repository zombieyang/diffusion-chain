import SDServer, { SDRequestable } from "../backends/SDServer";
import { SDApi } from "../backends/sd-api";
import { ControlMode, ControlNetPayload } from "../lib/schema";
import Session from "./Session";
 

export default class ControlNetSession extends Session<ControlNetPayload> {

    public enabled: boolean = true;
    public module: string = 'none';
    public model: string = 'none';
    public weight: number = 1;
    public originImageBase64: string = '';
    public annotatorBase64: string = '';
    public maskBase64: string = '';
    public lowVRam: boolean = false;
    public processRes: number = 512;
    public thresholdA: number = 0;
    public thresholdB: number = 0;
    public guidanceStart: number = 0;
    public guidanceEnd: number = 1;
    public pixelPerfect: boolean = false;
    public controlMode: ControlMode = ControlMode.Balanced;


    public async detect(sd: SDServer): Promise<string> {
        const res: any = await SDApi.controlnetDetect(sd, {
            controlnet_module: this.module,
            controlnet_processor_res: this.processRes,
            controlnet_threshold_a: this.thresholdA,
            controlnet_threshold_b: this.thresholdB,
            controlnet_input_images: [this.originImageBase64]
        });

        if (res && res.info == 'Success') {
            return (res.images as string[])[0];

        } else {
            throw new Error('unexpected result: \n' + res);
        }
    }

    public makeSDParam() {
        return {
            input_image: this.annotatorBase64 || this.originImageBase64,
            model: this.model,
            module: this.annotatorBase64 ? 'none' : this.module,
            weight: this.weight,

            enabled: this.enabled,
            mask: this.maskBase64,
            resize_mode: 'Scale to Fit (Inner Fit)',
            lowvram: this.lowVRam,
            processor_res: this.processRes,
            threshold_a: this.thresholdA,
            threshold_b: this.thresholdB,
            // guidance: ,
            guidance_start: this.guidanceStart,
            guidance_end: this.guidanceEnd,
            guessmode: false,
            control_mode: this.controlMode,
            pixel_perfect: this.pixelPerfect
        }
    }
}
