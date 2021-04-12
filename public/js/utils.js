var UA = navigator.userAgent;
var util = {
  isAndroid: /android|adr/gi.test(UA),
  isIos: /iphone|ipod|ipad/gi.test(UA) && !this.isAndroid,
  isWeixin: /MicroMessenger/gi.test(UA),
  isQQ: /QQ\/\d/gi.test(UA),
  isClient: this.isWeixin || this.isQQ,
  isChrome: /Chrome\/([\d.]+)/gi.test(UA) || /CriOS\/([\d.]+)/gi.test(UA),
  isIosWebview: !this.isChrome && /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/gi.test(UA),
  //url解析
  getURLPara:function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var rev = location.search.substr(1).match(reg);
    if (rev != null) {
      return decodeURI(rev[2]);
    }
    return null;
  },
  //安卓返回头处理
  getRequestParams:function(url) {
    var theRequest = {},
      backUrl = "",
      backStr = 'consulting=1';
    if (url.indexOf('?') !== -1) {
      var str = url.substr(1);
      var strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      if (theRequest.consulting) {
        backUrl = url;
      } else {
        backUrl = url + '&' + backStr;
      }
    } else {
      backUrl = url + '?' + backStr;
    }
    return backUrl;
  },
  //信息流URL处理
  urlHandle:function(url) {
    var strUrl = url.split('?')[0];
    var isOrig = url.indexOf('gts2_app_orig');
    var isTop = url.indexOf('gts2_app_top');
    var isApp = url.indexOf('app=');
    var backArr = ['gts2_app', 'gts2_app_top', 'gts2_app_orig'];
    var newStr = "";
    if (this.isAndroid && this.getURLPara('version') < 183) {
      if (isOrig > 0) {
        newStr = url.replace('gts2_app_orig', 'gts2_app_top');
      } else if (isApp > 0) {
        newStr = url;
      } else {
        newStr = strUrl + '?app=' + backArr[1];
      }
    } else {
      if (isTop > 0) {
        newStr = url.replace('gts2_app_top', 'gts2_app_orig');
      } else if (isApp > 0) {
        newStr = url;
      } else {
        newStr = strUrl + '?app=' + backArr[2];
      }
    }
    newStr = newStr + '&consulting=1';
    return newStr;
  }
}
