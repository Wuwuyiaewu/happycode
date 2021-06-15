define(function (require, exports, module) {
    var sessionStorageKey = 'index_page'
    var CryptoJS = require('utils/lib/crypto-js/crypto-js.min')
    var format = function (val) {
        val = val == null ? '' : $.trim(val.toString())
        return encodeURIComponent(val)
    }
    module.exports = {
        queryToJson: function (qs) {
            var qList = ''
            if (qs) {
                qList = $.trim(qs).split('&')
            } else {
                qList = $.trim(window.location.search ? window.location.search : '?')
                    .substring(1)
                    .split('&')
            }
            var json = {},
                i = 0,
                len = qList.length

            for (; i < len; i++) {
                if (qList[i]) {
                    var hash = qList[i].split('='),
                        key = hash[0],
                        value = hash[1]
                    // 如果只有key没有value, 那么将全部丢入一个$nullName数组中
                    if (hash.length < 2) {
                        value = key
                        key = '$nullName'
                    }
                    if (!(key in json)) {
                        // 如果缓存堆栈中没有这个数据，则直接存储
                        json[key] = decodeURIComponent(value)
                    } else {
                        // 如果堆栈中已经存在这个数据，则转换成数组存储
                        json[key] = [].concat(json[key], decodeURIComponent(value))
                    }
                }
            }
            return json
        },
        jsonToQuery: function (json) {
            var query = []
            if (typeof json == 'object') {
                for (var k in json) {
                    if (k === '$nullName') {
                        query = query.concat(json[k])
                        continue
                    }
                    if (json[k] instanceof Array) {
                        for (var i = 0, len = json[k].length; i < len; i++) {
                            query.push(k + '=' + format(json[k][i]))
                        }
                    } else {
                        if (typeof json[k] != 'function') {
                            query.push(k + '=' + format(json[k]))
                        }
                    }
                }
            }

            if (query.length) {
                return query.join('&')
            } else {
                return ''
            }
        },
        ajax: function (opts) {
            var def = new $.Deferred()
            $.ajax(opts)
                .done(function (res) {
                    def.resolve(res)
                })
                .fail(function (error) {
                    console.log('network error code:' + error.status)
                    def.reject(error)
                })

            return def
        },

        ims_ajax: function (options) {
            options = options || {};  //调用函数时如果options没有指定，就给它赋值{},一个空的Object
            options.type = (options.type || "GET").toUpperCase();/// 请求格式GET、POST，默认为GET
            options.dataType = options.dataType || "json";    //响应数据格式，默认json
            //格式化请求参数
            function formatParams(data) {
                var arr = [];
                for (var name in data) {
                    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
                }
                arr.push(("v=" + Math.random()).replace(".", ""));
                return arr.join("&");
            }
            var params = formatParams(JSON.parse(options.data.data).data);//options.data请求的数据

            var xhr;

            //考虑兼容性
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveObject) {//兼容IE6以下版本
                xhr = new ActiveXobject('Microsoft.XMLHTTP');
            }

            //启动并发送一个请求
            if (options.type == "GET") {
                xhr.open("GET", options.url + "?" + params, true);
                xhr.send(null);
            } else if (options.type == "POST") {
                xhr.open("post", options.url, true);

                //设置表单提交时的内容类型
                //Content-type数据请求的格式
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(params);
            }

            //    设置有效时间
            setTimeout(function () {
                if (xhr.readySate != 4) {
                    xhr.abort();
                }
            }, options.timeout)

            //    接收
            //     options.success成功之后的回调函数  options.error失败后的回调函数
            //xhr.responseText,xhr.responseXML  获得字符串形式的响应数据或者XML形式的响应数据
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var status = xhr.status;
                    if (status >= 200 && status < 300 || status == 304) {
                        options.success && options.success(xhr.responseText, xhr.responseXML);
                    } else {
                        options.error && options.error(status);
                    }
                }
            }
        },

        randomTrack: function (num) {
            var _num = num || 4
            var _trackArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
            var _track = ''
            for (var i = 0; i < _num; i++) {
                _track += _trackArr[Math.floor(Math.random() * (_trackArr.length - 1))]
            }
            _track += new Date()
                .getTime()
                .toString()
                .substring(6)
            return _track
        },
        createMiddleAjaxParams: function (params) {
            return {
                headers: {
                    method: params.head.url,
                    'Content-Type': 'application/json;',
                    module: 'uat-account',
                    rpcType: 'http',
                    httpMethod: 'post',
                    Authorization: params.head.authorization,
                    token: params.head.token,
                    trace: this.randomTrack(8)
                },
                dataType: 'json',
                timeout: 3000,
                url: 'https://' + window.middleDomain + params.head.url,
                method: params.head.method,
                data: JSON.stringify({ data: params.data, head: { appKey: params.head.appKey } })
            }
        },
        createGuessAjaxParams: function (data) {
            var key = CryptoJS.enc.Utf8.parse('GTSAPP123457890a')
            let encryptedData = CryptoJS.AES.encrypt(data.data.accountNo, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            })
            let params = {
                companyId: data.companyId,
                platform: 'CATS',
                accountNo: data.accountNo,
                key: encryptedData.ciphertext.toString()
            }
            return {
                data: JSON.stringify({ data: Object.assign(params, data.data) })
            }
        },
        toFixed: function (num, s) {
            var a = 2
            if (s) {
                a = s
            }
            const times = Math.pow(10, a)
            let des = 0
            if (num > 0) {
                des = num * times + 0.5
            } else {
                des = num * times - 0.5
            }
            des = parseInt(des, 10) / times
            return Number(des).toFixed(a)
        },
        /* 减法 */
        minus: function (num1, num2) {
            var r1 = this.getDecimalNum(num1)
            var r2 = this.getDecimalNum(num2)
            var m = Math.pow(10, Math.max(r1, r2))
            var n = r1 >= r2 ? r1 : r2
            return +(Math.round(num1 * m - num2 * m) / m).toFixed(n)
        },
        getDecimalNum: function (num) {
            try {
                return num.toString().split('.')[1].length
            } catch (e) {
                return 0
            }
        },
        setSessionStorage: function (key, data) {
            if (key) {
                try {
                    window.sessionStorage.setItem(sessionStorageKey + '-' + key, typeof data == 'object' ? JSON.stringify(data) : data)
                    return true
                } catch (e) {
                    console.error('存储失败')
                    return false
                }
            } else {
                console.error('参数传入有误')
                return false
            }
        },
        getSessionStorage: function (key) {
            try {
                var data = window.sessionStorage.getItem(sessionStorageKey + '-' + key)
                if (data) {
                    return JSON.parse(data)
                } else {
                    return ''
                }

            } catch (e) {
                console.error('存储失败')
                return false
            }
        },
        setLocalStorage: function (key, data) {
            if (key) {
                try {
                    window.localStorage.setItem(sessionStorageKey + '-' + key, typeof data == 'object' ? JSON.stringify(data) : data)
                    return true
                } catch (e) {
                    console.error('存储失败')
                    return false
                }
            } else {
                console.error('参数传入有误')
                return false
            }
        },
        getLocalStorage: function (key) {
            try {
                var data = window.localStorage.getItem(sessionStorageKey + '-' + key)
                if (data && ((data[0] === "{" && data[data.length - 1] === "}") || (data[0] === "[" && data[data.length - 1] === "]"))) {
                    return JSON.parse(data)
                } else {
                    return data
                }

            } catch (e) {
                console.error('存储失败')
                return false
            }
        },
        inApp: function () {
            if (window.JsHook && JsHook.appGoHome) {
                return true
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoHome) {
                return true
            } else {
                return false
            }
        },

        toAppPages: function (key) {
            var _arr = [].slice.call(arguments)
            _arr = _arr.splice(1)
            if (window.JsHook && JsHook.appGoHome) {
                JsHook[key](arguments[1], arguments[2])
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoHome) {
                window.webkit.messageHandlers[key].postMessage(arguments[1], arguments[2])
            }
        },
        guid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0
                const v = c == 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
        },
        sendSocketMsg: function (type, data) {
            const result = {
                head: {
                    server: 'yz',
                    msgType: type,
                    sendTime: Date.now(),
                    company_id: data ? data.companyId : ''
                },
                content: data,
                device: 'h5',
                trace: this.guid(),
                version_code: 1
            }
            return JSON.stringify(result)
        }
    }
})
