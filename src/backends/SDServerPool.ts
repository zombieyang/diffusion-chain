// import { Img2imgPayload, Txt2imgPayload } from '../lib/schema';
// import ExtraSession from '../sessions/ExtraSession';
// import GenerateSession from '../sessions/GenerateSession';
// import A1111Server, { SDRequestable } from './A1111Server'
// import { SDApi } from './sd-api';

// export default class SDServerPool implements SDRequestable {
//     private pool: A1111Server[] = [];
//     public currentProcedure: { done: boolean } | null = null;

//     constructor(servers: A1111Server[]) {
//         servers.forEach(server => { this.addServer(server) });
//     }

//     public addServer(server: A1111Server) {
//         if (this.pool.filter(_server => server.getBaseUrl() == _server.getBaseUrl()).length) return;

//         this.pool.push(server);
//     }
//     public removeServer(server: A1111Server) {
//         for (let i = 0; i < this.pool.length; i++) {
//             if (this.pool[i] == server) {
//                 this.pool.splice(i, 1);
//                 return;
//             }
//         }
//     }

//     async generate(session: GenerateSession, option: { batch?: number | undefined; imageFinishCallback?: ((image: string, index: number) => void) | undefined; }): Promise<string[]> {
//         if (this.currentProcedure && !this.currentProcedure.done) throw new Error('server pool is running another job');

//         const param = session.makeSDParam();
//         const ckpt = session.modelCheckpoint;
//         const sideEffectImages: string[] = [];
//         const resultImages: string[] = [];

//         this.currentProcedure = {
//             done: false
//         }


//         await Promise.all(
//             this.pool.map((server) =>
//                 SDApi.options(server, {
//                     'sd_model_checkpoint': ckpt
//                 })
//             )
//         )
//         const batch = option.batch || 1
//         let doneCount = 0;

//         await Promise.all(
//             this.pool.map(async (server, index) => {
//                 while (doneCount < batch) {
//                     if (!this.currentProcedure || this.currentProcedure.done) break;
//                     doneCount++

//                     const maybeImgtoImgParam = param as Img2imgPayload;
//                     let res: any;
//                     if (maybeImgtoImgParam.init_images && maybeImgtoImgParam.init_images.length) {
//                         if (maybeImgtoImgParam.denoising_strength == 0) {
//                             console.warn('denoising strength is 0')
//                         }
//                         res = await SDApi.img2img(server, param as Img2imgPayload);

//                     } else {
//                         res = await SDApi.txt2img(server, param as Txt2imgPayload);
//                     }

//                     if (res && res.images && res.images[0]) {
//                         resultImages.push(res.images[0]);
//                         if (res.images.length > 0 && sideEffectImages.length == 0) {
//                             res.images.forEach((image: string, index: number) => {
//                                 index > 0 && sideEffectImages.push(image);
//                             })
//                         }
//                         if (option.imageFinishCallback) {
//                             try { option.imageFinishCallback(res.images[0], index) } catch (e) { }
//                         }

//                     } else {
//                         doneCount--;
//                         throw new Error('unexpected result: \n' + JSON.stringify(res));
//                     }
//                 }
//             })
//         )

//         this.currentProcedure = { done: true };
//         return resultImages.concat(sideEffectImages);
//     }

//     public async extra(session: ExtraSession): Promise<string[]> {
//         const res = await SDApi.extraBatchImages(this.pool[0], session.makeSDParam());

//         if (res && res.images) {
//             return res.images;

//         } else {
//             throw new Error('unexpected result: \n' + JSON.stringify(res));
//         }
//     }

//     async progress(skipImage: boolean): Promise<number[]> {
//         if (!this.currentProcedure) return (new Array(this.pool.length)).fill(0) as number[];
//         const res = await Promise.all(
//             this.pool.map(server => {
//                 return SDApi.progress(server, { skip_current_image: skipImage });
//             })
//         )
//         return res.map(data => data.progress);
//     }
//     public async interrupt(): Promise<void> {
//         if (!this.currentProcedure) return;
//         await this.pool.map(server => {
//             return SDApi.interrupt(server);
//         })
//         this.currentProcedure.done = true;
//     }

//     public async skip(index: number): Promise<void> {
//         if (!this.currentProcedure) return;
//         if (arguments.length == 0) {
//             await Promise.all(this.pool.map(server => {
//                 return SDApi.interrupt(server)
//             }));
//         } else {
//             await SDApi.interrupt(this.pool[index]);
//         }
//         this.currentProcedure.done = false;
//     }
// }



