# ix_utils 指南

> 接口里面的`groupSymbol`通指当前操作的产品对应在 websocket 下发的 GroupSymbolListRet 命令里面的 data_list 下的某个成员，例如：`{"order_timeout":4,"volumes_step":0.01,"future_use":false,"swap_days_per_year":360,"holiday_margin_initial":400,"future_boundary_value":0,"source":"105","default_range_black_list":100,"special_margin_stop_out":400,"type":0,"max_stop_level":5000,"mode":1,"holiday_margin_stop_out":400,"enable":1,"default_range_initial":100,"future_ref_id_high_risk":0,"id":30181,"large_pips_ratio":100,"stop_level":10,"short_swap":1.5,"spread_balance":0,"calc_swap_schedule":62,"future_ref_id_black_list":0,"special_margin_initial":400,"volumes_list":"0.1;0.5;1;5;10","quote_timeout":60,"display_name":"AUDUSD","start_time":0,"profit_currency":"USD","holiday_margin_maintenance":200,"min_manual_volume":20,"name":"SET/USD/GTS/MM/MIN.new/0/A/AUDUSD_SET","tradable":1,"expiry_time":0,"status":0,"volumes_min":0.1,"short_swap_adjust":0,"future_ref_id_initial":0,"margin_stop_out":40,"holiday_margin_hedged":25,"range_black_list":100,"force_close_time":0,"default_range_high_risk":100,"volumes_max":100,"long_swap":1.2,"margin_maintenance":100,"margin_currency":"USD","margin_initial":200,"future_p_l_value":0,"base_currency":"AUD","future_tolerance":0,"long_swap_adjust":0,"position_volumes_max":100,"future_swap":0,"company_id":14,"three_days_swap":5,"margin_hedged":25,"special_margin_hedged":25,"range_initial":5000,"spread":0,"group_id":389,"range_high_risk":100,"digits":5,"contract_size":100000,"pips_ratio":100,"special_margin_maintenance":200}`

```js
// 引入依赖
import { calcOpenMargin } from '**/ix_utils'
```

## calcOpenMargin 计算保证金（包含层级保证金）

```js
/** @method 计算层级保证金
 * @param {Object} opts 参数 必传
 * @param {Object} opts.product 当前操作的产品对象
 * @param {Object} opts.groupGet websocket下发的GroupGetRet命令里面的content完整对象
 * @param {Object} opts.positionList 持仓列表完整对象
 * @param {Object} opts.groupSymbolMarginLeveMap store.getters['ix_quote/groupSymbolMarginLeveMap]完整对象
 * @param {Number} opts.volume 手数
 * @param {Number} opts.direction 方向 1买入 2卖出
 * @param {Number} opts.usdcnyRate usdcny产品报价的中间价cur_price
 * @param {Number} opts.usdhkdRate usdhkd产品报价的中间价cur_price
 * @return {Number} result 保证金值
 */
const margin = calcOpenMargin({
    groupSymbol,
    groupGet,
    positionList,
    groupSymbolMarginLeveMap,
    volume,
    direction,
    usdcnyRate,
    usdhkdRate
})
```

## marginLevel 保证金水平

```js
/** @method 保证金水平
 * @param {Object} opts 参数 必传
 * @param {Object} opts.assetAboutInfo store.getters.assetAboutInfo完整对象
 * @param {Number} opts.openMargin 保证金
 * @return {Number} result 保证金值 1328.00 显示时需要加上百分号(%)
 */
marginLevel({
    assetAboutInfo,
    openMargin
})
```

## 止盈止损范围

```js
/** @method 止损范围最小值
 * @param {Object} opts 参数 必传
 * @param {Object} opts.groupSymbol 当前操作的产品对应的groupSymbol对象(这里需要取store.state.ix_quote.product_map下面对应产品的groupSymbol属性)
 * @param {Number} opts.direction 方向 1买入 2卖出
 * @param {Number} opts.price 1.挂单时直接取挂单价 2.非挂单时再取产品的实时报价，买方向时传b1，卖方向时传a1
 * @return {Number} result
 */
return minStop({
    groupSymbol,
    direction,
    price
})

/** @method 止损范围最大值
 * @param {Object} opts 参数和minStop一致
 */
return maxStop({ groupSymbol, direction, price })

/** @method 止盈范围最小值
 * @param {Object} opts 参数和minStop一致
 */
return minProfit({
    groupSymbol,
    direction,
    price
})

/** @method 止盈范围最大值
 * @param {Object} opts 参数和minStop一致
 */
return maxProfit({
    groupSymbol,
    direction,
    price
})
```

## 止盈止损价格步长

```js
/** @method 止盈止损价格步长
 * @param {Object} groupSymbol 当前操作的产品对应的groupSymbol对象
 */
return profitStopStep(groupSymbol)
```

## 挂单价格范围

```js
/** @method 限价范围最小值
 * @param {Object} opts 参数 必传
 * @param {Object} opts.groupSymbol 当前操作的产品对应的groupSymbol对象(这里需要取store.state.ix_quote.product_map下面对应产品的groupSymbol属性)
 * @param {Number} opts.direction 方向 1买入 2卖出
 * @param {Number} opts.buy_price 实时报价买价
 * @param {Number} opts.sell_price 实时报价卖价
 * @return {Number} result
 */
return minLimit({
    groupSymbol,
    direction,
    buy_price,
    sell_price
})

/** @method 限价范围最大值
 * @param {Object} opts 参数和minLimit参数一致
 */
return maxLimit({
    groupSymbol,
    direction,
    buy_price,
    sell_price
})

/** @method 停损范围最小值
 * @param {Object} opts 参数和minLimit参数一致
 */
return minStopLimit({
    groupSymbol,
    direction,
    buy_price,
    sell_price
})

/** @method 停损范围最大值
 * @param {Object} opts 参数和minLimit参数一致
 */
return maxStopLimit({
    groupSymbol,
    direction,
    buy_price,
    sell_price
})
```

## 挂单价格步长

```js
/** @method 挂单价格步长
 * @param {Object} groupSymbol 当前操作的产品对应的groupSymbol对象
 */
return pendingOrderStep(groupSymbol)
```
