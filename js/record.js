(function ($) {
	
	$(function () {
		
		$.cookie.json = true;
		
		$("div.footer > span").on(TOUCH_EVENT, function (e) {
			
			if (confirm("Remove Cookie?")) {
				
				$.cookie("record", "", { path: "/", expires: -1 });
				
				location.reload(true);
			}
			
			e.preventDefault();
		});
		
		var cookie = $.cookie("record");
		
		if (cookie !== "undefined") {
			
			if (cookie.test1.off.date > 0) {
				
				$("#test1_off").text(cookie.test1.off.time);
			}
			
			if (cookie.test1.on.date > 0) {
				
				$("#test1_on").text(cookie.test1.on.time);
			}
			
			if (cookie.test2.slow.total.date > 0) {
				
				$("#test2_slow_total_total").text(cookie.test2.slow.total.total);
				$("#test2_slow_total_rate").text(cookie.test2.slow.total.rate);
			}
			
			if (cookie.test2.slow.rate.date > 0) {
				
				$("#test2_slow_rate_total").text(cookie.test2.slow.rate.total);
				$("#test2_slow_rate_rate").text(cookie.test2.slow.rate.rate);
			}
			
			if (cookie.test2.fast.total.date > 0) {
				
				$("#test2_fast_total_total").text(cookie.test2.fast.total.total);
				$("#test2_fast_total_rate").text(cookie.test2.fast.total.rate);
			}
			
			if (cookie.test2.fast.rate.date > 0) {
				
				$("#test2_fast_rate_total").text(cookie.test2.fast.rate.total);
				$("#test2_fast_rate_rate").text(cookie.test2.fast.rate.rate);
			}
		}
		
		var pages = new Pages("div.contents");
		
		pages.top();
		
		$("#report").on(TOUCH_EVENT, function () {
			
			pages.end();
		});
		
		$("#age").on("change", mailto);
		
		mailto();
		
		function mailto() {
			
			$("#mail").attr("href",
				"mailto:nosound.nowork@gmail.com?" +
				"subject=" + encodeURIComponent("ユニシス研究会：静岡グループ　計測結果報告") + "&" +
				"body=" +
					encodeURIComponent("［年齢］") + br() + sp(4) +
					encodeURIComponent($("#age > option:selected").text()) + br() + sp(1) + br() +
					encodeURIComponent("［○○○○テスト］") +  br() +
					sp(8) + encodeURIComponent("音なし：") + $("#test1_off").parent().text() +
					sp(1) + encodeURIComponent("／") + sp(1) +
					encodeURIComponent("音あり：") + $("#test1_on").parent().text() +  br() +
					encodeURIComponent("［××××テスト］")  +  br() +
					sp(4) + encodeURIComponent("テンポ - 遅い") +  br() +
					sp(8) + encodeURIComponent("最高回答数：") +
					$("#test2_slow_total_total").parent().parent().text() + sp(1) + encodeURIComponent("／") + sp(1) +
					encodeURIComponent("最高正解率：") + $("#test2_slow_rate_total").parent().parent().text() +  br() +
					sp(4) + encodeURIComponent("テンポ - 早い") +  br() +
					sp(8) + encodeURIComponent("最高回答数：") +
					$("#test2_fast_total_total").parent().parent().text() + sp(1) + encodeURIComponent("／") + sp(1) +
					encodeURIComponent("最高正解率：") + $("#test2_fast_rate_total").parent().parent().text()
			);
		}
		
		function sp(n) {
			return Array(n + 1).join("%20");
		}
		
		function br() {
			return "%0d%0a";
		}
	});
	
})(jQuery);