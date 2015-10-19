(function ($) {
	
	$(function () {
		
		$.cookie.json = true;
		
		$("div.footer > span").click(function () {
			
			if (confirm("Remove Cookie?")) {
				
				$.cookie("record", "", { path: "/", expires: -1 });
				
				location.reload(true);
			}
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
	});
	
})(jQuery);