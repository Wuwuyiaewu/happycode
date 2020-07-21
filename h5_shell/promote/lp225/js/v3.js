
$(function wheelRun(){
    let screenWidth = document.body.clientWidth;
    if(screenWidth > 750){
    let whellArr=[];
    let wheTxtArr=[];
    let timer;
    let infoTxt = $('.infotag')
    var index = 0;
    var j = 0;
    var k = j - 1;
    $('.wheelPart').click(function(e){
        clearInterval(timer)
        // whellArr.forEach(el => {
        //     el.classList.remove("active");
        // });
        index = e.currentTarget.dataset.index;
        $('.wheelPart').removeClass('active')
        $('.wheelTxt').removeClass('active')
        roll(index)
    })
    for (var i = 0; i <= 9; i++) {
        whellArr.push(document.querySelector('.part' + i))
        wheTxtArr.push(document.querySelector('.wheelTxt' + i))
    }
    // console.log(whellArr);
    // console.log(infoTxt)
    // console.log(infoTxt.children('.wheelTxt1'))

    let duration = 1500;
    function roll(index){
        console.log(index)
         j = index;
         k;
            whellArr[j].classList.add("active");
            wheTxtArr[j].classList.add("active");
            // console.log(whellArr[j].dataset.txt1);
            timer = window.setInterval(
                function count(){
                    console.log(index)
                    j++;
                    k= j - 1;
                    if (j >= 10) {
                        j = 0;
                    }
                    whellArr[j].classList.add("active");
                    wheTxtArr[j].classList.add("active");
                    whellArr[k].classList.remove("active");
                    wheTxtArr[k].classList.remove("active");
                    // console.log(whellArr[j].dataset.txt1);
                },duration
            )
    }
    roll(0)
    }
    
    // $('#prev').click(function(){
    //     if(j <= 0){
    //         j = 9;
    //     }
    //     console.log(j)
    //     $('.wheelPart').removeClass('active')
    //     // $('.wheelTxt').removeClass('active')
    //     j--;
    //     clearInterval(timer)
    //     roll(j)
    // })
    // $('#next').click(function(){
    //     console.log(j)
    //     if(j >= 9){
    //         j = 0;
    //     }
    //     console.log(j)
    //     $('.wheelPart').removeClass('active')
    //     // $('.wheelTxt').removeClass('active')
    //     j++;
    //     clearInterval(timer)
    //     roll(j)
    // })
})