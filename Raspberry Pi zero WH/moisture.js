import {requestI2CAccess} from "./node_modules/node-web-i2c/index.js";
import ADS1X15 from "@chirimen/ads1x15";
import nodeWebSocketLib from "websocket";
import {RelayServer} from "./RelayServer.js";
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

// チャンネル
const moisture__From__RasPI = "moisture__From__RasPI";

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const ads1x15 = new ADS1X15(port, 0x48);
  // If you uses ADS1115, you have to select "true", otherwise select "false".
  await ads1x15.init(true);
  console.log("init complete");

  let relay = RelayServer("achex", "chirimenSocket" , nodeWebSocketLib, "https://chirimen.org");
  let channel = await relay.subscribe(moisture__From__RasPI);
  console.log("RelayServer接続完了");
  
  while (true) {
    let output = "";

      const rawData = await ads1x15.read(0);
      const voltage = ads1x15.getVoltage(rawData);
      const data = voltage.toFixed(3);
      output += `CH${0}}:${data}V `;
    console.log(output);

    channel.send(data);

    await sleep(500);
  }
}
