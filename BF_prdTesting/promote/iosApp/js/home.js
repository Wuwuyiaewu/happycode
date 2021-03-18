function load_home() {
    $.ajax({
            method: 'get',
            async: false,
            dataType: `jsonp`,
            url: "https://www.bofu210.com/fApi/au01_bf?id=42307",
            jsonpCallBack: 'callback'
        })
        .done(function(msg) {

            let arr1 = msg.pic
            let arr2 = msg.href
            let banner_wrap = document.querySelector('#banner_swiper .swiper-wrapper')
            let _pic_path = []
            let _href_path = []
            arr1.forEach(el => {
                if (el) _pic_path.push(el)
            })
            arr2.forEach(el => {
                if (el) _href_path.push(el)
            })
            for (let i = 0; i < _pic_path.length; i++) {
                banner_wrap.innerHTML += `<div class="swiper-slide">
            <a href="javascript:gotoh5Trade();"><img src="/${_pic_path[i]}"></a>
        </div>`
                console.log(i);
            }
            var banner_swiper = new Swiper('#banner_swiper', {
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 600,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                }
            });
            console.log("WE ARE IN THIS AJAX FUNCTION");
        })
        .fail(function(msg) {
            console.log(msg);
            console.log("ajax failed!");
        })

}