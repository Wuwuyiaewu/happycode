### 盈亏计算
1.  函数文件位置/store/getter.js
2.  输出数据格式

        {
            positionList:[
                {
                    // ws PositionListRet 协议返回的数据跟 GroupSymbolListRet 协议返回数据
                    profitOrLoss //盈亏
                    数据集合
                }
            ],
            accountData:{
                csbzj //初始保证金：持仓中所有产品所需初始保证金总和
                kybzj //可用保证金
                gylx //隔夜利息:当前持仓的隔夜利息
                yk   //盈亏：当前持仓的盈亏之和
                jyk // 净盈亏:当前持仓的净盈亏之和
                yj  //佣金:佣金
                jz  //净值:余额跟净盈亏之和
            },
            colorClass:''//这个字段暂时用不上可以忽略，之前是资产状态颜色 adequate:充足  stopout:强平  less:不足
        }

3.  依赖函数
    *   ix_utils/throttle 节流函数,控制计算频率，优化性能
    *   ix_utils/profitOrLoss_YZ 盈亏计算函数

             params
            {
                base_currency 基础货币
                profit_currency 盈利货币
                direction 1、买入 2、卖出
                order_price 订单价格
                buy_price 最新买入价格
                sell_price 最新卖出价格
                exchange_buy_price 中间汇率货币买入价格 ProductRealTimePrice
                exchange_sell_price  中间汇率货币卖出价格 ProductRealTimePrice
                interest_exchange_profit  中间汇率货币盈利货币 GroupSymbolListRet
                contract_size  合约单位 GroupSymbolListRet
            }
            产品分类  

            直接货币 GroupSymbolListRet{base_currency:'USD',profit_currency:'USD'}
            间接货币 GroupSymbolListRet{base_currency:'USD'}

            怎么查找关联产品 AUDJPY可以找到 USDJPY,JPYUSD

            交叉货币直接盘 关联货币 profit_currency === 关联产品的 profit_currency
            交叉货币间接盘 profit_currency != 关联产品的 profit_currency

            输出结果： 盈亏



