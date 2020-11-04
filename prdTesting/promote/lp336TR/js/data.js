// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
var data = splitData([
    // ["2014-01-02", 16572.17, 16441.35, 16416.49, 16573.07, 80960000],
]);
function splitData(rawData) {
    var datas = [];
    var times = [];
    var vols = [];
    for (var i = 0; i < rawData.length; i++) {
        datas.push(rawData[i]);
        times.push(rawData[i].splice(0, 1)[0]);
        vols.push(rawData[i][4]);
    }
    return {
        datas: datas,
        times: times,
        vols: vols,
    };
}

// 请求数据
