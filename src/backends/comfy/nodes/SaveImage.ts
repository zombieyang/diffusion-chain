import VAEDecode from "./VAEDecode";
import ComfyNode, { transferNodeOutputToInputIfMatch } from "./_Base";

export default class SaveImage extends ComfyNode<{
    image: VAEDecode,
}> {
    public width: number = 0;

    constructor(id: number, props: {
        image: VAEDecode
    }) {
        super(id, props);
    }

    public getPayload() {
        return {
            inputs: {
                "filename_prefix": "ComfyUI-DiffusionChain",
                "images": transferNodeOutputToInputIfMatch(
                    this.properties.image, [
                    { type: VAEDecode, outputIndex: 0 }
                ])
            },
            class_type: "SaveImage"
        }
    }

}