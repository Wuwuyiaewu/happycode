$(function() {
  var url = pageConfig.url
  var companyId = pageConfig.companyId
  var downloadAppConfig = pageConfig.downloadAppConfig
  var $phone = $('#phone')
  var $code = $('#code')
  var $btn_code = $('.btn_code')
  var $password = $('#password')
  var $submit = $('.submit')
  var md = new MobileDetect(navigator.userAgent)
  var appMarket = md.mobile()
  var Validator = formValidate()
  var device = getDevice()
  var _id = ''
  var _token = ''
  var layerList = [] //缓存弹层的id，用于关闭时，优先关闭最新打开的弹层
  var layerWrap = {
    open: function(obj) {
      var content = obj && obj.content
      var time = obj && obj.time
      var config = {}
      var close = '<div class="close"><img src="/public/images/register/close.png" /></div>'
      if (content && !time) {
        config = Object.assign({}, obj, {
          shadeClose: false,
          content: close + content
        })
      } else {
        config = obj
      }
      layerList.push(layer.open(config))
    }
  }

  // 增加自定义验证规则
  $.validator.addMethod('format', function(value, element, params) {
    var reg = new RegExp(params.source)
    return reg.test(value)
  })
	
  console.log('第一次进入页面')

  /** 点击事件 --- start */
	
// 手机号码事件：input
  $phone.on('input',function(e){
    if($(this).val().length){
      $('.clearPhone').addClass('showIcon')
	   if ($(this).val().length > 11) {
        var text = $(this).val().split('').slice(0,11).join('')
        $(this).val(text)
      }
    } else {
      $('.clearPhone').removeClass('showIcon')
    }
  })
	
// 验证码事件：input
  $code.on('input', function(e) {
    if ($(this).val().length > 6) {
      var text = $(this) .val().split('').slice(0, 6).join('')
      $(this).val(text)
    }
  })

  // 清空手机号
  $('.clearPhone').on('click', function(e){
    if($(this).hasClass('showIcon')) {
      $phone.val('')
      return
    }
    e.preventDefault()
  })

  //隐藏显示密码
  $('body').on('click', '.pwd_status', function(e){
    if($(this).hasClass('pwd_hide')) {
      $(this).removeClass('pwd_hide')
      $('#password').prop('type', 'text')
    } else {
      $(this).addClass('pwd_hide')
      $('#password').prop('type', 'password')
    }
  })
  // 获取验证码
  $btn_code.on('click', function(e) {
    e.preventDefault()
    Validator.resetForm()
    var text = $(this).html()
    if (text === '验证码' && Validator.element($('#phone'))) {
      ixGetVerifiCode()
    }
  })

  // 立即注册
  $submit.on('click', function(e) {
    e.preventDefault()
    var text = $(this).html()

    if (text === '立即注册' && Validator.form()) {
      $(this).html(showSpinner())
      rightNowGet()
    }
  })

  //弹层： 条款选择
  $('.agreementBtn').on('click', function() {
    layerWrap.open({
      type: 0,
      className: 'clause', //这样你就可以在css里面控制该弹层的风格了
      content:
        '<img src="'+pageConfig.logo+'" />\
                <p class="border-1px" data-name="service">客户服务协议<span>></span></p>\
                <p class="border-1px" data-name="disclaimer">免责声明<span>></span></p>\
                <p class="border-1px" data-name="privacyClause">隐私条款<span>></span></p>\
                '
    })
  })

  // 关闭按钮，每次关闭最新打开的弹层
  $('body').on('click', '.close', function(e) {
    if (layerList.length) {
      layer.close(layerList.splice(layerList.length - 1, 1)[0])
    }
  })

  // 具体条款协议
  $('body').on('click', '.clause', function(e) {
    var name = $(e.target).data().name
    if (pageConfig[name]) showAgreement(pageConfig[name])
  })

  // 下载APP
  $('body').on('click', '.register_success button', function() {
    var events = {
      WEBSITE: function() {
        // 生成二维码
        var iosBase64 = jrQrcode.getQrBase64(downloadAppConfig.ios.url)
        var androidBase64 = jrQrcode.getQrBase64(downloadAppConfig.android.url)

        layerWrap.open({
          className: 'download_web', //这样你就可以在css里面控制该弹层的风格了
          content:
            '<ul>\
            <li><img src=' +
            iosBase64 +
            ' />iPhone</li>\
            <li><img src=' +
            androidBase64 +
            ' />Android phone</li>\
            </ul>'
        })
      },
      WEBSITE_ANDROID: function() {
        location.href = downloadAppConfig.android.url
      },
      WEBSITE_IOS: function() {
        location.href = downloadAppConfig.ios.url
      }
    }
    events[device]()
  })
  
  /** 点击事件 --- end */

  //弹层：具体条款内容
  function showAgreement(config) {
    var title = config.title
    var content = config.content

    layerWrap.open({
      type: 1,
      className: 'agreement', //这样你就可以在css里面控制该弹层的风格了
      content: '<h1 class="title">' + title + '</h1><div class="content"><div class="inner">' + content + '</div></div>',
      style: 'width:90%;max-width:640px;'
    })
  }

  // 表单提交
  function rightNowGet() {
    checkVerifiCode(openAccount)
  }

  // 校验手机验证码
  function checkVerifiCode(cb) {
    var mobile = $phone.val().trim()
    var verCode = $code.val().trim()

    $.ajax(url, {
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      data: {
        call_bo_url: '/verificode/checkVerifiCode',
        call_bo_method: '1',
        company_id: companyId,
        _verifiCode: verCode,
        _verifiNumber: mobile,
        _id: _id
      },
      success: function(res) {
        if (res.ret === 0) {
          var result = JSON.parse(res.msg)
          if (result.data.status.code == 200) {
            _token = result.data._token
            cb()
          } else {
            $submit.html('立即注册')
            layerWrap.open({
              content: result.data.status.msg || '',
              skin: 'msg',
              time: 2 //2秒后自动关闭
            })
          }
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $submit.html('立即注册')
      }
    })
  }

  // 保存账号接口
  function openAccount() {
    var data = {
      guestPhone: $phone.val(),
      code: $code.val(),
      pwd: $password.val()
    }
    $.ajax(url, {
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      data: {
        call_bo_url: '/app/appNewCustomer',
        call_bo_method: '3',
        customer: JSON.stringify({
          mobilePhonePrefix: '86',
          mobilePhone: data.guestPhone,
          passwordRaw: hex_md5(data.pwd),
          //   "email":"513414619@qq.com",
          openFrom: device,
          informationFrom: 'frontoffice',
          appMarket: appMarket,
          isAutoApprove: true,
          companyId: companyId,
          utmSource: util.getURLPara('utm_source') || '', //广告来源
          utmMedium: util.getURLPara('utm_medium') || '', //广告媒介
          utmTerm: util.getURLPara('utm_term') || '', //关键词
          utmContent: util.getURLPara('utm_content') || '', //广告组
          utmCampaign: util.getURLPara('utm_campaign') || '' //广告系列
        }),
        _token: _token,
        company_id: companyId,
        devToken: 'HWP950005',
        devName: 'HUAWEI-001',
        recommendCode: 'asd001',
        accountGroupId: '361122'
      },
      success: function(res) {
        if (res.ret == 0) {
          var result = JSON.parse(res.msg)
          if (result.code == 'SUCCESS' && result.result.newRet == 'OK') {
            // 弹层：注册成功
            layerWrap.open({
              className: 'register_success', //这样你就可以在css里面控制该弹层的风格了
              content:
                '<img class="logo_success" src="/public/images/register/logo_success.png" />\
                <p>注册成功!</p>\
                <button>立即下载APP</button>'
            })
          } else {
            layerWrap.open({
              content: result.result.newComment || '',
              skin: 'msg',
              time: 2 //2秒后自动关闭
            })
          }
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {},
      complete: function() {
        $submit.html('立即注册')
      }
    })
  }

  // 验证码事件逻辑
  function ixGetVerifiCode() {
    // 校验号码+获取短信验证码
    validatePhone(getVerifiCode)
  }
  // 获取验证码
  function getVerifiCode() {
    var mobile = $phone.val().trim()
    $.ajax(url, {
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      data: {
        call_bo_url: '/verificode/getVerifiCode',
        _areaCode: '86',
        _mobileNumber: mobile,
        call_bo_method: '2',
        company_id: companyId, //41011
        _url: '/app/appNewCustomer',
        messageLang: 'zh_CN'
      },
      success: function(res) {
        if (res.ret === 0) {
          var result = JSON.parse(res.msg)
          _id = result.data._id

          $btn_code.addClass('clicked')

          Countdown(
            60,
            function(num) {
              $btn_code.html('已发送 ' + num)
            },
            function() {
              $btn_code.html('验证码')
		     $btn_code.removeClass('clicked')
            }
          )
          layerWrap.open({
            content: '验证码已发送至您的手机',
            skin: 'msg',
            time: 2 //2秒后自动关闭
          })
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {}
    })
  }

  // 校验手机号码是否已注册过
  function validatePhone(cb) {
    var mobile = $phone.val().trim()
    $.ajax(url, {
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      data: {
        call_bo_url: '/app/appValidatePhoneAndEmail',
        call_bo_method: '3',
        company_id: companyId,
        messageLang: 'zh_CN',
        customer: JSON.stringify({
          mobilePhonePrefix: '86',
          mobilePhone: mobile
        })
      },
      success: function(res) {
        if (res.ret === 0) {
          var result = JSON.parse(res.msg)
          if (result.result.newRet === 'OK') {
            // 可以注册
            cb()
          } else {
            // 不可以注册，提示
            //提示
            layerWrap.open({
              content: result.result.newComment || '',
              skin: 'msg',
              time: 2 //2秒后自动关闭
            })
          }
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log('是否存在手机号-failed')
      }
    })
  }

  // 表单验证
  function formValidate() {
    return $('#form').validate({
      errorElement: 'em',
      errorClass: 'error_text',
      // submitHandler: function(form) {
      //   console.log('提交事件!')
      // },
      rules: {
        phone: {
          required: true,
          rangelength: [11, 11],
		  format: /^[0-9]+$/
        },
        code: {
          required: true,
          rangelength: [6, 6],
		  format: /^[0-9]+$/
        },
        password: {
          required: true,
          rangelength: [6, 18],
		  format: /^[0-9A-z]+$/
        },
        agree: 'required'
      },
      messages: {
        phone: '请输入11位手机号码',
        code: {
		  required: '请输入6位验证码',
          rangelength: '请输入6位验证码',
		  format: '请输入6位数字'
	    },
        password: {
          required: '请输入密码',
          rangelength: '请输入6-18位字母或数字',
		  format: '请输入6-18位字母或数字'
        },
        agree: '请阅读并同意【客户服务协议及隐私条款】'
      }
    })
  }
  // 定时器
  function Countdown(duration, onTick, onComplete) {
    var secondsLeft = Math.round(duration),
      tick = function() {
        if (secondsLeft > 0) {
          onTick(secondsLeft)
          secondsLeft -= 1
        } else {
          clearInterval(interval)
          onComplete()
        }
      },
      // Setting the interval, by call tick and passing through this via a self-calling function wrap.
      interval = setInterval(
        (function(self) {
          return function() {
            tick.call(self)
          }
        })(this),
        1000
      )

    // First tick.
    tick.call(this)

    return {
      abort: function() {
        clearInterval(interval)
      },

      getRemainingTime: function() {
        return secondsLeft
      }
    }
  }

  function showSpinner() {
    return '<div class="spinner">\
    <div class="spinner-container container1">\
      <div class="circle1"></div>\
      <div class="circle2"></div>\
      <div class="circle3"></div>\
      <div class="circle4"></div>\
    </div>\
    <div class="spinner-container container2">\
      <div class="circle1"></div>\
      <div class="circle2"></div>\
      <div class="circle3"></div>\
      <div class="circle4"></div>\
    </div>\
    <div class="spinner-container container3">\
      <div class="circle1"></div>\
      <div class="circle2"></div>\
      <div class="circle3"></div>\
      <div class="circle4"></div>\
    </div>\
  </div>'
  }

 function getDevice() {
    var platform = 'WEBSITE'
    if (util.isAndroid) {
      platform = 'WEBSITE_ANDROID'
    }
    if (util.isIos) {
      platform = 'WEBSITE_IOS'
    }
    return platform
  }
})
