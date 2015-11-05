(function ($) {
	
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
		
		play: function (func) {
			
			if (this.ready) {
				
				var _this = this;
				
				function callback() { if ($.isFunction(func)) func.apply(_this); }
				
				if ((this.audio.currentTime === 0) && (this.options.currentTime > 0)) {
					
					// android audio bug fix
					if ($("div.container").hasClass("android")) {
						
						var delay = 0.5,
							crrTm = this.options.currentTime - delay;
						
						this.audio.currentTime = crrTm > 0 ? crrTm : this.options.currentTime;
						
						this.audio.muted = true;
						
						this.audio.play();
						
						setTimeout(function () {
							
							_this.audio.muted = false;
							
							callback();
							
						}, delay * 1000);
						
					} else {
						
						this.audio.currentTime = this.options.currentTime;
						
						this.audio.play();
						
						callback();
					}
					
				} else {
					
					this.audio.play();
					
					callback();
				}
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
			
			this.audio.addEventListener("canplaythrough", function () {
				
				if (!_this.ready) {
					
					function complete() {
						
						_this.ready = true;
						
						if (_this.options.autoPlay) {
							
							_this.play(function () { _this.options.load.apply(_this); });
							
						} else {
							
							_this.options.load.apply(_this);
						}
					}
					
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
				}
				
			}, false);
			
			this.audio.addEventListener("ended", function () {
				
				if (_this.options.loop) {
					
					_this.audio.currentTime = 0;
					
					_this.play();
				}
				
			}, false);
			
			this.audio.addEventListener("error", function () {
				
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
				
				alert(typeof ga);
				
				if (typeof ga !== "function") {
					
					ga("send", params);
				}
			}
		}
	});
	
})(jQuery);