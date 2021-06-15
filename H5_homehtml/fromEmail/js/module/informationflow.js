define(function(require, exports, module) {
    var base = require('utils/base')
    var loadjs = require('utils/loadjs');
    var data = null;
    var parentElement = null;
    var that = base() 
    var utils = require('utils/utils')
    var queryString = utils.queryToJson()
    var lang = queryString.lang || 'zh-cn'
    if(lang === 'en-US') {
        lang = 'en' 
    } else if(lang === 'zh-CN') {
        lang = 'zh-cn' 
    }
     // 事件响应声明
    var evtFuncs = {
    }
    //自定义函数
    var custFuncs = {
        initInfoFlowData:function(res){
            // https://github.com/muicss/loadjs
            var _arr = []
            if(lang ==='en') {
                _arr = [
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/proden/wequickNewsList.css',
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/proden/vue.js',
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/proden/vant.min.js',
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/proden/wequickNewsList.umd.min.js',
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/proden/wequickNewsList.common.js',
                ]
            } else {
                _arr = [
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/prod/wequickNewsList.css',
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/prod/vue.js',
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/prod/vant.min.js',
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/prod/wequickNewsList.umd.min.js',
                    'https://zixuninfo.oss-cn-hangzhou.aliyuncs.com/js/prod/wequickNewsList.common.js',
                ]
            }
            loadjs(_arr, 'infoflow',{async: false,});
            loadjs.ready('infoflow', {
                success: function() { /* foo.js & bar.js loaded */ 
                        new Vue({
                            components: {
                            demo: wequickNewsList
                            }
                        }).$mount('#informationflowBox')
                    // require.async('/pages/js/',function(){
                    //     debugger

                    // })                
                },
                error: function(depsNotFound) { /* foobar bundle load failed */ 
                
                },
              });

        }
    }
    var render = function() {
        var _data = $.extend({lang:lang},data)
        console.log(_data)
        parentElement.html(template.render($('#tpl_informationflow').text(),_data ))
        custFuncs.initInfoFlowData()
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
