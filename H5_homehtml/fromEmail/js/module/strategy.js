define(function(require, exports, module) {
    var base = require('utils/base')
    var utils = require('utils/utils')
    var data = {
        title:[],
        dataList:{

        },
        isActive:'',
        showList:[],
    };
    var prePrice = {};
    var baseQuote = [];
    var tpl = '';
    var parentElement = null;
    var that = base() 
     // 事件响应声明
    var evtFuncs = {
        changeType:function(ev){
            data.isActive = $(this).data('type')
            data.showList = data.dataList[data.isActive]
            render()
            window.setTimeout(function(){
                custFuncs.upDateQuote(baseQuote)
            },300)
            
        },
        showDetail:function(ev) {
            $(document).dialog({
                style: 'ios',
                content: '<div style="text-align:left;">'+ $(this).data("content") +'</div>',
            });
        }
    }
    //自定义函数
    var custFuncs = {
        countData:function(res){
            data.appKey = res.appKey
            data.authorization = res.authorization
            var typeObj = {
                '1':'今日策略',
                '2':'短期策略',
                '3':'中期策略'
            }
            $.each(res.list,function(index,item){
                if(!data.dataList[item.type]) {
                    data.dataList[item.type] = []
                }
                data.dataList[item.type].push(item);
            })
            var _index = 0
            $.each(data.dataList,function(index,item){
                if(_index === 0) {
                    data.showList = data.dataList[index]
                    data.isActive = index
                }
                data.title.push({type:index,title:typeObj[index]})
                _index+=1;
            })
            render();
            // 绑定事件
            bindEvt(); 
           
        },
        upDateQuote(data){
            baseQuote = data
            var quotes = {}
            var orColorType = window.PAGECONFIG.orColorType
            $.each(data,function(i,quote){
                quotes[quote.code_id]  = quote
            })
            // var domList = parentElement[0].querySelectorAll('[data-symbolid]');
            var domList = parentElement[0].querySelectorAll('[data-symbolid]');
            $.each(domList,function(index,itemdom){
                var symbolId = $(itemdom).data('symbolid')
                if(quotes[symbolId]) {
                    var price = quotes[symbolId] || {}
                    var item =  {
                        cur_price:price.cur_price,
                        symbolId: symbolId
                    }
                    var _yesterday_price = price.yesterday_price?price.yesterday_price.toString():''
                    var point = _yesterday_price.indexOf('.')>-1?_yesterday_price.split('.')[1].length:2

                    item.upDownWidth = (utils.minus(price.cur_price, price.yesterday_price)/price.yesterday_price* 100).toFixed(2)
                    item.colorType = ''
                    if(prePrice[item.symbolId]){
                        item.colorType = item.cur_price > Number(prePrice[item.symbolId].cur_price) ? (orColorType==1?'up':'down') : item.cur_price < Number(prePrice[item.symbolId].cur_price)?(orColorType==1?'down':'up'):prePrice[item.symbolId].colorType
                    }
                    item.upColor = item.upDownWidth>0?(orColorType==1?'up':'down'):(orColorType==1?'down':'up')
                    $(itemdom).find('.change').removeClass('down up').addClass(item.colorType)
                    $(itemdom).find('.change .price').text(item.cur_price.toFixed(point))
                    $(itemdom).find('.change .width').removeClass('down up').addClass(item.upColor).text(item.upDownWidth+'%')
                }
                prePrice[item.symbolId] = $.extend({},item)
            })
            // render(true)
        }
    }
    var render = function() {
        // DOM渲染
        parentElement.html(template.render(tpl, data))
        new Swiper(parentElement.find('.swiper-container'), {
            pagination: false,
            spaceBetween: 12,
            initialSlide:0,
            slidesPerView: 'auto',
            normalizeSlideIndex:false,
            autoplay: false
        })
    }

    var bindEvt = function() {
        // 绑定事件
        parentElement.on('click','.evt-changeType div',evtFuncs.changeType)
        parentElement.on('click','.evt-detail',evtFuncs.showDetail)
        that.bind('quote',function(evt){
            custFuncs.upDateQuote(evt.data)
        })       
    }
    // 页面初始化
    var init = function(_data,id) {
        tpl = $('#tpl_strategy').text()
        parentElement = $('#'+id)
        custFuncs.countData(_data)
    }
    that.init = init;
    module.exports = that
})
