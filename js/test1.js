(function ($) {
	
	var SETTINGS = {
		SOUND_SRC: {
			SLOW: "data/sound/test1.slow",
			FAST: "data/sound/test1.fast"
		}
	};
	
	$(function () {
		
		var timer = new Timer("#sec"),
			sound = null;
			type = "";
		
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
				
				link.show();
				
				if (sound !== null) sound.stop();
				
				var result = (timer.result() / 1000).toFixed(2);
				
				$("#result").text(result);
				
				// Send Google Analytics  - - - - - - - - - - - - - - - - - - - - - - - -
				if (type !== "") {
					
					var t = type === "slow" ? "Slow" : "Fast";
					
					$.ga_send("Quick Touch", "Tempo " + t, "", result * 100);
				}
				
				// Set Cookie - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
				var record = new Cookie();
				
				if (record.get("test1", type, "time") > result) {
					
					record.set(["test1", type, "time"], result);
					record.set(["test1", type, "date"], (new Date()).getTime());
				}
				
				record.save();
			}
		});
		
		pages.top();
		
		$("#sound_slow").on(TOUCH_EVENT, function () { load("slow"); });
		
		$("#sound_fast").on(TOUCH_EVENT, function () { load("fast"); });
		
		$("#start").on(TOUCH_EVENT, function () {
			
			pages.next(function () {
				
				shuffle(25);
				
				timer.start();
			});
		});
		
		$("#back").on(TOUCH_EVENT, function () {
			
			if (sound !== null) sound.stop();
			
			pages.top();
		});
		
		$("#again").on(TOUCH_EVENT, function () { location.reload(); });
		
		cells.on(TOUCH_EVENT, function () {
			
			var n = parseInt(next.text());
			
			if ($(this).hasClass("sq_" + n)) {
				
//				if (n == 5) {
				if (n === 25) {
//				if (n == 50) {
					
					pages.end();
					
				} else {
					
//					if (n == 25) { shuffle(50); }
					
					next.text(parseInt(n) + 1).addClass("highlight");
					
					setTimeout(function () { next.removeClass("highlight"); }, 200);
				}
			}
		});
		
		function load(t) {
			
			link.hide();
			
			var title = "",
				soundSrc = "",
				currentTime = 0;
			
			if (t === "slow") {
				
				title = "（テンポ - 遅い）";
				soundSrc = SETTINGS.SOUND_SRC.SLOW;
				currentTime = 20.5;
				
			} else if (t === "fast") {
				
				title = "（テンポ - 速い）";
				soundSrc = SETTINGS.SOUND_SRC.FAST;
				currentTime = 13;
			}
			
			type = t;
			
			$("div.title > h2").text(title);
			
			// Play Sound - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			pages.next(function () {
				
				if (sound === null) {
					
					sound = new Sound({ load: sPage });
				}
				
				soundSrc = soundSrc + sound.extension();
				
				sound.options.currentTime = currentTime;
				
				if ((sound.src === soundSrc) && sound.ready) {
					
					setTimeout(function () { sound.play(sPage); }, 1000);
					
				} else {
					
					sound.load(soundSrc);
				}
			});
			
			function sPage() { pages.jump(2, function () { time.show(); }); }
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