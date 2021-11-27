import {requestI2CAccess} from "./node_modules/node-web-i2c/index.js";
import nodeWebSocketLib from "websocket";
import {RelayServer} from "./RelayServer.js.js";
import ADS1X15 from "@chirimen/ads1x15";
import SHT30 from "@chirimen/sht30";
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const sht30__From__RasPI = "sht30__From__RasPI";

main();

async function main() {
  const i2cAccess = await requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const ads1x15 = new ADS1X15(port, 0x48);
  const sht30 = new SHT30(port, 0x44);
  await sht30.init();
  // If you uses ADS1115, you have to select "true", otherwise select "false".
  await ads1x15.init(true);
  console.log("init complete");
  while (true) {
    let output = "";
    // ADS1115 has 4 channels.
      const rawData = await ads1x15.read(0);
      const voltage = ads1x15.getVoltage(rawData);
      output += `CH${0}:${voltage.toFixed(3)}V `;
      await sleep(500);
      const data = {
        humidity: undefined,
        temperature: undefined,
      };
      const data = await sht30.readData();
      console.log(
      [
        `Humidity: ${humidity.toFixed(2)}%`,
        `Temperature: ${temperature.toFixed(2)} degree`
      ].join(", ")
      );
      console.log(output);
      
      let relay = RelayServer("achex", "chirimenSocket" , nodeWebSocketLib, "https://chirimen.org");
      let channel = relay.subscribe(sht30__From__RasPI);
      channel.send(data.temperature);
    }
  }
