import {
    wsParams
} from '@/utils/index'
class SocketEvent {
    constructor (ws) {
        this._socket = ws
        this._map = new Map() // 记录promise
        this.requestToResponse = {
            login: ['UserLoginInfoRet', 'InitProductInfo', 'GroupSymbolInitListRet', 'GroupGetRet', 'TradeServerTimeRet'],
            pendings: ['OrderListRet'],
            cancelOrder: ['OrderCancelRet'],
            positions: ['PositionListRet'],
            modifyOrder: ['OrderUpdateRet'],
            profitloss: ['PositionUpdateRet'],
            klineHistoryRangeData: ['KlineHistoryRangeData'],
            uptrend: ['Uptrend'],
            symbolInfo: ['SymbolInfo'],
            logout: ['UserLogoutRet']
        }
        // 通过msgId关联
        this.aboutAsMsgid = {
            klineHistoryData: ['KlineHistoryData'],
            SharingTick: ['SharingTickRet'],
            openOrder: ['OrderAddRet', 'DealAddRet']
        }
        this.userDefined = {} // 用户自定义回调关系
        this.errorCode = ['Warning', 'msgNotVerified', 'OpenOrderCaptchaRet'] // 错误协议内容
        this.timer = null
        this.sendRequest = {} // 保存请求返回的数据
        this.timeOut = 60 // 超时时间 秒
    }

