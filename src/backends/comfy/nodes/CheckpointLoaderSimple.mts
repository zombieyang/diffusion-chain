import ComfyNode from "./_Base.mjs";



export default class CheckpointLoaderSimple extends ComfyNode<{
    ckpt_name: string
}> {
    constructor(id: number, properties: {
        ckpt_name: string
    }) {
        super(id, properties);
    }

    public getPayload() {
        return {
            inputs: {
                ckpt_name: this.properties.ckpt_name.split(' ')[0]
            },
            class_type: 'CheckpointLoaderSimple'
        }
    }
    
}