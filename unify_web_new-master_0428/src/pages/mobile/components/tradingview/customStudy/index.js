import CustomEMA from './customEMA'
import CustomMA from './customMA'
import CustomRSI from './customRSI'
import CustomWR from './customWR'
import CustomMACD from './customMACD.js'

const allFunc = [CustomEMA, CustomMA, CustomRSI, CustomWR, CustomMACD]

export const customIndicatorsGetter = (PineJS, digit) => Promise.resolve(allFunc.map(func => func(PineJS, digit)))