    emit (socketData) {
        const { msg_code, content, remark, desc } = socketData
        let { code } = socketData
        if (!content) return
        // 强行吧 OpenOrderCaptchaRet 消息包装成错误，给下单请求返回需要做人机验证
        if (msg_code === 'OpenOrderCaptchaRet') {
            for (const key in this.sendRequest) {
                if (this.sendRequest[key].type === 'openOrder') {
                    content.msg_id = key * 1
                    code = '0001'
                    break
                }
            }
        }
        // 处理通过请求协议返回错误的数据
        // 处理通过请求协议返回错误的数据
        if (Object.keys(this.sendRequest).indexOf(msg_code) >= 0 && code !== '0000') {
            const entry = this._map.get(msg_code)
            entry.resolve({
                errorType: msg_code,
                errorData: content,
                requestData: entry.data,
                remark: remark || desc
            })
            this._map.delete(msg_code)
            delete this.sendRequest[msg_code]
            return
        }
        // 错误优先，如果协议记录在errorCode里边匹配返回消息的 msg_id是不是在请求的msgId或者msg_id
        const _responseMsgId = content.msg_id || content.msgId

        if (this.errorCode.indexOf(msg_code) >= 0 && code !== '0000' && _responseMsgId) {
            // 遍历Map获取msg_id 或者msgId
            for (const [key, value] of this._map) {
                const loaclMsgId = value.data.msg_id || value.data.msgId
                if (_responseMsgId === loaclMsgId) {
                    value.resolve({
                        errorType: msg_code,
                        errorData: content,
                        requestData: value.data,
                        remark: remark || desc
                    })
                    this._map.delete(key)
                    delete this.sendRequest[key]
                    break
                }
            }
            return
        }
        // 获取到关联是通过msgId还是msg_code
        // 先查询msg_code是不是记录在用户自定义的 userDefined 然后再查询是不是在 requestToResponse记录中
        // 获取 msg_code是不是在需要回调的requestToResponse键值对中
        // 因为可能需要好几个消息一起才能触发回调，使用保存获取到的消息记录，并且保存数据记录

        let _aboutAsInfo = {
            key: null, // 在map跟sendRequest 的key
            groupKey: null // 在分组的哪个key
        }
        for (const aboutAsMsgIdKey in this.aboutAsMsgid) {
            if (this.aboutAsMsgid[aboutAsMsgIdKey].indexOf(msg_code) >= 0) {
                _aboutAsInfo = {
                    key: _responseMsgId,
                    groupKey: aboutAsMsgIdKey
                }
                break
            }
        }
        // const keys = Object.keys(this.userDefined).concat(Object.keys(this.requestToResponse))

        if (!_aboutAsInfo.key) {
            for (const userDefinedKey in this.userDefined) {
                if (this.userDefined[userDefinedKey] && this.userDefined[userDefinedKey].indexOf(msg_code) >= 0) {
                    _aboutAsInfo = {
                        key: userDefinedKey,
                        groupKey: userDefinedKey
                    }
                    break
                }
            }
        }

        if (!_aboutAsInfo.key) {
            for (const requestToResponseKey in this.requestToResponse) {
                if (this.requestToResponse[requestToResponseKey] && this.requestToResponse[requestToResponseKey].indexOf(msg_code) >= 0) {
                    _aboutAsInfo = {
                        key: requestToResponseKey,
                        groupKey: requestToResponseKey
                    }
                    break
                }
            }
        }
        if (this.sendRequest.hasOwnProperty(_aboutAsInfo.key)) {
            const entry = this._map.get(_aboutAsInfo.key)
            if (code === '0000') {
                entry.sendTime = new Date().getTime()
                // 返回数据正常把数据保存起来
                if (this.sendRequest[_aboutAsInfo.key].msgCode.indexOf(msg_code) < 0) {
                    this.sendRequest[_aboutAsInfo.key].msgCode.push(msg_code)
                    this.sendRequest[_aboutAsInfo.key].msgData[msg_code] = content
                }
                let flg = true // 默认为true

                if (this.userDefined[_aboutAsInfo.groupKey]) {
                    this.userDefined[_aboutAsInfo.groupKey].forEach(item => {
                        if (this.sendRequest[_aboutAsInfo.key].msgCode.indexOf(item) < 0) {
                            flg = false
                        }
                    })
                } else if (this.aboutAsMsgid[_aboutAsInfo.groupKey]) {
                    this.aboutAsMsgid[_aboutAsInfo.groupKey].forEach(item => {
                        if (this.sendRequest[_aboutAsInfo.key].msgCode.indexOf(item) < 0) {
                            flg = false
                        }
                    })
                } else {
                    this.requestToResponse[_aboutAsInfo.groupKey].forEach(item => {
                        if (this.sendRequest[_aboutAsInfo.key].msgCode.indexOf(item) < 0) {
                            flg = false
                        }
                    })
                }
                if (flg) {
                    if ((this.aboutAsMsgid[_aboutAsInfo.groupKey] && this.aboutAsMsgid[_aboutAsInfo.groupKey].length === 1) || (this.requestToResponse[_aboutAsInfo.groupKey] && this.requestToResponse[_aboutAsInfo.groupKey].length === 1)) {
                        entry.resolve(this.sendRequest[_aboutAsInfo.key].msgData[msg_code])
                    } else {
                        entry.resolve(this.sendRequest[_aboutAsInfo.key].msgData)
                    }

                    delete this.userDefined[_aboutAsInfo.groupKey]
                    this._map.delete(_aboutAsInfo.key)
                    delete this.sendRequest[_aboutAsInfo.key]
                }
            } else {
                // 返回出错了--触发错误回调
                entry.resolve({
                    errorType: msg_code,
                    errorData: content,
                    requestData: entry.data,
                    remark: remark || desc
                })
                delete this.userDefined[_aboutAsInfo.groupKey]
                this._map.delete(_aboutAsInfo.key)
                delete this.sendRequest[_aboutAsInfo.key]
            }
        }
    }
    // bindEvent() {
    //     if (!this._socket) return false
    //     this._socket.addEventListener('message', ev => {
    //         // 判断是不是需要触发回调
    //         if (ev && typeof ev.data === 'object') {
    //             return
    //         }
    //         const { msg_code, code, content, remark, desc } = JSON.parse(ev.data)
    //         if (!content) return
    //         // 处理通过请求协议返回错误的数据
    //         // 处理通过请求协议返回错误的数据
    //         if (Object.keys(this.sendRequest).indexOf(msg_code) >= 0 && code !== '0000') {
    //             const entry = this._map.get(msg_code)
    //             entry.resolve({
    //                 errorType: msg_code,
    //                 errorData: content,
    //                 requestData: entry.data,
    //                 remark: remark || desc
    //             })
    //             this._map.delete(msg_code)
    //             delete this.sendRequest[msg_code]
    //             return
    //         }
    //         // 错误优先，如果协议记录在errorCode里边匹配返回消息的 msg_id是不是在请求的msgId或者msg_id
    //         let _responseMsgId = content.msg_id || content.msgId

