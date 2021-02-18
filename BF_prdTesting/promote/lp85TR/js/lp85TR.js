(function() {
    function cleanHTML(html) {
        var root = document.implementation.createHTMLDocument().body;

        root.innerHTML = html;

        //Manipulate the DOM here
        $(root).find("script, style, img").remove(); //jQuery is not relevant, I just didn't want to write exhausting boilerplate code just to make a point
        return root;
    }
    // 傳入產品技術分析所需 peid、pid
    function ajaxTech_Url(peid, pid) {
        $.ajax({
            method: 'post',
            url: "https://api.bingxuegirl.com/inv/currencies",
            data: { pid: pid, peid: peid },
            success: function(msg) {
                let htmlObject = cleanHTML(msg);
                let conclusion = htmlObject.children[0].querySelector('div:nth-child(1) span').innerHTML
                if (conclusion == '强力买入') {
                    $('#conclusionText').text('现价买入')
                    $('span.buyarrow').css('display', 'block')
                } else if (conclusion == '买入') {
                    $('#conclusionText').text('逢低买入')
                    $('span.buyarrow').css('display', 'block')
                } else if (conclusion == '中性') {
                    $('#conclusionText').text('高抛低吸')
                } else if (conclusion == '卖出') {
                    $('#conclusionText').text('逢高卖出')
                    $('span.sellarrow').css('display', 'block')
                } else if (conclusion == '强力卖出') {
                    $('#conclusionText').text('现价卖出')
                    $('span.sellarrow').css('display', 'block')
                }

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //searchTechLock = false;
                console.log(errorThrown);
            }
        });
    }
    // 比特幣 https://m.cn.investing.com/crypto/bitcoin/btc-usd-technical
    ajaxTech_Url(3600, 945629)

    function mountedData() {
        var url = new URL(window.location.href);
        var utm_source = url.searchParams.get("utm_source") == null ? '' : url.searchParams.get("utm_source");
        var utm_medium = url.searchParams.get("utm_medium") == null ? '' : url.searchParams.get("utm_medium");
        var utm_term = url.searchParams.get("utm_term") == null ? '' : url.searchParams.get("utm_term");
        var utm_campaign = url.searchParams.get("utm_campaign") == null ? '' : url.searchParams.get("utm_campaign");
        var utm_content = url.searchParams.get("utm_content") == null ? '' : url.searchParams.get("utm_content");
        let productId = 613023
        let sellUrl = "javascript:h5toExp(" + `'/order/${productId}?direction=sell&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&openbrowser=false&experience=true'` + ")";
        let buyUrl = "javascript:h5toExp(" + `'/order/${productId}?direction=buy&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&openbrowser=false&experience=true'` + ")";
        let productUrl = "javascript:h5toExp(" + `'/productDetail/${productId}?&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&openbrowser=false&experience=true'` + ")";
        console.log(productUrl)
        $('.sellBtn').attr('href', sellUrl)
        $('.buyBtn').attr('href', buyUrl)
        $('.prodBtn').attr('href', productUrl)
    }
    mountedData()
})()