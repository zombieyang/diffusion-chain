// import {
//     SDServer, 
//     SDServerPool,
//     ControlNetSession,
//     ExtraSession,
//     GenerateSession
// } from '../src/entry';
// import { readBase64, writeBase64 } from './testlib';

// const server1 = new SDServer("");
// const server2 = new SDServer("");
// const serverPool = new SDServerPool([server1, server2]);

// const session = new GenerateSession();
// session.modelCheckpoint = 'majicmixLux_v2.safetensors [53a24db033]'

// session.prompt = `
// shot at 8k resolution, Horror, perspective, splash art, fantasy, photorealistic, highly detailed

// cute cat

// dark studio, rim lighting, low key
// dungeon basement interior, (mess, obstacle)
// concept artist, depth of field
// `
// session.negativePrompt = `
// (worst quality, low quality:2), monochrome, zombie,overexposure, watermark,text,bad anatomy,bad hand,
// ((extra hands)),extra fingers,too many fingers,fused fingers,bad arm,distorted arm,extra arms,fused arms,
// extra legs,missing leg,disembodied leg,extra nipples, detached arm, liquid hand,inverted hand,disembodied limb, 
// oversized head,extra body,extra navel,easynegative,(hair between eyes),sketch, duplicate, ugly, huge eyes, 
// text, logo, worst face, (bad and mutated hands:1.3), (blurry:2.0), horror, geometry, bad_prompt, (bad hands), 
// (missing fingers), multiple limbs, bad anatomy, (interlocked fingers:1.2), Ugly Fingers, 
// (extra digit and hands and fingers and legs and arms:1.4), (deformed fingers:1.2), (long fingers:1.2),
// (bad-artist-anime), bad-artist, bad hand, extra legs ,(ng_deepnegative_v1_75t),((hands on head))`

// session.batchSize = 1;
// session.cfgScale = 7;
// session.steps = 40;
// session.samplerIndex = 'DPM++ 2M SDE Karras'
// session.width = 512
// session.height = 512


// let interval: NodeJS.Timer | null = null;

// (async function () {
//     console.log('===gen1===');
//     const gen1 = serverPool.generate(session, { batch: 2 });
//     interval = setInterval(async () => {
//         console.log('progress:', await serverPool.progress(true));
//     }, 1000)
//     const res1 = await gen1;
//     clearInterval(interval);
//     res1.forEach((image, index) => {
//         writeBase64(`.testoutput/poolgen1_${index}.png`, image)
//     })

//     console.log('===gen2===');
//     session.initImagesBase64 = [readBase64(`.testoutput/poolgen1_0.png`)]
//     session.imageCfgScale = 1.5
//     session.denoisingStrength = 0.9
//     const gen2 = serverPool.generate(session, { batch: 2 });
//     interval = setInterval(async () => {
//         console.log('progress:', await serverPool.progress(true));
//     }, 1000)
//     setTimeout(() => {
//         serverPool.interrupt();
//     }, 3000);
//     const res2 = await gen2;
//     clearInterval(interval);
//     res2.forEach((image, index) => {
//         writeBase64(`.testoutput/poolgen2_${index}.png`, image)
//     })

//     console.log('===gen3===');
//     const cn1 = new ControlNetSession();
//     session.initImagesBase64 = [readBase64(`.testoutput/poolgen2_0.png`)]
//     cn1.originImageBase64 = readBase64(`.testoutput/poolgen1_0.png`);
//     cn1.module = 'openpose'
//     cn1.model = 'control_v11p_sd15_openpose [cab727d4]'
//     cn1.pixelPerfect = true
//     session.controlNets.push(cn1)
//     const gen3 = serverPool.generate(session, { batch: 2 });
//     interval = setInterval(async () => {
//         console.log('progress:', await serverPool.progress(true));
//     }, 1000)
//     const res3 = await gen3;
//     clearInterval(interval);
//     res3.forEach((image, index) => {
//         writeBase64(`.testoutput/poolgen3_${index}.png`, image)
//     })

//     console.log('===extra===');
//     const extraSession = new ExtraSession();
//     extraSession.upscaler1 = 'ESRGAN_4x';
//     extraSession.upscaler2 = 'None';
//     extraSession.upscalingResize = 4;
//     extraSession.upscalingResizeH = 2048;
//     extraSession.upscalingResizeW = 2048;
//     extraSession.imageBase64 = [readBase64(`.testoutput/poolgen3_0.png`)]

//     const extra = serverPool.extra(extraSession);
//     interval = setInterval(async () => {
//         console.log('progress:', await serverPool.progress(true));
//     }, 1000)
//     const res4 = await extra
//     clearInterval(interval);
//     res4.forEach((image, index) => {
//         writeBase64(`.testoutput/poolgen4_${index}.png`, image)
//     })

// })().catch(e => {
//     console.log(e);
//     interval && clearInterval(interval);
// });