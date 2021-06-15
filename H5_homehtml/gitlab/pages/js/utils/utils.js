define(function(require, exports, module) {
    var sessionStorageKey = 'index_page'
    var format = function(val) {
        val = val == null ? '' : $.trim(val.toString())
        return encodeURIComponent(val)
    }
    module.exports = {
        queryToJson: function(qs) {
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
        jsonToQuery: function(json) {
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
        ajax: function(opts) {
            var def = new $.Deferred()
            $.ajax(opts)
                .done(function(res) {
                    def.resolve(res)
                })
                .fail(function(error) {
                    console.log('network error code:' + error.status)
                    def.reject(error)
                })

            return def
        },
        randomTrack: function(num) {
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
        createMiddleAjaxParams: function(params) {
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
                url: 'https://'+window.middleDomain + params.head.url,
                method: params.head.method,
                data: JSON.stringify({ data: params.data, head: { appKey: params.head.appKey } })
            }
        },
        toFixed: function(num, s) {
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
        minus: function(num1, num2) {
            var r1 = this.getDecimalNum(num1)
            var r2 = this.getDecimalNum(num2)
            var m = Math.pow(10, Math.max(r1, r2))
            var n = r1 >= r2 ? r1 : r2
            return +(Math.round(num1 * m - num2 * m) / m).toFixed(n)
        },
        getDecimalNum: function(num) {
            try {
                return num.toString().split('.')[1].length
            } catch (e) {
                return 0
            }
        },
        setSessionStorage:function(key,data) {
            if(key) {
                try {
                    window.sessionStorage.setItem(sessionStorageKey+'-'+key,typeof data == 'object'?JSON.stringify(data):data)
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
        getSessionStorage:function(key){
            try {
                var data = window.sessionStorage.getItem(sessionStorageKey+'-'+key)
                if(data) {
                    return JSON.parse(data)
                } else {
                    return ''
                }
              
            } catch (e) {
                console.error('存储失败')
                return false
            }
        },
        setLocalStorage:function(key,data) {
            if(key) {
                try {
                    window.localStorage.setItem(sessionStorageKey+'-'+key,typeof data == 'object'?JSON.stringify(data):data)
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
        getLocalStorage:function(key){
            try {
                var data = window.localStorage.getItem(sessionStorageKey+'-'+key)
                if(data && ((data[0] === "{" && data[data.length-1] === "}") || (data[0] === "[" && data[data.length-1] === "]"))) {
                    return JSON.parse(data)
                } else {
                    return data
                }
              
            } catch (e) {
                console.error('存储失败')
                return false
            }
        },
        inApp:function(){
            if(window.JsHook && JsHook.appGoHome) {
                return true
            } else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoHome) {
                return true
            } else  {
                return false
            }
        },
        
        toAppPages:function(key){
           var _arr = [].slice.call(arguments)
            _arr = _arr.splice(1)
            if (window.JsHook && JsHook.appGoHome) {
                JsHook[key](arguments[1],arguments[2])
            } else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoHome) {
                window.webkit.messageHandlers[key].postMessage(arguments[1],arguments[2])
            }
        },
        guid:function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = (Math.random() * 16) | 0
                const v = c == 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
        },
        sendSocketMsg:function(type,data) {
            const result = {
                head: {
                    server: 'yz',
                    msgType: type,
                    sendTime: Date.now(),
                    company_id: data?data.companyId:''
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
