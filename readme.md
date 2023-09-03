#

launch your StableDiffusion with `--api`

```javascript
const server = new SDServer("http://127.0.0.1:7860");
const session = new GenerateSession();
session.modelCheckpoint = 'majicmixSombre_v20.safetensors [5c9a81db7a]'

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

also support comfyUI and SDXL now:
```javascript

const server = new SDServer("http://127.0.0.1:8188");
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