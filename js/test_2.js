(function ($) {
	
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
					
					timer.stop();
					pages.end();
					time.hide();
					
				} else {
					
					sec.text(s);
				}
				
			}, 111);
		});
		
		function load(sound) {
			
			if (sound == "slow") {
				
				
			} else if (sound == "fast") {
				
				
			}
			
			pages.next();
			
			$.getJSON("../test/q.json", function (data) {
				
				var dice = random(data.dice.questions, 3),
					image = random(data.image, 5),
					calc = random(data.calc, 5),
					ePage = $("div.page_e");
				
				$.each(dice, function (index, value) { ePage.before(makePageQ("dice", value)); });
				
				$.each(image, function (index, value) { ePage.before(makePageQ("image", value[0])); });
				
				$.each(calc, function (index, value) { ePage.before(makePageQ("calc", value[0])); });
				
				setTimeout(function () { time.show(); pages.next(); }, 1500);
				
				function makePageQ(type, value) {
					
					var pageQ = $("<div>").addClass("page_q");
					
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
									
									pages.next();
								}
							});
						}
						
						pageQ.append($("<h3>").append($("<span>").text(data.dice.description))).append(table);
						
					} else {
						
						pageQ.append($("<h3>").append($("<span>").text(value.question))).append(list);
						
						if (typeof value.file !== "undefined") {
							
							pageQ.append($("<img>").attr("src", "../img/q/" + value.file));
						}
						
						var list = $("<ol>");
						
						$.each(value.selections, function (j, val) {
							
							var answer = $("<li>").text(val);
							
							if (value.answer == j) answer.addClass("correct");
							
							answer.click(function () {
								
								count.total++;
								
								if ($(this).hasClass("correct")) count.correct++;
								
								pages.next();
							});
							
							list.append(answer);
						});
						
						pageQ.append(list);
					}
					
					return pageQ;
				}
			});
		}
		
		function random(ary, n) {
			
			if (ary.length < n) return;
			
			var ret = [];
			
			while (n > 0) {
				
				ret.push(ary.splice(Math.floor(Math.random() * ary.length), 1));
				
				n--;
			}
			
			return ret;
		}
	});
	
})(jQuery);