const usExchangeRate = 7.77;
const TR_DATA = [
    { type: "外汇", name: "欧元美元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 1, isShow: false, delta: 0.002 },
    { type: "外汇", name: "英镑美元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 2, isShow: false, delta: 0.004 },
    { type: "外汇", name: "澳元美元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 5, isShow: false, delta: 0.002 },
    { type: "外汇", name: "纽元美元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 8, isShow: false, delta: 0.002 },
    { type: "外汇", name: "美元瑞郎", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 4, isShow: false, delta: 0.004 },
    { type: "外汇", name: "欧元瑞郎", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 10, isShow: false, delta: 0.004 },
    { type: "外汇", name: "英镑瑞郎", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 12, isShow: false, delta: 0.004 },
    { type: "外汇", name: "欧元英镑", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 6, isShow: false, delta: 0.004 },
    { type: "外汇", name: "欧元澳元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 15, isShow: false, delta: 0.004 },
    { type: "外汇", name: "英镑澳元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 53, isShow: false, delta: 0.004 },
    { type: "外汇", name: "澳元纽元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 50, isShow: false, delta: 0.002 },
    { type: "外汇", name: "美元新加坡元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 42, isShow: false, delta: 0.004 },
    { type: "外汇", name: "欧元加元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 16, isShow: false, delta: 0.004 },
    { type: "外汇", name: "欧元纽元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 52, isShow: false, delta: 0.004 },
    { type: "外汇", name: "美元加元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 7, isShow: false, delta: 0.002 },
    { type: "外汇", name: "英镑加元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 54, isShow: false, delta: 0.004 },
    { type: "外汇", name: "英镑纽元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 55, isShow: false, delta: 0.004 },
    { type: "外汇", name: "美元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 3, isShow: false, delta: 0.002 },
    { type: "外汇", name: "欧元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 9, isShow: false, delta: 0.004 },
    { type: "外汇", name: "英镑日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 11, isShow: false, delta: 0.004 },
    { type: "外汇", name: "澳元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 49, isShow: false, delta: 0.002 },
    { type: "外汇", name: "纽元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 58, isShow: false, delta: 0.002 },
    { type: "外汇", name: "加元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 51, isShow: false, delta: 0.002 },
    { type: "外汇", name: "美元离岸人民币", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 961728, isShow: false, delta: 0.01 },
    { type: "外汇", name: "港元离岸人民币", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 1817, isShow: false, delta: 0.01 },
    { type: "外汇", name: "瑞郎日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 13, isShow: false, delta: 0.004 },
    { type: "指数", name: "英国UK100", profit: 0, high: 0, low: 0, mulpiple: "10", pid: 8838, isShow: false, delta: 0.005 },
    { type: "指数", name: "法国FRA40", profit: 0, high: 0, low: 0, mulpiple: "10", pid: 8853, isShow: false, delta: 0.005 },
    { type: "指数", name: "德国GER30", profit: 0, high: 0, low: 0, mulpiple: "5", pid: 8826, isShow: false, delta: 0.005 },
    { type: "指数", name: "美汇指数", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 8827, isShow: false, delta: 0.004 },
    { type: "指数", name: "恐慌指数", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 8884, isShow: false, delta: 0.05 },
    { type: "指数", name: "香港50", profit: 0, high: 0, low: 0, mulpiple: "2", pid: 8984, isShow: false, delta: 0.005 },
    { type: "指数", name: "中华300", profit: 0, high: 0, low: 0, mulpiple: "10", pid: 940801, isShow: false, delta: 0.005 },
    { type: "指数", name: "日本JPN225", profit: 0, high: 0, low: 0, mulpiple: "2", pid: 8859, isShow: false, delta: 0.005 },
    { type: "指数", name: "美国DJ30", profit: 0, high: 0, low: 0, mulpiple: "5", pid: 8873, isShow: false, delta: 0.005 },
    { type: "指数", name: "美国SP500", profit: 0, high: 0, low: 0, mulpiple: "50", pid: 8839, isShow: false, delta: 0.005 },
    { type: "指数", name: "美国TECH100", profit: 0, high: 0, low: 0, mulpiple: "20", pid: 8874, isShow: false, delta: 0.005 },
    { type: "能源", name: "天然气", profit: 0, high: 0, low: 0, mulpiple: "10000", pid: 8862, isShow: false, delta: 0.01 },
    { type: "能源", name: "英国原油", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 8833, isShow: false, delta: 0.005 },
    { type: "能源", name: "美国原油", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 8849, isShow: false, delta: 0.005 },
    { type: "贵金属", name: "现货白银", profit: 0, high: 0, low: 0, mulpiple: "5000", pid: 69, isShow: false, delta: 0.005 },
    { type: "贵金属", name: "现货黄金", profit: 0, high: 0, low: 0, mulpiple: "100", pid: 68, isShow: false, delta: 0.0025 },
    { type: "贵金属", name: "钯金", profit: 0, high: 0, low: 0, mulpiple: "100", pid: 1043108, isShow: false, delta: 0.005 },
    { type: "贵金属", name: "铜", profit: 0, high: 0, low: 0, mulpiple: "100", pid: 8831, isShow: false, delta: 0.005 },
    { type: "贵金属", name: "铂金", profit: 0, high: 0, low: 0, mulpiple: "50", pid: 1043107, isShow: false, delta: 0.005 },
    { type: "农产品", name: "玉米", profit: 0, high: 0, low: 0, mulpiple: 100, pid: 8918, isShow: false, delta: 0.01 },
    { type: "农产品", name: "大豆", profit: 0, high: 0, low: 0, mulpiple: 50, pid: 8916, isShow: false, delta: 0.01 },
    { type: "农产品", name: "小麦", profit: 0, high: 0, low: 0, mulpiple: 100, pid: 8917, isShow: false, delta: 0.01 },
    { type: "农产品", name: "可可", profit: 0, high: 0, low: 0, mulpiple: "20", pid: 8894, isShow: false, delta: 0.01 },
    { type: "美股", name: "苹果公司", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6408, isShow: false, delta: 0.05 },
    { type: "美股", name: "阿里巴巴", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 941155, isShow: false, delta: 0.05 },
    { type: "美股", name: "花旗银行", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 241, isShow: false, delta: 0.05 },
    { type: "美股", name: "波音", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 238, isShow: false, delta: 0.05 },
    { type: "美股", name: "京东", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 102911, isShow: false, delta: 0.05 },
    { type: "美股", name: "耐克", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8948, isShow: false, delta: 0.05 },
    { type: "美股", name: "特斯拉", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 13994, isShow: false, delta: 0.05 },
    { type: "美股", name: "微博", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 101899, isShow: false, delta: 0.05 },
    { type: "美股", name: "新浪", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6377, isShow: false, delta: 0.05 },
    { type: "美股", name: "58同城", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 48394, isShow: false, delta: 0.05 },
    { type: "美股", name: "拼多多", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1089236, isShow: false, delta: 0.05 },
    { type: "美股", name: "沃尔玛", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7997, isShow: false, delta: 0.05 },
    { type: "美股", name: "百度", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6378, isShow: false, delta: 0.05 },
    { type: "美股", name: "亚马逊", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6435, isShow: false, delta: 0.05 },
    { type: "美股", name: "可口可乐", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 271, isShow: false, delta: 0.05 },
    { type: "美股", name: "微软", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 252, isShow: false, delta: 0.05 },
    { type: "美股", name: "华米科技", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1061947, isShow: false, delta: 0.05 },
    { type: "美股", name: "迪士尼", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 258, isShow: false, delta: 0.05 },
    { type: "美股", name: "谷歌C", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 100160, isShow: false, delta: 0.05 },
    { type: "美股", name: "星巴克", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6500, isShow: false, delta: 0.05 },
    { type: "美股", name: "雪佛龙", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 240, isShow: false, delta: 0.05 },
    { type: "美股", name: "福特汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 255, isShow: false, delta: 0.05 },
    { type: "美股", name: "面书", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 26490, isShow: false, delta: 0.05 },
    { type: "美股", name: "通用电气", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8193, isShow: false, delta: 0.05 },
    { type: "美股", name: "通用汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 239, isShow: false, delta: 0.05 },
    { type: "美股", name: "GoPro", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 102883, isShow: false, delta: 0.05 },
    { type: "美股", name: "爱奇艺", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1073098, isShow: false, delta: 0.05 },
    { type: "美股", name: "新濠博亚娱乐", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 39332, isShow: false, delta: 0.05 },
    { type: "美股", name: "3M", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 277, isShow: false, delta: 0.05 },
    { type: "美股", name: "奈飞", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 13063, isShow: false, delta: 0.05 },
    { type: "美股", name: "甲骨文", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 274, isShow: false, delta: 0.05 },
    { type: "美股", name: "Spotify", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1072316, isShow: false, delta: 0.05 },
    { type: "美股", name: "携程网", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6451, isShow: false, delta: 0.05 },
    { type: "美股", name: "推特", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 44334, isShow: false, delta: 0.05 },
    { type: "美股", name: "优步", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1115848, isShow: false, delta: 0.05 },
    { type: "美股", name: "埃克森美孚", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7888, isShow: false, delta: 0.05 },
    { type: "美股", name: "雅培", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8192, isShow: false, delta: 0.05 },
    { type: "美股", name: "汽车之家", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 48389, isShow: false, delta: 0.05 },
    { type: "美股", name: "好市多", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6443, isShow: false, delta: 0.05 },
    { type: "美股", name: "GAP", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7925, isShow: false, delta: 0.05 },
    { type: "美股", name: "本田汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8019, isShow: false, delta: 0.05 },
    { type: "美股", name: "强生公司", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8177, isShow: false, delta: 0.05 },
    { type: "美股", name: "摩根大通", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 267, isShow: false, delta: 0.05 },
    { type: "美股", name: "卡夫亨氏", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 270, isShow: false, delta: 0.05 },
    { type: "美股", name: "万事达卡", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7864, isShow: false, delta: 0.05 },
    { type: "美股", name: "麦当劳", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 272, isShow: false, delta: 0.05 },
    { type: "美股", name: "陌陌", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 943151, isShow: false, delta: 0.05 },
    { type: "美股", name: "摩根士丹利", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8056, isShow: false, delta: 0.05 },
    { type: "美股", name: "诺基亚", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 23176, isShow: false, delta: 0.05 },
    { type: "美股", name: "百事可乐", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8358, isShow: false, delta: 0.05 },
    { type: "美股", name: "辉瑞", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7989, isShow: false, delta: 0.05 },
    { type: "美股", name: "索尼", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8086, isShow: false, delta: 0.05 },
    { type: "美股", name: "搜狗", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1054796, isShow: false, delta: 0.05 },
    { type: "美股", name: "蒂芙尼", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 0000, isShow: false, delta: 0.05 },
    { type: "美股", name: "丰田汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8321, isShow: false, delta: 0.05 },
    { type: "美股", name: "Under Armour", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 976067, isShow: false, delta: 0.05 },
    { type: "美股", name: "百胜餐饮", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8327, isShow: false, delta: 0.05 },
    { type: "美股", name: "欢聚", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 40109, isShow: false, delta: 0.05 },
    { type: "美股", name: "跟谁学", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1136128, isShow: false, delta: 0.05 },
    { type: "美股", name: "哔哩哔哩", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1073087, isShow: false, delta: 0.05 },
    { type: "美股", name: "黑莓", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6374, isShow: false, delta: 0.05 },
    { type: "美股", name: "富途", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1123144, isShow: false, delta: 0.05 },
    { type: "美股", name: "雾芯科技", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1169116, isShow: false, delta: 0.05 },
    { type: "美股", name: "台积电", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 32306, isShow: false, delta: 0.05 },
    { type: "美股", name: "陆金所", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1167066, isShow: false, delta: 0.05 },
    { type: "美股", name: "Palantir", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1166239, isShow: false, delta: 0.05 },
    { type: "美股", name: "第九城市", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 16714, isShow: false, delta: 0.05 },
    { type: "美股", name: "名创优品", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1166925, isShow: false, delta: 0.05 },
    { type: "美股", name: "贝壳", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1164709, isShow: false, delta: 0.05 },
    { type: "美股", name: "Beyond Meet", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1129317, isShow: false, delta: 0.05 },
    { type: "美股", name: "3D system", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 13938, isShow: false, delta: 0.05 },
    { type: "美股", name: "Bionano Genomics", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1096506, isShow: false, delta: 0.05 },
    { type: "美股", name: "Polar Power", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 994020, isShow: false, delta: 0.05 },
    { type: "美股", name: "蔚来", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1096032, isShow: false, delta: 0.05 },
    { type: "美股", name: "小鹏汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1165509, isShow: false, delta: 0.05 },
    { type: "美股", name: "好未来", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 29752, isShow: false, delta: 0.05 },
    { type: "美股", name: "Adobe", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6373, isShow: false, delta: 0.05 },
    { type: "美股", name: "Ts Innovation", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1169832, isShow: false, delta: 0.05 },
    { type: "美股", name: "逸仙电商", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1167333, isShow: false, delta: 0.05 },
    { type: "美股", name: "小牛电动", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 573109, isShow: false, delta: 0.05 },
    { type: "美股", name: "老虎证券", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1123579, isShow: false, delta: 0.05 },
    { type: "美股", name: "网易", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6439, isShow: false, delta: 0.05 },
    { type: "美股", name: "华住集团", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1166247, isShow: false, delta: 0.05 },
    { type: "美股", name: "Twilio", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 985558, isShow: false, delta: 0.05 },
    { type: "美股", name: "Tilray", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1084213, isShow: false, delta: 0.05 },
    { type: "美股", name: "维珍银河", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1052758, isShow: false, delta: 0.05 },
    { type: "美股", name: "Salesforce", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8294, isShow: false, delta: 0.05 },
    { type: "美股", name: "Zoom", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1127188, isShow: false, delta: 0.05 },
    { type: "美股", name: "高通", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 5739, isShow: false, delta: 0.05 },
    { type: "港股", name: "美团点评-W", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1096030, isShow: false, delta: 0.05 },
    { type: "港股", name: "石药集团", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 100083, isShow: false, delta: 0.05 },
    { type: "港股", name: "百威亚太", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1141315, isShow: false, delta: 0.05 },
    { type: "港股", name: "比亚迪股份", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 13884, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国金茂", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 49987, isShow: false, delta: 0.05 },
    { type: "港股", name: "阿里健康", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 946376, isShow: false, delta: 0.05 },
    { type: "港股", name: "海底捞", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 1096193, isShow: false, delta: 0.05 },
    { type: "港股", name: "舜宇光学科技", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 943521, isShow: false, delta: 0.05 },
    { type: "港股", name: "青岛啤酒", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 32499, isShow: false, delta: 0.05 },
    { type: "港股", name: "康师傅", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 32484, isShow: false, delta: 0.05 },
    { type: "港股", name: "蒙牛", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 13888, isShow: false, delta: 0.05 },
    { type: "港股", name: "李宁", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50066, isShow: false, delta: 0.05 },
    { type: "港股", name: "阿里巴巴-SW", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1155537, isShow: false, delta: 0.05 },
    { type: "港股", name: "香港交易所", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 8564, isShow: false, delta: 0.05 },
    { type: "港股", name: "友邦保险", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 32502, isShow: false, delta: 0.05 },
    { type: "港股", name: "腾讯控股", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 102047, isShow: false, delta: 0.05 },
    { type: "港股", name: "阅文", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1054808, isShow: false, delta: 0.05 },
    { type: "港股", name: "平安好医生", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1075240, isShow: false, delta: 0.05 },
    { type: "港股", name: "安踏体育", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 100123, isShow: false, delta: 0.05 },
    { type: "港股", name: "小米集团-W", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1075487, isShow: false, delta: 0.05 },
    { type: "港股", name: "银河娱乐", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 49962, isShow: false, delta: 0.05 },
    { type: "港股", name: "吉利汽车", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 49968, isShow: false, delta: 0.05 },
    { type: "港股", name: "华润啤酒", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 8560, isShow: false, delta: 0.05 },
    { type: "港股", name: "中兴通讯", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 13879, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国铁塔", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 1089444, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国海洋石油", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 8570, isShow: false, delta: 0.05 },
    { type: "港股", name: "海螺水泥", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 32497, isShow: false, delta: 0.05 },
    { type: "港股", name: "建设银行", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 8572, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国移动", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8, isShow: false, delta: 0.05 },
    { type: "港股", name: "中芯国际", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50051, isShow: false, delta: 0.05 },
    { type: "港股", name: "联想集团", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 32500, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国神华", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 101040, isShow: false, delta: 0.05 },
    { type: "港股", name: "中信证券", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50024, isShow: false, delta: 0.05 },
    { type: "港股", name: "金沙中国有限公司", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 38075, isShow: false, delta: 0.05 },
    { type: "港股", name: "药明生物", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 1167625, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国平安", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8579, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国人寿", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 8581, isShow: false, delta: 0.05 },
    { type: "港股", name: "金山软件", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 100143, isShow: false, delta: 0.05 },
    { type: "港股", name: "招商银行", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 32495, isShow: false, delta: 0.05 },
    { type: "港股", name: "汇控", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 8545, isShow: false, delta: 0.05 },
    { type: "港股", name: "新鸿基地产", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8551, isShow: false, delta: 0.05 },
    { type: "港股", name: "金蝶国际", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 100019, isShow: false, delta: 0.05 },
    { type: "港股", name: "复星国际", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 49983, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国海外发展", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8567, isShow: false, delta: 0.05 },
    { type: "港股", name: "白云山", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 945136, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国太平", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 49992, isShow: false, delta: 0.05 },
    { type: "港股", name: "长江基建", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8574, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国南方航空", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 100079, isShow: false, delta: 0.05 },
    { type: "港股", name: "永利澳门", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 100089, isShow: false, delta: 0.05 },
    { type: "港股", name: "比亚迪股份", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 13884, isShow: false, delta: 0.05 },
    { type: "港股", name: "新华保险", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 50003, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国中车", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50057, isShow: false, delta: 0.05 },
    { type: "港股", name: "融创中国", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 100117, isShow: false, delta: 0.05 },
    { type: "港股", name: "碧桂园", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50008, isShow: false, delta: 0.05 },
    { type: "港股", name: "周大福", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 50007, isShow: false, delta: 0.05 },
    { type: "港股", name: "广汽集团", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 50010, isShow: false, delta: 0.05 },
    { type: "港股", name: "申洲国际", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 50011, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国太保", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 32492, isShow: false, delta: 0.05 },
    { type: "港股", name: "紫金", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 13893, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国建材", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 13894, isShow: false, delta: 0.05 },
    { type: "港股", name: "恒大", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50017, isShow: false, delta: 0.05 },
    { type: "港股", name: "华夏沪深300", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 999132, isShow: false, delta: 0.05 },
    { type: "港股", name: "南方A50", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 959571, isShow: false, delta: 0.05 },
    { type: "港股", name: "农夫山泉", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1165549, isShow: false, delta: 0.05 },
    { type: "港股", name: "京东健康", profit: 0, high: 0, low: 0, mulpiple: 50 / usExchangeRate, pid: 1167535, isShow: false, delta: 0.05 },
    { type: "港股", name: "微创医疗", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 100059, isShow: false, delta: 0.05 },
    { type: "港股", name: "长城汽车", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50012, isShow: false, delta: 0.05 },
    { type: "港股", name: "福耀玻璃", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 949921, isShow: false, delta: 0.05 },
    { type: "港股", name: "思摩尔国际", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 1163128, isShow: false, delta: 0.05 },
    { type: "港股", name: "中国有赞", profit: 0, high: 0, low: 0, mulpiple: 4000 / usExchangeRate, pid: 943563, isShow: false, delta: 0.05 },
    { type: "港股", name: "信达生物", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 1097278, isShow: false, delta: 0.05 },
    { type: "港股", name: "微盟集团", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 573111, isShow: false, delta: 0.05 },
    { type: "港股", name: "保利协鑫能源", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50021, isShow: false, delta: 0.05 },
    { type: "港股", name: "康希诺生物-B", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1123795, isShow: false, delta: 0.05 },
    { type: "港股", name: "众安在线", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1052239, isShow: false, delta: 0.05 },
    { type: "港股", name: "猫眼娱乐", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1118184, isShow: false, delta: 0.05 },
    { type: "港股", name: "瑞声科技", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50009, isShow: false, delta: 0.05 },
    { type: "港股", name: "同程艺龙", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 1097872, isShow: false, delta: 0.05 },
    { type: "港股", name: "新东方在线", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 1123794, isShow: false, delta: 0.05 },
    { type: "港股", name: "丘钛科技", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 990763, isShow: false, delta: 0.05 },
    { type: "港股", name: "四环医药", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50034, isShow: false, delta: 0.05 },
    { type: "港股", name: "BC科技集团", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 990500, isShow: false, delta: 0.05 },
    { type: "数字货币", name: "比特币", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 10573, isShow: false, delta: 0.05 },
    { type: "数字货币", name: "以太币", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1058142, isShow: false, delta: 0.05 },
]