define(function(require, exports, module) {
    var base = require('utils/base')
    var data = null;
    var parentElement = null;
    var timer = null;
    var viewIsShow = true
    var that = base() 
     // 事件响应声明
    var evtFuncs = {
        hideView:function(){
            if(viewIsShow) {
                // parentElement
                parentElement.children('.m-sidebar').removeClass('m-sidebar_open')
                parentElement.children('.m-sidebar').addClass('m-sidebar_close')
                viewIsShow = false;
                if(timer) {
                    window.clearTimeout(timer)
                    timer = null;
                }
            }
        },
        showView:function(){
            if(!viewIsShow) {
                parentElement.children('.m-sidebar').removeClass('m-sidebar_close')
                parentElement.children('.m-sidebar').addClass('m-sidebar_open')
                viewIsShow = true;
            }
        }
    }
    //自定义函数
    var custFuncs = {
        countData(res) {
            data = res.uiComponent?res.uiComponent[0]:{}
            if (data.img) {
                //生成页面
                render()
                // 绑定事件
                bindEvt()
            }
        }
    }
    var render = function() {
        // DOM渲染
        parentElement.html(template.render($('#tpl_sidebar').text(), data))
        // timer = window.setTimeout(evtFuncs.hideView,5000)
    }

    var bindEvt = function() {
        // 绑定事件
        parentElement.on('click','.evt-close',evtFuncs.hideView)
        parentElement.on('click','.evt-show',evtFuncs.showView)
        $('#homeContent').on('scroll',evtFuncs.hideView)
    }
    // 页面初始化
    var init = function(_data,id) {
        parentElement = $('#'+id)
        custFuncs.countData(_data)
    }
    that.init = init;
    module.exports = that
})
