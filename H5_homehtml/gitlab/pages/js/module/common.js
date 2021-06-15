//通用模块加载器，对于没有任何js逻辑代码交互的模块使用
define(function(require, exports, module) {
    var base = require('utils/base')
    var data = null;
    var parentElement = null;
    var that = base() 
     // 事件响应声明
    var evtFuncs = {}
    //自定义函数
    var custFuncs = {}
    var render = function(tplId) {
        // DOM渲染
        parentElement.html(template.render($('#'+tplId).text(), data))
    }

    var bindEvt = function() {
        // 绑定事件
    }
    // 页面初始化
    var init = function(_data,id,tplId) {
        parentElement = $('#'+id)
        data = _data;
        //生成页面
        render(tplId);
        // 绑定事件
        bindEvt();
    }
    that.init = init;
    module.exports = that
})
