define(function(require, exports, module) {
    var base = require('utils/base')
    var utils = require('utils/utils')
    var data = null;
    var parentElement = null;
    var that = base() 
    var utils = require('utils/utils')
     // 事件响应声明
    var evtFuncs = {
    }
    //自定义函数
    var custFuncs = {
        initInfoFlowData:function(res){
            var qs = utils.queryToJson()
            var pageWidth = qs.pagewidth ? qs.pagewidth : 375
            require.async('https://info.chongontrading.com/lib/infoflowDepends.js',function(){
                window.initFccInfoFlow($.extend({
                    font_size: '.28rem',
                    appKey:data.appKey,
                    pagewidth:pageWidth
                },res))  
            })
        },
        getFollowToken(){
            var uuid = utils.getLocalStorage('infoflowuuid');
            if(!uuid) {
                uuid = utils.randomTrack(6)
                utils.setLocalStorage('infoflowuuid',uuid)
            }
            return utils.ajax(utils.createMiddleAjaxParams({
                head:{
                    url:'/account/uac/auth/token',
                    authorization: data.authorization,
                    method:'POST',
                    appKey:data.appKey
                },
                data:{
                    uuid:uuid
                }
            }))
        },
    }
    var render = function() {
        // DOM渲染
        custFuncs.getFollowToken()
        .done(function(res){
            if(res.code != 1) {
                $(document).dialog({
                    type : 'notice',
                    style: 'ios',
                    infoText: '信息流授权失败',
                    autoClose: 2000,
                    position: 'bottom'
                });
                return
            } 
            parentElement.html(template.render($('#tpl_infoflow').text(), data))
            custFuncs.initInfoFlowData(res.data)
        })
        .fail(function(error){
            console.log(error)
        })
    }

    var bindEvt = function() {
        // 绑定事件
    }
    // 页面初始化
    var init = function(_data,id) {
        parentElement = $('#'+id)
        data = _data;
        //生成页面
        render();
        // 绑定事件
        bindEvt();
    }
    that.init = init;
    module.exports = that
})
