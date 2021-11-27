import {requestI2CAccess} from "node-web-i2c/index.js";
import GROVEACCELEROMETER from "@chirimen/grove-accelerometer";
import nodeWebSocketLib from "websocket";
import {RelayServer} from "./RelayServer.js.js";
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const accelMotor__From__RasPI = "accelMotor__From__RasPI";

main();

async function main() {
    const i2cAccess = await requestI2CAccess();
    const port = i2cAccess.ports.get(1);
    const groveaccelerometer = new GROVEACCELEROMETER(port, 0x53);
    await groveaccelerometer.init();

	let relay = RelayServer("achex", "chirimenSocket" , nodeWebSocketLib, "https://chirimen.org");
    let channel = await relay.subscribe(accelMotor__From__RasPI);

    for (;;) {
        try {
        const values = await groveaccelerometer.read();
        values.all = Math.abs(values.x) + Math.abs(values.y);
        console.log(`ax: ${values.x}, ax: ${values.y}, ax: ${values.z}\nAll: ${values.all}`);
        channel.send(values);
        } catch (err) {
            console.error("READ ERROR:" + err);
        }
        await sleep(1000);
    }
}
