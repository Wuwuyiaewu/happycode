const usExchangeRate = 7.77;
console.log('18:16')
var technicalAnalysisVue = new Vue({
    el: '#technical_analysis_content',
    data() {
        return {
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
            rankedImgPath: [],
            rankedButtonPath: '/promote/lp295/_v2_js_css/images/r_btn.png',
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
            sellInfo: {
                id: 23,
                price: 1893.07,
                amount: 0.05,
            },
            buyInfo: {
                id: 87,
                price: 1894.27,
                amount: 0.05,
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
                573020: { type: "指数", name: "恐慌指数", profit: 0, high: 0, low: 0, mulpiple: "1000", pid: 8884, isShow: false, delta: 0.005 },
                573016: { type: "指数", name: "香港50", profit: 0, high: 0, low: 0, mulpiple: "2", pid: 8984, isShow: false, delta: 0.005 },
                573017: { type: "指数", name: "中华300", profit: 0, high: 0, low: 0, mulpiple: "10", pid: 941616, isShow: false, delta: 0.005 },
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
            }
        };
    },
    methods: {
        //newly added
        updateSellInfo() {
            let numSellId = parseInt(this.sellInfo.id);
            let type = Math.random();
            if (type < 0.25) {
                this.sellInfo.amount = 0.05;
            } else if (type < 0.5) {
                this.sellInfo.amount = 0.1;
            } else if (type < 0.75) {
                this.sellInfo.amount = 0.15;
            } else {
                this.sellInfo.amount = 0.2;
            }
            this.sellInfo.id = String("0" + (numSellId += 26)).slice(-2);
            this.sellInfo.price = this.product[573004].current;
        },
        updateBuyInfo() {
            let numBuyId = parseInt(this.buyInfo.id);
            let type = Math.random();
            if (type < 0.25) {
                this.buyInfo.amount = 0.05;
            } else if (type < 0.5) {
                this.buyInfo.amount = 0.1;
            } else if (type < 0.75) {
                this.buyInfo.amount = 0.15;
            } else {
                this.buyInfo.amount = 0.2;
            }
            this.buyInfo.id = String("0" + (numBuyId += 26)).slice(-2);
            this.buyInfo.price = this.product[573004].current;
        },
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
                technicalAnalysisVue.createNewWebSocket();
            }).catch(function(error) {
                console.log(error, 'axios 發送的 Http 、 Ws 出現錯誤');
            });

        },
        createNewWebSocket() {
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
                technicalAnalysisVue.wsConfig.head.msgType = 'login';
                this.createNewWebSocket();
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
                    let prdCode = parseInt(resSplitData[0].split('p(')[1]);
                    //console.log(prdCode);
                    if (prdCode in vm.exRates) {
                        vm.exRates[prdCode] = parseFloat(resSplitData[3])
                    };
                    let target = this.product[parseInt(resSplitData[0].split('p(')[1])];
                    let new_multiple = 0;
                    new_multiple = target.mulpiple;
                    if (target.category == "UKUS") {
                        new_multiple = target.mulpiple * vm.exRates[573039];
                    } else if (target.category == "EUUS") {
                        new_multiple = target.mulpiple * vm.exRates[573139];
                    } else if (target.category == "USHK") {
                        new_multiple = 50 / (vm.exRates[573043] / vm.exRates[573042]);
                    } else if (target.category == "USCN") {
                        new_multiple = 100 / vm.exRates[573043];
                    } else if (target.category == "USJP") {
                        new_multiple = 500 / vm.exRates[573032];
                    } else if (target.category == "USCH") {
                        new_multiple = target.mulpiple / vm.exRates[573035];
                    } else if (target.category == "AUUS") {
                        new_multiple = target.mulpiple * vm.exRates[573024];
                    } else if (target.category == "NZUS") {
                        new_multiple = target.mulpiple * vm.exRates[573028];
                    } else if (target.category == "USSG") {
                        new_multiple = target.mulpiple / vm.exRates[593069];
                    } else if (target.category == "USCA") {
                        new_multiple = target.mulpiple / vm.exRates[573031];
                    } else if (target.category == "USJP") {
                        new_multiple = target.mulpiple / vm.exRates[573032];
                    }
                    target.profit = (target.high - target.low) * new_multiple;
                    target.current = resSplitData[3];
                    target.high = Math.max(parseFloat(resSplitData[3]), target.high);
                    target.low = Math.min(parseFloat(resSplitData[3]), target.low);
                    target.pChange = ((parseFloat(resSplitData[3]) - target.ytd_price) / target.ytd_price * 100).toFixed(2);

                    //target.high=parseFloat(resSplitData[5]);
                    //target.low=parseFloat(resSplitData[6]);
                    //console.log("product: " + target.name, "profit: " + target.profit);
                    Vue.set(this.product, parseInt(resSplitData[0].split('p(')[1]), JSON.parse(JSON.stringify(target)));
                } else {
                    // 更新所有產品營利-> sort-> 只更新最高營利的5個產品的技術分析跟報價
                    let responseData = JSON.parse(res.data);
                    let msgCode = responseData.msg_code;
                    if (msgCode === 'LastPrice') {
                        console.log(responseData.content);
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
                            target.low = Math.min(this.product[responseData.content[i].code_id].current, parseFloat(responseData.content[i].low_price));
                            target.ytd_price = responseData.content[i].yesterday_price;
                            target.pChange = ((responseData.content[i].cur_price - responseData.content[i].yesterday_price) / responseData.content[i].yesterday_price * 100).toFixed(2);
                            let new_multiple = 0;
                            new_multiple = target.mulpiple;
                            if (target.category == "UKUS") {
                                new_multiple = target.mulpiple * vm.exRates[573039];
                            } else if (target.category == "EUUS") {
                                new_multiple = target.mulpiple * vm.exRates[573139];
                            } else if (target.category == "USHK") {
                                new_multiple = 50 / (vm.exRates[573043] / vm.exRates[573042]);
                            } else if (target.category == "USCN") {
                                new_multiple = 100 / vm.exRates[573043];
                            } else if (target.category == "USJP") {
                                new_multiple = 500 / vm.exRates[573032];
                            } else if (target.category == "USCH") {
                                new_multiple = target.mulpiple / vm.exRates[573035];
                            } else if (target.category == "AUUS") {
                                new_multiple = target.mulpiple * vm.exRates[573024];
                            } else if (target.category == "NZUS") {
                                new_multiple = target.mulpiple * vm.exRates[573028];
                            } else if (target.category == "USSG") {
                                new_multiple = target.mulpiple / vm.exRates[593069];
                            } else if (target.category == "USCA") {
                                new_multiple = target.mulpiple / vm.exRates[573031];
                            } else if (target.category == "USJP") {
                                new_multiple = target.mulpiple / vm.exRates[573032];
                            }
                            target.profit = (target.high - target.low) * new_multiple;
                            //target.profit=(target.high-target.low)*target.mulpiple;
                            Vue.set(this.product, responseData.content[i].code_id, JSON.parse(JSON.stringify(target)));
                        }
                        //SORT
                        this.rankedIds = [573100, 573110, 573107, 573115, 573016];
                        // this.rankedIds=[];
                        //console.log(this.selectedProductIds);
                        this.selectedProductIds.sort((x, y) => {
                            return this.product[y].profit - this.product[x].profit;
                        });
                        for (let i = 0; i < this.selectedProductIds.length; i++) {
                            if (this.rankedIds.length >= 1) {
                                break;
                            }
                            if (this.product[this.selectedProductIds[i]].isShow) {
                                this.rankedIds.push(this.selectedProductIds[i]);
                            }
                        }
                        //更新最高營利的5個產品的技術分析跟報價
                        let subscribeIds = this.rankedIds.concat(this.exRateIds);
                        console.log(subscribeIds);
                        this.sendNewRequest("productSubscription", { code_ids: subscribeIds, subscribeType: "reSubscribe", type: "yz" });
                        if (!this.searchTechLock) {
                            this.getTechnicalAnalysisInfo();
                        }
                    }
                }
            } catch (e) {
                //console.log(e);
            }
        },
        lpToH5PageChecking(urlPath) {
            let app = new URL(window.location.href).searchParams.get("app");
            if (app == 'ix_app_orig') {
                IX_postMessage.toPage(urlPath);
            } else {
                //let url="<!--#echo var='gwfx_oa_new'-->/yz352001"+urlPath;
                location.href = 'https://h5.gitabu.com/yz352001' + urlPath;
            }

            _gaq.push(['_trackEvent', $GA_NAME, urlPath, 'content_ti', 1, true]);
        },
        getTechnicalAnalysisInfo(index) {
            if (!this.isShowTechnicalAnalysisHtml) {
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
                    let htmlObject = _this.parseHTML(msg);
                    let htmlObject2 = _this.parseHTML(msg.substring(msg.indexOf('<h3'), msg.length));
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
        this.initWs();
        this.techAnalyInfo = this.defaultTechAnalyInfo;
        setInterval(this.updateSellInfo, 5000);
        setInterval(this.updateBuyInfo, 5000);
    },
    destroyed() {}
})