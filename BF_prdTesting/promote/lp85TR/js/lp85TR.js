(function() {

    let htmlObjectPop = null;
    let techAnalyInfo = {};
    let defaultTechAnalyInfo = {
        conclusion: '中性',
        suggestion: '高抛低吸',
        conclusionBg: 'bg_normal', //bg_green,bg_red,bg_normal
        conclusionMAText: '---',
        conclusionMATextColor: 'text_normal', //text_green,text_red,text_normal
        conclusionMABuyText: '---',
        conclusionMASellText: '---',
        conclusionTechIndiText: '---',
        conclusionTechIndiTextColor: 'text_normal', //text_green,text_red,text_normal
        conclusionTechIndiBuyText: '---',
        conclusionTechIndiSellText: '---',
    };

    let products = {
        613023: { pid: 945629 },
    }

    function parseHTML(str) {
        let tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = str;
        return tmp.body.children;
    }

    // 傳入產品技術分析所需 peid、pid
    function ajaxTech_Url(peid, pid) {
        $.ajax({
            method: 'post',
            url: "https://api.bingxuegirl.com/inv/currencies",
            data: { pid: pid, peid: peid },
            success: function(msg) {
                let htmlObject = parseHTML(msg);
                console.log(htmlObject);

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //searchTechLock = false;
                console.log(errorThrown);
            }
        });
    }
    ajaxTech_Url(900, 945629)

    function mountedData() {
        var url = new URL(window.location.href);
        var utm_source = url.searchParams.get("utm_source") == null ? '' : url.searchParams.get("utm_source");
        var utm_medium = url.searchParams.get("utm_medium") == null ? '' : url.searchParams.get("utm_medium");
        var utm_term = url.searchParams.get("utm_term") == null ? '' : url.searchParams.get("utm_term");
        var utm_campaign = url.searchParams.get("utm_campaign") == null ? '' : url.searchParams.get("utm_campaign");
        var utm_content = url.searchParams.get("utm_content") == null ? '' : url.searchParams.get("utm_content");
        let productId = 613023
        let sellUrl = "javascript:h5toExp(" + `'/order/${productId}?direction=sell&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&openbrowser=false&experience=true&path=K18'` + ")";
        let buyUrl = "javascript:h5toExp(" + `'/order/${productId}?direction=buy&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&openbrowser=false&experience=true&path=K18'` + ")";
        let productUrl = "javascript:h5toExp(" + `'/productDetail/${productId}?&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&openbrowser=false&experience=true&path=K18'` + ")";
        console.log(productUrl)
        $('.sellBtn').attr('href', sellUrl)
        $('.buyBtn').attr('href', buyUrl)
        $('.prodBtn').attr('href', productUrl)
    }
    mountedData()
})()