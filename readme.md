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
