import {requestGPIOAccess} from "./node_modules/node-web-gpio/dist/index.js"; // WebGPIO を使えるようにするためのライブラリをインポート
import nodeWebSocketLib from "websocket";
import {RelayServer} from "./RelayServer.js";

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec)); // sleep 関数を定義

const motor__From__PC = "motor__From__PC";

// モータとLEDを付けるか
let isScary = false;

let relay;
let channel;
async function initialize()
{
  relay = RelayServer("achex", "chirimenSocket" , nodeWebSocketLib, "https://chirimen.org");
  console.log("RelayServer接続完了");
  channel = await relay.subscribe(motor__From__PC);

  channel.message = setScary;

  blink();
  motor();
}

async function setScary()// 怖いのかのフラグの管理
{
  isScary = (isScary) ? false : true;
  console.log(`isScary: ${isScary}`);
}

async function blink() {
  const gpioAccess = await requestGPIOAccess(); // GPIO を操作する 
  const port = gpioAccess.ports.get(26); // 26 番ポートを操作する

  await port.export("out"); // ポートを出力モードに設定

  // 無限ループ
  while (isScary) {
    // 1秒間隔で LED が点滅します
    await port.write(1); // LEDを点灯
    await sleep(300);   // 1000 ms (1秒) 待機
    await port.write(0); // LEDを消灯
    await sleep(700);   // 1000 ms (1秒) 待機
    // await port.write(1); // LEDを点灯
    // await sleep(1000);   // 1000 ms (1秒) 待機
    // await port.write(0); // LEDを消灯
    // await sleep(500);   // 1000 ms (1秒) 待機
  }
}

async function motor() {
  const gpioAccess = await requestGPIOAccess(); // GPIO を操作する 
  const port = gpioAccess.ports.get(21); // 26 番ポートを操作する

  await port.export("out"); // ポートを出力モードに設定

  // 無限ループ
  while (isScary) {
    // 1秒間隔で LED が点滅します
    await port.write(1); // LEDを点灯
    await sleep(300);   // 1000 ms (1秒) 待機
    await port.write(0); // LEDを消灯
    await sleep(700);   // 1000 ms (1秒) 待機
    // await port.write(1); // LEDを点灯
    // await sleep(1000);   // 1000 ms (1秒) 待機
    // await port.write(0); // LEDを消灯
    // await sleep(500);   // 1000 ms (1秒) 待機
  }
}

initialize();