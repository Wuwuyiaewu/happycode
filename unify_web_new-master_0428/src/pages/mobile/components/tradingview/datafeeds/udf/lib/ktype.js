// tradingview K线类型关联websocket K线类型
// tradingview 类型 '1', '5', '15', '30', '60', '1D', '1W', '1M'
// websocket 类型 1min, 2min, 3min, 5min, 15min, 30min, 1hour, day, week, month
export const KtypeList = ['1', '5', '15', '30', '60', '1D'] // ix没有周K和月K数据, '1W', '1M'
export const tvKtype = {
    '1': '1min',
    '2': '2min',
    '3': '3min',
    '5': '5min',
    '15': '15min',
    '30': '30min',
    '60': '1hour',
    '120': '2hour',
    '240': '4hour',
    D: 'day',
    '1D': 'day',
    '1W': 'week',
    '1M': 'month'
}
export const wsKtype = {
    '1min': '1',
    '2min': '2',
    '3min': '3',
    '5min': '5',
    '15min': '15',
    '30min': '30',
    '1hour': '60',
    '2hour': '120',
    '4hour': '240',
    day: '1D',
    day: 'D',
    week: '1W',
    month: '1M'
}
