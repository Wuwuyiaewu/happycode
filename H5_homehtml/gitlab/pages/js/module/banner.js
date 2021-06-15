define(function(require, exports, module) {
    var base = require('utils/base')
    var data = null
    var parentElement = null
    var swiper = null
    var that = base()
    // 事件响应声明
    var evtFuncs = {}
    //自定义函数
    var custFuncs = {
        countData: function(res) {
            data = {
                type: res.locating
            }
            if (res.locating == 'scrollImage') {
                data.title = ''
            } else if (res.locating == 'handerImage') {
                data.title = res.title
            }
            data.list = res.uiComponent || []
            if (data.list.length > 0) {
                //生成页面
                render()
                // 绑定事件
                bindEvt()
            }
        }
    }
    var render = function() {
        // DOM渲染
        parentElement.html(template.render($('#tpl_banner').text(), data))
    }

    var bindEvt = function() {
        if (data.type == 'scrollImage') {
            /* 效果1 */
            swiper = new Swiper(parentElement.find('.swiper-container'), {
                autoplay: {
                    delay: 5000
                },
                pagination:data.list.length>1?{el: '.swiper-pagination',clickable: true}:false,
                lazy: {
                    loadPrevNext: true
                }
            })
        } else if (data.type == 'handerImage') {
            /* 效果2 */
            swiper = new Swiper(parentElement.find('.swiper-container'), {
                pagination: false,
                spaceBetween: 10,
                slidesPerView: 'auto',
                autoplay: false,
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 2
                }
            })
        }
    }
    // 页面初始化
    var init = function(_data, id) {
        parentElement = $('#' + id)  
        custFuncs.countData(_data)    
    }
    that.init = init
    module.exports = that
})