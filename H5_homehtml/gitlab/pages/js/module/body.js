define(function(require, exports, module) {
    var base = require('utils/base')
    var data = null;
    var parentElement = null;
    var that = base()
     // 事件响应声明
    var evtFuncs = {
    }
    //自定义函数
    var custFuncs = {}
    var render = function() {
        // DOM渲染
        parentElement.html(template.render($('#tpl_body').text(), data))
    }

    var bindEvt = function() {
        // 绑定事件
    }
    // 页面初始化
    var init = function(_data,id) {
        data = _data;
        parentElement = $('#'+id)
        //生成页面
        render(id);
        // 绑定事件
        bindEvt();
    }
    that.init = init;
    module.exports = that
})
