import { GenerationPayload, Img2imgPayload, Txt2imgPayload } from "../lib/schema";
import ExtraSession from "../sessions/ExtraSession";
import GenerateSession from "../sessions/GenerateSession";
import { SDApi } from "./sd-api";

export interface Requestable {
    interrupt(): Promise<void>;
}

export interface SDRequestable extends Requestable {
    progress(skipImage: boolean): Promise<any>;
    generate(session: GenerateSession, option: {
        batch?: number,
        imageFinishCallback?: (image: string, index: number) => void
    }): Promise<string[]>;
    extra(session: ExtraSession): Promise<string[]>;
}

export default class SDServer implements SDRequestable {
    public readonly baseUrl: string;
    public currentProcedure: { done: boolean } | null = null;

    public constructor(baseUrl: string) {
        if (!baseUrl) {
            throw new Error("sd baseurl is missed");
        }
        this.baseUrl = baseUrl;
    }
    async get(url: string): Promise<any> {
        var myHeaders = new Headers()
        myHeaders.set("Content-Type", "application/json;")
        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        }
        const res = (await fetch(this.baseUrl + url, requestOptions))
        
        if (res.status == 200) {
            return res.json()
        } else {
            return res.text()
        }
        
    }
    async post(url: string, param: any): Promise<any> {
        var myHeaders = new Headers()
        myHeaders.set("Content-Type", "application/json;")
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(param),
        }
        const res = (await fetch(this.baseUrl + url, requestOptions))
        console.log(res.status, this.baseUrl + url)
        if (res.status == 200) {
            return res.json()
        } else {
            return res.text()
        }
        
    }

    public async interrupt(): Promise<void> {
        if (!this.currentProcedure) return;
        await SDApi.interrupt(this);
        this.currentProcedure.done = true;
    }

    public async skip(): Promise<void> {
        if (!this.currentProcedure) return;
        await SDApi.interrupt(this);
        this.currentProcedure.done = false;
    }

    public async progress(skipImage: boolean): Promise<number> {
        if (!this.currentProcedure) return 0;
        const res = await SDApi.progress(this, { skip_current_image: skipImage });

        return res.progress
    }

    public async generate(session: GenerateSession, option: {
        batch?: number,
        imageFinishCallback?: (image: string, index: number) => void
    }): Promise<string[]> {
        if (this.currentProcedure && !this.currentProcedure.done) throw new Error('server is running another job');

        const param = session.makeSDParam();
        const ckpt = session.modelCheckpoint;
        const sideEffectImages: string[] = [];
        const resultImages: string[] = [];

        this.currentProcedure = {
            done: false
        }

        const switchModelResult = await SDApi.options(this, {
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
                res = await SDApi.img2img(this, param as Img2imgPayload);

            } else {
                res = await SDApi.txt2img(this, param as Txt2imgPayload);
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
        const res = await SDApi.extraBatchImages(this, session.makeSDParam());

        if (res && res.images) {
            return res.images;

        } else {
            throw new Error('unexpected result: \n' + JSON.stringify(res));
        }
    }
}