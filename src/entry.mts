import ComfyServer from "./backends/ComfyServer.mjs";
import A1111Server from "./backends/A1111Server.mjs";
// import SDServerPool from "./backends/SDServerPool";
import ControlNetSession from "./sessions/ControlNetSession.mjs";
import ExtraSession from "./sessions/ExtraSession.mjs";
import GenerateSession from "./sessions/GenerateSession.mjs";
import { A1111Api } from "./backends/A1111-api.mjs";
import { ComfyApi } from "./backends/comfyui-api.mjs";

enum ServerType {
    Comfy = "Comfy",
    A1111 = "A1111",
    Unknown = "Unknown"
}

async function checkServerType(baseUrl: string) {
    let finalType = ServerType.Unknown;
    await [
        {
            type: ServerType.A1111,
            checker: async () => {
                const server = new A1111Server(baseUrl);
                const result = await A1111Api.options(server);
                return typeof result != 'string';
            }
        },
        {
            type: ServerType.Comfy,
            checker: async () => {
                const server = new ComfyServer(baseUrl);
                const result = await ComfyApi.objectInfo(server);
                return typeof result != 'string';
            }
        }
    ].reduce(async (prom, predict) => {
        await prom
        if (await predict.checker()) {
            finalType = predict.type
            console.log('reject', predict.type)
            return Promise.reject("done")
        }
    }, Promise.resolve()).catch(() => {});

    return finalType;
}


export {
    ServerType,
    checkServerType,

    ComfyServer,
    A1111Server,
    // SDServerPool,
    
    ControlNetSession,
    ExtraSession,
    GenerateSession,
    
    A1111Api,
    ComfyApi
}