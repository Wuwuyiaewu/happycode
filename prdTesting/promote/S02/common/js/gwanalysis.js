function setGWAnalysisParams(_maq) {
    var params = {};
    //Document对象数据

    if (document) {
        //params.url = decodeURI(document.URL) || '';
        //params.pagetitle = document.title || '';
        params.prevUrl = decodeURI(document.referrer) || '';
    }
    /*
   //Window对象数据
   if(window && window.screen) {
       params.sh = window.screen.height || 0;
       params.sw = window.screen.width || 0;
       params.cd = window.screen.colorDepth || 0;
   }
   //navigator对象数据
   if(navigator) {
       params.lang = navigator.language || '';
   }
   */
    //解析_maq配置
    if (_maq) {
        for (var i in _maq) {
            switch (_maq[i][0]) {

                //公共字段
                case '_setlogType':
                    params.logType = _maq[i][1];
                    break;
                case '_setSessionId':
                    params.sessionId = _maq[i][1];
                    break;
                case '_setUserId':
                    params.userId = _maq[i][1];
                    break;
                case '_setPlatformVersion':
                    params.platformVersion = _maq[i][1];
                    break;
                case '_setPlatformType':
                    params.platformType = _maq[i][1];
                    break;
                case '_setPlatformName':
                    params.platformName = _maq[i][1];
                    break;
                case '_setBusinessPlatform':
                    params.businessPlatform = _maq[i][1];
                    break;
                case '_setDeviceId':
                    params.deviceId = _maq[i][1];
                    break;
                case '_setUtmctr':
                    params.utmctr = _maq[i][1];
                    break;
                case '_setUtmccn':
                    params.utmccn = _maq[i][1];
                    break;
                case '_setUtmcct':
                    params.utmcct = _maq[i][1];
                    break;
                case '_setUtmcmd':
                    params.utmcmd = _maq[i][1];
                    break;
                case '_setUtmcsr':
                    params.utmcsr = _maq[i][1];
                    break;
                case '_setUtmctr2':
                    params.utmctr2 = _maq[i][1];
                    break;
                case '_setUtmccn2':
                    params.utmccn2 = _maq[i][1];
                    break;
                case '_setUtmcct2':
                    params.utmcct2 = _maq[i][1];
                    break;
                case '_setUtmcmd2':
                    params.utmcmd2 = _maq[i][1];
                    break;
                case '_setUtmcsr2':
                    params.utmcsr2 = _maq[i][1];
                    break;
                case '_setUtmcsr2':
                    params.utmcsr2 = _maq[i][1];
                    break;
                case '_setEventCategory':
                    params.eventCategory = _maq[i][1];
                    break;
                case '_setEventAction':
                    params.eventAction = _maq[i][1];
                    break;
                case '_setEventLabel':
                    params.eventLabel = _maq[i][1];
                    break;
                case '_setEventValue':
                    params.eventValue = _maq[i][1];
                    break;

                    //网站扩展字段
                case '_setMarkWords':
                    params.markWords = _maq[i][1];
                    break;
                case '_setBehaviorDetail':
                    params.behaviorDetail = _maq[i][1];
                    break;
                case '_setBehaviorType':
                    params.behaviorType = _maq[i][1];
                    break;
                case '_setAdvisoryType':
                    params.advisoryType = _maq[i][1];
                    break;
                    /**case '_setPrevurl':
                        params.prevurl = _maq[i][1];
                        break;**/

                    //直播间扩展字段
                case '_setUserSource':
                    params.userSource = _maq[i][1];
                    break;
                case '_setUseEquipment':
                    params.useEquipment = _maq[i][1];
                    break;
                case '_setAccountPlatform':
                    params.accountPlatform = _maq[i][1];
                    break;
                case '_setAccountType':
                    params.accountType = _maq[i][1];
                    break;
                case '_setTradingAccount':
                    params.tradingAccount = _maq[i][1];
                    break;
                case '_setRoomId':
                    params.roomId = _maq[i][1];
                    break;
                case '_setRoomName':
                    params.roomName = _maq[i][1];
                    break;
                case '_setVideoId':
                    params.videoId = _maq[i][1];
                    break;
                case '_setVideoName':
                    params.videoName = _maq[i][1];
                    break;
                case '_setCourseId':
                    params.courseId = _maq[i][1];
                    break;
                case '_setCourseName':
                    params.courseName = _maq[i][1];
                    break;
                case '_setTeacherId':
                    params.teacherId = _maq[i][1];
                    break;
                case '_setTeacherName':
                    params.teacherName = _maq[i][1];
                    break;
                case '_setOperateEntrance':
                    params.operateentrance = _maq[i][1];
                    break;
                case '_setUserType':
                    params.userType = _maq[i][1];
                    break;
                case '_setOperationType':
                    params.operationtype = _maq[i][1];
                    break;
                case '_setUserTel':
                    params.userTel = _maq[i][1];
                    break;
                case '_setTouristId':
                    params.touristId = _maq[i][1];
                    break;
                case '_setUserName':
                    params.userName = _maq[i][1];
                    break;
                case '_setNickName':
                    params.nickName = _maq[i][1];
                    break;
                case '_setEmail':
                    params.email = _maq[i][1];
                    break;

                default:
                    break;
            }
        }
    }
    //拼接参数串
    var args = '';
    for (var i in params) {
        if (args != '') {
            args += '&';
        }
        args += i + '=' + encodeURIComponent(params[i]);
    }

    var pro = document.location.protocol;
    var hrefs = window.location.host;
    if (typeof(pro) == "undefined" || pro == "" || pro == null) {
        pro = "http:";
    }
    var urls = pro + "//datac.gwghk.com";
    if (hrefs.indexOf("testoa.se6868.com") >= 0 || hrefs.indexOf("testm.se6868.com") >= 0 || hrefs.indexOf("testweb.se6868.com") >= 0 || hrefs.indexOf("172.30.5") >= 0 || hrefs.indexOf("localhost") >= 0 || hrefs.indexOf("testoa.se6868.com") >= 0 || hrefs.indexOf("testweb.gwfx.hk") >= 0 || hrefs.indexOf("testm.se6868.com") >= 0) {
        if (pro == "https:") {
            urls = pro + "//testdatac.gwghk.com:44333";
        } else {
            urls = pro + "//testdatac.gwghk.com:88";
        }

    }
    //通过Image对象请求后端脚本
    var img = new Image(0, 0);
    img.src = urls + '/1.gif?' + args + '&dates=' + new Date().getTime() + '&';
}

(function() {
    document.writeln("<script async src=\'https://www.googletagmanager.com/gtag/js?id=AW-722792077\'></script>");
    document.writeln("       <script>");
    document.writeln("       window.dataLayer = window.dataLayer || [];");
    document.writeln("       function gtag(){dataLayer.push(arguments);}");
    document.writeln("       gtag(\'js\', new Date());");
    document.writeln("");
    document.writeln("       gtag(\'config\', \'AW-722792077\');");
    document.writeln("</script>");
})();