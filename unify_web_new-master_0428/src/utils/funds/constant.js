// 文件类型常量
export const FILE_TYPE = {
    'FILE_TYPE_IDCARD_BACK': 'FILE_TYPE_IDCARD_BACK', // 身份证反面
    'FILE_TYPE_IDCARD_FRONT': 'FILE_TYPE_IDCARD_FRONT' // 身份证正面
}

// 身份证审核状态
export const ID_CART_STATUS = {
    '-6': '未上传',
    '-1': '审核失败',
    '0': '审批中',
    '1': '审批中',
    '2': '已通过'
}

// 出金银行卡的状态
export const WITH_MONEY_CODE = {
    '-1': '已取消', // 审批失败
    '0': '审批中',
    '1': '审批中',
    '2': '已通过',
    '5': '已删除' // 解绑
}

export const MARKET_ID = {
    0: '上海', 1: '深圳', 2: '港股', 9: '美股'
}

// 订单类型
// 市价：1、4
export const DEAL_REASON = {
    1: '市价开仓',
    2: '限价开仓',
    3: '停损开仓',
    4: '市价平仓',
    5: '止损平仓',
    6: '止盈平仓',
    7: '强平',
    8: '一键平仓',
    9: '结算平仓',
    10: '滚动开仓',
    11: '对冲平仓',
    16: '止损',
    17: '销户平仓',
    19: '日结平仓',
    20: '挂单平仓',
    21: '市价强平',
    32: '止盈',
    321: '拆股-强平',
    322: '合股-强平',
    323: '配股-强平',
    324: '送股-强平'
}

// 订单状态
export const ORDER_STATUS = {
    1: '待成交',
    2: '全部成交',
    5: '手动撤消',
    6: '已拒绝',
    10: '系统撤销', // 收盘到期
    11: '系统撤销' // 公司行动
}

// 印尼 +62 IDR
// 马来西亚 +60 MYR
// 泰国 +66 THB
// 越南 +84 VND
// 菲律宾 +63 PHP

export const AREACODEMAP = {
    62: 'IDR',
    60: 'MYR',
    66: 'THB',
    84: 'VND',
    63: 'PHP',
    86: 'CNY'
}

// 国家编码转区号
export const COUNTRTOAREACODE = {
    ISO_3166_360: '62',
    ISO_3166_156: '86',
    ISO_3166_458: '60',
    ISO_3166_764: '66',
    ISO_3166_704: '84',
    ISO_3166_608: '63'
}
