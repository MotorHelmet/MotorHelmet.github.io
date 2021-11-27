class Datas
{
    constructor(sensor, limit, channel)
    {
        this.channel = channel;
        this.sensor = sensor;
        this.sensorData = new Array();
        this.isScarryData = new Array();
        this.maxData = new Array();
        this.date = new Array();
        this.LIMIT = limit;
    }
}