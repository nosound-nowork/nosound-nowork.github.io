(function ($) {
	
	$(function () {
		
		var timer = new Timer(),
			timerId = null,
			sound = "";
		
		var squares = $("#squares"),
			cells = squares.find("td"),
			link = $("#link"),
			next = $("div.next"),
			time = $("div.time");
		
		var pages = new Pages("div.contents", {
			
			onTop: function () {
				
				link.show();
				
				time.hide();
			},
			
			onEnd: function () {
				
				timer.stop();
				
				next.hide();
				time.hide();
				
				clearInterval(timerId);
				
				var result = (timer.result() / 1000).toFixed(2);
				
				$("#result").text(result + " 秒");
				
				// Send Google Analytics  - - - - - - - - - - - - - - - - - - - - - - - -
				
				
				
				// Set Cookie - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
				$.cookie.json = true;
				
				var cookie = $.cookie("record");
				
				if (typeof cookie !== "undefined") {
					
					if (cookie.test1[sound].time > result) {
						
						cookie.test1[sound].time = result;
						cookie.test1[sound].date = (new Date()).getTime();
						
						$.cookie("record", cookie, { path: "/", expires: 365 });
					}
				}
			}
		});
		
		pages.top();
		
		$("#sound_off").on(TOUCH_EVENT, function () { load("off"); });
		
		$("#sound_on").on(TOUCH_EVENT, function () { load("on"); });
		
		$("#start").on(TOUCH_EVENT, function () {
			
			pages.next(function () {
				
				shuffle(25);
				
				timer.start();
				
				var sec = $("#sec");
				
				timerId = setInterval(function () {
					
					sec.text((timer.now() / 1000).toFixed(2));
					
				}, 123);
			});
		});
		
		$("#back").on(TOUCH_EVENT, function () { pages.top(); });
		
		$("#again").on(TOUCH_EVENT, function () { location.reload(); });
		
		cells.on(TOUCH_EVENT, function () {
			
			var n = next.text();
			
			if ($(this).hasClass("sq_" + n)) {
				
//				if (n == 5) {
				if (n == 25) {
//				if (n == 50) {
					
					pages.end();
					
				} else {
					
//					if (n == 25) { shuffle(50); }
					
					next.text(parseInt(n) + 1).addClass("highlight");
					
					setTimeout(function () { next.removeClass("highlight"); }, 200);
				}
			}
		});
		
		function load(s) {
			
			link.hide();
			
			if (s == "off") {
				
				sPage();
				
			} else if (s == "on") {
				
				pages.next(function () { setTimeout(sPage, 2500); });
			}
			
			sound = s;
			
			function sPage() {
				
				pages.jump(2, function () { time.show(); });
			}
		}
		
		function shuffle(m) {
			
			var l = [];
			
			for (var i = m - 25; i <= m; i++) {
				
				l.push(i);
			}
			
			var j = 0;
			
			while (l.length > 1) {
				
				var n = l.splice(Math.floor(Math.random() * (l.length - 1) + 1), 1);
				
				$(cells[j]).addClass("sq_" + n).text(n);
				
				j++;
			}
			
			next.text(m - 24)
		}
	});
	
})(jQuery);