    //         if (this.errorCode.indexOf(msg_code) >= 0 && code !== '0000' && _responseMsgId) {
    //             // 遍历Map获取msg_id 或者msgId
    //             for (const [key, value] of this._map) {
    //                 const loaclMsgId = value.data.msg_id || value.data.msgId
    //                 if (_responseMsgId === loaclMsgId) {
    //                     value.resolve({
    //                         errorType: msg_code,
    //                         errorData: content,
    //                         requestData: value.data,
    //                         remark: remark || desc
    //                     })
    //                     this._map.delete(key)
    //                     delete this.sendRequest[key]
    //                     break
    //                 }
    //             }
    //             return
    //         }
    //         // 获取到关联是通过msgId还是msg_code
    //         // 先查询msg_code是不是记录在用户自定义的 userDefined 然后再查询是不是在 requestToResponse记录中
    //         // 获取 msg_code是不是在需要回调的requestToResponse键值对中
    //         // 因为可能需要好几个消息一起才能触发回调，使用保存获取到的消息记录，并且保存数据记录
    //         let _aboutAsInfo = {
    //             key: null, //在map跟sendRequest 的key
    //             groupKey: null //在分组的哪个key
    //         }
    //         for (let aboutAsMsgIdKey in this.aboutAsMsgid) {
    //             if (this.aboutAsMsgid[aboutAsMsgIdKey].indexOf(msg_code) >= 0) {
    //                 _aboutAsInfo = {
    //                     key: _responseMsgId,
    //                     groupKey: aboutAsMsgIdKey
    //                 }
    //                 break
    //             }
    //         }
    //         // const keys = Object.keys(this.userDefined).concat(Object.keys(this.requestToResponse))

    //         if (!_aboutAsInfo.key) {
    //             for (let userDefinedKey in this.userDefined) {
    //                 if (this.userDefined[userDefinedKey] && this.userDefined[userDefinedKey].indexOf(msg_code) >= 0) {
    //                     _aboutAsInfo = {
    //                         key: userDefinedKey,
    //                         groupKey: userDefinedKey
    //                     }
    //                     break
    //                 }
    //             }
    //         }

    //         if (!_aboutAsInfo.key) {
    //             for (let requestToResponseKey in this.requestToResponse) {
    //                 if (this.requestToResponse[requestToResponseKey] && this.requestToResponse[requestToResponseKey].indexOf(msg_code) >= 0) {
    //                     _aboutAsInfo = {
    //                         key: requestToResponseKey,
    //                         groupKey: requestToResponseKey
    //                     }
    //                     break
    //                 }
    //             }
    //         }

    //         if (this.sendRequest.hasOwnProperty(_aboutAsInfo.key)) {
    //             const entry = this._map.get(_aboutAsInfo.key)
    //             if (code === '0000') {
    //                 entry.sendTime = new Date().getTime()
    //                 // 返回数据正常把数据保存起来
    //                 if (this.sendRequest[_aboutAsInfo.key].msgCode.indexOf(msg_code) < 0) {
    //                     this.sendRequest[_aboutAsInfo.key].msgCode.push(msg_code)
    //                     this.sendRequest[_aboutAsInfo.key].msgData[msg_code] = content
    //                 }
    //                 let flg = true //默认为true

