import { Img2imgPayload, Txt2imgPayload } from "../lib/schema.mjs";
import ControlNetSession from "./ControlNetSession.mjs";
import Session from "./Session.mjs";

export default class GenerateSession extends Session<Txt2imgPayload | Img2imgPayload> {
    public modelCheckpoint: string = '';
    public modelCheckpointRefiner: string = '';

    public denoisingStrength: number = 0.7;
    public prompt: string = "";
    public negativePrompt: string = "";
    public seed: number = -1;
    public samplerIndex: string = "";
    public batchSize: number = 0;
    public steps: number = 0;
    public cfgScale: number = 0;
    public width: number = 0;
    public height: number = 0;

    public restore_faces: boolean = false;
    // public n_iter: number = 1;

    public initImagesBase64: string[] = [];
    //resize_mode = 0 means "resize to upscaling_resize"
    //resize_mode = 1 means "resize to width and height"
    public resizeMode: number = 0;
    public imageCfgScale: number = 0;
    public maskBase64: string = '';
    public maskBlur: number = 0;
    public inpaintingFill: number = 0;
    public inpaintFullRes: boolean = false;
    public inpaintFullResPadding: number = 1;

    public controlNets: ControlNetSession[] = [];

    public makeSDParam(): Txt2imgPayload | Img2imgPayload {

        const base = {
            prompt: this.prompt,
            seed: this.seed,
            // sampler_name: this.samplerName,
            sampler_index: this.samplerIndex,
            batch_size: this.batchSize,
            steps: this.steps,
            cfg_scale: this.cfgScale,
            width: this.width,
            height: this.height,
            negative_prompt: this.negativePrompt,

            restore_faces: false,

            // styles: null,
            // subseed: -1,
            // subseed_strength: 0,
            // seed_resize_from_h: -1,
            // seed_resize_from_w: -1,
            // n_iter: 1,
            // tiling: false,
            // do_not_save_samples: false,
            // do_not_save_grid: false,
            // eta: null,

            // s_min_uncond: 0,
            // s_churn: 0,
            // s_tmax: null,
            // s_tmin: 0,
            // s_noise: 1,
            // override_settings: null,
            // override_settings_restore_afterwards: true,
            // script_args: [],
            // script_name: null,
            // send_images: true,
            // save_images: false,
            // alwayson_scripts: {},

        };

        const controlnet = this.controlNets.length ? {
            alwayson_scripts: {
                controlnet: {
                    args: this.controlNets.map(cn => cn.makeSDParam())
                }
            }
        } : {
            alwayson_scripts: {
            }
        }

        const txtOrImg = this.initImagesBase64 && this.initImagesBase64.length ? {
            denoising_strength: this.denoisingStrength,
            init_images: this.initImagesBase64,
            image_cfg_scale: this.imageCfgScale,
            resize_mode: this.resizeMode,
            mask: this.maskBase64 ? this.maskBase64 : void 0,
            mask_blur: this.maskBlur,
            inpainting_fill: this.inpaintingFill,
            inpaint_full_res: this.inpaintFullRes,
            inpaint_full_res_padding: this.inpaintFullResPadding,
            // inpainting_mask_invert: 0,
            // initial_noise_multiplier: 0,

            // include_init_images: false
        } : {
            // enable_hr: false,
            // hr_scale: 2,
            // hr_upscaler: null,
            // hr_second_pass_steps: 0,
            // hr_resize_x: 0,
            // hr_resize_y: 0,
            // hr_sampler_name: null,
            // hr_prompt: '',
            // hr_negative_prompt: '',

            // firstphase_width: 0,
            // firstphase_height: 0,
        }

        return Object.assign({}, this.additionParams, controlnet, base, txtOrImg) as any;
    }
}