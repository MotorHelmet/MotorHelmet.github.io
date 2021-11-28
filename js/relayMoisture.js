// チャンネル
const moisture__From__RasPI = "moisture__From__RasPI";

// 記録用のインスタンス
let moistureDatas = new Datas("Moisture");

// 怖いがっている
moistureDatas.LIMIT = 0.25;

// // 記録用の配列
// let sht30Data = new Array();
// let date = new Array();
// let isScarryData = new Array();

async function setRelayMoisture()
{
    let relay = RelayServer("achex", "chirimenSocket");
    moistureDatas.channel = await relay.subscribe(moisture__From__RasPI);
    console.log("RelayServerに接続完了");
    moistureDatas.channel.onmessage = getMessageMoisture;
}

async function getMessageMoisture(msg)
{
    // データ取得
    let data = msg.data;
    let value = document.getElementById(`value${moistureDatas.sensor}`);
    let scary = document.getElementById(`value${moistureDatas.sensor}`);
    value.innerHTML = data;                               // 「値」出力

    let arrayAccel = document.getElementById(`array${moistureDatas.sensor}`);
    moistureDatas.sensorData.push(data);                                  // 配列に値を追加

    let isScary = (data > moistureDatas.LIMIT) ? true : false;
    scary.innerHTML = (isScary === true) ? "O" : "X";           // 「怖いか」 出力
    moistureDatas.isScarryData.push(isScary);
    
    // let max = Math.max.apply(null, sht30Data);                       
    let max = moistureDatas.sensorData.reduce(function(a, b)// 最大値取得
    {
        return (a <= b) ? b : a;
    });
    console.log(max);
    let maxAccel = document.getElementById(`max${moistureDatas.sensor}`);
    maxAccel.innerHTML = max;                                   // 最大値出力

    let now = new Date();                                       // 現在時刻取得
    moistureDatas.date.push(`${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

    let tr = document.createElement("tr");                      // tableに値を出力
    let tdData = document.createElement("td");
    let tdIsScaryData = document.createElement("td");
    let th = document.createElement("th");
    th.innerHTML = `${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    tdData.innerHTML = data;
    tdIsScaryData.innerHTML = (isScary === true) ? "O" : "X";
    tr.appendChild(th);
    tr.appendChild(tdData);
    tr.appendChild(tdIsScaryData);
    arrayAccel.appendChild(tr);
}