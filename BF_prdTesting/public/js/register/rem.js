;(function() {
  /**
   * 7.5=设计稿尺寸/100
   * css元素尺寸=设计稿元素尺寸/100;
   */
  var change = 'orientationchange' in window ? 'orientationchange' : 'resize'
  function calculate() {
    var deviceWidth = document.documentElement.clientWidth
    if (deviceWidth < 320) {
      deviceWidth = 320
    } else if (deviceWidth > 450) {
      deviceWidth = 450
    }
    document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
  }
  window.addEventListener(change, calculate, false)
  calculate()
})()