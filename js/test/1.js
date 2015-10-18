(function ($) {
	
	$(function () {
		
		var pages = new Pages("div.contents"),
			squares = $("#squares");
			timer = new Timer(),
			timerId = null,
			cells = squares.find("td"),
			next = $("div.next"),
			time = $("div.time");
		
		$("#sound_off").click(function () { load(false); });
		
		$("#sound_on").click(function () { load(true); });
		
		$("#start").click(function () {
			
			shuffle(25);
			
			pages.next();
			
			timer.start();
			
			var sec = $("#sec");
			
			timerId = setInterval(function () {
				
				sec.text((timer.now() / 1000).toFixed(2));
				
			}, 111);
		});
		
		cells.click(function () {
			
			var n = next.text();
			
			if ($(this).hasClass("sq_" + n)) {
				
//				if (n == 5) {
				if (n == 25) {
//				if (n == 50) {
					
					timer.stop();
					
					next.text("");
					time.hide();
					
					clearInterval(timerId);
					
					var result = (timer.result() / 1000).toFixed(2);
					
					$("#result").text(result + " 秒");
					
					pages.next();
					
				} else {
					
//					if (n == 25) { shuffle(50); }
					
					next.text(parseInt(n) + 1).addClass("highlight");
					
					setTimeout(function () { next.removeClass("highlight"); }, 200);
				}
			}
		});
		
		function load(sound) {
			
			if (sound) {
				
				pages.next();
				
				setTimeout(sPage, 1000);
				
			} else {
				
				sPage();
			}
			
			function sPage() {
				time.show();
				pages.jump(2);
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