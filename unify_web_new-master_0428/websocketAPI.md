### 登录成功下发前端依赖数据

-   协议名称 UserLoginInfoRet
-   相同数据格式协议 AccountGetRet、AccountUpdateRet、AccountUpdate

          content:{
              account_id
              account_no
              balance
              margin_stop_out
              group_id
              company_id
              margin_maintenance
              margin
          }

-   协议名称 InitProductInfo

          content:{
              product_category:[
                 {
                      code_ids
                      display
                      list:[
                          {
                              simplified
                              zone
                              short_name
                              source
                              code_id
                              digit
                          }
                      ]
                      title
                      sort
                      zone
                 }
              ]
          }

-   协议名称 GroupGetRet
-   相同数据格式协议 GroupUpdateRet

          content:{
              margin_type
              server_id
              currency
          }

-   协议名称 ServerGetRet

          content:{
              end_of_day
          }

-   协议名称 GroupSymbolListRet

          content:{
              data_list:[
                  {
                      id
                      source
                      enable
                      range_initial
                      volumes_step
                      volumes_min
                      volumes_max
                      name
                      digits
                      order_timeout
                      display_name
                      spread
                      spread_balance
                      group_id
                      contract_size
                      base_currency
                      profit_currency
                      margin_currency
                      stop_level
                      pips_ratio
                      margin_initial
                      holiday_margin_initial
                      margin_hedged
                      long_swap
                      short_swap
                      three_days_swap
                      expiry_time
                  }
              ]
              total
              offset
              count
          }

-   协议名称 GroupTradeTimeListRet

          content:{
              data_list:[
                  {
                      symbol_id
                      enable
                      status
                      non_tradeable
                      start_time
                      end_time
                      day_of_week
                  }

              ]
              total
              offset
              count
          }

-   协议名称 TradeServerTimeRet

          content:{
             server_time
          }

### 登录成功，获取数据返回的协议

<!-- + 协议名称 GroupSymbolMarginLevelListRet

        content:{
            data_list:[
                {
                    id
                    symbol_id
                    margin_initial
                    range_max
                    range_min
                }

            ]
            total
            offset
            count
        }   -->

-   协议名称 OrderListRet

          content:{
              data_list:[
                  {
                      id
                      symbol
                      request_volume
                      request_price
                      request_time
                      stop_loss
                      take_profit
                      account_id
                      group_id
                      position_id
                      direction
                      type
                      expire_type
                      range
                  }

              ]
              total
              offset
              count
          }

*   协议名称 PositionListRet

          content:{
              data_list:[
                  {
                      id
                      open_price
                      volume
                      symbol
                      swap
                      commission
                      direction
                      account_id
                      group_id
                      status
                      init_volume
                      open_price
                      open_time
                      close_price
                      close_time
                      profit
                      take_profit
                  }

              ]
              total
              offset
              count
          }

*   http 接口平仓记录 /account/api/tradeInfo

           data:[
             {
                  id
                  dealId
                  openDirection :BUY/SELL
                  tradeVolume
                  profit
                  tradeTime
                  openPrice
                  tradePrice
                  swap
                  orderType
                  openTime
                  tradeTime
             }
           ]

### 交易相关数据

#### 开仓挂单返回协议

-   协议名称 OrderAddRet

          content:{
             id
             direction
             request_volume
             open_margin
             symbol
             request_price
             type
          }

-   协议名称 OrderUpdateRet

          content:{
              id
          }

-   协议名称 PositionAddRet

          content:{
              id
              init_volume
              open_price
          }

-   协议名称 DealAddRet

          content:{
              id
              execute_price
              src_price
              profit
              swap
              symbol
              direction
          }

*   协议名称 AccountUpdateRet、AccountUpdateRet、AccountGetRet

          数据结构看前边描述

### 异常协议

-   协议名称 Warning

          content:{
             ret
             msg_id
          }


-   协议名称 msgNotVerified

           content:{
             ret
             msg_id
          }
          数据结构不详，大概是这样
