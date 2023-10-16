import { checkServerType } from "../src/entry.mjs";

(async function() {
    const type = await checkServerType("http://127.0.0.1:7860");
    console.log(type);
})().catch(e=> {})