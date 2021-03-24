var num = 7.5;
var docEl = document.documentElement;
var width = docEl.getBoundingClientRect().width;
if (width > 750) { width = 750; }
var rem = width / num;
rem = parseFloat(rem.toFixed(3));
docEl.style.fontSize = rem + 'px';

var realitySize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
if (rem !== realitySize) {
    rem = rem * rem / realitySize;
    docEl.style.fontSize = rem + 'px';
}
window.REM = rem;


$(window).resize(function() {
    var num = 7.5;
    var docEl = document.documentElement;
    var width = docEl.getBoundingClientRect().width;
    if (width > 750) { width = 750; }
    var rem = width / num;
    rem = parseFloat(rem.toFixed(3));
    docEl.style.fontSize = rem + 'px';

    var realitySize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    if (rem !== realitySize) {
        rem = rem * rem / realitySize;
        docEl.style.fontSize = rem + 'px';
    }
    window.REM = rem;
});

$(document).ready(function() {
    $('.footbar').css('bottom', '0');
    table1_change(1);
});

$(function() {

    $(window).scroll(function() {
        if ($(document).scrollTop() > $(".header").height()) {
            $(".header").addClass('header2');
            $(".topbox .logo").css('visibility', 'visible');
            $(".topbox .service").css('visibility', 'visible');
        } else {
            $(".header").removeClass('header2');
        }
        if ($(document).scrollTop() > $(".imain2").offset().top - 200) {
            $(".ilist1 .items").addClass('itemf');
        }
    });

});

function table1_change(table_id) {
    $("#tab_table1 li").removeClass("show");
    $("#tab_table1 li[page=" + table_id + "]").addClass("show");
    $("#tab_table1 .item").removeClass("show");
    $("#tab_table1 .item[page=" + table_id + "]").addClass("show");
}