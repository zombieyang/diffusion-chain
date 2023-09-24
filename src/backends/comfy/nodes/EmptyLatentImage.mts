import CheckpointLoaderSimple from "./CheckpointLoaderSimple.mjs";
import ComfyNode from "./_Base.mjs";

export default class EmptyLatentImage extends ComfyNode<{
    width: number,
    height: number
}> {
    constructor(id: number, properties: {
        width: number,
        height: number
    }) {
        super(id, properties);
    }

    public getPayload() {
        return {
            inputs: {
                "width": this.properties.width,
                "height": this.properties.height,
                "batch_size": 1
            },
            class_type: "EmptyLatentImage"
        }
    }
    
}