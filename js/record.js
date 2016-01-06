(function ($) {
	
	$(function () {
		
		var record = new Cookie();
		
		if (record.get("test1", "slow", "date") > 0) {
			
			$("#test1_slow").text(record.get("test1", "slow", "time"));
		}
		
		if (record.get("test1", "fast", "date") > 0) {
			
			$("#test1_fast").text(record.get("test1", "fast", "time"));
		}
		
		if (record.get("test2", "off", "total", "date") > 0) {
			
			$("#test2_off_total_total").text(record.get("test2", "off", "total", "total"));
			$("#test2_off_total_rate").text(record.get("test2", "off", "total", "rate"));
		}
		
		if (record.get("test2", "off", "rate", "date") > 0) {
			
			$("#test2_off_rate_total").text(record.get("test2", "off", "rate", "total"));
			$("#test2_off_rate_rate").text(record.get("test2", "off", "rate", "rate"));
		}
		
		if (record.get("test2", "on", "total", "date") > 0) {
			
			$("#test2_on_total_total").text(record.get("test2", "on", "total", "total"));
			$("#test2_on_total_rate").text(record.get("test2", "on", "total", "rate"));
		}
		
		if (record.get("test2", "on", "rate", "date") > 0) {
			
			$("#test2_on_rate_total").text(record.get("test2", "on", "rate", "total"));
			$("#test2_on_rate_rate").text(record.get("test2", "on", "rate", "rate"));
		}
		
		var pages = new Pages("div.contents");
		
		pages.top();
		
		$("#report").on(TOUCH_EVENT, function () { pages.end(); });
		
		$("#remove").on(TOUCH_EVENT, function () { pages.next(); });
		
		$("#yes").on(TOUCH_EVENT, function () {
			
			record.remove();
			
			pages.next();
		});
		
		$("#no").on(TOUCH_EVENT, function () { pages.prev(); });
		
		$("#ok").on(TOUCH_EVENT, function () { location.reload(true); });
		
		$("#age").on("change", mailto);
		
		mailto();
		
//		= = = = = = = = = = =
//		 2016/01/06  CLOSE
//		= = = = = = = = = = =
		$("#age").attr("disabled", true);
		
		$("#mailto").parent().addClass("disabled");
		
		$("div.policy").addClass("thanks").html(
			"記録のご報告は、<br>2015年12月末日で締め切りました。<br><br>ご協力ありがとうございました。"
		);
		
		function mailto() {
			
//			= = = = = = = = = = =
//			 2016/01/06  CLOSE
//			= = = = = = = = = = =
//			$("#mailto").attr("href",
//				"mailto:" + "nosound.nowork" + "@" + "gmail.com?" +
//				"subject=" + ec("ユニシス研究会：静岡G 記録報告") + "&" +
//				"body=" +
//					ec("［年齢］") + br(1) + sp(4) +
//					ec($("#age > option:selected").text()) + br(2) +
//					ec("［Quick Touch］") +  br(1) +
//					sp(4) + ec("テンポ - 遅い：") + $("#test1_slow").parent().text() + br(1) +
//					sp(4) + ec("テンポ - 速い：") + $("#test1_fast").parent().text() + br(2) +
//					ec("［Rapid Answer］")  +  br(1) +
//					sp(4) + ec("音なし") +  br(1) +
//					sp(8) + ec("最高回答数：") + $("#test2_off_total_total").parents("dd").text() + br(1) +
//					sp(8) + ec("最高正解率：") + $("#test2_off_rate_total").parents("dd").text() +  br(1) +
//					sp(4) + ec("音あり") +  br(1) +
//					sp(8) + ec("最高回答数：") + $("#test2_on_total_total").parents("dd").text() + br(1) +
//					sp(8) + ec("最高正解率：") + $("#test2_on_rate_total").parents("dd").text() + br(2) +
//					ec("［その他 感想など］") + br(1)
//			);
		}
		
		function ec(s) { return encodeURIComponent(s); }
		
		function sp(n) { return Array(n + 1).join("%20"); }
		
		function br(n) { return Array(n + 1).join("%0d%0a");}
	});
	
})(jQuery);