import { GenerationPayload, Img2imgPayload, Txt2imgPayload } from "../lib/schema.mjs";
import ExtraSession from "../sessions/ExtraSession.mjs";
import GenerateSession from "../sessions/GenerateSession.mjs";
import { SDRequestable } from "./A1111Server.mjs";
import makeComfyImg2ImgPayload from "./comfy/workflows/img2img.mjs";
import makeComfyTxt2ImgPayload from "./comfy/workflows/txt2img.mjs";
import { ComfyApi, ComfyResult } from "./comfyui-api.mjs";

export default class ComfyServer implements SDRequestable {
    private readonly baseUrl: string;
    getBaseUrl(): string {
        return this.baseUrl
    }

    getReadableError(result: ComfyResult): string {
        const parseError = (error: any) => 
            `Error: ${error.message}\n${error.details ? `Details: ${error.details}\n` : ''}`;

        let errorMessage = result.error ? parseError(result.error) : '';

        if (result.node_errors) {
            for (const [node_id, node_error] of Object.entries(result.node_errors)) {
                errorMessage += `Node ${node_id}:\n${node_error.errors.map(parseError).join('')}`;
            }
        }
        return errorMessage;
    }

    public currentProcedure: { done: boolean } | null = null;

    public constructor(baseUrl: string) {
        if (!baseUrl) {
            throw new Error("comfyui baseurl is missed");
        }
        this.baseUrl = baseUrl;
    }
    public async ping(): Promise<boolean> {
        return await ComfyApi.headBaseURL(this) == 200
    }
    public async getDetailInfo(): Promise<any> {
        return await ComfyApi.objectInfo(this)
    }

    public async interrupt(): Promise<void> {
        if (!this.currentProcedure) return;
        await ComfyApi.interrupt(this);
        this.currentProcedure.done = true;
    }

    public async skip(): Promise<void> {
        if (!this.currentProcedure) return;
        await ComfyApi.interrupt(this);
        this.currentProcedure.done = false;
    }

    public async progress(skipImage: boolean): Promise<number> {
        if (!this.currentProcedure) return 0;
        const res = await ComfyApi.progress(this, { skip_current_image: skipImage });

        return res.progress
    }

    public async generate(session: GenerateSession, option: {
        batch?: number,
        imageFinishCallback?: (image: string, index: number) => void
    }): Promise<string[]> {
        if (session.controlNets.length) throw new Error('comfy with controlnet is not supported yet.');
        if (this.currentProcedure && !this.currentProcedure.done) throw new Error('server is running another job');

        const param = session.makeSDParam();
        const ckpt = session.modelCheckpoint;
        const refiner = session.modelCheckpointRefiner
        const sideEffectImages: string[] = [];
        const resultImages: string[] = [];

        this.currentProcedure = {
            done: false
        }

        for (let index = 0; index < (option.batch || 1); index++) {
            if (this.currentProcedure.done) break;

            const maybeImgtoImgParam = param as Img2imgPayload;
            let res: any;
            if (maybeImgtoImgParam.init_images && maybeImgtoImgParam.init_images.length) {
                if (maybeImgtoImgParam.denoising_strength == 0) {
                    console.warn('denoising strength is 0')
                }
                maybeImgtoImgParam.init_images = [(await ComfyApi.uploadImage(this, maybeImgtoImgParam.init_images[0])).name]
                const comfyImg2ImgPrompt = makeComfyImg2ImgPayload(param as Img2imgPayload, ckpt, refiner)
                res = await ComfyApi.prompt(this, comfyImg2ImgPrompt);

            } else {
                const comfyTxt2ImgPrompt = makeComfyTxt2ImgPayload(param as Txt2imgPayload, ckpt, refiner)
                res = await ComfyApi.prompt(this, comfyTxt2ImgPrompt);
            }
            
            if (res.error) {
                const readable_error = this.getReadableError(res)
                throw new Error(readable_error);
            }
            
            const prompt_id = res.prompt_id;
            while (true) {
                const res = await ComfyApi.queue(this);
                if (res.queue_pending.length || res.queue_running.length) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            const history = await ComfyApi.history(this);
            
            const promptInfo = history[prompt_id];
            // [4][0] for output id.
            const {filename,subfolder,type} = promptInfo.outputs[promptInfo.prompt[4][0]].images[0]
            const resultB64 = await ComfyApi.view(this, filename,type,subfolder);
            
            resultImages.push(resultB64)
            if (option.imageFinishCallback) {
                try { option.imageFinishCallback(resultB64, index) } catch (e) { }
            }
        }

        this.currentProcedure = { done: true };
        return resultImages.concat(sideEffectImages);
    }

    public async extra(session: ExtraSession): Promise<string[]> {
        // const res = await SDApi.extraBatchImages(this, session.makeSDParam());

        // if (res && res.images) {
        //     return res.images;

        // } else {
        //     throw new Error('unexpected result: \n' + JSON.stringify(res));
        // }
        return [];
    }
}