// チャンネル
const accelMotor__From__RasPI = "accelMotor__From__RasPI";

// 記録用のインスタンス
let accelDatas = new Datas("Accel");

// 怖いがっている
accelDatas.LIMIT = 15;

// // 記録用の配列
// let sht30Data = new Array();
// let date = new Array();
// let isScarryData = new Array();

async function setRelayAccel()
{
    let relay = RelayServer("achex", "chirimenSocket");
    accelDatas.channel = await relay.subscribe(accelMotor__From__RasPI);
    console.log("RelayServerに接続完了");
    accelDatas.channel.onmessage = getMessageAccel;
}

async function getMessageAccel(msg)
{
    // データ取得
    let data = msg.data;
    let value = document.getElementById(`value${accelDatas.sensor}`);
    let scary = document.getElementById(`scary${accelDatas.sensor}`);
    value.innerHTML = data.all;                               // 「値」出力

    let arrayAccel = document.getElementById(`array${accelDatas.sensor}`);
    accelDatas.sensorData.push(data.all);                                  // 配列に値を追加

    let isScary = (data.all > accelDatas.LIMIT) ? true : false;
    scary.innerHTML = (isScary === true) ? "O" : "X";           // 「怖いか」 出力
    accelDatas.isScarryData.push(isScary);
    
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
    tdIsScaryData.innerHTML = (isScary === true) ? "O" : "X";
    tr.appendChild(th);
    tr.appendChild(tdData);
    tr.appendChild(tdIsScaryData);
    arrayAccel.appendChild(tr);
}