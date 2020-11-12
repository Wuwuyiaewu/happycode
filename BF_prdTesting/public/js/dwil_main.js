$(window).scroll(function(){
    
    var $this = $(this),
        $head = $('#head_menu');
    if ($this.scrollTop() > 100) {
       $head.addClass('show_bg');
    } else {
       $head.removeClass('show_bg');
    }
});	
        