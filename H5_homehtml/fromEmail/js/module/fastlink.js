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
        parentElement.html(template.render($('#tpl_fastlink').text(), data))
    }
    var bindEvt = function() {
        // 绑定事件

        parentElement.find(".m-fastlink_content_item").each(function(i ,e){
            (function(n){
                e.addEventListener('click', function(){
                    window._paq && window._paq.push(['trackEvent', '首页', '功能菜单', '菜单' + n, 78])
                })
            })(i+1)
        })
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
