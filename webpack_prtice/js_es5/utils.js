// utils.js
// function calculate(n) { 
//   return ((n * 100 + 20 - 4)) % 10 + 3  // 計算價格公式
// }

// out = {
//   cal: calculate,
//   name: 'hello'
// }

// 
function main(require) {
  var obj = require()
  console.log(obj.cal(30)) // 9
  console.log(obj.name) // hello
}

function utils(module) {
  function calculate(n) { 
    return ((n * 100 + 20 - 4)) % 10 + 3
  }

  module.exports = {
    cal: calculate,
    name: 'hello'
  }
}

var m = {}
utils(m)

function r() {
  // 回傳我們所需要的 m.exports
  return m.exports
}
main(r)
