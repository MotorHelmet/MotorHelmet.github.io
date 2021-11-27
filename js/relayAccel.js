// チャンネル
const accelMotor__From__RasPI = "accelMotor__From__RasPI";

// 怖いがっている
const SCARY_LIMIT = 15;

let sensorData = new Array();
let date = new Array();

let channel;
async function setRelay()
{
    let relay = RelayServer("achex", "chirimenSocket");
    channel = await relay.subscribe(accelMotor__From__RasPI);
    console.log("RelayServerに接続完了");
    channel.onmessage = getMessage;
}

async function getMessage(msg)
{
    // データ取得
    let data = msg.data;
    let value = document.getElementById("valueAccel");
    let scary = document.getElementById("scaryAccel");
    let isScary = (sensorData.all > SCARY_LIMIT) ? true : false;
    value.innerHTML = sensorData.all;                               // 「値」出力
    scary.innerHTML = (isScary === true) ? "O" : "X";           // 「怖いか」 出力
    
    let max = Math.max.apply(null, sensorData);                       // 最大値取得
    let maxAccel = document.getElementById("maxAccel");
    maxAccel.innerHTML = max;                                   // 最大値出力

    let arrayAccel = document.getElementById("arrayAccel");
    sensorData.push(data.all);                                      // 配列に値を追加
    let tr = document.createElement("tr");                      // tableに値を出力
    let td = document.createElement("td");
    let th = document.createElement("th");
    let now = new Date();                                       // 現在時刻取得
    date.push(`${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
    th.innerHTML = `${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    td.innerHTML = data.all;
    tr.appendChild(th);
    tr.appendChild(td);
    arrayAccel.appendChild(tr);
}