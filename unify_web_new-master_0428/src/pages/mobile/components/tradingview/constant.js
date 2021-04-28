// 主图指标
export const MAINSTUDIES = [
    {
        label: 'MA',
        desc_zh: '移动平均线',
        desc_en: 'Moving Average',
        name: 'Moving Average mock',
        params: [true, false, [5, 20, 30, 60, 250, 'close', 0]]
    },
    {
        label: 'BOLL',
        name: 'Bollinger Bands',
        desc_zh: '布林线',
        desc_en: 'Bollinger Bands',
        params: [true, false, [26, 2]]
    },
    {
        label: 'EMA',
        desc_zh: '指数移动平均线',
        desc_en: 'Exponential Moving Average',
        name: 'Custom Moving Average Exponential',
        params: [true, false]
    },
    {
        label: 'SAR',
        name: 'Parabolic SAR',
        desc_zh: '抛物线',
        desc_en: 'Parabolic SAR',
        params: [true, false, [0.02, 0.02, 0.2]]
    },
    {
        label: 'Alligator',
        name: 'Williams Alligator',
        desc_zh: '鳄鱼指标',
        desc_en: 'Williams Alligator',
        params: [true, false, [13, 8, 5]]
    },
    {
        label: 'TEMA',
        name: 'Triple EMA',
        params: [true, false]
    },

    {
        label: 'DEMA',
        name: 'Double EMA',
        params: [true, false]
    },
    {
        label: 'SMMA',
        name: 'Smoothed Moving Average',
        params: [true, false]
    },
    {
        label: 'Ichimoku',
        name: 'Ichimoku Cloud',
        params: [true, false]
    },
    {
        label: 'ENV',
        name: 'Envelopes',
        params: [true, false]
    }
]

// 副图指标
export const SUBSTUDIES = [
    {
        label: 'MACD',
        name: 'Custom MACD',
        desc_zh: '指数平滑移动平均线',
        desc_en: 'Moving Average Convergence & Divergence',
        params: [false, false, [12, 26, 'close', 9]]
    },
    {
        label: 'RSI',
        desc_zh: '相对强弱指标',
        desc_en: 'Relative Stength Index',
        name: 'Custom Relative Strength Index',
        params: [false, false]
    },
    {
        label: 'ATR',
        name: 'Average True Range',
        desc_zh: '平均真实波幅',
        desc_en: 'Average True Range',
        params: [false, false, [14]]
    },
    {
        label: 'CCI',
        name: 'Commodity Channel Index',
        desc_zh: '顺势指标',
        desc_en: 'Commodity Channel Index',
        params: [false, false, [14]]
    },
    {
        label: 'WR',
        name: 'Custom Williams %R',
        desc_zh: '威廉指标',
        desc_en: 'Williams %R',
        params: [false, false, [14]]
    },
    {
        label: 'DMI',
        name: 'Directional Movement',
        params: [false, false]
    },
    {
        label: 'TRIX',
        name: 'TRIX',
        params: [false, false]
    },
    {
        label: 'OBV',
        name: 'On Balance Volume',
        params: [false, false]
    },
    {
        label: 'ASI',
        name: 'Accumulative Swing Index',
        params: [false, false]
    },
    {
        label: 'Momentum',
        name: 'Momentum',
        params: [false, false]
    },
    {
        label: 'DPO',
        name: 'Detrended Price Oscillator',
        params: [false, false]
    },

    {
        label: 'Aroon',
        name: 'Aroon',
        params: [false, false]
    },
    {
        label: 'KST',
        name: 'Know Sure Thing',
        params: [false, false]
    },
    {
        label: 'ROC',
        name: 'Rate Of Change',
        params: [false, false]
    },
    {
        label: 'CRSI',
        name: 'Connors RSI',
        params: [false, false]
    },

    {
        label: 'SMII',
        name: 'SMI Ergodic Indicator/Oscillator',
        params: [false, false]
    },
    {
        label: 'HV',
        name: 'Historical Volatility',
        params: [false, false]
    },
    {
        label: 'Stoch',
        name: 'Stochastic',
        params: [false, false]
    },
    {
        label: 'EOM',
        name: 'Ease Of Movement',
        params: [false, false]
    },

]
