(function ($) {
	
	var SETTINGS = {
		FPS: 1000 / 60,
		JSON_PATH: "data/",
		SOUND_FILE: {
			SLOW: "data/sound/test2.slow",
			FAST: "data/sound/test2.fast"
		},
		IMG_PATH: "img/q/",
		LIMIT: 30,
		Q: { MAX: 15, DICE: 5, IMAGE: 5, CALC: 5 }
	};
	
	$(function () {
		
		var timer = new Timer(),
			timerId = null,
			sound = null,
			type = "",
			count = { total: 0, correct: 0 };
		
		var link = $("#link"),
			time = $("div.time"),
			sec = $("#sec");
		
		var pages = new Pages("div.contents", {
			
			onTop: function () {
				
				link.show();
				
				time.hide();
				
				sec.text(SETTINGS.LIMIT.toFixed(2));
			},
			
			onEnd: function () {
				
				timer.stop();
				
				time.hide();
				
				clearInterval(timerId);
				
				if (sound !== null) sound.stop();
				
				var rate = count.correct == 0 ? 0.0 : Math.round(count.correct / count.total * 1000) / 10;
				
				$("#total").text(count.total);
				$("#rate").text(rate);
				
				// Send Google Analytics  - - - - - - - - - - - - - - - - - - - - - - - -
				if (type !== "") {
					
					var t = type === "slow" ? "Slow" : "Fast";
					
					$.ga_send("Rapid Answer", "Tempo " + t, "total", count.total);
					$.ga_send("Rapid Answer", "Tempo " + t, "correct", count.correct);
				}
				
				// Set Cookie - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
				$.cookie.json = true;
				
				var cookie = $.cookie("record");
				
				if (typeof cookie !== "undefined") {
					
					if (cookie.test2[type].total.total < count.total) {
						
						cookie.test2[type].total.total = count.total;
						cookie.test2[type].total.correct = count.correct;
						cookie.test2[type].total.rate = rate;
						cookie.test2[type].total.date = (new Date()).getTime();
						
						$.cookie("record", cookie, { path: "/", expires: 365 });
					}
					
					if (cookie.test2[type].rate.rate < rate) {
						
						cookie.test2[type].rate.total = count.total;
						cookie.test2[type].rate.correct = count.correct;
						cookie.test2[type].rate.rate = rate;
						cookie.test2[type].rate.date = (new Date()).getTime();
						
						$.cookie("record", cookie, { path: "/", expires: 365 });
					}
				}
			}
		});
		
		pages.top();
		
		$("#sound_slow").on(TOUCH_EVENT, function () { load("slow"); });
		
		$("#sound_fast").on(TOUCH_EVENT, function () { load("fast"); });
		
		$("#start").on(TOUCH_EVENT, function () {
			
			pages.next(function () {
				
				timer.start();
				
				timerId = setInterval(function () {
					
					var s = (SETTINGS.LIMIT - timer.now() / 1000).toFixed(2);
					
					if (s > 0) {
						
						sec.text(s);
						
					} else {
						
						pages.end();
					}
					
				}, SETTINGS.FPS);
			});
		});
		
		$("#back").on(TOUCH_EVENT, function () {
			
			if ($("div.container").hasClass("admin") && (sound !== null)) sound.stop();
			
			pages.top();
		});
		
		$("#again").on(TOUCH_EVENT, function () { location.reload(); });
		
		function nextQ() {
			
			if (count.total == SETTINGS.Q.MAX) {
				
				pages.end();
				
			} else {
				
				pages.next();
			}
		}
		
		function load(t) {
			
			link.hide();
			
			var soundFile = "",
				currentTime = 0;
			
			if (t == "slow") {
				
				$("span.sound").text("（テンポ - 遅い）");
				
				soundFile = SETTINGS.SOUND_FILE.SLOW;
				currentTime = 16.5;
				
			} else if (t == "fast") {
				
				$("span.sound").text("（テンポ - 速い）");
				
				soundFile = SETTINGS.SOUND_FILE.FAST;
				currentTime = 13;
			}
			
			type = t;
			
			pages.next(function () {
				
				// Play Sound - - - - - - - - - - - - - - - - - - - - - - - - - - - -
				if ($("div.container").hasClass("admin")) {
					
					if (sound === null) {
						
						sound = new Sound({ load: sPage });
					}
					
					soundFile = soundFile + sound.extension();
					
					sound.options.currentTime = currentTime;
					
					if ((sound.file === soundFile) && sound.ready) {
						
						setTimeout(function () { sound.play(sPage); }, 1000);
						
					} else {
						
						sound.load(soundFile);
					}
					
				} else {
					
					setTimeout(sPage, 2500);
				}
				
				function sPage() {
					
					$.getJSON(SETTINGS.JSON_PATH + "q.json", function (data) {
						
						$("div.page_q").remove();
						
						var ePage = $("div.page_e");
						
						$.each(
							random(data.dice.q, SETTINGS.Q.DICE, "dice"),
							function (index, value) { ePage.before(makePageQ(value)); }
						);
						
						$.each(
							random(data.image, SETTINGS.Q.IMAGE, "image"),
							function (index, value) { ePage.before(makePageQ(value)); }
						);
						
						$.each(
							random(data.calc, SETTINGS.Q.CALC, "calc"),
							function (index, value) { ePage.before(makePageQ(value)); }
						);
						
						pages.next(function () { time.show(); });
						
						function makePageQ(item) {
							
							var pageQ = $("<div>").addClass("page_q").addClass(item.type);
							
							if (item.type == "dice") {
								
								pageQ.append($("<h3>").html(data.dice.d));
								
								var table = $(
									"<table><tbody>" +
										"<tr><td></td><td></td><td></td></tr>" +
										"<tr><td></td><td></td><td></td></tr>" +
										"<tr><td></td><td></td><td></td></tr>" +
										"<tr><td></td><td></td><td></td></tr>" +
									"</tbody></table>"
								);
								
								var cells = table.find("td");
								
								item.value = String(item.value);
								
								for (var i = 0; i < item.value.length; i++) {
									
									$(cells[i]).on(TOUCH_EVENT, function () {
										
										var $this = $(this);
										
										if ($this.hasClass("q_1") || $this.hasClass("q_3")) {
											
											count.total++;
											
											if ($this.hasClass("q_3")) count.correct++;
											
											nextQ();
										}
										
									}).addClass("q_" + item.value.charAt(i));
								}
								
								pageQ.append(table);
								
							} else {
								
								pageQ.append($("<h3>").html(item.value.q));
								
								if (typeof item.value.f !== "undefined") {
									
									pageQ.append($("<img>").attr("src", SETTINGS.IMG_PATH + item.value.f));
								}
								
								var ol1 = $("<ol>").addClass("buttons"),
									ol2 = $("<ol>").addClass("buttons");
								
								$.each(item.value.s, function (j, val) {
									
									var answer = $("<a>").attr("href", "javascript:void(0);").text(val);
									
									if (item.value.a == j) answer.addClass("correct");
									
									answer.on(TOUCH_EVENT, function () {
										
										count.total++;
										
										if ($(this).hasClass("correct")) count.correct++;
										
										nextQ();
									});
									
									(j < 2 ? ol1 : ol2).append($("<li>").append(answer));
								});
								
								pageQ.append(ol1).append(ol2);
							}
							
							return pageQ;
						}
					});
				}
			});
		}
		
		function random(ary, n, t) {
			
			if (ary.length < n) return;
			
			var ret = [];
			
			while (n > 0) {
				
				var v = ary.splice(Math.floor(Math.random() * ary.length), 1)[0];
				
				if (typeof t === "undefined") {
					
					ret.push(v);
					
				} else {
					
					ret.push({ type: t, value: v });
				}
				
				n--;
			}
			
			return ret;
		}
	});
	
})(jQuery);