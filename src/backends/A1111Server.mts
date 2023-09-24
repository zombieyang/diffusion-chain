import { GenerationPayload, Img2imgPayload, Txt2imgPayload } from "../lib/schema.mjs";
import ExtraSession from "../sessions/ExtraSession.mjs";
import GenerateSession from "../sessions/GenerateSession.mjs";
import { A1111Api } from "./A1111-api.mjs";

export interface Requestable {
    interrupt(): Promise<void>;
}

export interface SDRequestable extends Requestable {
    getBaseUrl(): string;
    progress(skipImage: boolean): Promise<any>;
    generate(session: GenerateSession, option: {
        batch?: number,
        imageFinishCallback?: (image: string, index: number) => void
    }): Promise<string[]>;
    extra(session: ExtraSession): Promise<string[]>;
    ping(): Promise<boolean>;
    getDetailInfo(): Promise<any>;
}

export default class A1111Server implements SDRequestable {
    private readonly baseUrl: string;
    getBaseUrl(): string {
        return this.baseUrl
    }
    public currentProcedure: { done: boolean } | null = null;

    public constructor(baseUrl: string) {
        if (!baseUrl) {
            throw new Error("sd baseurl is missed");
        }
        this.baseUrl = baseUrl;
    }
    
    ping(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getDetailInfo(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async interrupt(): Promise<void> {
        if (!this.currentProcedure) return;
        await A1111Api.interrupt(this);
        this.currentProcedure.done = true;
    }

    public async skip(): Promise<void> {
        if (!this.currentProcedure) return;
        await A1111Api.interrupt(this);
        this.currentProcedure.done = false;
    }

    public async progress(skipImage: boolean): Promise<number> {
        if (!this.currentProcedure) return 0;
        const res = await A1111Api.progress(this, { skip_current_image: skipImage });

        return res.progress
    }

    public async generate(session: GenerateSession, option: {
        batch?: number,
        imageFinishCallback?: (image: string, index: number) => void
    } = {}): Promise<string[]> {
        if (this.currentProcedure && !this.currentProcedure.done) throw new Error('server is running another job');

        const param = session.makeSDParam();
        const ckpt = session.modelCheckpoint;
        const sideEffectImages: string[] = [];
        const resultImages: string[] = [];

        this.currentProcedure = {
            done: false
        }

        const switchModelResult = await A1111Api.options(this, {
            'sd_model_checkpoint': ckpt
        })
        console.log(switchModelResult)

        for (let index = 0; index < (option.batch || 1); index++) {
            if (this.currentProcedure.done) break;

            const maybeImgtoImgParam = param as Img2imgPayload;
            let res: any;
            if (maybeImgtoImgParam.init_images && maybeImgtoImgParam.init_images.length) {
                if (maybeImgtoImgParam.denoising_strength == 0) {
                    console.warn('denoising strength is 0')
                }
                res = await A1111Api.img2img(this, param as Img2imgPayload);

            } else {
                res = await A1111Api.txt2img(this, param as Txt2imgPayload);
            }

            if (res && res.images && res.images[0]) {
                resultImages.push(res.images[0]);
                if (res.images.length > 0 && sideEffectImages.length == 0) {
                    res.images.forEach((image: string, index: number) => {
                        index > 0 && sideEffectImages.push(image);
                    })
                }
                if (option.imageFinishCallback) {
                    try { option.imageFinishCallback(res.images[0], index) } catch (e) { }
                }

            } else {
                throw new Error('unexpected result: \n' + JSON.stringify(res));
            }
        }

        this.currentProcedure = { done: true };
        return resultImages.concat(sideEffectImages);
    }

    public async extra(session: ExtraSession): Promise<string[]> {
        const res = await A1111Api.extraBatchImages(this, session.makeSDParam());

        if (res && res.images) {
            return res.images;

        } else {
            throw new Error('unexpected result: \n' + JSON.stringify(res));
        }
    }
}