fetch('https://randomuser.me/api/', {})
    .then((response) => {
        // 這裡會得到一個 ReadableStream 的物件
        console.log(response);
        // 可以透過 blob(), json(), text() 轉成可用的資訊
        return response.json();
    }).then((jsonData) => {
        console.log(jsonData);
    }).catch((err) => {
        console.log('錯誤:', err);
    });