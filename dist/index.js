'use strict';

fetch('https://randomuser.me/api/', {}).then(function (response) {
    // 這裡會得到一個 ReadableStream 的物件
    console.log(response);
    // 可以透過 blob(), json(), text() 轉成可用的資訊
    return response.json();
}).then(function (jsonData) {
    console.log(jsonData);
}).catch(function (err) {
    console.log('錯誤:', err);
});