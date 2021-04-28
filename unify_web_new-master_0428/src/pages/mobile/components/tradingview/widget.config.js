export const klineTypeList = [{
    name: 'kIcon1',
    title_zh: '美国线',
    title_en: 'Bars',
    value: 0,
}, {
    name: 'kIcon2',
    title_zh: 'K线图',
    title_en: 'Candles',
    value: 1,
}, {
    name: 'kIcon3',
    title_zh: '空心K线图',
    title_en: 'Hollow Candles',
    value: 9,
}, {
    name: 'kIcon4',
    title_zh: '平均K线图',
    title_en: 'Heikin Ashi',
    value: 8,
}, {
    name: 'kIcon5',
    title_zh: '线形图',
    title_en: 'Line',
    value: 2,
}, {
    name: 'kIcon6',
    title_zh: '面积图',
    title_en: 'Area',
    value: 3,
}, {
    name: 'kIcon7',
    title_zh: '基准线',
    title_en: 'Baseline',
    value: 10,
}]

export function candleKTypeList (vm) {
    return [
        {
            title: vm.$t('chart.timeSharing'),
            value: '1min',
            ktype: 'timeSharing',
        },
        {
            title: vm.$t('chart.1min'),
            value: '1min',
            ktype: '1',
        }, {
            title: vm.$t('chart.15min'),
            value: '15min',
            ktype: '15',
        }, {
            title: vm.$t('chart.30min'),
            value: '30min',
            ktype: '30',
        }, {
            title: vm.$t('chart.1hour'),
            value: '1hour',
            ktype: '60',
        }, {
            title: vm.$t('chart.day'),
            value: 'day',
            ktype: '1D',
        }, {
            title: vm.$t('chart.week'),
            value: 'week',
            ktype: '1W',
        }, {
            title: vm.$t('chart.5min'),
            value: '5min',
            ktype: '5',
        }, {
            title: vm.$t('chart.2hour'),
            value: '2hour',
            ktype: '120',
        }, {
            title: vm.$t('chart.4hour'),
            value: '4hour',
            ktype: '240',
        }, {
            title: vm.$t('chart.month'),
            value: 'month',
            ktype: '1M',
        }
    ]
}
export function WidgetConfig (style) {
    return {
        // debug: true, // uncomment this line to see Library errors and warnings in the console
        // fullscreen: true,
        symbol: 'BTC/USDT',
        container_id: 'tv_chart_container',

        //	BEWARE: no trailing slash is expected in feed URL
        library_path: '/charting_library/',
        custom_css_url: 'customCssUrl.css?v=1.0.1',
        locale: 'zh',

        disabled_features: [
            // 头部工具栏
            'header_widget',
            // K线类型
            // 'header_chart_type',
            // K线周期
            // 'header_resolutions',
            // 指标工具
            // 'header_indicators',
            // 左边工具栏
            'left_toolbar',
            // 底部时间栏目
            'timeframes_toolbar',
            // 头部设置按钮
            'header_settings',
            // 头部全屏按钮
            'header_fullscreen_button',
            // 底部控制按钮
            'control_bar',
            // 左上角产品名称部件
            'legend_context_menu',
            // 在表单左上角元素信息中隐藏“设置”按钮
            // 'edit_buttons_in_legend',
            // 在表单左上角元素信息中隐藏“设置”按钮
            'symbol_info',
            // logo
            'adaptive_logo',
            // “撤销”、“重做”按钮
            'header_undo_redo',
            // 成交量是否显示
            'create_volume_indicator_by_default',
            // k线与销量分开
            // 'volume_force_overlay',
            // 图表右键菜单
            'pane_context_menu',
            // 照相机
            'header_screenshot',
            // 上传下载按钮
            'header_saveload',
            // 移动端可以隐藏logo
            'adaptive_logo',
            // 指标模板
            'study_templates',
            // 图表对比
            'header_compare',
            // 市场状态
            'display_market_status',
            // 用户本地存储
            'use_localstorage_for_settings',
            // 搜索
            'header_symbol_search',
            'symbol_search_hot_key',

            'high_density_bars',
            // 禁用右边价格坐标弹窗
            'scales_context_menu',
            // 禁用图表上下滑动，上下滑动是直接滑动页面
            'vert_touch_drag_scroll'
        ],
        enabled_features: [
            // 指标栏目
            'dont_show_boolean_study_arguments',
            // 阻止滚动到第一个历史 K 线的左侧
            'fix_left_edge'
        ],
        charts_storage_url: 'http://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        // debug: true,
        theme: 'Light', // "Light" | "Dark"
        timezone: 'Asia/Shanghai',
        overrides: {
            // 'paneProperties.axisProperties.autoScale': false,
            // 'paneProperties.axisProperties.lockScale': false,
            // 'paneProperties.axisProperties.percentage': false,
            // 'paneProperties.axisProperties.indexedTo100': false,
            // 'paneProperties.axisProperties.log': false,
            // 'paneProperties.axisProperties.alignLabels': false,
            // 'paneProperties.axisProperties.isInverted': false,

            // 'paneProperties.legendProperties.showStudyArguments': false,
            // 'paneProperties.legendProperties.showStudyTitles': false,
            // 'paneProperties.legendProperties.showStudyValues': false,
            'paneProperties.legendProperties.showSeriesTitle': false, // 隐藏K线标题
            'paneProperties.legendProperties.showSeriesOHLC': false, // 显示高开低收
            'paneProperties.legendProperties.showLegend': true,
            'paneProperties.legendProperties.showBarChange': false,
            // 'paneProperties.legendProperties.showOnlyPriceSource': false,

            // 'scalesProperties.backgroundColor': '#ffffff',
            // 'scalesProperties.fontSize': 11,
            // 'scalesProperties.lineColor': '#555',
            // 'scalesProperties.textColor': '#555',
            // 'scalesProperties.scaleSeriesOnly': false,
            // 'scalesProperties.showSeriesLastValue': false,
            // 'scalesProperties.showSeriesPrevCloseValue': false,
            // 'scalesProperties.showStudyLastValue': false,
            // 'scalesProperties.showStudyPlotLabels': false,
            // 'scalesProperties.showSymbolLabels': false,

            'timeScale.rightOffset': 5,

            // 数据列风格。 请参阅下面的支持的值
            //  Bars = 0            #美国线
            //  Candles = 1         #K线图
            //  Line = 2            #线形图
            //  Area = 3            #面积图
            //  Heiken Ashi = 8     #平均K线图
            //  Hollow Candles = 9  #空心K线图
            //  Renko = 4           #转形图
            //  Kagi = 5            #卡吉图
            //  Point&Figure = 6    #点数图
            //  Line Break = 7      #新价图
            'mainSeriesProperties.style': 1, // K线样式 0美国K线 1K线 2线形图 3面积图

            // 'mainSeriesProperties.showCountdown': false,
            // 'mainSeriesProperties.visible': true,
            'mainSeriesProperties.showPriceLine': false, // 现价线
            'scalesProperties.showSeriesLastValue': false, // 现价标签
            // 'mainSeriesProperties.priceLineWidth': 1,
            'mainSeriesProperties.priceLineColor': 'rgb(71, 127, 211)',
            // 'mainSeriesProperties.showPrevClosePriceLine': false,
            // 'mainSeriesProperties.prevClosePriceLineWidth': 1,
            // 'mainSeriesProperties.prevClosePriceLineColor': 'rgba( 85, 85, 85, 1)',
            // 'mainSeriesProperties.lockScale': false,
            // 'mainSeriesProperties.minTick': 'default',

            // 'mainSeriesProperties.priceAxisProperties.autoScale': false
            'mainSeriesProperties.priceAxisProperties.autoScaleDisabled': false,
            'mainSeriesProperties.priceAxisProperties.percentage': false,
            'mainSeriesProperties.priceAxisProperties.percentageDisabled': false,
            'mainSeriesProperties.priceAxisProperties.log': false,
            'mainSeriesProperties.priceAxisProperties.logDisabled': false,

            'mainSeriesProperties.candleStyle.upColor': style.riseColor,
            'mainSeriesProperties.candleStyle.downColor': style.fallColor,
            'mainSeriesProperties.candleStyle.borderUpColor': style.riseColor,
            'mainSeriesProperties.candleStyle.borderDownColor': style.fallColor,
            'mainSeriesProperties.candleStyle.wickUpColor': style.riseColor,
            'mainSeriesProperties.candleStyle.wickDownColor': style.fallColor
        },
        studies_overrides: {
            'Custom MACD.palettes.plot_0_Palette.colors.0.color': style.riseColor,
            'Custom MACD.palettes.plot_0_Palette.colors.1.color': style.fallColor,
        }
    }
}
