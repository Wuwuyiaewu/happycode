const usExchangeRate = 7.77;
var technicalAnalysisVue = new Vue({
    el: '#technical_analysis_content',
    data() {
        return {
            more_btn_text: '了解更多',
            title_content1: '行情推荐',
            title_content2: '技术分析',
            start: false,
            ws: null,
            techAnalyIndex: 0,
            isSelectCatagory: false,
            isSelectAll: true,
            isShowTimeMenu: false,
            isShowInnerTimeMenu: false,
            isShowTechDetailMenu: false,
            searchTechLock: false,
            isShowTechnicalAnalysisHtml: true,
            defaultTechAnalyInfo: {
                conclusion: '---',
                conclusionBg: 'bg_normal', //bg_green,bg_red,bg_normal
                conclusionMAText: '---',
                conclusionMATextColor: 'text_normal', //text_green,text_red,text_normal
                conclusionMABuyText: '---',
                conclusionMASellText: '---',
                conclusionTechIndiText: '---',
                conclusionTechIndiTextColor: 'text_normal', //text_green,text_red,text_normal
                conclusionTechIndiBuyText: '---',
                conclusionTechIndiSellText: '---',

            },
            techAnalyInfo: {},
            rankedImgPath: [
                'images/ranking_icon1.png',
                'images/ranking_icon2.png',
                'images/ranking_icon3.png',
                'images/ranking_icon4.png',
                'images/ranking_icon5.png'
            ],
            rankedButtonPath: 'images/r_btn.png',
            techDetailTimingIndex: 2,
            techDetailTiming: [
                { timeString: "5分钟", peid: "300" },
                { timeString: "15分钟", peid: "900" },
                { timeString: "每小时", peid: "3600" },
                { timeString: "每日", peid: "86400" },
                { timeString: "每周", peid: "week" },
                { timeString: "每月", peid: "month" },
                { timeString: "1分钟", peid: "60" },
                { timeString: "30分钟", peid: "1800" },
                { timeString: "5小时", peid: "18000" },
            ],
            techDetailTimingSort: [
                { timeString: "5分钟", peid: "300" },
                { timeString: "15分钟", peid: "900" },
                { timeString: "每小时", peid: "3600" },
                { timeString: "每日", peid: "86400" },
            ],
            techDetailTimingMenu: [
                { timeString: "每月", peid: "month" },
                { timeString: "每周", peid: "week" },
                { timeString: "每日", peid: "86400" },
                { timeString: "5小时", peid: "18000" },
                { timeString: "30分钟", peid: "1800" },
                { timeString: "1分钟", peid: "60" },
            ],
            catagory: [
                { type: "外汇", toggle: true },
                { type: "指数", toggle: true },
                { type: "能源", toggle: true },
                { type: "贵金属", toggle: true },
                { type: "农产品", toggle: true },
                { type: "美股", toggle: true },
                { type: "港股", toggle: true },
                { type: "数字货币", toggle: true },
            ],
            // PivotPoint
            htmlObjectPop: null,
            lastCatagory: null,
            selectedCatagoryText: '',
            httpConfig: {
                method: 'post',
                url: HTTP_BASE_URL + '/account/appProperties/getAccountProperties',
                headers: {
                    'Content-type': 'application/json',
                    'module': 'uat-account',
                    'rpcType': 'http',
                    'method': '/account/appProperties/getAccountProperties',
                    'httpMethod': 'post',
                    'trace': this.getTraceId(),
                    'Authorization': ''
                },

                data: {
                    "head": { "appKey": "yz352001" },
                    "data": { "login_name": "Guest", "password": "" }
                },
            },
            wsConfig: {
                url: WS_BASE_URL,
                method: 'get',
                trace: this.getTraceId(),
                version_code: "1",
                device: "h5",
                head: {
                    server: "yz",
                    msgType: "login",
                    sendTime: (new Date()).getTime(),
                    Authorization: "",
                    lang: "zh-CN"
                },
                content: {
                    appKey: "",
                    clientIp: "",
                    company_id: "",
                    login_name: "Guest",
                    password: "",
                    user_type: -1
                },
            },
            selectedProductIds: [],
            rankedIds: [],
            exRates: { 573139: 1.16823, 573039: 1.27218, 573024: 0.71334, 573028: 0.66224, 573035: 0.92125, 573033: 1.07610, 573034: 1.17177, 573036: 0.91818, 573041: 1.63763, 573037: 1.78335, 573030: 1.07705, 573069: 1.36637, 573090: 1.55562, 573091: 1.76441, 573031: 1.33174, 573088: 1.69363, 573089: 1.92091, 573032: 105.108, 573040: 122.775, 573038: 133.673, 573026: 74.95, 573029: 69.572, 573027: 78.923, 573043: 6.79531, 573042: 0.87675, 573087: 114.07, },
            product: {
                573139: { type: "外汇", name: "欧元美元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 1, isShow: false, delta: 0.002 },
                573039: { type: "外汇", name: "英镑美元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 2, isShow: false, delta: 0.004 },
                573024: { type: "外汇", name: "澳元美元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 5, isShow: false, delta: 0.002 },
                573028: { type: "外汇", name: "纽元美元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 8, isShow: false, delta: 0.002 },
                573035: { type: "外汇", name: "美元瑞郎", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 4, isShow: false, delta: 0.004 },
                573033: { type: "外汇", name: "欧元瑞郎", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 10, isShow: false, delta: 0.004 },
                573034: { type: "外汇", name: "英镑瑞郎", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 12, isShow: false, delta: 0.004 },
                573036: { type: "外汇", name: "欧元英镑", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 6, isShow: false, delta: 0.004 },
                573041: { type: "外汇", name: "欧元澳元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 15, isShow: false, delta: 0.004 },
                573037: { type: "外汇", name: "英镑澳元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 53, isShow: false, delta: 0.004 },
                573030: { type: "外汇", name: "澳元纽元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 50, isShow: false, delta: 0.002 },
                593069: { type: "外汇", name: "美元新加坡元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 42, isShow: false, delta: 0.004 },
                573090: { type: "外汇", name: "欧元加元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 16, isShow: false, delta: 0.004 },
                573091: { type: "外汇", name: "欧元纽元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 52, isShow: false, delta: 0.004 },
                573031: { type: "外汇", name: "美元加元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 7, isShow: false, delta: 0.002 },
                573088: { type: "外汇", name: "英镑加元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 54, isShow: false, delta: 0.004 },
                573089: { type: "外汇", name: "英镑纽元", profit: 0, high: 0, low: 0, mulpiple: "100000", pid: 55, isShow: false, delta: 0.004 },
                573032: { type: "外汇", name: "美元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 3, isShow: false, delta: 0.002 },
                573040: { type: "外汇", name: "欧元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 9, isShow: false, delta: 0.004 },
                573038: { type: "外汇", name: "英镑日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 11, isShow: false, delta: 0.004 },
                573026: { type: "外汇", name: "澳元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 49, isShow: false, delta: 0.002 },
                573029: { type: "外汇", name: "纽元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 58, isShow: false, delta: 0.002 },
                573027: { type: "外汇", name: "加元日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 51, isShow: false, delta: 0.002 },
                573043: { type: "外汇", name: "美元离岸人民币", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 961728, isShow: false, delta: 0.01 },
                573042: { type: "外汇", name: "港元离岸人民币", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 1817, isShow: false, delta: 0.01 },
                573087: { type: "外汇", name: "瑞郎日元", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 13, isShow: false, delta: 0.004 },
                573023: { type: "指数", name: "英国UK100", profit: 0, high: 0, low: 0, mulpiple: "10", pid: 8838, isShow: false, delta: 0.005 },
                573021: { type: "指数", name: "法国FRA40", profit: 0, high: 0, low: 0, mulpiple: "10", pid: 8853, isShow: false, delta: 0.005 },
                573022: { type: "指数", name: "德国GER30", profit: 0, high: 0, low: 0, mulpiple: "5", pid: 8826, isShow: false, delta: 0.005 },
                573019: { type: "指数", name: "美汇指数", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 8827, isShow: false, delta: 0.004 },
                573020: { type: "指数", name: "恐慌指数", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 8884, isShow: false, delta: 0.05 },
                573016: { type: "指数", name: "香港50", profit: 0, high: 0, low: 0, mulpiple: "2", pid: 8984, isShow: false, delta: 0.005 },
                573017: { type: "指数", name: "中华300", profit: 0, high: 0, low: 0, mulpiple: "10", pid: 940801, isShow: false, delta: 0.005 },
                573018: { type: "指数", name: "日本JPN225", profit: 0, high: 0, low: 0, mulpiple: "2", pid: 8859, isShow: false, delta: 0.005 },
                573015: { type: "指数", name: "美国DJ30", profit: 0, high: 0, low: 0, mulpiple: "5", pid: 8873, isShow: false, delta: 0.005 },
                573013: { type: "指数", name: "美国SP500", profit: 0, high: 0, low: 0, mulpiple: "50", pid: 8839, isShow: false, delta: 0.005 },
                573014: { type: "指数", name: "美国TECH100", profit: 0, high: 0, low: 0, mulpiple: "20", pid: 8874, isShow: false, delta: 0.005 },
                573012: { type: "能源", name: "天然气", profit: 0, high: 0, low: 0, mulpiple: "10000", pid: 8862, isShow: false, delta: 0.01 },
                573011: { type: "能源", name: "英国原油", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 8833, isShow: false, delta: 0.005 },
                573010: { type: "能源", name: "美国原油", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 8849, isShow: false, delta: 0.005 },
                573005: { type: "贵金属", name: "现货白银", profit: 0, high: 0, low: 0, mulpiple: "5000", pid: 69, isShow: false, delta: 0.005 },
                573004: { type: "贵金属", name: "现货黄金", profit: 0, high: 0, low: 0, mulpiple: "100", pid: 68, isShow: false, delta: 0.0025 },
                573003: { type: "贵金属", name: "钯金", profit: 0, high: 0, low: 0, mulpiple: "100", pid: 1043108, isShow: false, delta: 0.005 },
                593070: { type: "贵金属", name: "铜", profit: 0, high: 0, low: 0, mulpiple: "100", pid: 8831, isShow: false, delta: 0.005 },
                573002: { type: "贵金属", name: "铂金", profit: 0, high: 0, low: 0, mulpiple: "50", pid: 1043107, isShow: false, delta: 0.005 },
                573007: { type: "农产品", name: "玉米", profit: 0, high: 0, low: 0, mulpiple: 100, pid: 8918, isShow: false, delta: 0.01 },
                573008: { type: "农产品", name: "大豆", profit: 0, high: 0, low: 0, mulpiple: 50, pid: 8916, isShow: false, delta: 0.01 },
                573006: { type: "农产品", name: "小麦", profit: 0, high: 0, low: 0, mulpiple: 100, pid: 8917, isShow: false, delta: 0.01 },
                573009: { type: "农产品", name: "可可", profit: 0, high: 0, low: 0, mulpiple: "20", pid: 8894, isShow: false, delta: 0.01 },
                573118: { type: "美股", name: "苹果公司", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6408, isShow: false, delta: 0.05 },
                573115: { type: "美股", name: "阿里巴巴", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 941155, isShow: false, delta: 0.05 },
                573113: { type: "美股", name: "花旗银行", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 241, isShow: false, delta: 0.05 },
                573116: { type: "美股", name: "波音", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 238, isShow: false, delta: 0.05 },
                573099: { type: "美股", name: "京东", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 102911, isShow: false, delta: 0.05 },
                593052: { type: "美股", name: "耐克", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8948, isShow: false, delta: 0.05 },
                593043: { type: "美股", name: "特斯拉", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 13994, isShow: false, delta: 0.05 },
                573143: { type: "美股", name: "微博", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 101899, isShow: false, delta: 0.05 },
                593048: { type: "美股", name: "新浪", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6377, isShow: false, delta: 0.05 },
                573144: { type: "美股", name: "58同城", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 48394, isShow: false, delta: 0.05 },
                573095: { type: "美股", name: "拼多多", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1089236, isShow: false, delta: 0.05 },
                593041: { type: "美股", name: "沃尔玛", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7997, isShow: false, delta: 0.05 },
                573114: { type: "美股", name: "百度", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6378, isShow: false, delta: 0.05 },
                573117: { type: "美股", name: "亚马逊", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6435, isShow: false, delta: 0.05 },
                573098: { type: "美股", name: "可口可乐", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 271, isShow: false, delta: 0.05 },
                573096: { type: "美股", name: "微软", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 252, isShow: false, delta: 0.05 },
                573128: { type: "美股", name: "华米科技", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1061947, isShow: false, delta: 0.05 },
                593063: { type: "美股", name: "迪士尼", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 258, isShow: false, delta: 0.05 },
                593062: { type: "美股", name: "谷歌C", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 100160, isShow: false, delta: 0.05 },
                573093: { type: "美股", name: "星巴克", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6500, isShow: false, delta: 0.05 },
                573104: { type: "美股", name: "雪佛龙", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 240, isShow: false, delta: 0.05 },
                573120: { type: "美股", name: "福特汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 255, isShow: false, delta: 0.05 },
                573103: { type: "美股", name: "面书", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 26490, isShow: false, delta: 0.05 },
                573126: { type: "美股", name: "通用电气", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8193, isShow: false, delta: 0.05 },
                573124: { type: "美股", name: "通用汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 239, isShow: false, delta: 0.05 },
                573127: { type: "美股", name: "GoPro", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 102883, isShow: false, delta: 0.05 },
                573101: { type: "美股", name: "爱奇艺", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1073098, isShow: false, delta: 0.05 },
                573129: { type: "美股", name: "新濠博亚娱乐", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 39332, isShow: false, delta: 0.05 },
                573131: { type: "美股", name: "3M", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 277, isShow: false, delta: 0.05 },
                573135: { type: "美股", name: "奈飞", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 13063, isShow: false, delta: 0.05 },
                573137: { type: "美股", name: "甲骨文", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 274, isShow: false, delta: 0.05 },
                573138: { type: "美股", name: "Spotify", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1072316, isShow: false, delta: 0.05 },
                573140: { type: "美股", name: "携程网", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6451, isShow: false, delta: 0.05 },
                573141: { type: "美股", name: "推特", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 44334, isShow: false, delta: 0.05 },
                573142: { type: "美股", name: "优步", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1115848, isShow: false, delta: 0.05 },
                573092: { type: "美股", name: "埃克森美孚", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7888, isShow: false, delta: 0.05 },
                593066: { type: "美股", name: "雅培", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8192, isShow: false, delta: 0.05 },
                593065: { type: "美股", name: "汽车之家", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 48389, isShow: false, delta: 0.05 },
                593064: { type: "美股", name: "好市多", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6443, isShow: false, delta: 0.05 },
                593061: { type: "美股", name: "GAP", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7925, isShow: false, delta: 0.05 },
                593060: { type: "美股", name: "本田汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8019, isShow: false, delta: 0.05 },
                593059: { type: "美股", name: "强生公司", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8177, isShow: false, delta: 0.05 },
                593058: { type: "美股", name: "摩根大通", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 267, isShow: false, delta: 0.05 },
                593057: { type: "美股", name: "卡夫亨氏", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 270, isShow: false, delta: 0.05 },
                593056: { type: "美股", name: "万事达卡", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7864, isShow: false, delta: 0.05 },
                593055: { type: "美股", name: "麦当劳", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 272, isShow: false, delta: 0.05 },
                593054: { type: "美股", name: "陌陌", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 943151, isShow: false, delta: 0.05 },
                593053: { type: "美股", name: "摩根士丹利", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8056, isShow: false, delta: 0.05 },
                593051: { type: "美股", name: "诺基亚", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 23176, isShow: false, delta: 0.05 },
                593050: { type: "美股", name: "百事可乐", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8358, isShow: false, delta: 0.05 },
                593049: { type: "美股", name: "辉瑞", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 7989, isShow: false, delta: 0.05 },
                593047: { type: "美股", name: "索尼", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8086, isShow: false, delta: 0.05 },
                593046: { type: "美股", name: "搜狗", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1054796, isShow: false, delta: 0.05 },
                593045: { type: "美股", name: "蒂芙尼", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 0000, isShow: false, delta: 0.05 },
                593044: { type: "美股", name: "丰田汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8321, isShow: false, delta: 0.05 },
                593042: { type: "美股", name: "Under Armour", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 976067, isShow: false, delta: 0.05 },
                593040: { type: "美股", name: "百胜餐饮", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8327, isShow: false, delta: 0.05 },
                593039: { type: "美股", name: "欢聚", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 40109, isShow: false, delta: 0.05 },
                633080: { type: "美股", name: "跟谁学", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1136128, isShow: false, delta: 0.05 },
                633078: { type: "美股", name: "哔哩哔哩", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1073087, isShow: false, delta: 0.05 },
                633077: { type: "美股", name: "黑莓", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6374, isShow: false, delta: 0.05 },
                633086: { type: "美股", name: "富途", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1123144, isShow: false, delta: 0.05 },
                633087: { type: "美股", name: "雾芯科技", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1169116, isShow: false, delta: 0.05 },
                633076: { type: "美股", name: "台积电", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 32306, isShow: false, delta: 0.05 },
                633073: { type: "美股", name: "陆金所", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1167066, isShow: false, delta: 0.05 },
                633072: { type: "美股", name: "Palantir", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1166239, isShow: false, delta: 0.05 },
                633071: { type: "美股", name: "第九城市", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 16714, isShow: false, delta: 0.05 },
                633070: { type: "美股", name: "名创优品", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1166925, isShow: false, delta: 0.05 },
                633069: { type: "美股", name: "贝壳", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1164709, isShow: false, delta: 0.05 },
                633068: { type: "美股", name: "Beyond Meet", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1129317, isShow: false, delta: 0.05 },
                633067: { type: "美股", name: "3D system", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 13938, isShow: false, delta: 0.05 },
                633066: { type: "美股", name: "Bionano Genomics", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1096506, isShow: false, delta: 0.05 },
                633065: { type: "美股", name: "Polar Power", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 994020, isShow: false, delta: 0.05 },
                633064: { type: "美股", name: "蔚来", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1096032, isShow: false, delta: 0.05 },
                633063: { type: "美股", name: "小鹏汽车", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1165509, isShow: false, delta: 0.05 },
                633062: { type: "美股", name: "好未来", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 29752, isShow: false, delta: 0.05 },
                633061: { type: "美股", name: "Adobe", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6373, isShow: false, delta: 0.05 },
                633060: { type: "美股", name: "Ts Innovation", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1169832, isShow: false, delta: 0.05 },
                633059: { type: "美股", name: "逸仙电商", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1167333, isShow: false, delta: 0.05 },
                633075: { type: "美股", name: "小牛电动", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1096132, isShow: false, delta: 0.05 },
                633074: { type: "美股", name: "老虎证券", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1123579, isShow: false, delta: 0.05 },
                633058: { type: "美股", name: "网易", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 6439, isShow: false, delta: 0.05 },
                633092: { type: "美股", name: "华住集团", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1166247, isShow: false, delta: 0.05 },
                633093: { type: "美股", name: "Twilio", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 985558, isShow: false, delta: 0.05 },
                633094: { type: "美股", name: "Tilray", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1084213, isShow: false, delta: 0.05 },
                633095: { type: "美股", name: "维珍银河", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1052758, isShow: false, delta: 0.05 },
                633097: { type: "美股", name: "Salesforce", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 8294, isShow: false, delta: 0.05 },
                633098: { type: "美股", name: "Zoom", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1127188, isShow: false, delta: 0.05 },
                633100: { type: "美股", name: "高通", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 963389, isShow: false, delta: 0.05 },
                573110: { type: "港股", name: "美团点评-W", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1096030, isShow: false, delta: 0.05 },
                573136: { type: "港股", name: "石药集团", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 100083, isShow: false, delta: 0.05 },
                593037: { type: "港股", name: "百威亚太", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1141315, isShow: false, delta: 0.05 },
                593020: { type: "港股", name: "比亚迪股份", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 13884, isShow: false, delta: 0.05 },
                593026: { type: "港股", name: "中国金茂", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 49987, isShow: false, delta: 0.05 },
                593031: { type: "港股", name: "阿里健康", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 946376, isShow: false, delta: 0.05 },
                573112: { type: "港股", name: "海底捞", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 1096193, isShow: false, delta: 0.05 },
                573150: { type: "港股", name: "舜宇光学科技", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 943521, isShow: false, delta: 0.05 },
                593032: { type: "港股", name: "青岛啤酒", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 32499, isShow: false, delta: 0.05 },
                593029: { type: "港股", name: "康师傅", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 32484, isShow: false, delta: 0.05 },
                593014: { type: "港股", name: "蒙牛", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 13888, isShow: false, delta: 0.05 },
                593013: { type: "港股", name: "李宁", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50066, isShow: false, delta: 0.05 },
                573152: { type: "港股", name: "阿里巴巴-SW", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1155537, isShow: false, delta: 0.05 },
                573097: { type: "港股", name: "香港交易所", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 8564, isShow: false, delta: 0.05 },
                573106: { type: "港股", name: "友邦保险", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 32502, isShow: false, delta: 0.05 },
                573100: { type: "港股", name: "腾讯控股", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 102047, isShow: false, delta: 0.05 },
                593035: { type: "港股", name: "阅文", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1054808, isShow: false, delta: 0.05 },
                573146: { type: "港股", name: "平安好医生", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1075240, isShow: false, delta: 0.05 },
                573148: { type: "港股", name: "安踏体育", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 100123, isShow: false, delta: 0.05 },
                573107: { type: "港股", name: "小米集团-W", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1075487, isShow: false, delta: 0.05 },
                573119: { type: "港股", name: "银河娱乐", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 49962, isShow: false, delta: 0.05 },
                573094: { type: "港股", name: "吉利汽车", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 49968, isShow: false, delta: 0.05 },
                573121: { type: "港股", name: "华润啤酒", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 8560, isShow: false, delta: 0.05 },
                573102: { type: "港股", name: "中兴通讯", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 13879, isShow: false, delta: 0.05 },
                573122: { type: "港股", name: "中国铁塔", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 1089444, isShow: false, delta: 0.05 },
                573123: { type: "港股", name: "中国海洋石油", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 8570, isShow: false, delta: 0.05 },
                573125: { type: "港股", name: "海螺水泥", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 32497, isShow: false, delta: 0.05 },
                573130: { type: "港股", name: "建设银行", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 8572, isShow: false, delta: 0.05 },
                573105: { type: "港股", name: "中国移动", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8573, isShow: false, delta: 0.05 },
                573132: { type: "港股", name: "中芯国际", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50051, isShow: false, delta: 0.05 },
                573133: { type: "港股", name: "联想集团", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 32500, isShow: false, delta: 0.05 },
                573134: { type: "港股", name: "中国神华", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 101040, isShow: false, delta: 0.05 },
                573145: { type: "港股", name: "中信证券", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50024, isShow: false, delta: 0.05 },
                573147: { type: "港股", name: "金沙中国有限公司", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 38075, isShow: false, delta: 0.05 },
                573149: { type: "港股", name: "药明生物", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 1167625, isShow: false, delta: 0.05 },
                573108: { type: "港股", name: "中国平安", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8579, isShow: false, delta: 0.05 },
                573109: { type: "港股", name: "中国人寿", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 8581, isShow: false, delta: 0.05 },
                573151: { type: "港股", name: "金山软件", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 100143, isShow: false, delta: 0.05 },
                573111: { type: "港股", name: "招商银行", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 32495, isShow: false, delta: 0.05 },
                593034: { type: "港股", name: "汇控", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 8545, isShow: false, delta: 0.05 },
                593033: { type: "港股", name: "新鸿基地产", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8551, isShow: false, delta: 0.05 },
                593030: { type: "港股", name: "金蝶国际", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 100019, isShow: false, delta: 0.05 },
                593028: { type: "港股", name: "复星国际", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 49983, isShow: false, delta: 0.05 },
                593027: { type: "港股", name: "中国海外发展", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8567, isShow: false, delta: 0.05 },
                593025: { type: "港股", name: "白云山", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 945136, isShow: false, delta: 0.05 },
                593024: { type: "港股", name: "中国太平", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 49992, isShow: false, delta: 0.05 },
                593023: { type: "港股", name: "长江基建", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 8574, isShow: false, delta: 0.05 },
                593022: { type: "港股", name: "中国南方航空", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 100079, isShow: false, delta: 0.05 },
                593021: { type: "港股", name: "永利澳门", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 100089, isShow: false, delta: 0.05 },
                593020: { type: "港股", name: "比亚迪股份", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 13884, isShow: false, delta: 0.05 },
                593038: { type: "港股", name: "新华保险", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 50003, isShow: false, delta: 0.05 },
                593019: { type: "港股", name: "中国中车", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50057, isShow: false, delta: 0.05 },
                593018: { type: "港股", name: "融创中国", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 100117, isShow: false, delta: 0.05 },
                593016: { type: "港股", name: "碧桂园", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50008, isShow: false, delta: 0.05 },
                593017: { type: "港股", name: "周大福", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 50007, isShow: false, delta: 0.05 },
                593015: { type: "港股", name: "广汽集团", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 50010, isShow: false, delta: 0.05 },
                593036: { type: "港股", name: "申洲国际", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 50011, isShow: false, delta: 0.05 },
                593012: { type: "港股", name: "中国太保", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 32492, isShow: false, delta: 0.05 },
                593011: { type: "港股", name: "紫金", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 13893, isShow: false, delta: 0.05 },
                593010: { type: "港股", name: "中国建材", profit: 0, high: 0, low: 0, mulpiple: 2000 / usExchangeRate, pid: 13894, isShow: false, delta: 0.05 },
                593009: { type: "港股", name: "恒大", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50017, isShow: false, delta: 0.05 },
                593072: { type: "港股", name: "华夏沪深300", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 999132, isShow: false, delta: 0.05 },
                593071: { type: "港股", name: "南方A50", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 959571, isShow: false, delta: 0.05 },
                633004: { type: "港股", name: "农夫山泉", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1165549, isShow: false, delta: 0.05 },
                633005: { type: "港股", name: "京东健康", profit: 0, high: 0, low: 0, mulpiple: 50 / usExchangeRate, pid: 1167535, isShow: false, delta: 0.05 },
                633003: { type: "港股", name: "微创医疗", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 100059, isShow: false, delta: 0.05 },
                633002: { type: "港股", name: "长城汽车", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50012, isShow: false, delta: 0.05 },
                633006: { type: "港股", name: "福耀玻璃", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 949921, isShow: false, delta: 0.05 },
                633007: { type: "港股", name: "思摩尔国际", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 1163128, isShow: false, delta: 0.05 },
                633085: { type: "港股", name: "中国有赞", profit: 0, high: 0, low: 0, mulpiple: 4000 / usExchangeRate, pid: 943563, isShow: false, delta: 0.05 },
                633084: { type: "港股", name: "信达生物", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 1097278, isShow: false, delta: 0.05 },
                633083: { type: "港股", name: "微盟集团", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 1116332, isShow: false, delta: 0.05 },
                633082: { type: "港股", name: "保利协鑫能源", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50021, isShow: false, delta: 0.05 },
                633081: { type: "港股", name: "康希诺生物-B", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1123795, isShow: false, delta: 0.05 },
                633091: { type: "港股", name: "众安在线", profit: 0, high: 0, low: 0, mulpiple: 100 / usExchangeRate, pid: 1052239, isShow: false, delta: 0.05 },
                633096: { type: "港股", name: "猫眼娱乐", profit: 0, high: 0, low: 0, mulpiple: 200 / usExchangeRate, pid: 1118184, isShow: false, delta: 0.05 },
                633099: { type: "港股", name: "瑞声科技", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 50009, isShow: false, delta: 0.05 },
                633101: { type: "港股", name: "同程艺龙", profit: 0, high: 0, low: 0, mulpiple: 400 / usExchangeRate, pid: 1097872, isShow: false, delta: 0.05 },
                633102: { type: "港股", name: "新东方在线", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 1123794, isShow: false, delta: 0.05 },
                633103: { type: "港股", name: "丘钛科技", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 990763, isShow: false, delta: 0.05 },
                633104: { type: "港股", name: "四环医药", profit: 0, high: 0, low: 0, mulpiple: 1000 / usExchangeRate, pid: 50034, isShow: false, delta: 0.05 },
                633105: { type: "港股", name: "BC科技集团", profit: 0, high: 0, low: 0, mulpiple: 500 / usExchangeRate, pid: 990500, isShow: false, delta: 0.05 },
                613023: { type: "数字货币", name: "比特币", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1057391, isShow: false, delta: 0.05 },
                613025: { type: "数字货币", name: "以太币", profit: 0, high: 0, low: 0, mulpiple: "1", pid: 1058142, isShow: false, delta: 0.05 },
            }
        };
    },
    methods: {
        updateSelectedCatagory() {
            for (let i = 0; i < this.catagory.length; i++) {
                if (this.catagory[i].toggle) {
                    this.isSelectCatagory = false;
                    //this.setCookies();
                    this.setSelectedCatagoryText();
                    this.techDetailTimingIndex = 2;
                    this.techAnalyIndex = 0;
                    if (this.searchTechLock) {
                        setTimeout(function() {
                            technicalAnalysisVue.updateSelectedProductIds();
                        }, 300);
                    } else {
                        this.updateSelectedProductIds();
                    }
                    return;
                }
            }
            alert("请选择至少一项产品");

        },
        updateAllCatagoryButtonStatus() {
            for (let i = 0; i < this.catagory.length; i++) {
                if (!this.catagory[i].toggle) {
                    this.isSelectAll = false;
                    return;
                }
            }
            this.isSelectAll = true;
        },
        updateAllCatagoryToggle() {
            this.isSelectAll = !this.isSelectAll;
            if (this.isSelectAll) {
                for (let i = 0; i < this.catagory.length; i++) {
                    this.catagory[i].toggle = true;
                }
            } else {
                for (let i = 0; i < this.catagory.length; i++) {
                    this.catagory[i].toggle = false;
                }
            }
        },
        gotoSelectCatagory() {
            this.isSelectCatagory = true;
            this.lastCatagory = this.lastCatagory = JSON.parse(JSON.stringify(this.catagory));
        },
        cancelSelectCatagory() {
            this.isSelectCatagory = false;
            this.catagory = this.lastCatagory;
        },
        setSelectedCatagoryText() {
            this.selectedCatagoryText = '';
            for (let i = 0; i < this.catagory.length; i++) {
                if (this.catagory[i].toggle) {
                    if (this.selectedCatagoryText === '') {
                        this.selectedCatagoryText = this.catagory[i].type;
                    } else {
                        this.selectedCatagoryText += " /" + this.catagory[i].type;
                    }
                }
            }
        },
        updateSelectedProductIds() {
            this.selectedProductIds = [];
            for (let key in this.product) {
                for (let i = 0; i < this.catagory.length; i++) {
                    if (this.catagory[i].toggle && this.product[key].type === this.catagory[i].type) {
                        this.selectedProductIds.push(key);
                        break;
                    }
                }
            }

            //console.log(this.selectedProductIds);
            //console.log(this.ws);
            //this.sendNewRequest("productSubscription", {code_ids: this.selectedProductIds,subscribeType: "reSubscribe",type: "yz"});
            this.sendNewRequest("lastPrice", { code_ids: this.selectedProductIds });

        },
        getTraceId() {
            return 'h5_' + new Date().getTime();
        },
        initWs() {
            axios(this.httpConfig).then(function(response) {
                // 從 HTTP 所取得的 response 帶入ws head
                technicalAnalysisVue.wsConfig.head.Authorization = response.headers.authorization;
                technicalAnalysisVue.wsConfig.head.msgType = 'login';
                technicalAnalysisVue.wsConfig.content.appKey = response.data.data.transBaseConfigVo.appKey;
                technicalAnalysisVue.wsConfig.content.clientIp = response.data.data.clientIp;
                technicalAnalysisVue.wsConfig.content.company_id = response.data.data.toKenCompanyInfoVo.companyId;
                technicalAnalysisVue.wsConfig.content.login_name = "Guest";
                technicalAnalysisVue.wsConfig.content.user_type = -1;
                technicalAnalysisVue.createNewWebSocket();
            }).catch(function(error) {
                console.log(error, 'axios 發送的 Http 、 Ws 出現錯誤');
                setTimeout(function() { technicalAnalysisVue.initWs(); }, 5000);

            });

        },
        createNewWebSocket() {
            console.log('create websocket');
            this.ws = new WebSocket(WS_BASE_URL);

            this.ws.onopen = () => {
                if (this.ws.readyState === 1) {
                    this.ws.send(JSON.stringify(this.wsConfig));
                    this.updateSelectedCatagory();
                }
            };

            this.ws.onclose = () => {
                console.log("close connection");
            };

            this.ws.onmessage = (res) => {
                this.wsResponseHandling(res);
            };

            this.ws.onerror = () => {
                let _this = this;
                setTimeout(function() {

                    technicalAnalysisVue.wsConfig.head.msgType = 'login';
                    _this.initWs();
                    _this.techAnalyInfo = _this.defaultTechAnalyInfo;

                }, 5000);


            };
        },
        sendNewRequest(msgType, content) {
            this.wsConfig.head.msgType = msgType;
            this.wsConfig.content = content;
            this.ws.send(JSON.stringify(this.wsConfig));
        },
        wsResponseHandling(res) {
            let vm = this;
            try {
                if (res.data.indexOf('p(') == 0) { //ProductSubscription
                    //console.log(res.data);
                    let resSplitData = res.data.split(",");
                    prdCode = parseInt(resSplitData[0].split('p(')[1]);
                    //console.log(prdCode);
                    if (prdCode in vm.exRates) {
                        vm.exRates[prdCode] = parseFloat(resSplitData[3])
                    };
                    let target = this.product[parseInt(resSplitData[0].split('p(')[1])];
                    target.current = resSplitData[3];
                    target.high = Math.max(parseFloat(resSplitData[3]), target.high);
                    target.low = Math.min(parseFloat(resSplitData[3]), target.low);

                    //target.high=parseFloat(resSplitData[5]);
                    //target.low=parseFloat(resSplitData[6]);
                    target.profit = 500 * (target.high - target.low) / (parseFloat(target.current) * target.delta);
                    Vue.set(this.product, parseInt(resSplitData[0].split('p(')[1]), JSON.parse(JSON.stringify(target)));
                } else {
                    // 更新所有產品營利-> sort-> 只更新最高營利的5個產品的技術分析跟報價
                    let responseData = JSON.parse(res.data);
                    let msgCode = responseData.msg_code;
                    if (msgCode === 'LastPrice') {
                        responseData.content.find(prdt => {
                            if (prdt.code_id in vm.exRates) {
                                vm.exRates[prdt.code_id] = prdt.cur_price;
                            }
                        });
                        //更新所有產品營利
                        for (let i = 0; i < responseData.content.length; i++) {

                            target = this.product[responseData.content[i].code_id];
                            if (new Date() - new Date(1000 * responseData.content[i].time) > 600000) {
                                target.isShow = false;
                            } else {
                                target.isShow = true;
                            }
                            target.current = responseData.content[i].cur_price.toString();
                            target.high = Math.max(this.product[responseData.content[i].code_id].current, parseFloat(responseData.content[i].high_price));
                            target.low = Math.min(this.product[responseData.content[i].code_id].current, parseFloat(responseData.content[i].low_price));;
                            if (target.pid == "8838") {
                                target.mulpiple = target.mulpiple * vm.exRates[573039];
                            } else if (target.pid == "8853" || target.pid == "8826") {
                                target.mulpiple = target.mulpiple * vm.exRates[573139];
                            } else if (target.pid == "8984") {
                                target.mulpiple = 50 / (vm.exRates[573043] / vm.exRates[573042]);
                            } else if (target.pid == "941616") {
                                target.mulpiple = 100 / vm.exRates[573043];
                            } else if (target.pid == "8859") {
                                target.mulpiple = 500 / vm.exRates[573032];
                            } else if (target.pid == "10" || target.pid == "12" || target.pid == "4") {
                                target.mulpiple = target.mulpiple / vm.exRates[573035];
                            } else if (target.pid == "6") {
                                target.mulpiple = target.mulpiple * vm.exRates[573039];
                            } else if (target.pid == "15" || target.pid == "53") {
                                target.mulpiple = target.mulpiple * vm.exRates[573024];
                            } else if (target.pid == "50" || target.pid == "52" || target.pid == "55") {
                                target.mulpiple = target.mulpiple * vm.exRates[573028];
                            } else if (target.pid == "42") {
                                target.mulpiple = target.mulpiple / vm.exRates[593069];
                            } else if (target.pid == "16" || target.pid == "7" || target.pid == "54") {
                                target.mulpiple = target.mulpiple / vm.exRates[573031];
                            } else if (target.pid == "3" || target.pid == "9" || target.pid == "11" || target.pid == "13" || target.pid == "49" || target.pid == "51" || target.pid == "58") {
                                target.mulpiple = target.mulpiple / vm.exRates[573032];
                            } else if (target.pid == "961728" || target.pid == "1817") {
                                target.mulpiple = target.mulpiple / vm.exRates[573043];
                            }
                            target.profit = 500 * (target.high - target.low) / (parseFloat(target.current) * target.delta);
                            Vue.set(this.product, responseData.content[i].code_id, JSON.parse(JSON.stringify(target)));
                        }
                        //SORT
                        this.rankedIds = [];
                        //console.log(this.selectedProductIds);
                        this.selectedProductIds.sort((x, y) => {
                            return this.product[y].profit - this.product[x].profit;
                        });
                        for (let i = 0; i < this.selectedProductIds.length; i++) {
                            if (this.rankedIds.length >= 5) {
                                break;
                            }
                            //這裡決定是否顯示收市產品
                            if (new Date().getDay() == 0 || new Date().getDay() == 6) {
                                this.rankedIds.push(this.selectedProductIds[i]);
                            } else if (this.product[this.selectedProductIds[i]].isShow) {
                                this.rankedIds.push(this.selectedProductIds[i]);
                            }
                        }

                        //如果沒有產品, 就加收市產品
                        if (this.rankedIds.length == 0) {
                            for (let i = 0; i < this.selectedProductIds.length; i++) {
                                if (this.rankedIds.length >= 5) {
                                    break;
                                }

                                this.rankedIds.push(this.selectedProductIds[i]);
                            }
                        }

                        //更新最高營利的5個產品的技術分析跟報價
                        this.sendNewRequest("productSubscription", { code_ids: this.rankedIds, subscribeType: "reSubscribe", type: "yz" });
                        if (!this.searchTechLock) {
                            this.getTechnicalAnalysisInfo();
                        }
                    }
                }
            } catch (e) {
                //console.log(e);
            }
        },
        gaPush(content1, content2) {
            _gaq.push(['_trackEvent', $GA_NAME, content1, content2, 1, true]);
        },
        lpToH5PageChecking(urlPath) {
            toH5SubPage(urlPath);
            _gaq.push(['_trackEvent', $GA_NAME, urlPath, 'content_ti', 1, true]);
        },
        getTechnicalAnalysisInfo(index) {
            if (!this.isShowTechnicalAnalysisHtml) {
                return;
            }
            if (this.rankedIds.length <= 0) {
                return;
            }
            this.techAnalyInfo = this.defaultTechAnalyInfo;
            let _this = this;
            this.searchTechLock = true;

            if (index === undefined) {
                // console.log('未傳入 index')
                setTimeout(function() {
                    let peid = _this.techDetailTiming[_this.techDetailTimingIndex].peid;
                    let pid = _this.product[_this.rankedIds[_this.techAnalyIndex]].pid;
                    _this.ajaxTech_Url(peid, pid)
                }, 0);
            } else {
                // console.log('有傳入 index 為' + index)
                setTimeout(function() {
                    let peid = _this.techDetailTimingMenu[index].peid;
                    let pid = _this.product[_this.rankedIds[_this.techAnalyIndex]].pid;
                    _this.ajaxTech_Url(peid, pid)
                }, 300);
            }
        },
        // 傳入產品技術分析所需 peid、pid
        ajaxTech_Url(peid, pid) {
            let _this = this
            $.ajax({
                method: 'post',
                url: TECH_ANA_URL,
                data: { pid: pid, peid: peid },
                success: function(msg) {
                    //console.log(_this);
                    //console.log(peid,pid);
                    //console.log(msg);
                    let htmlObject = _this.parseHTML(msg);
                    let htmlObject2 = _this.parseHTML(msg.substring(msg.indexOf('<h3'), msg.length));
                    //console.log(TECH_ANA_URL);
                    //console.log(htmlObject);
                    _this.htmlObjectPop = htmlObject2[2]
                    let newTechAnalyInfo = {};
                    // Pivot point
                    // _this.getPivotpoint(htmlObjectPop)
                    //conclusion
                    newTechAnalyInfo.conclusion = htmlObject[0].querySelector('div:nth-child(1) span').innerHTML;
                    newTechAnalyInfo.conclusionBg = _this.setTechConclusionBgColor(newTechAnalyInfo.conclusion);
                    newTechAnalyInfo.conclusionMAText = htmlObject[0].querySelector('div:nth-child(2) span:nth-child(2)').innerHTML;
                    newTechAnalyInfo.conclusionMATextColor = _this.setTechConclusionTextColor(newTechAnalyInfo.conclusionMAText);
                    newTechAnalyInfo.conclusionMABuyText = htmlObject[0].querySelector('div:nth-child(2) span:nth-child(3)').innerHTML;
                    newTechAnalyInfo.conclusionMASellText = htmlObject[0].querySelector('div:nth-child(2) span:nth-child(4)').innerHTML;
                    newTechAnalyInfo.conclusionTechIndiText = htmlObject[0].querySelector('div:nth-child(3) span:nth-child(2)').innerHTML;
                    newTechAnalyInfo.conclusionTechIndiTextColor = _this.setTechConclusionTextColor(newTechAnalyInfo.conclusionTechIndiText);
                    newTechAnalyInfo.conclusionTechIndiBuyText = htmlObject[0].querySelector('div:nth-child(3) span:nth-child(3)').innerHTML;
                    newTechAnalyInfo.conclusionTechIndiSellText = htmlObject[0].querySelector('div:nth-child(3) span:nth-child(4)').innerHTML;
                    //MA
                    newTechAnalyInfo.standardMA5HTML = htmlObject2[4].querySelector('tbody tr:nth-child(1) td:nth-child(2)').innerHTML;
                    newTechAnalyInfo.moveMA5HTML = htmlObject2[4].querySelector('tbody tr:nth-child(1) td:nth-child(3)').innerHTML;
                    newTechAnalyInfo.standardMA10HTML = htmlObject2[4].querySelector('tbody tr:nth-child(2) td:nth-child(2)').innerHTML;
                    newTechAnalyInfo.moveMA10HTML = htmlObject2[4].querySelector('tbody tr:nth-child(2) td:nth-child(3)').innerHTML;
                    newTechAnalyInfo.standardMA20HTML = htmlObject2[4].querySelector('tbody tr:nth-child(3) td:nth-child(2)').innerHTML;
                    newTechAnalyInfo.moveMA20HTML = htmlObject2[4].querySelector('tbody tr:nth-child(3) td:nth-child(3)').innerHTML;
                    newTechAnalyInfo.standardMA50HTML = htmlObject2[4].querySelector('tbody tr:nth-child(4) td:nth-child(2)').innerHTML;
                    newTechAnalyInfo.moveMA50HTML = htmlObject2[4].querySelector('tbody tr:nth-child(4) td:nth-child(3)').innerHTML;
                    newTechAnalyInfo.standardMA100HTML = htmlObject2[4].querySelector('tbody tr:nth-child(5) td:nth-child(2)').innerHTML;
                    newTechAnalyInfo.moveMA100HTML = htmlObject2[4].querySelector('tbody tr:nth-child(5) td:nth-child(3)').innerHTML;
                    newTechAnalyInfo.standardMA200HTML = htmlObject2[4].querySelector('tbody tr:nth-child(6) td:nth-child(2)').innerHTML;
                    newTechAnalyInfo.moveMA200HTML = htmlObject2[4].querySelector('tbody tr:nth-child(6) td:nth-child(3)').innerHTML;
                    newTechAnalyInfo.maConcludeText = '&nbsp;' + htmlObject2[4].querySelector('tbody tr:nth-child(7) p:nth-child(1) span:nth-child(1)').innerHTML +
                        htmlObject2[4].querySelector('tbody tr:nth-child(7) p:nth-child(1) span:nth-child(2)').innerHTML + '<br>' + '&nbsp;' +
                        htmlObject2[4].querySelector('tbody tr:nth-child(7) p:nth-child(2) span:nth-child(1)').innerHTML +
                        htmlObject2[4].querySelector('tbody tr:nth-child(7) p:nth-child(2) span:nth-child(2)').innerHTML;
                    newTechAnalyInfo.maConclude = htmlObject2[4].querySelector('tbody tr:nth-child(7) td p:nth-child(4) span').innerHTML;
                    //Technical Indicators
                    let ti = [];
                    for (let i = 1; i < 13; i++) {
                        let name = htmlObject2[3].querySelector('tbody tr:nth-child(' + i + ') td:nth-child(1)').innerHTML;
                        let info = htmlObject2[3].querySelector('tbody tr:nth-child(' + i + ') td:nth-child(2)').innerHTML;
                        let conclude = htmlObject2[3].querySelector('tbody tr:nth-child(' + i + ') td:nth-child(3) span').innerHTML;
                        ti.push({ name: name, info: info, conclude: conclude });
                    }
                    newTechAnalyInfo.ti = ti;
                    newTechAnalyInfo.tiConcludeInfo = '<span>' + htmlObject2[3].querySelector('tbody tr:nth-child(13) p:nth-child(1) span:nth-child(1)').innerHTML +
                        htmlObject2[3].querySelector('tbody tr:nth-child(13) p:nth-child(1) span:nth-child(2)').innerHTML + '<br>' +
                        htmlObject2[3].querySelector('tbody tr:nth-child(13) p:nth-child(2) span:nth-child(1)').innerHTML +
                        htmlObject2[3].querySelector('tbody tr:nth-child(13) p:nth-child(2) span:nth-child(2)').innerHTML + '<br>' +
                        htmlObject2[3].querySelector('tbody tr:nth-child(13) p:nth-child(3) span:nth-child(1)').innerHTML +
                        htmlObject2[3].querySelector('tbody tr:nth-child(13) p:nth-child(3) span:nth-child(2)').innerHTML + '</span>';
                    newTechAnalyInfo.tiConclude = htmlObject2[3].querySelector('tbody tr:nth-child(13) p:nth-child(5) span').innerHTML;
                    _this.techAnalyInfo = newTechAnalyInfo;
                    _this.searchTechLock = false;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    _this.searchTechLock = false;
                    console.log(errorThrown);
                }
            });
        },
        //PivotPoint
        getPivotpoint() {
            setTimeout(() => {
                let pop = document.querySelector('.curr_table')
                let htmltemp = this.htmlObjectPop.innerHTML
                pop.innerHTML = `${htmltemp}`
            }, 0);
        },
        moreBtnClick() {
            this.isShowTimeMenu = false;
            this.isShowTechDetailMenu = true;
            this.getPivotpoint();
        },
        switchTiming(index) {
            if (!this.searchTechLock) {
                let tempTechDedeil = { timeString: this.techDetailTimingMenu[index].timeString, peid: this.techDetailTimingMenu[index].peid };
                // this.techDetailTiming[3]={timeString:this.techDetailTiming[3].timeString,peid:this.techDetailTiming[3].peid};
                // console.log(this.techDetailTiming)

                this.techDetailTimingSort[3] = tempTechDedeil;
                this.techDetailTimingIndex = 3;
                this.isShowTimeMenu = false;
                this.isShowInnerTimeMenu = false;
                this.getTechnicalAnalysisInfo(index);
            }
            // if (!this.searchTechLock){
            // 	let tempTechDedeil={timeString:this.techDetailTiming[index].timeString,peid:this.techDetailTiming[index].peid};
            // 	this.techDetailTiming[index]={timeString:this.techDetailTiming[3].timeString,peid:this.techDetailTiming[3].peid};
            // 	this.techDetailTiming[3]=tempTechDedeil;
            // 	this.techDetailTimingIndex=3;
            // 	this.isShowTimeMenu=false;
            // 	this.isShowInnerTimeMenu=false;
            // 	this.getTechnicalAnalysisInfo();
            // }
        },
        setTechAnalyIndex(index) {
            if (!this.searchTechLock) {
                this.techAnalyIndex = index;
                this.getTechnicalAnalysisInfo();
            }
        },
        setTechDetailTimingIndex(index) {
            if (!this.searchTechLock) {
                this.techDetailTimingIndex = index;
                this.getTechnicalAnalysisInfo();
            }
        },
        parseHTML(str) {
            let tmp = document.implementation.createHTMLDocument();
            tmp.body.innerHTML = str;
            return tmp.body.children;
        },
        setTechConclusionBgColor(str) {
            if (str == null) {
                return 'bg_normal';
            }
            if (str.indexOf('卖') >= 0) {
                return 'bg_green';
            } else if (str.indexOf('买') >= 0) {
                return 'bg_red';
            } else {
                return 'bg_normal';
            }
        },
        setTechConclusionTextColor(str) {
            if (str == null) {
                return 'text_normal';
            }
            if (str.indexOf('卖') >= 0) {
                return 'text_green';
            } else if (str.indexOf('买') >= 0) {
                return 'text_red';
            } else {
                return 'text_normal';
            }
        },
        // 關閉技術分析顯示
        closeTechTimeMenu() {
            let vm = this
            let techBtn = document.getElementById('technical_analysis_content')
            techBtn.addEventListener('click', function() {
                vm.isShowTimeMenu = false
            }, true)
        }
    },
    created() {
        this.start = true;
        //this.initCookies();
        //this.getCookies();  
        this.updateAllCatagoryButtonStatus();

        setTimeout(function() {
            technicalAnalysisVue.initWs();
            technicalAnalysisVue.techAnalyInfo = technicalAnalysisVue.defaultTechAnalyInfo;

        }, 2000);


    },
    destroyed() {}
})