    //                 if (this.userDefined[_aboutAsInfo.groupKey]) {
    //                     this.userDefined[_aboutAsInfo.groupKey].forEach(item => {
    //                         if (this.sendRequest[_aboutAsInfo.key].msgCode.indexOf(item) < 0) {
    //                             flg = false
    //                         }
    //                     })
    //                 } else if (this.aboutAsMsgid[_aboutAsInfo.groupKey]) {
    //                     this.aboutAsMsgid[_aboutAsInfo.groupKey].forEach(item => {
    //                         if (this.sendRequest[_aboutAsInfo.key].msgCode.indexOf(item) < 0) {
    //                             flg = false
    //                         }
    //                     })
    //                 } else {
    //                     this.requestToResponse[_aboutAsInfo.groupKey].forEach(item => {
    //                         if (this.sendRequest[_aboutAsInfo.key].msgCode.indexOf(item) < 0) {
    //                             flg = false
    //                         }
    //                     })
    //                 }

    //                 if (flg) {
    //                     if ((this.aboutAsMsgid[_aboutAsInfo.groupKey] && this.aboutAsMsgid[_aboutAsInfo.groupKey].length === 1) || (this.requestToResponse[_aboutAsInfo.groupKey] && this.requestToResponse[_aboutAsInfo.groupKey].length === 1)) {
    //                         entry.resolve(this.sendRequest[_aboutAsInfo.key].msgData[msg_code])
    //                     } else {
    //                         entry.resolve(this.sendRequest[_aboutAsInfo.key].msgData)
    //                     }

    //                     delete this.userDefined[_aboutAsInfo.groupKey]
    //                     this._map.delete(_aboutAsInfo.key)
    //                     delete this.sendRequest[_aboutAsInfo.key]
    //                 }
    //             } else {
    //                 // 返回出错了--触发错误回调
    //                 entry.resolve({
    //                     errorType: msg_code,
    //                     errorData: content,
    //                     requestData: entry.data,
    //                     remark: remark || desc
    //                 })
    //                 delete this.userDefined[_aboutAsInfo.groupKey]
    //                 this._map.delete(_aboutAsInfo.key)
    //                 delete this.sendRequest[_aboutAsInfo.key]
    //             }
    //         }
    //         false
    //     })
    // }
    clearData () {
        this.sendRequest = {}
        this._map = new Map()
        if (this.timer) {
            window.clearInterval(this.timer)
            this.timer = null
        }
    }

    /*
     * type  类型
     * data  请求数据
     * backArr 回调协议数组 可不传
     * timeOut 超时时间 可不传
     * */
    send (type, data, backArr, timeOut) {
        // 触发超时
        if (!this.timer) {
            this.timer = window.setInterval(() => {
                const nowTime = new Date().getTime()
                this._map.forEach((value, key, map) => {
                    const entry = this._map.get(key)
                    if (nowTime - entry.sendTime > entry.timeOut * 1000) {
                        entry.reject({
                            errorType: 'TimeOut',
                            remark: 'timeOut' + '(' + key + ')' + (entry.data ? entry.data.msg_id : '')
                        })
                        if (!isPRD) {
                            alert('timeOut' + '(' + key + ')' + (entry.data ? entry.data.msg_id : ''))
                        }
                        this._map.delete(key)
                        delete this.sendRequest[key]
                        delete this.userDefined[key]
                    }
                })
                if (this._map.size === 0) {
                    window.clearInterval(this.timer)
                    this.timer = null
                }
            }, 500)
        }
        if (backArr && backArr.length > 0) {
            this.userDefined[type] = backArr
        }
        return new Promise((resolve, reject) => {
            this._socket.send(wsParams(type, data))
            this.sendRequest[this.aboutAsMsgid[type] ? data.msgId || data.msg_id : type] = {
                type: type,
                msgCode: [],
                msgData: {}
            }
            this._map.set(this.aboutAsMsgid[type] ? data.msgId || data.msg_id : type, {
                sendTime: new Date().getTime(),
                timeOut: timeOut ? timeOut - 0.5 : this.timeOut - 0.5,
                data,
                resolve,
                reject
            })
        })
    }
}

export default SocketEvent
