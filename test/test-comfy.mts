import { ComfyServer, GenerateSession } from '../src/entry.mjs';
import { readBase64, writeBase64 } from './testlib.mjs';

const server = new ComfyServer("http://127.0.0.1:8188");
const session = new GenerateSession();
session.modelCheckpoint = 'majicmixSombre_v20.safetensors [5c9a81db7a]'

session.prompt = `beautiful scenery nature glass bottle landscape, , purple galaxy bottle`
session.negativePrompt = `text, watermark`

session.batchSize = 1;
session.cfgScale = 7;
session.steps = 40;
session.samplerIndex = 'dpmpp_2m_sde_gpu'
session.width = 512
session.height = 512

    ;
(async function () {
    // console.log('===gen1===');
    // const gen1 = server.generate(session, { batch: 1 });
    // let interval = setInterval(async () => {
    //     console.log('progress:', await server.progress(true));
    // }, 1000)
    // const res1 = await gen1;
    // clearInterval(interval);
    // res1.forEach((image, index)=> {
    //     writeBase64(`.testoutput_comfy/gen1_${index}.png`, image)
    // })

    // console.log('===gen2===');
    // session.initImagesBase64 = [readBase64(`.testoutput_comfy/gen1_${0}.png`)]
    // session.imageCfgScale = 1.5
    // session.denoisingStrength = 0.1
    // const gen2 = server.generate(session, { batch: 1 });
    // interval = setInterval(async () => {
    //     console.log('progress:', await server.progress(true));
    // }, 1000)
    // // setTimeout(() => {
    // //     server.interrupt();
    // // }, 3000);
    // const res2 = await gen2;
    // clearInterval(interval);
    // res2.forEach((image, index)=> {
    //     writeBase64(`.testoutput_comfy/gen2_${index}.png`, image)
    // })


    console.log('===gen3===');
    session.modelCheckpoint = 'sd_xl_base_1.0_0.9vae.safetensors'
    session.modelCheckpointRefiner = 'sd_xl_refiner_1.0_0.9vae.safetensors'
    session.initImagesBase64 = []
    session.denoisingStrength = 1
    const gen3 = server.generate(session, { batch: 1 });
    let interval = setInterval(async () => {
        console.log('progress:', await server.progress(true));
    }, 1000)
    const res3 = await gen3;
    clearInterval(interval);
    res3.forEach((image, index) => {
        writeBase64(`.testoutput_comfy/gen3_${index}.png`, image)
    })

    console.log('===gen4===');
    session.initImagesBase64 = [readBase64(`.testoutput_comfy/gen3_${0}.png`)]
    session.imageCfgScale = 1.5
    session.denoisingStrength = 0.1
    const gen4 = server.generate(session, { batch: 1 });
    interval = setInterval(async () => {
        console.log('progress:', await server.progress(true));
    }, 1000)
    // setTimeout(() => {
    //     server.interrupt();
    // }, 3000);
    const res4 = await gen4;
    clearInterval(interval);
    res4.forEach((image, index) => {
        writeBase64(`.testoutput_comfy/gen4_${index}.png`, image)
    })

})();