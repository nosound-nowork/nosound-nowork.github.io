(function ($) {
	
	$(function () {
		
		changePage(1);
		
		var sound = false,
			timer = new Timer(),
			timerId = null,
			squares = $("table.squares td"),
			next = $("div.next"),
			time = $("div.time"),
			sec = $("#sec");
		
		$("#sound_off").click(function () {
			
			sound = false;
			
			changePage(2);
		});
		
		$("#sound_on").click(function () {
			
			sound = true;
			
			changePage(2);
		});

		$("#start").click(function () {
			
			if (sound) {
				
			};
			
			time.show();
			
			shuffle(25);
			
			changePage(3);
			
			timer.start();
			
			timerId = setInterval(function () {
				
				sec.text((timer.now() / 1000).toFixed(2));
				
			}, 111);
		});
		
		squares.click(function () {
			
			var n = next.text();
			
			if ($(this).hasClass("sq_" + n)) {
				
//				if (n == 50) {
				if (n == 25) {
					
					timer.stop();
					
					next.text("");
					time.hide();
					
					clearInterval(timerId);
					
					$("div.page4 > h2").text((timer.result() / 1000).toFixed(2) + " 秒");
					
					changePage(4);
					
				} else {
					
					next.text(parseInt(n) + 1);
					
//					if (n == 25) shuffle(50);
				}
			}
		});
		
		function changePage(n) {
			
			$("div.contents > div").hide();
			
			$("div.page" + n).show();
		}
		
		function shuffle(m) {
			
			var l = [];
			
			for (var i = m - 25; i <= m; i++) {
				
				l.push(i);
			}
			
			var j = 0;
			
			while (l.length > 1) {
				
				var n = l.splice(Math.floor(Math.random() * (l.length - 1) + 1), 1);
				
				$(squares[j]).addClass("sq_" + n).text(n);
				
				j++;
			}
			
			next.text(m - 24)
		}
	});
	
})(jQuery);