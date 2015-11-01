(function ($) {
	
	$(function () {
		
		$.cookie.json = true;
		
		if ($("div.container").hasClass("admin")) {
			
			$("div.footer > span").on(TOUCH_EVENT, function () {
				
				if (confirm("Are you sure you want to delete the cookie?")) {
					
					$.cookie("record", "", { path: "/", expires: -1 });
					
					location.reload(true);
				}
			});
		}
		
		var cookie = $.cookie("record");
		
		if (typeof cookie !== "undefined") {
			
			if (cookie.test1.slow.date > 0) {
				
				$("#test1_slow").text(cookie.test1.slow.time);
			}
			
			if (cookie.test1.fast.date > 0) {
				
				$("#test1_fast").text(cookie.test1.fast.time);
			}
			
			if (cookie.test2.off.total.date > 0) {
				
				$("#test2_off_total_total").text(cookie.test2.off.total.total);
				$("#test2_off_total_rate").text(cookie.test2.off.total.rate);
			}
			
			if (cookie.test2.off.rate.date > 0) {
				
				$("#test2_off_rate_total").text(cookie.test2.off.rate.total);
				$("#test2_off_rate_rate").text(cookie.test2.off.rate.rate);
			}
			
			if (cookie.test2.on.total.date > 0) {
				
				$("#test2_on_total_total").text(cookie.test2.on.total.total);
				$("#test2_on_total_rate").text(cookie.test2.on.total.rate);
			}
			
			if (cookie.test2.on.rate.date > 0) {
				
				$("#test2_on_rate_total").text(cookie.test2.on.rate.total);
				$("#test2_on_rate_rate").text(cookie.test2.on.rate.rate);
			}
		}
		
		var pages = new Pages("div.contents");
		
		pages.top();
		
		$("#report").on(TOUCH_EVENT, function () { pages.end(); });
		
		$("#age").on("change", mailto);
		
		mailto();
		
		function mailto() {
			
			$("#mailto").attr("href",
				"mailto:" + "nosound.nowork" + "@" + "gmail.com?" +
				"subject=" + encodeURIComponent("ユニシス研究会：静岡G　記録報告") + "&" +
				"body=" +
					encodeURIComponent("［年齢］") + br(1) + sp(4) +
					encodeURIComponent($("#age > option:selected").text()) + br(1) + sp(1) + br(1) +
					encodeURIComponent("［Quick Touch］") +  br(1) +
					sp(8) + encodeURIComponent("音なし：") + $("#test1_off").parent().text() + br(1) +
					sp(8) + encodeURIComponent("音あり：") + $("#test1_on").parent().text() + br(1) +
					encodeURIComponent("［Rapid Answer］")  +  br(1) +
					sp(4) + encodeURIComponent("テンポ - 遅い") +  br(1) +
					sp(8) + encodeURIComponent("最高回答数：") +
					$("#test2_off_total_total").parent().parent().text() + br(1) +
					sp(8) + encodeURIComponent("最高正解率：") +
					$("#test2_off_rate_total").parent().parent().text() +  br(1) +
					sp(4) + encodeURIComponent("テンポ - 早い") +  br(1) +
					sp(8) + encodeURIComponent("最高回答数：") +
					$("#test2_on_total_total").parent().parent().text() + br(1) +
					sp(8) + encodeURIComponent("最高正解率：") +
					$("#test2_on_rate_total").parent().parent().text() + br(2) +
					encodeURIComponent("［その他 感想など］") + br(1)
			);
		}
		
		function sp(n) { return Array(n + 1).join("%20"); }
		
		function br(n) { return Array(n + 1).join("%0d%0a");}
	});
	
})(jQuery);