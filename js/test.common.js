(function ($) {
	
	$.cookie.json = true;
	
	var cookie = $.cookie("record");
	
	if (typeof cookie === "undefined") {
		
		initCookie();
		
	} else {
		
		if ((typeof cookie.test1 === "undefined") || (typeof cookie.test2 === "undefined") ||
			(typeof cookie.test1.slow === "undefined") || (typeof cookie.test1.fast === "undefined") ||
			(typeof cookie.test2.off === "undefined") || (typeof cookie.test2.on === "undefined")) {
			
			initCookie();
		}
	}
	
	function initCookie() {
		
		$.cookie("record", {
			test1: {
				slow: { time: 99999, date: 0 },
				fast: { time: 99999, date: 0 }
			},
			test2: {
				off: {
					total: { total: 0, correct: 0, rate: 0.00, date: 0 },
					rate: { total: 0, correct: 0, rate: 0.00, date: 0 }
				},
				on: {
					total: { total: 0, correct: 0, rate: 0.0, date: 0 },
					rate: { total: 0, correct: 0, rate: 0.0, date: 0 }
				}
			}
		}, { path: "/", expires: 365 });
	}
	
	var Timer = function (n, o) { this.init(n, o); };
	
	Timer.prototype = {
		
		_n: null,
		
		_s: null,
		
		_e: null,
		
		_id: null,
		
		options: {
			limit: 0,
			timeup: $.noop,
			fps: 30
		},
		
		start: function () {
			
			this.reset();
			
			this._s = new Date();
			
			var _this = this;
			
			this._id = setInterval(function () {
				
				var t = _this.now() / 1000;
				
				if (_this.options.limit === 0) {
					
					_this._n.text(t.toFixed(2));
					
				} else {
					
					var l = _this.options.limit - t;
					
					if (l > 0) {
						
						t = l;
						
					} else {
						
						t = 0;
						
						_this.stop();
						
						_this.options.timeup.apply(_this);
					}
				}
				
				_this._n.text(t.toFixed(2));
				
			}, 1000 / this.options.fps);
			
			return this;
		},
		
		stop: function () {
			
			this._e = new Date();
			
			clearInterval(this._id);
			
			this._id = null;
			
			return this;
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
			
			clearInterval(this._id);
			
			this._id = null;
			
			return this;
		},
		
		init: function (n, o) {
			
			this._n = $(n);
			
			$.extend(this.options, o);
			
			this._n.text(this.options.limit.toFixed(2));
		}
	};
	
	window.Timer = Timer;
	
	var Sound = function (options) { this.init(options); };
	
	Sound.prototype = {
		
		options: {
			loop: true,
			autoPlay: true,
			currentTime: 0,
			load: $.noop,
			error: $.noop
		},
		
		audio: null,
		
		src: "",
		
		ready: false,
		
		canPlayMP3: function () {
			
			return this.audio.canPlayType("audio/mpeg") !== "";
		},
		
		canPlayOgg: function () {
			
			return this.audio.canPlayType("audio/ogg") !== "";
		},
		
		extension: function () {
			
			return this.canPlayMP3() ? ".mp3" : this.canPlayOgg() ? ".ogg" : "";
		},
		
		load: function (src) {
			
			this.src = src;
			this.ready = false;
			
			this.audio.src = src;
			
			this.audio.load();
		},
		
		play: function (callback) {
			
			if (this.ready) {
				
				// android audio bug fix
				if (this.audio.currentTime === 0) {
					
					if (this.options.currentTime > 0) {
						
						var t = this.options.currentTime - 0.25;
						
						if (t > 0) {
							
							this.audio.currentTime = t;
						}
					}
				}
				
				this.audio.muted = true;
				
				this.audio.play();
				
				var _this = this;
				
				setTimeout(function () {
					
					_this.audio.muted = false;
					
					if ($.isFunction(callback)) callback.apply(_this);
					
				}, 250);
			}
		},
		
		pause: function () {
			
			if (!this.audio.paused) {
				
				this.audio.pause();
			}
		},
		
		stop: function () {
			
			this.pause();
			
			this.audio.currentTime = 0;
		},
		
		init: function (options) {
			
			if (!window.HTMLAudioElement) return;
			
			$.extend(this.options, options);
			
			this.audio = new Audio();
			
			this.audio.preload = "none";
			this.audio.autoPlay = false;
			
			var _this = this;
			
			this.audio.addEventListener("canplaythrough", function() {
				
				if (!_this.ready) {
					
					// android audio bug fix
					if ($("div.container").hasClass("android")) {
						
						_this.audio.muted = true;
						
						_this.audio.play();
						
						setTimeout(function () {
							
							_this.audio.pause();
							
							_this.audio.muted = false;
							_this.audio.currentTime = 0;
							
							complete();
							
						}, 1000);
						
					} else {
						
						complete();
					}
					
					function complete() {
						
						_this.ready = true;
						
						if (_this.options.autoPlay) {
							
							_this.play(function () { _this.options.load.apply(_this); });
							
						} else {
							
							_this.options.load.apply(_this);
						}
					}
				}
				
			}, false);
			
			this.audio.addEventListener("ended", function() {
				
				if (_this.options.loop) {
					
					_this.audio.currentTime = 0;
					
					_this.play();
				}
				
			}, false);
			
			this.audio.addEventListener("error", function() {
				
				_this.options.error.apply(_this);
				
			}, false);
		}
	};
	
	window.Sound = Sound;
	
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
				
				ga("send", params);
			}
		}
	});
	
})(jQuery);