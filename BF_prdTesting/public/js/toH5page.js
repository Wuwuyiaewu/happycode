(function to_TR_withoutBuySell() {
    if (typeof(productId) !== "undefined") {
        let productCode = "";
        let productName = "";
        let digits = 0;
        let origin = "https://h5.bofu210.com";
        let fallColor = "#E3525C";
        let riseColor = "#11B873";

        let url = new URL(window.location.href);
        let utm_source = url.searchParams.get("utm_source") == null ? '' : url.searchParams.get("utm_source");
        let utm_medium = url.searchParams.get("utm_medium") == null ? '' : url.searchParams.get("utm_medium");
        let utm_term = url.searchParams.get("utm_term") == null ? '' : url.searchParams.get("utm_term");
        let utm_campaign = url.searchParams.get("utm_campaign") == null ? '' : url.searchParams.get("utm_campaign");
        let utm_content = url.searchParams.get("utm_content") == null ? '' : url.searchParams.get("utm_content");
        $('.TR_sell')
            .attr('href', origin + '/JW666key/order/' + productId + '?path=K18&direction=sell&utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_term=' + utm_term + '&utm_campaign=' + utm_campaign + '&utm_content=' + utm_content + '&openbrowser=false&experience=true&minetipcash=true')

        $('.TR_buy')
            .attr('href', origin + '/JW666key/order/' + productId + '?path=K18&direction=buy&utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_term=' + utm_term + '&utm_campaign=' + utm_campaign + '&utm_content=' + utm_content + '&openbrowser=false&experience=true&minetipcash=true')
    }

})()

function gotoRegister() {
    if (isApp()) {
        IX_postMessage.toPage('/register/openRealAccount/1' + window.location.search);
    } else {
        let url = "<!--#echo var='gwfx_oa_new'-->/JW666key/register/openRealAccount/1" + window.location.search;
        window.location.href = url;
    }
}

function gotoRegister_pcui() {
    if (isApp()) {
        IX_postMessage.toPage('/register/openRealAccount/1' + window.location.search);
    } else {
        let url = "https://web.bofu210.com/JW666key/register/openRealAccount/1" + window.location.search;
        window.location.href = url;
    }
}

function gotoLogin(phone) {
    let search = window.location.search;
    if (!(phone == null)) {
        if (search.length > 0) {
            search += '&phone=' + phone;
        } else {
            search = '?phone=' + phone;
        }
    }
    if (isApp()) {
        IX_postMessage.toPage('/login' + search);
    } else {
        let url = "<!--#echo var='gwfx_oa_new'-->/JW666key/login";
        window.location.href = url + search;
    }
}

function gotoh5Trade() {
    if (isApp()) {
        IX_postMessage.toPage('/trade' + window.location.search);
    } else {
        let url = "<!--#echo var='gwfx_oa_new'-->/JW666key/trade" + window.location.search;
        window.location.href = url;
    }
}

function gotoGitah5Trade() {
    if (isApp()) {
        IX_postMessage.toPage('/trade');
    } else {
        let url = "<!--#echo var='gwfx_oa_new'-->/JW666key/trade" + window.location.search;
        window.location.href = url;
    }
}

function gotoHome() {
    let url = "<!--#echo var='gwfx_oa_new'-->/JW666key/home" + window.location.search;
    window.location.href = url;
}

function toMore() {
    let url = "<!--#echo var='gwfx_m'-->/H5TradeInfo.html?TR_page=36&" + window.location.search;
    window.location.href = url;
}

function gotoProduct(e) {
    if (isApp()) {
        IX_postMessage.toPage(`/productDetail/` + e);
    } else {
        let url = "<!--#echo var='gwfx_oa_new'-->/JW666key/productDetail/" + e + window.location.search;
        window.location.href = url;
    }
}

function gotoAboutTab(page) {
    //let search=window.location.search;
    //if (search==''){
    //	search='?page='+page;
    //}
    //else {
    //	search+='&page='+page;	
    //}
    let url = "<!--#echo var='gwfx_pc'-->/h5aboutTab.html?page=" + page;
    window.location.href = url;
}

function gotoMiddlePageCheck(urlPath, title) {
    if (isApp()) {
        if (urlPath.indexOf('?') >= 0) {
            IX_postMessage.toMiddlePage({
                path: '/nest/queryinfo',
                query: {
                    url: urlPath,
                    title: title
                }
            })
        } else {
            IX_postMessage.toMiddlePage({
                path: '/nest/queryinfo',
                query: {
                    url: urlPath + window.location.search,
                    title: title
                }
            })
        }
    } else {
        window.location.href = urlPath + window.location.search;
    }

}

