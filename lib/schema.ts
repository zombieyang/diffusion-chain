export interface GenerationPayload {
    prompt: string,
    styles: string[],
    seed: number,
    subseed: number,
    subseed_strength: number,
    seed_resize_from_h: number,
    seed_resize_from_w: number,
    sampler_name: string,
    batch_size: number,
    n_iter: number,
    steps: number,
    cfg_scale: number,
    width: number,
    height: number,
    restore_faces: boolean,
    tiling: boolean,
    do_not_save_samples: boolean,
    do_not_save_grid: boolean,
    negative_prompt: string,
    eta: number,
    s_min_uncond: number,
    s_churn: number,
    s_tmax: number,
    s_tmin: number,
    s_noise: number,
    override_settings: any,
    override_settings_restore_afterwards: boolean,
    sampler_index: string,
    script_args: string[],
    alwayson_script: any

}
export interface Img2imgPayload extends GenerationPayload {
    denoising_strength: number,
    init_images: string[],
    resize_mode?: number,
    image_cfg_scale?: number,
    mask?: string,
    mask_blur?: number,
    inpainting_fill?: number,
    inpaint_full_res?: boolean,
    inpaint_full_res_padding?: number,
    inpainting_mask_invert?: number,
    initial_noise_multiplier?: number,

    include_init_images: boolean,
}
export interface Txt2imgPayload extends GenerationPayload {
    enable_hr?: boolean,
    firstphase_width?: number,
    firstphase_height?: number,
    hr_scale?: number,
    hr_upscaler?: string,
    hr_second_pass_steps?: number,
    hr_resize_x?: number,
    hr_resize_y?: number,
    hr_sampler_name?: string,
    hr_prompt?: string,
    hr_negative_prompt?: string,
}
export interface DetectPayload {
    controlnet_module: string,
    controlnet_input_images: string[],
    controlnet_processor_res: number,
    controlnet_threshold_a: number,
    controlnet_threshold_b: number
}
export interface ExtraPayload {
    resize_mode: number,
    show_extras_results: boolean,
    gfpgan_visibility: number,
    codeformer_visibility: number,
    codeformer_weight: number,
    upscaling_resize: number,
    upscaling_resize_w: number,
    upscaling_resize_h: number,
    upscaling_crop: boolean,
    upscaler_1: string,
    upscaler_2: string,
    extras_upscaler_2_visibility: number,
    upscale_first: boolean,
    imageList: [{ data: string, name: string }]
}
export enum ControlMode {
    Balanced = 'Balanced',
    Prompt = 'My prompt is more important',
    ControlNet = 'ControlNet is more important'
}
export interface ControlNetPayload {
    input_image: string,
    model: string,
    module: string,
    weight: number,

    enabled: boolean,
    mask: string,
    resize_mode: string,
    lowvram: boolean,
    processor_res: number,
    threshold_a: number,
    threshold_b: number,
    //  string,
    guidance_start: number,
    guidance_end: number,
    guessmode: boolean,
    control_mode: ControlMode,
    pixel_perfect: boolean,
}