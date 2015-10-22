(function ($) {
	
	$.cookie.json = true;
	
	if (typeof $.cookie("record") === "undefined") {
		
		$.cookie("record", {
			test1: {
				off: { time: 99999, date: 0 },
				on: { time: 99999, date: 0 }
			},
			test2: {
				slow: {
					total: { total: 0, correct: 0, rate: 0.00, date: 0 },
					rate: { total: 0, correct: 0, rate: 0.00, date: 0 }
				},
				fast: {
					total: { total: 0, correct: 0, rate: 0.0, date: 0 },
					rate: { total: 0, correct: 0, rate: 0.0, date: 0 }
				}
			}
		}, { path: "/", expires: 365 });
	}
	
	var Timer = function () {};
	
	Timer.prototype = {
		_s: null,
		_e: null,
		start: function () {
			this._s = new Date();
		},
		stop: function () {
			this._e = new Date();
		},
		now: function () {
			if (this._s == null) return false;
			return (new Date()).getTime() - this._s.getTime();
		},
		result: function () {
			if ((this._s == null) || (this._e == null)) return false;
			return this._e.getTime() - this._s.getTime();
		},
		reset: function () {
			this._s = null;
			this._e = null;
		}
	};
	
	window.Timer = Timer;
	
	// Google Analytics Event Tracking
	$.extend({
		
		ga_send: function (category, action, label, value) {
			
			if (!$("div.container").hasClass("admin")) {
				
				var params = {
					"hitType": "event",
					"eventCategory": category,
					"eventAction": action,
				};
				
				if ((typeof label !== "undefined") && (label !== "")) {
					
					params.eventLabel = label;
				}
				
				if (typeof value !== "undefined") {
					
					params.eventValue = value;
				}
				
//				ga('send', params);
			}
		}
	});
	
})(jQuery);