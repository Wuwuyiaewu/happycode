;(function($) {
    $.fn.numberAnimate = function(setting) {
      var defaults = {
        speed : 1000,//动画速度
        num : "", //初始化值
        iniAnimate : true, //是否要初始化动画效果
        symbol : '',//默认的分割符号，千，万，千万
        dot : 0 //保留几位小数点
      }
      //如果setting为空，就取default的值
      var setting = $.extend(defaults, setting);
    
      //如果对象有多个，提示出错
      if($(this).length > 1){
        alert("just only one obj!");
        return;
      }
    
      //如果未设置初始化值。提示出错
      if(setting.num == ""){
        alert("must set a num!");
        return;
      }
      var nHtml = '<div class="mt-number-animate-dom" data-num="{{num}}">\
              <span class="mt-number-animate-span">0</span>\
              <span class="mt-number-animate-span">1</span>\
              <span class="mt-number-animate-span">2</span>\
              <span class="mt-number-animate-span">3</span>\
              <span class="mt-number-animate-span">4</span>\
              <span class="mt-number-animate-span">5</span>\
              <span class="mt-number-animate-span">6</span>\
              <span class="mt-number-animate-span">7</span>\
              <span class="mt-number-animate-span">8</span>\
              <span class="mt-number-animate-span">9</span>\
              <span class="mt-number-animate-span">.</span>\
            </div>';
    
      //数字处理
      var numToArr = function(num){
        num = parseFloat(num).toFixed(setting.dot);
        if(typeof(num) == 'number'){
          var arrStr = num.toString().split("");  
        }else{
          var arrStr = num.split("");
        }
        //console.log(arrStr);
        return arrStr;
      }
    
      //设置DOM symbol:分割符号
      var setNumDom = function(arrStr){
        var shtml = '<div class="mt-number-animate">';
        for(var i=0,len=arrStr.length; i<len; i++){
          if(i != 0 && (len-i)%3 == 0 && setting.symbol != "" && arrStr[i]!="."){
            shtml += '<div class="mt-number-animate-dot">'+setting.symbol+'</div>'+nHtml.replace("{{num}}",arrStr[i]);
          }else{
            shtml += nHtml.replace("{{num}}",arrStr[i]);
          }
        }
        shtml += '</div>';
        return shtml;
      }
    
      //执行动画
      var runAnimate = function($parent){
        $parent.find(".mt-number-animate-dom").each(function() {
          var num = $(this).attr("data-num");
          num = (num=="."?10:num);
          var spanHei = $(this).height()/11; //11为元素个数
          var thisTop = -num*spanHei+"px";
          if(thisTop != $(this).css("top")){
            if(setting.iniAnimate){
              //HTML5不支持
              if(!window.applicationCache){
                $(this).animate({
                  top : thisTop
                }, setting.speed);
              }else{
                $(this).css({
                  'transform':'translateY('+thisTop+')',
                  '-ms-transform':'translateY('+thisTop+')',   /* IE 9 */
                  '-moz-transform':'translateY('+thisTop+')',  /* Firefox */
                  '-webkit-transform':'translateY('+thisTop+')', /* Safari 和 Chrome */
                  '-o-transform':'translateY('+thisTop+')',
                  '-ms-transition':setting.speed/1000+'s',
                  '-moz-transition':setting.speed/1000+'s',
                  '-webkit-transition':setting.speed/1000+'s',
                  '-o-transition':setting.speed/1000+'s',
                  'transition':setting.speed/1000+'s'
                }); 
              }
            }else{
              setting.iniAnimate = true;
              $(this).css({
                top : thisTop
              });
            }
          }
        });
      }
    
      //初始化
      var init = function($parent){
        //初始化
        $parent.html(setNumDom(numToArr(setting.num)));
        runAnimate($parent);
      };
    
      //重置参数
      this.resetData = function(num){
        var newArr = numToArr(num);
        var $dom = $(this).find(".mt-number-animate-dom");
        if($dom.length < newArr.length){
          $(this).html(setNumDom(numToArr(num)));
        }else{
          $dom.each(function(index, el) {
            $(this).attr("data-num",newArr[index]);
          });
        }
        runAnimate($(this));
      }
      //init
      init($(this));
      return this;
    }
  })(jQuery);
  
  $(document).ready(function () {
    let toDay = new Date();
  
    let nowT = (toDay) => {
      //現在時間
      var nowYear = toDay.getFullYear();
      let nowMonth = ()=>{
        let a = toDay.getMonth()
        if((a+'').length<2){
          return `0${a+1}`
        }else{
          return a+1
        }
      }
      let nowDate = ()=>{
        let a = toDay.getDate();
        if((a+'').length<2){
          return `0${a+1}`
        }else{
          return a+1
        }
      }
      let nowDay = `${nowYear}-${nowMonth()}-${nowDate()}`;
      // return nowDay;
      
      return new Date(nowDay).valueOf();
    };
    let baseDay = new Date("2020-08-10").valueOf(); //基本時間
    let dayGap = Math.floor((nowT(toDay) - baseDay) / (1000 * 60 * 60 * 24)); //時間差
    console.log(nowT(toDay));
  
    var a, b, c;
    a = $(window).height();
    var group = $(".part_09");
    $(window).scroll(function () {
      b = $(this).scrollTop();
      c = group.offset().top;
      if (a + b < c + 100) {
        //初始化
        // alert(nowT(toDay))
        var numRun = $(".numberRun1").numberAnimate({
          num: "1000",
          speed: 1000,
          symbol: ",",
        });
        var nums = 15470467 + 1950 * dayGap;
        numRun.resetData(nums);
        var numRun2 = $(".numberRun2").numberAnimate({
          num: "100",
          speed: 1000,
          symbol: ",",
        });
        var nums2 = 1670298 + 98 * dayGap;
        numRun2.resetData(nums2);
        var sname = 1;
      }
    });
  });