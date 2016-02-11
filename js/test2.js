(function ($) {
	
	var SETTINGS = {
		JSON_PATH: "data/",
		SOUND_SRC: "data/sound/test2.rain",
		IMG_PATH: "img/q/",
		LIMIT: 60,
		Q: { MAX: 21, DICE: 7, IMAGE: 7, CALC: 7 }
	};
	
	$(function () {
		
		var timer = new Timer("#sec", { limit: SETTINGS.LIMIT, timeup: function () { pages.end(); } }),
			sound = null,
			type = "",
			count = { total: 0, correct: 0 };
		
		var link = $("#link"),
			time = $("div.time"),
			caution = $("span.caution");
		
		var pages = new Pages("div.contents", {
			
			top: function () {
				
				link.show();
				
				time.hide();
				
				caution.show();
			},
			
			end: function () {
				
				this.fixed(true);
				
				timer.stop();
				
				time.hide();
				
				link.show();
				
				if (sound !== null) sound.stop();
				
				var rate = count.correct == 0 ? 0.0 : Math.round(count.correct / count.total * 1000) / 10;
				
				$("#total").text(count.total);
				$("#rate").text(rate);
				
				// Send Google Analytics  - - - - - - - - - - - - - - - - - - - - - - - -
				if (type !== "") {
					
					var t = type === "off" ? "OFF" : "ON";
					
					$.ga_send("Rapid Answer", "Sound " + t, "Total", count.total);
					$.ga_send("Rapid Answer", "Sound " + t, "Correct", count.correct);
				}
				
				// Set Cookie - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
				var record = new Cookie();
				
				if (record.get("test2", type, "total", "total") < count.total) {
					
					record.set(["test2", type, "total", "total"], count.total);
					record.set(["test2", type, "total", "correct"], count.correct);
					record.set(["test2", type, "total", "rate"], rate);
					record.set(["test2", type, "total", "date"], (new Date()).getTime());
				}
				
				if (record.get("test2", type, "rate", "rate") < rate) {
					
					record.set(["test2", type, "rate", "total"], count.total);
					record.set(["test2", type, "rate", "correct"], count.correct);
					record.set(["test2", type, "rate", "rate"], rate);
					record.set(["test2", type, "rate", "date"], (new Date()).getTime());
				}
				
				record.save();
			}
		});
		
		pages.top();
		
		$("#sound_off").on(TOUCH_EVENT, function () { load("off"); });
		
		$("#sound_on").on(TOUCH_EVENT, function () { load("on"); });
		
		$("#start").on(TOUCH_EVENT, function () {
			
			pages.next(function () { timer.start(); });
		});
		
		$("#back").on(TOUCH_EVENT, function () {
			
			if (sound !== null) sound.stop();
			
			pages.top();
		});
		
		$("#again").on(TOUCH_EVENT, function () { location.reload(); });
		
		function load(t) {
			
			link.hide();
			
			type = t;
			
			pages.next(function () {
				
				var title = "";
				
				if (t === "off") {
					
					title = "（音なし）";
					
					caution.hide();
					
					sPage();
					
				} else if (t === "on") {
					
					title = "（音あり）";
					
					// Play Sound - - - - - - - - - - - - - - - - - - - - - - - - - - - -
					if (sound === null) {
						
						sound = new Sound({ load: sPage, currentTime: 1 });
					}
					
					if (sound.ready) {
						
						setTimeout(function () { sound.play(sPage); }, 1000);
						
					} else {
						
						sound.load(SETTINGS.SOUND_SRC + sound.extension());
					}
				}
				
				$("div.title > h2").text(title);
				
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
						
						function nextQ() {
							
							if (count.total === SETTINGS.Q.MAX) {
								
								pages.end();
								
							} else {
								
								pages.next();
							}
						}
						
						function makePageQ(item) {
							
							var pageQ = $("<div>").addClass("page_q").addClass(item.type);
							
							if (item.type == "dice") {
								
								pageQ.append($("<h4>").html(data.dice.d));
								
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
								
								pageQ.append($("<h4>").html(item.value.q));
								
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