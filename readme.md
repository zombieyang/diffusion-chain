# Diffusion-Chain
A jsapi to invoke StableDiffusion or ComfyUI.

## Usage 
launch your StableDiffusion with `--api`

```javascript
import { A1111Server, GenerateSession } from 'diffusion-chain'
const server = new A1111Server("http://127.0.0.1:7860");
const session = new GenerateSession();
session.modelCheckpoint = 'majicmixSombre_v20.safetensors [5c9a81db7a]'

session.prompt = `
cute cat
`

server.ping.then(isAlive => { console.log(isAlive) })

server.generate(session, { batch: 1 })
    .then(res=> {
        res.forEach(image=> {
            console.log(image) // the base64 of image
        })
    })
```

also support comfyUI and SDXL now:
```javascript

import { ComfyServer, GenerateSession } from 'diffusion-chain'
const server = new ComfyServer("http://127.0.0.1:8188");
const session = new GenerateSession();
session.modelCheckpoint = 'sd_xl_base_1.0_0.9vae.safetensors'
session.modelCheckpointRefiner = 'sd_xl_refiner_1.0_0.9vae.safetensors'

session.prompt = `
cute cat
`

server.generate(session, { batch: 1 })
    .then(res=> {
        res.forEach(image=> {
            console.log(image) // the base64 of image
        })
    })
```

## More parameter
see [schema.ts](https://github.com/zombieyang/diffusion-chain/blob/main/src/sessions/GenerateSession.ts)
