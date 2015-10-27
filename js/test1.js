(function ($) {
	
	var SETTINGS = {
		SOUND_FILE: "data/sound/test1"
	};
	
	$(function () {
		
		var timer = new Timer(),
			timerId = null,
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
				
				clearInterval(timerId);
				
				var result = (timer.result() / 1000).toFixed(2);
				
				$("#result").text(result);
				
				// Send Google Analytics  - - - - - - - - - - - - - - - - - - - - - - - -
				if (type !== "") {
					
					var t = type === "off" ? "Off" : "On";
					
					$.ga_send("Quick Touch", "Sound " + t, "", result * 100);
				}
				
				// Set Cookie - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
				$.cookie.json = true;
				
				var cookie = $.cookie("record");
				
				if (typeof cookie !== "undefined") {
					
					if (cookie.test1[type].time > result) {
						
						cookie.test1[type].time = result;
						cookie.test1[type].date = (new Date()).getTime();
						
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
		
		$("#back").on(TOUCH_EVENT, function () {
			
			if ($("div.container").hasClass("admin") && (sound !== null)) sound.stop();
			
			pages.top();
		});
		
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
		
		function load(t) {
			
			link.hide();
			
			if (t == "off") {
				
				$("span.sound").text("（音なし）");
				
				sPage();
				
			} else if (t == "on") {
				
				$("span.sound").text("（音あり）");
				
				if ($("div.container").hasClass("admin")) {
					
					pages.next(function () {
						
						if ((sound === null) || (!sound.ready)) {
							
							sound = new Sound({
								load: sPage
							});
							
							sound.load(SETTINGS.SOUND_FILE + sound.extension());
							
						} else {
							
							sound.play();
						}
					});
					
				} else {
					
					pages.next(function () { setTimeout(sPage, 2500); });
				}
			}
			
			type = t;
			
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