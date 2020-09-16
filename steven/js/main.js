var productId = "573017";
var productCode = "OANDA:XAUUSD";
var productTechId = "68";
var script2InnerHtml = '';
var htmlObject;
var htmlObject2;
var htmlObject3;
var height = 450;
var width = 350;
var left = '50px';
var originalDate;
var techTime;

function getData() {
	$.ajax({
		type: "GET",
		url: '/fApi/lp266api',

		success: function (msg) {
			msg = JSON.parse(msg);

			$("#description").html(msg[0].description);
			productId = msg[0].product;
			productCode = msg[0].productCode;
			productTechId = msg[0].productTechId;


			getTechnicalData(3600);


			var script1 = document.createElement("script");
			script1.type = "text/javascript";
			script1.src = "https://s3.tradingview.com/tv.js";
			script1.onload = function () {
				new TradingView.widget(
					{
						// "autosize":true,

						"width": width,
						"height": height,
						"symbol": productCode,
						"interval": "60",
						"timezone": "Asia/Shanghai",
						"hide_top_toolbar": true,
						"theme": "dark",
						"style": "1",
						"locale": "zh_CN",
						"toolbar_bg": "#f1f3f6",
						"enable_publishing": false,
						"hide_legend": true,
						"save_image": false,
						"container_id": "tradingview_3aa8c"
					}
				);
			};
			document.body.appendChild(script1);
			//script2InnerHtml='{"symbol": "'+productCode+'","width": "100%","colorTheme": "light","isTransparent": true,"locale": "zh_CN"}';

			var script2 = document.createElement("script");
			script2.type = "text/javascript";
			script2.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
			script2.async = true;
			script2.innerHTML = '{"symbol": "' + productCode + '","width": "100%","colorTheme": "dark","isTransparent": true,"locale": "zh_CN"}';
			//document.body.appendChild(script2); 
			document.getElementById("script2").appendChild(script2);

			//$("#cover").html('<div class="cover" style="width: 100%; height: 100%; border-radius: 0; z-index:999; background-color:transparent; right:0; top:0; cursor: pointer;" id="product_chart"></div><div class="cover"></div>');

			$("#tech_title").html(msg[0].productCode2 + ' 技术分析');
			$("#tech_detail_title").html(msg[0].productCode2 + ' 技术分析');

			//setTimeout(function() {
			//	console.log($("#script2 div:nth-child(5)").html());

			//	$("#script2 div:nth-child(5)").css("margin","auto");
			//	$("#script2 div:nth-child(5)").css("width","50%");
			//	$("#script2 div:nth-child(5)").css("position","relative");
			//	$("#script2 div:nth-child(5)").css("left",left);


			//display:block;
			//}, 5000);


		},
		error: function (request, status, error) {
			console.log(request.responseText);
		}
	});
}


function getTechnicalData(time) {
	techTime = time;
	$.ajax({
		type: "POST",
		url: 'https://api.bingxuegirl.com/inv/currencies',
		data: { pid: productTechId, peid: time },
		dataType: "html",
		success: function (msg) {
			//console.log(msg);
			//	var lastPos=msg.indexOf("<!-- Tables --> ");
			//	var res = msg.substring(0,lastPos);

			//	console.log($($.parseHTML('<div><span id="foo">hello</span></div>')).find('#foo'));
			//	console.log(res);
			//	var description = $($.parseHTML(data.description)).html();
			//	htmlObject=$($.parseHTML(msg));   
			//$("#part3_subContent").html(res);

			//	console.log(msg);
			htmlObject = $($.parseHTML(msg));

			let htmlStr1 = '';
			let htmlStr2 = '';
			let firstTech = htmlObject.find(".summaryTableLine").eq(0);
			let secTech = htmlObject.find(".summaryTableLine").eq(1);
			htmlStr1 = '<td class="normal">移动平均指数：</td><td id="part_03_sub_1_conclusion">' + firstTech.find('span:nth-child(2)').html() + '</td><td class="greenFont">' + firstTech.find('span:nth-child(3) i:nth-child(1)').html() + firstTech.find('span:nth-child(3) i:nth-child(2)').html() + '</td><td class="redFont">' + firstTech.find('span:nth-child(4) i:nth-child(1)').html() + firstTech.find('span:nth-child(4) i:nth-child(2)').html() + "</td>";
			htmlStr2 = '<td class="normal">技术指标：</td><td id="part_03_sub_2_conclusion">' + secTech.find('span:nth-child(2)').html() + '</td><td class="greenFont">' + secTech.find('span:nth-child(3) i:nth-child(1)').html() + secTech.find('span:nth-child(3) i:nth-child(2)').html() + '</td><td class="redFont">' + secTech.find('span:nth-child(4) i:nth-child(1)').html() + secTech.find('span:nth-child(4) i:nth-child(2)').html() + "</td>";

			$("#part_03_conclusion").html(htmlObject.find('.summary span').html());
			$("#part_03_conclusion").attr('class', htmlObject.find('.summary span').attr('class'));

			htmlObject.find('.summary span').attr('class')
			$("#part_03_sub_1").html(htmlStr1);
			$("#part_03_sub_2").html(htmlStr2);

			$("#part_03_sub_1_conclusion").attr('class', firstTech.find('span:nth-child(2)').attr('class'));
			$("#part_03_sub_2_conclusion").attr('class', secTech.find('span:nth-child(2)').attr('class'));


			setTechDetail(htmlObject);


		},
		error: function (request, status, error) {
			console.log("fail");
			console.log(request.responseText);
			getTechnicalData(techTime);
		}
	});
}


