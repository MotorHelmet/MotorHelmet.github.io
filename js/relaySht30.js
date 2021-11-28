// チャンネル
const sht30__From__RasPI = "sht30__From__RasPI";

// 記録用のインスタンス
let sht30Datas = new Datas("Sht30");

// 怖いがっている
sht30Datas.LIMIT = 25;

async function setRelaySht30()
{
    console.log("test");
    let relay = RelayServer("achex", "chirimenSocket");
    sht30Datas.channel = await relay.subscribe(sht30__From__RasPI);
    console.log("RelayServerに接続完了");
    sht30Datas.channel.onmessage = getMessageSht30;
}

function getMessageSht30(msg)
{
    // データ取得
    let data = msg.data;
    let value = document.getElementById("valueSht30");
    let scary = document.getElementById("scarySht30");
    value.innerHTML = data;                               // 「値」出力

    let arraySht30 = document.getElementById("arraySht30");
    sht30Datas.sensorData.push(data);                                  // 配列に値を追加

    let isScary = (data > sht30Datas.LIMIT) ? true : false;
    scary.innerHTML = (isScary === true) ? "O" : "X";           // 「怖いか」 出力
    sht30Datas.isScarryData.push(isScary);
    
    // let max = Math.max.apply(null, accelData);                       // 最大値取得
    let max = sht30Datas.sensorData.reduce(function(a, b)
    {
        return (a <= b) ? b : a;
    });
    console.log(max);
    let maxAccel = document.getElementById("maxSht30");
    maxAccel.innerHTML = max;                                   // 最大値出力

    let now = new Date();                                       // 現在時刻取得
    sht30Datas.date.push(`${now.getFullYear()}/${now.getMonth()}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

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
    arraySht30.appendChild(tr);
}