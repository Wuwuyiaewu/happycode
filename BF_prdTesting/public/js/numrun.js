(function($) {
    $.fn.animateNumbers = function(stop, commas, duration, ease) {
        return this.each(function() {
            var $this = $(this);
            var start = parseInt($this.text().replace(/,/g, ""));
            commas = (commas === undefined) ? true : commas;
            $({ value: start }).animate({ value: stop }, {
                duration: duration == undefined ? 1000 : duration,
                easing: ease == undefined ? "swing" : ease,
                step: function() {
                    $this.text(Math.floor(this.value));
                    if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
                },
                complete: function() {
                    if (parseInt($this.text()) !== stop) {
                        $this.text(stop);
                        if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
                    }
                }
            });
        });
    };
})(jQuery);

var baseDate = new Date(2020, 7, 10);
var todayDate = new Date();
var diffDays = parseInt((todayDate - baseDate) / (1000 * 60 * 60 * 24), 10);
var count1 = 15470467 + 1950 * (1 + diffDays);
var count2 = 1670298 + (1 + diffDays) * 98;


function countAnimCheck() {
    let a = $(window).height();
    let group = $(".numRun");
    let b = $(this).scrollTop();
    let c = group.offset().top;
    if (a + b > c + 100) {
        $("#total_count_1").animateNumbers(count1, true, 500);
        $("#total_count_2").animateNumbers(count2, true, 500);
    }
}

$(document).ready(function() {
    countAnimCheck();
});


$(window).scroll(function() {
    countAnimCheck();
});