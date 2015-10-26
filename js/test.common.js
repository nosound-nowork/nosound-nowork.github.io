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
	
	var Sound = function (options) { this.init(options); };
	
	Sound.prototype = {
		
		options: {
			loop: true,
			autoplay: true,
			currentTime: 0,
			playbackRate: 1.0,
			load: $.noop,
			error: $.noop,
		},
		
		_ready: false,
		
		audio: null,
		
		canPlayMP3: function () {
			return this.audio.canPlayType("audio/mpeg") !== "";
		},
		
		canPlayOgg: function () {
			return this.audio.canPlayType("audio/ogg") !== "";
		},
		
		extension: function () {
			
			return this.canPlayMP3() ? ".mp3" : this.canPlayOgg() ? ".ogg" : "";
		},
		
		load: function (file) {
			
			alert(file);
			
			this._ready = false;
			
			this.audio.src = file;
			
			this.audio.load();
		},
		
		play: function () {
			
			if (this._ready) {
				
				if (this.audio.currentTime === 0) {
					
					this.audio.currentTime = this.options.currentTime;
				}
				
				this.audio.playbackRate = this.options.playbackRate;
				
				this.audio.play();
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
			
			alert(window.HTMLAudioElement);
			
			if (window.HTMLAudioElement) return;
			
			$.extend(this.options, options);
			
			this.audio = new Audio();
			
			this.audio.preload = "none";
			this.audio.autoplay = false;
			
			this.audio.canplaythrough = function () {
				
				if (this.options.autoplay) this.play();
				
				this.options.load.apply(this);
			};
			
			this.audio.ended = function () {
				
				if (this.options.loop) this.play();
			};
			
			this.audio.error = function () {
				
				this.options.error.apply(this);
			};
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
				
//				ga('send', params);
			}
		}
	});
	
})(jQuery);