function toH5SubPage(urlPath) {
    if (isApp()) {
        IX_postMessage.toPage(urlPath + window.location.search);
    } else {
        let url = "<!--#echo var='gwfx_oa_new'-->/JW666key" + urlPath + window.location.search;
        location.href = url;
    }


}

function h5toExp(urlPath) {
    if (isApp()) {
        let url = "<!--#echo var='gwfx_oa_new'-->/JW666key" + urlPath;
        window.top.location = url;
    } else {
        let url = "<!--#echo var='gwfx_oa_new'-->/JW666key" + urlPath;
        location.href = url;
    }
}

function toH5SubPageNoParam(urlPath) {
    if (isApp()) {
        IX_postMessage.toPage(urlPath);
    } else {
        let url = "<!--#echo var='gwfx_oa_new'-->/JW666key" + urlPath;
        location.href = url;
    }


}



function gotoMiddlePageNoCheck(urlPath, title) {
    IX_postMessage.toMiddlePage({
        path: '/nest/queryinfo',
        query: {
            url: urlPath + window.location.search,
            title: title
        }
    })
}

function toH5SubPageNoCheck(urlPath) {
    IX_postMessage.toPage(urlPath + window.location.search);

}

function gotoInnerAboutUsPage(page) {
    if (window.location.search == null || window.location.search == "") {
        window.location.href =
            "<!--#echo var='gwfx_pc'-->/H5TradeInfo.html?page=" +
            page;
    } else {
        window.location.href =
            "<!--#echo var='gwfx_pc'-->/H5TradeInfo.html" +
            window.location.search +
            "&page=" +
            page;
    }
}


function isApp() {
    let app = new URL(window.location.href).searchParams.get("app");
    return (app == 'ix_app_orig');
}


function toCustomerService() {
    window.onbeforeunload = null;
    var live800Prompt = "http://www.onlineservice-hk.com/k800/chatClient/chatbox.jsp?companyID=284&configID=55&jid=";
    // 设置参数
    let url = new URL(window.location.href);
    let utm_source = url.searchParams.get("utm_source") == null ? '' : url.searchParams.get("utm_source");
    let utm_medium = url.searchParams.get("utm_medium") == null ? '' : url.searchParams.get("utm_medium");
    let utm_campaign = url.searchParams.get("utm_campaign") == null ? '' : url.searchParams.get("utm_campaign");
    let utm_term = url.searchParams.get("utm_term") == null ? '' : url.searchParams.get("utm_term");
    let utm_content = url.searchParams.get("utm_content") == null ? '' : url.searchParams.get("utm_content");

    var accountNo = '';
    var realCompanyId = '';
    var params =
        "company_id=210" +
        "&utm_source=" + utm_source +
        "&utm_medium=" + utm_medium +
        "&utm_campaign=" + utm_campaign +
        "&utm_term=" + utm_term +
        "&utm_content=" + utm_content +
        "&chat_type=1" +
        "&lang=" + window.navigator.language +
        "&uagent=" + encodeURIComponent(window.navigator.userAgent) +
        "&reffer=" + encodeURIComponent(window.location.href) +
        "&lastPageDesc=" + encodeURIComponent(document.title) +
        "&account_no=" + accountNo +
        "&real_co_id=" + realCompanyId;

    var liveUrl = "https://im.bofu210.com:8188/?" + params;

    if (url.pathname == "/lp275C.html") {
        window.location.href = liveUrl;
    } else if (url.pathname == "/03-App-lp/K66_v2.html") {
        console.log("in the k66 v2 path")
        window.open(liveUrl, 'Live800Chatindow', 'height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
    } else if (isApp()) {
        gotoMiddlePageCheck(liveUrl, '联系客服');
    } else {
        try {
            window.open(liveUrl, 'Live800Chatindow', 'height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
        } catch (e) {
            window.open(liveUrl);
        }
    }
}

function gotoH5TradeInfoPage(page) {
    if (window.location.search.length > 0) {
        window.location.href = "<!--#echo var='gwfx_pc'-->/H5TradeInfo.html" + window.location.search + "&page=" + page;
    } else {
        window.location.href = "<!--#echo var='gwfx_pc'-->/H5TradeInfo.html?page=" + page;
    }

}



function toWebOrMobileH5(page) {
    if (/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = "https://h5.bofu210.com/JW666key" + page;
    } else {
        window.location.href = "https://web.bofu210.com/JW666key" + page;
    }

}