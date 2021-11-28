// チャンネル
const accelMotor__From__RasPI = "accelMotor__From__RasPI";
const motor__From__PC = "motor__From__PC";

// 記録用のインスタンス
let accelDatas = new Datas("Accel");

// 怖いがっている
accelDatas.LIMIT = 15;

// 怖がっているか
// let isScary = false;

let channelAccel;
let relayToMotorAccel;
async function setRelayAccel()
{
    let relayAccel = RelayServer("achex", "chirimenSocket");
    accelDatas.channel = await relayAccel.subscribe(accelMotor__From__RasPI);
    console.log("RelayServerに接続完了");
    accelDatas.channel.onmessage = getMessageAccel;

    relayToMotorAccel = RelayServer("achex", "chirimenSocket");
    channelAccel = await relayToMotorAccel.subscribe(motor__From__PC);
}

async function getMessageAccel(msg)
{
    console.log("getMessageAccel");

    // データ取得
    let data = msg.data;
    let value = document.getElementById(`value${accelDatas.sensor}`);
    let scary = document.getElementById(`scary${accelDatas.sensor}`);
    value.innerHTML = data.all;                               // 「値」出力

    let arrayAccel = document.getElementById(`array${accelDatas.sensor}`);
    accelDatas.sensorData.push(data.all);                                  // 配列に値を追加

    accelDatas.isScary = (data.all > accelDatas.LIMIT) ? true : false;
    scary.innerHTML = (accelDatas.isScary === true) ? "O" : "X";           // 「怖いか」 出力
    accelDatas.isScarryData.push(accelDatas.isScary);
    
    let max = accelDatas.sensorData.reduce(function(a, b)// 最大値取得
    {
        return (a <= b) ? b : a;
    });
    console.log(max);
    let maxAccel = document.getElementById(`max${accelDatas.sensor}`);
    maxAccel.innerHTML = max;                                   // 最大値出力

    let now = new Date();                                       // 現在時刻取得
    accelDatas.date.push(`${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

    let tr = document.createElement("tr");                      // tableに値を出力
    let tdData = document.createElement("td");
    let tdIsScaryData = document.createElement("td");
    let th = document.createElement("th");
    th.innerHTML = `${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    tdData.innerHTML = data.all;
    tdIsScaryData.innerHTML = (accelDatas.isScary === true) ? "O" : "X";
    tr.appendChild(th);
    tr.appendChild(tdData);
    tr.appendChild(tdIsScaryData);
    arrayAccel.appendChild(tr);

    await sendDataToMotorAccel();
}


async function sendDataToMotorAccel()
{
    channelAccel.send(accelDatas.isScary);
    // channel.send({data: false});
    console.log(`モータに ${accelDatas.isScary} を送信しました`);
}