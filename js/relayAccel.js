// チャンネル
const accelMotor__From__RasPI = "accelMotor__From__RasPI";

// 怖いがっている
const SCARY_LIMIT = 15;

// 記録用の配列
let sensorData = new Array();
let date = new Array();
let isScarryData = new Array();

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
    value.innerHTML = data.all;                               // 「値」出力

    let arrayAccel = document.getElementById("arrayAccel");
    sensorData.push(data.all);                                  // 配列に値を追加

    let isScary = (data.all > SCARY_LIMIT) ? true : false;
    scary.innerHTML = (isScary === true) ? "O" : "X";           // 「怖いか」 出力
    isScarryData.push(isScary);
    
    // let max = Math.max.apply(null, sensorData);                       // 最大値取得
    let max = sensorData.reduce(function(a, b)
    {
        return (a <= b) ? b : a;
    });
    console.log(max);
    let maxAccel = document.getElementById("maxAccel");
    maxAccel.innerHTML = max;                                   // 最大値出力

    let now = new Date();                                       // 現在時刻取得
    date.push(`${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

    let tr = document.createElement("tr");                      // tableに値を出力
    let tdData = document.createElement("td");
    let tdIsScaryData = document.createElement("td");
    let th = document.createElement("th");
    th.innerHTML = `${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    tdData.innerHTML = data.all;
    tdIsScaryData.innerHTML = (isScary === true) ? "O" : "X";
    tr.appendChild(th);
    tr.appendChild(tdData);
    tr.appendChild(tdIsScaryData);
    arrayAccel.appendChild(tr);
}