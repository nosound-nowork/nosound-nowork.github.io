(function ($) {
	
	var SETTINGS = {
		IMG_PATH: "../img/q/",
		Q:{ MAX: 13, DICE: 3, IMAGE: 5, CALC: 5 }
	};
	
	$(function () {
		
		var timer = new Timer(),
			timerId = null,
			sound = "",
			count = { total: 0, correct: 0 };
		
		var link = $("#link"),
			time = $("div.time");
		
		var pages = new Pages("div.contents");
		
		pages.onTop(function () {
			
			link.show();
			
			time.hide();
		});
		
		pages.onEnd(function () {
			
			timer.stop();
			
			time.hide();
			
			clearInterval(timerId);
			
			var rate = count.correct == 0 ? 0.0 : Math.round(count.correct / count.total * 1000) / 10;
			
			$("#total").text(count.total);
			$("#rate").text(rate);
			
			// Set Cookie - - - - - - - - - - - - - - - - - - - - - - - - - - -
			$.cookie.json = true;
			
			var cookie = $.cookie("record");
			
			if (typeof cookie !== "undefined") {
				
				if (cookie.test2[sound].total.total < count.total) {
					
					cookie.test2[sound].total.total = count.total;
					cookie.test2[sound].total.correct = count.correct;
					cookie.test2[sound].total.rate = rate;
					cookie.test2[sound].total.date = (new Date()).getTime();
					
					$.cookie("record", cookie, { path: "/", expires: 365 });
				}
				
				if (cookie.test2[sound].rate.rate < rate) {
					
					cookie.test2[sound].rate.total = count.total;
					cookie.test2[sound].rate.correct = count.correct;
					cookie.test2[sound].rate.rate = rate;
					cookie.test2[sound].rate.date = (new Date()).getTime();
					
					$.cookie("record", cookie, { path: "/", expires: 365 });
				}
			}
			//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		});
		
		pages.top();
		
		$("#sound_slow").on(TOUCH_EVENT, function () { load("slow"); });
		
		$("#sound_fast").on(TOUCH_EVENT, (function () { load("fast"); });
		
		$("#start").on(TOUCH_EVENT, function () {
			
			pages.next();
			
			timer.start();
			
			var sec = $("#sec");
			
			timerId = setInterval(function () {
				
				var s = (30 - timer.now() / 1000).toFixed(2);
				
				if (s < 0) {
					
					pages.end();
					
				} else {
					
					sec.text(s);
				}
				
			}, 123);
		});
		
		$("#back").on(TOUCH_EVENT, function () {
			
			pages.top();
		});
		
		function nextQ() {
			
			if (count.total == SETTINGS.Q.MAX) {
				
				pages.end();
				
			} else {
				
				pages.next();
			}
		}
		
		function load(s) {
			
			link.hide();
			
			if (s == "slow") {
				
				
			} else if (s == "fast") {
				
				
			}
			
			sound = s;
			
			pages.next();
			
			$.getJSON("../test/q.json", function (data) {
				
				var dice = random(data.dice.questions, SETTINGS.Q.DICE),
					image = random(data.image, SETTINGS.Q.IMAGE),
					calc = random(data.calc, SETTINGS.Q.CALC),
					ePage = $("div.page_e");
				
				$.each(dice, function (index, value) { ePage.before(makePageQ("dice", value)); });
				
				$.each(image, function (index, value) { ePage.before(makePageQ("image", value)); });
				
				$.each(calc, function (index, value) { ePage.before(makePageQ("calc", value)); });
				
				setTimeout(function () { time.show(); pages.next(); }, 1000);
				
				function makePageQ(type, value) {
					
					var pageQ = $("<div>").addClass("page_q").addClass(type);
					
					if (type == "dice") {
						
						var table = $(
							"<table><tbody>" +
								"<tr><td></td><td></td><td></td></tr>" + "<tr><td></td><td></td><td></td></tr>" +
								"<tr><td></td><td></td><td></td></tr>" + "<tr><td></td><td></td><td></td></tr>" +
							"</tbody></table>"
						);
						
						var cells = table.find("td");
						
						value = String(value);
						
						for (var i = 0; i < value.length; i++) {
							
							var char = value.charAt(i),
								cell = $(cells[i]).addClass("q_" + char).data("char", char);
							
							cell.on(TOUCH_EVENT, function () {
								
								var c = $(this).data("char");
								
								if ((c == "1") || (c == "3")) {
									
									count.total++;
									
									if (c == "3") count.correct++;
									
									nextQ();
								}
							});
						}
						
						pageQ.append($("<h2>").text(data.dice.description)).append(table);
						
					} else {
						
						pageQ.append($("<h2>").text(value.question));
						
						if (typeof value.file !== "undefined") {
							
							pageQ.append($("<img>").attr("src", SETTINGS.IMG_PATH + value.file));
						}
						
						var ol1 = $("<ol>").addClass("buttons"),
							ol2 = $("<ol>").addClass("buttons");
						
						$.each(value.selections, function (j, val) {
							
							var answer = $("<a>").attr("href", "javascript:void(0);").text(val);
							
							if (value.answer == j) answer.addClass("correct");
							
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
		
		function random(ary, n) {
			
			if (ary.length < n) return;
			
			var ret = [];
			
			while (n > 0) {
				
				ret.push(ary.splice(Math.floor(Math.random() * ary.length), 1)[0]);
				
				n--;
			}
			
			return ret;
		}
	});
	
})(jQuery);