function getStrategyTitle() {

	$.ajax({
		type: "GET",
		url: '/fApi/strategy2020',
		dataType: 'json',
		data: { categoryId: 1363 },
		success: function (msg) {
			$("#strategy_title").html(msg.list[0].title);

		},
		error: function (request, status, error) {
			console.log(request.responseText);
		}
	});

}

function getTechnicalDataDetail(time) {

	$.ajax({
		type: "POST",
		url: 'https://api.bingxuegirl.com/inv/currencies',
		data: { pid: productTechId, peid: time },
		dataType: "html",
		success: function (msg) {
			htmlObject2 = $($.parseHTML(msg));
			setTechDetail(htmlObject2);
		},
		error: function (request, status, error) {
			console.log(request.responseText);
		}
	});

}

function setTechDetail(targetHtmlObject) {

	let htmlStr1 = '';
	let htmlStr2 = '';
	let firstTech = targetHtmlObject.find(".summaryTableLine").eq(0);
	let secTech = targetHtmlObject.find(".summaryTableLine").eq(1);
	htmlStr1 = '<tr><td class="normal">移动平均指数：</td><td id="tech_detail_sub_1_conclusion">' + firstTech.find('span:nth-child(2)').html() + '</td><td class="greenFont">' + firstTech.find('span:nth-child(3) i:nth-child(1)').html() + firstTech.find('span:nth-child(3) i:nth-child(2)').html() + '</td><td class="redFont">' + firstTech.find('span:nth-child(4) i:nth-child(1)').html() + firstTech.find('span:nth-child(4) i:nth-child(2)').html() + "</td></tr>";
	htmlStr2 = '<tr><td class="normal">技术指标：</td><td id="tech_detail_sub_2_conclusion">' + secTech.find('span:nth-child(2)').html() + '</td><td class="greenFont">' + secTech.find('span:nth-child(3) i:nth-child(1)').html() + secTech.find('span:nth-child(3) i:nth-child(2)').html() + '</td><td class="redFont">' + secTech.find('span:nth-child(4) i:nth-child(1)').html() + secTech.find('span:nth-child(4) i:nth-child(2)').html() + "</td></tr>";


	let timeString = targetHtmlObject.find('h3 span').html();
	let yearPos = timeString.indexOf('年');
	let monthPos = timeString.indexOf('月');
	let dayPos = timeString.indexOf('日');
	let timePos = timeString.indexOf(':');
	let year = '';
	let month = '';
	let day = '';
	let hour = '';
	let minute = '';


	year = timeString.substring(0, yearPos);
	month = timeString.substring(yearPos + 1, monthPos);
	day = timeString.substring(monthPos + 1, dayPos);
	hour = timeString.substring(timePos - 2, timePos);
	minute = timeString.substring(timePos + 1, timePos + 3);
	if (day.length == 1) {
		day = '0' + day;
	}
	if (month.length == 1) {
		month = '0' + month;
	}

	var testString = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00';
	console.log(testString);
	originalDate = new Date(year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00');

	originalDate.setTime(originalDate.getTime() + (8 * 60 * 60 * 1000));




	htmlObject3 = targetHtmlObject[8].innerHTML;


	$(".time_string").html('最后更新时间: ' + originalDate.toLocaleString());
	$("#tech_detail_table_1").html('<tr><th colspan="4">总结：<strong id="tech_detail_1_conclusion">' + targetHtmlObject.find('.summary span').html() + '</strong></th></tr>' + htmlStr1 + htmlStr2);
	$("#tech_detail_table_2").html('<tr><td>名称</td><td>S3</td><td>S2</td><td>S1</td><td>轴点</td><td>R1</td><td>R2</td><td>R3</td></tr>' + htmlObject3.substring(htmlObject3.indexOf('<tbody>') + 7, htmlObject3.indexOf('</tbody>')));
	$("#tech_detail_tech_indicator_table").html('<tr><td>名称</td><td>价值</td><td>操作</td></tr>' + targetHtmlObject.find('#curr_table tbody').html());


	$("#tech_detail_1_conclusion").attr('class', htmlObject.find('.summary span').attr('class'));
	$("#tech_detail_sub_1_conclusion").attr('class', firstTech.find('span:nth-child(2)').attr('class'));
	$("#tech_detail_sub_2_conclusion").attr('class', secTech.find('span:nth-child(2)').attr('class'));


}

$(document).ready(function () {



	/*	var ua = navigator.userAgent;
		if(ua.match(/MicroMessenger/i) !=null){
			height=450;
			width=350;
		}
		else if(ua.match(/iPhone|iPad/i) != null){
			height=450;
			width=350;
		}
		else if(ua.match(/Android/i) != null){
			height=450;
			width=350;
		}
		else{
			height=800;
			width=620;
			left='200px';
		}**/

	width = Math.min(650, Math.round(window.innerWidth / 1.35));
	height = width + 100;
	getData();
	getStrategyTitle();
	//getTechnicalDataDetail(86400);
	//	console.log(window.innerWidth);


});

function seeProductDetail() {
	popup_show('tnc');

}

function gotoProductDetail() {
	toH5SubPage("/productDetail/" + productId);
}


$("#product_chart").click(function () {
	gotoProductDetail();
});


function popup_show(div_name) {
	$("#" + div_name).fadeIn();
}

function popup_close(div_name) {
	$("#" + div_name).fadeOut();
	return false;
}

function changeTimeTab(index) {

	$('.xauTab li').removeClass('cur');
	$('.xauTab li:nth-child(' + index + ')').addClass('cur');

}

