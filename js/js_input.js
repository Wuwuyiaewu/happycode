function calculate(n) {
    return ((n * 100 + 20 - 4)) % 10 + 3 // 計算價格公式
}

out = {
    cal: calculate,
    name: 'hello'
}