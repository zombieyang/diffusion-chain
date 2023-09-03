import { ComfyPromptNode } from "../../comfyui-api";

export default abstract class ComfyNode<T extends {}> {
    public properties: T;
    public id: number;
    constructor(id: number, properties: T) {
        this.id = id;
        this.properties = properties;
    }

    public abstract getPayload(): ComfyPromptNode;
}

export function transferNodeOutputToInputIfMatch(node: ComfyNode<any>, options: {
    type: { new(...args: any[]): typeof node },
    outputIndex: number
}[]) {
    for (let i = 0; i < options.length; i++) {
        if (node instanceof options[i].type) {
            return [
                node.id.toString(),
                options[i].outputIndex
            ]
        }
    }
    return null;
}