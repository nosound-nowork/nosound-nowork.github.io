(function ($) {
	
	var SETTINGS = {
		IMG_PATH: "../img/q/",
		Q:{ MAX: 13, DICE: 3, IMAGE: 5, CALC: 5 }
	};
	
	$(function () {
		
		var pages = new Pages("div.contents"),
			timer = new Timer(),
			timerId = null,
			time = $("div.time"),
			count = { total: 0, correct: 0 };
		
		$("#sound_slow").click(function () { load("slow"); });
		
		$("#sound_fast").click(function () { load("fast"); });
		
		$("#start").click(function () {
			
			pages.next();
			
			timer.start();
			
			var sec = $("#sec");
			
			timerId = setInterval(function () {
				
				var s = (30 - timer.now() / 1000).toFixed(2);
				
				if (s < 0) {
					
					end();
					
				} else {
					
					sec.text(s);
				}
				
			}, 111);
		});
		
		function end() {
			
			timer.stop();
			time.hide();
			pages.end();
			
			var rate = Math.round(count.correct / count.total * 1000) / 10;
			
			$("#answer").text(count.total);
			$("#rate").text(rate);
		}
		
		function nextQ() {
			
			if (count.total == SETTINGS.Q.MAX) {
				
				end();
				
			} else {
				
				pages.next();
			}
		}
		
		function load(sound) {
			
			if (sound == "slow") {
				
				
			} else if (sound == "fast") {
				
				
			}
			
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
							
							cell.click(function () {
								
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
							
							answer.click(function () {
								
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