define(function(require, exports, module) {
    var base = require('utils/base')
    var data = {
        baseData:{}
    }
    var parentElement = null
    var code_ids = [];
    var that = base()
    // 事件响应声明
    var evtFuncs = {}
    //自定义函数
    var custFuncs = {
        countData: function(res) {
            var _data = res.uiComponent || []
            if (_data.length === 0) return
            $.each(_data,function(index,el){
                data.baseData[el.title] = {
                    name_cn:el.name_cn,
                    name_en:el.name_en,
                    digit:el.digit,
                    codeid:el.title
                }
                code_ids.push(el.title)
            })
        },
        upDateQuote(quoteList) {
            var quoteData = {}
            var list = data.baseData
            $.each(quoteList || [],function(a,quote){
                quoteData[quote.code_id] = quote
            })
            var orColorType = window.PAGECONFIG.orColorType
            var newObj = {}
            var parent = document.querySelectorAll('.m-quotes');
            var domList = [];
            $.each(parent,function(c,b){
                domList = $.merge(domList,b.querySelectorAll('[data-symbolid]'))
            })
            // var domList = document.querySelector('#'+key).querySelectorAll('[data-symbolid]')
            $.each(domList,function(i,itemdom){
                var codeid = $(itemdom).data('symbolid')
                var product = data.baseData[codeid]
                var quote = quoteData[codeid]
                var digit = product.digit
                var obj = {
                    code_id: codeid,
                    name_cn:list[codeid].name_cn,
                    name_en:list[codeid].name_en,
                    digit:list[codeid].digit,
                    price: quote?quote.cur_price.toFixed(digit):'--'
                }
                if(list[codeid] && quote) {
                    obj.type = quote.cur_price > Number(list[codeid].price) ? (orColorType==1?'up':'down') : quote.cur_price < Number(list[codeid].price) ? (orColorType==1?'down':'up') : list[codeid].type 
                }
                //obj.type =  obj.type  || (orColorType==1?'up':'down')
                obj.upDownAmount = quote?(quote.cur_price - quote.yesterday_price).toFixed(digit):'--'
                obj.upDownWidth = quote?((obj.upDownAmount / quote.yesterday_price) * 100).toFixed(2)+'%':'--'
                obj.upColor = quote?(obj.upDownAmount>0?(orColorType==1?'up':'down'):(orColorType==1?'down':'up')):''
                newObj[codeid] = obj
                /* dom操作 */
                $(itemdom).removeClass('down up').addClass(obj.type)
                $(itemdom).find('.m-quotes_price').text(obj.price)
                $(itemdom).find('.m-quotes_change').html((obj.upDownAmount>0?'+'+obj.upDownAmount:obj.upDownAmount)+' &nbsp '+(obj.upDownWidth>0?'+'+obj.upDownWidth:obj.upDownWidth)).removeClass('down up').addClass(obj.upColor)


            })
            
            data.baseData = newObj
        },
        initSwiper: function(num) {
            new Swiper(parentElement.find('.swiper-container'), {
                slidesPerView: 3,
                slidesPerGroup: 3,
                initialSlide: 0,
                normalizeSlideIndex: false,
                pagination: num > 3 ? { el: '.swiper-pagination', clickable: true } : false
            })
        }
    }
    var render = function(_data) {
        // DOM渲染
        parentElement.html(template.render($('#tpl_quotes').text(), _data))
        custFuncs.initSwiper(_data.uiComponent.length)
    }

    var bindEvt = function() {
        that.bind('quote',function(evt){
            custFuncs.upDateQuote(evt.data)
        })
        // 绑定事件
    }
    // 页面初始化
    var init = function(_data, id) {
        parentElement = $('#' + id)
        custFuncs.countData(_data)
        render(_data)
        bindEvt()
    }
    that.init = init
    module.exports = that
})
