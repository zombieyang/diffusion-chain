import ComfyNode from "./_Base";

export default class LoadImage extends ComfyNode<{
    image: string
}> {
    constructor(id: number, properties: {
        image: string
    }) {
        super(id, properties);
    }

    public getPayload() {
        return {
            inputs: {
                "image": this.properties.image,
                "choose file to upload": "image"
            },
            class_type: "LoadImage"
        }
    }
    
}