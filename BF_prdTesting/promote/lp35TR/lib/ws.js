function WS(options) {
    this.options = options
    this.subs = {}
    this.callbacks = {}
    this.init()
}

WS.prototype = {
    init: function() {
        this.ws = new WebSocket(this.options.url)
        this.bindEvents()
    },

    reset: function() {
        this.callbacks = {}
        this.subs = {}
    },

    bindEvents: function() {
        this.ws.addEventListener('open', this.open.bind(this))
        this.ws.addEventListener('message', this.message.bind(this))
        this.ws.addEventListener('error', this.error.bind(this))
        this.ws.addEventListener('close', this.close.bind(this))
    },

    close: function() {
        var _this = this
        console.error('close')
        clearTimeout(this.timer)
        setTimeout(function() {
            (_this.callbacks['close'] || []).forEach(function(cb) {
                cb()
            })
        }, 1000)
    },

    error: function() {
        console.error('error')
        clearTimeout(this.timer)
    },

    open: function() {
        this.heartbeat()
        // getLastPrice()
        // this.getKline()
        var _this = this
        ;(this.subs['send'] || []).forEach(function(item) {
            _this.send(item)
        })
    },

    message: function(res) {
        var data = res.data
        if (res.data && typeof res.data === 'string') {
            try {
                data = JSON.parse(res.data)
            } catch (error) {
            }
        }

        switch (Object.prototype.toString.call(data)) {
        case '[object Object]': {
            Array.isArray(this.callbacks[data.msg_code]) && this.callbacks[data.msg_code].forEach(function(e) { return e(data) })
            break;
        }
        case '[object String]': {
            if (data.indexOf('p') === 0) {
                Array.isArray(this.callbacks['productSubscription']) && this.callbacks['productSubscription'].forEach(function(e) {
                    var str = data.match(/\((.*)\)/)
                    if (str && str[1]) {
                        str = str[1].split(',')
                    }
                    e(str)
                })
            }

            break;
        }
        case '[object Blob]': {
            Array.isArray(this.callbacks['klineHistoryDataBlob']) && this.callbacks['klineHistoryDataBlob'].forEach(function(e) {
                ungzip(data).then(function(obj) { e(obj) })
            })
            break;
        }
        }
    },

    send: function(data) {
        if (this.ws.readyState === 1) {
            this.ws.send(JSON.stringify(data))
        } else {
            if (Array.isArray(this.subs['send'])) {
                this.subs['send'].push(data)
            } else {
                this.subs['send'] = [data]
            }
        }
    },

    subscribe: function(option, cb) {
        var msgType = option.msgType
        if (msgType) {
            if (Array.isArray(this.callbacks[msgType])) {
                this.callbacks[msgType].push(cb)
            } else {
                this.callbacks[msgType] = [cb]
            }
        }

        // 原生回调函数
        var event = option.event
        if (event) {
            if (Array.isArray(this.callbacks[event])) {
                this.callbacks[event].push(cb)
            } else {
                this.callbacks[event] = [cb]
            }
        }
    },

    heartbeat: function() {
        var _this = this
        this.timer = setTimeout(function() {
            _this.send(_this.options.heartData)
            _this.heartbeat()
        }, 20000)
    }
}

function ungzip (blod) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader()
        // var startTime = Date.now()
        reader.onload = function() {
            var charData = reader.result.split('').map(function(x) { return x.charCodeAt(0) })
            var data = pako.inflate(new Uint8Array(charData))
            var strData = ''
            /**
             * String.fromCharCode.apply(null, array) 显示 Maximum call stack size exceeded
             * 超过最大调用堆栈大小
             *
             */
            var chunk = 8 * 1024
            var i
            var uint16Arr = new Uint16Array(data)
            for (i = 0; i < uint16Arr.length / chunk; i++) {
                strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk, (i + 1) * chunk))
            }
            strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk))
            var result = JSON.parse(decodeURIComponent(strData))
            resolve(result)
        }
        reader.readAsBinaryString(blod)
        reader.onerror = function() { reject() }
    })

    // return Base64.decode(result)
}
