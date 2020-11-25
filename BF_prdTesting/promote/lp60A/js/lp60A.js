var left  = 342;
var right = 280;
function vote(left_add , right_add) {
	let voted = localStorage.getItem('lp337vote')
	randerNum()

	if(left_add == 1 || voted === 'left') {
        console.log('l');
		left+=1
        $(".vs_btn").addClass("voted");
        $(".vs_btn").attr('disabled',true);
		$(".left_btn").html("已站队");
		$(".right_btn").html("看涨");
        localStorage.setItem('lp337vote','left')  
		randerNum()
		if(!voted){
			popup_show('zdPop')
		}
	}
	else if(right_add == 1 || voted === 'right') {
        console.log('r');
        
		right+=1
        $(".vs_btn").addClass("voted");
        $(".vs_btn").attr('disabled',true);
		$(".left_btn").html("看跌");
		$(".right_btn").html("已站队");
        localStorage.setItem('lp337vote','right')
		randerNum()
		if(!voted){
			popup_show('zdPop')
		}
	}

}
function randerNum(){
    $('.leftNum').html(left)
    $('.rightNum').html(right)
}
function randerDay(){
	let a = new Date
	let day = a.getDate()
	let daylen = day.toString().length
	let month = a.getMonth()
	console.log(len);
	if(month != 12){
		month += 1
	}
	if(daylen < 2){
		day = '0'+day
	}
	console.log(day);
	
	console.log(month);
	let dateTxt = month +'月'+day+'日黄金'
	$('.date').html(dateTxt)
}
$(function(){
    vote(0, 0)
	randerDay()
})
$(function(){ 
	
	// 将时间戳转换成日期格式
	var date = new Date();
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = date.getDate() + ' ';
	h = date.getHours() + ':';
	m = date.getMinutes() + ':';
	s = date.getSeconds(); 
	console.log(Y+M+D+h+m+s);
	
	
	// 思路：↓↓↓↓↓↓↓
	
	// 1440             一天有1440分钟
	// 1440/15 = 96     一天要轮换96次 
	
	// 获取当天的凌晨时间
	// 获取打开时间
	
	// 打开时间 - 凌晨时间    过了多少分钟
	// 过了多少分钟 / 15 = 轮换了多少次
	
	
	// 凌晨时间：将日期格式转换成时间戳
	var zeroTime = `2020-11-03 11:00:00`;       // 当天的凌晨时间
	console.log(zeroTime);
	
	var zeroTime_t = new Date(zeroTime.replace(/-/g, '/'));  // 格式化凌晨时间
	var zeroTime_timestamp = zeroTime_t.getTime();          // 将 Y+M+D+h+m+s 格式转换成时间戳格式
	// console.log('零'+zeroTime_timestamp);
	
	
	// 获取打开时间的时间戳 单位毫秒
	// var nowTime = new Date();
	var nowTime = new Date().getTime();
	// console.log('现'+nowTime);
	
	
	// 时间差：打开时间 减去 凌晨时间
	var difference = nowTime - zeroTime_timestamp;
	//console.log(difference);
	console.log(difference);
	
	// 15分钟有多少毫秒
	var fift = 60*60*1000;
	var count = Math.floor(difference/fift);    // 在这个时间差内，轮换了多少次
	//console.log(count);
	console.log(count);
	let odd = Math.ceil(count/2) //奇數
	let even = Math.floor(count/2) //偶數
	console.log('奇數小時'+odd);
	console.log('偶數小時'+even);
	left = left + odd * 12 + even * 11
	right = right + even * 11 + odd * 12
	randerNum()
	})