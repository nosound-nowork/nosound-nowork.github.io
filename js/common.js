(function ($) {
	
	window.TOUCH_EVENT = window.ontouchstart === null ? "touchend" : "click";
	
	$(function () {
		
		if (navigator.userAgent.indexOf('Android') > 0) $("div.container").addClass("android");
		
		if (navigator.userAgent.indexOf('iPhone') > 0) $("div.container").addClass("iPhone");
		
		if (location.hash !== "") $("div.container").addClass("admin");
		
		$("a").each(function () {
			
			var $this = $(this),
				href = $this.attr("href");
			
			if (href.indexOf("javascript:") !== 0) {
				
				$this.attr("href", href + location.hash);
			}
		});
	});
	
	var Cookie = function () { this.load(); };
	
	Cookie.prototype = {
		
		_key: "record",
		
		_path: "/",
		
		_expires: 365,
		
		_json: {
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
		},
		
		load: function () {
			
			$.cookie.json = true;
			
			var cookie = $.cookie(this._key);
			
			if ((typeof cookie !== "undefined") &&
				(typeof cookie.test1 !== "undefined") && (typeof cookie.test2 !== "undefined") &&
				(typeof cookie.test1.slow !== "undefined") && (typeof cookie.test1.fast !== "undefined") &&
				(typeof cookie.test2.off !== "undefined") && (typeof cookie.test2.on !== "undefined")) {
				
				this._json = cookie;
				
				return true;
				
			} else {
				
				return false;
			}
		},
		
		save: function () {
			
			$.cookie.json = true;
			
			$.cookie(this._key, this._json, { path: this._path, expires: this._expires });
		},
		
		remove: function () {
			
			$.cookie.json = true;
			
			$.cookie(this._key, {}, { path: this._path, expires: -1 });
		},
		
		get: function ( /* variable */ ) {
			
			var ret = this._json;
			
			for (var i in arguments) {
				
				ret = ret[arguments[i]];
			}
			
			return ret;
		},
		
		set: function (keys, value) {
			
			var json = this._json;
			
			for (var i = 0; i < keys.length; i++) {
				
				if (i === (keys.length - 1)) {
					
					json[keys[i]] = value;
					
				} else {
					
					json = json[keys[i]];
				}
			}
		}
	};
	
	window.Cookie = Cookie;
	
	var Pages = function (node, options) {
		
		this._n = $(node);
		
		if (typeof options !== "undefined") $.extend(this.settings, options);
	};
	
	Pages.prototype = {
		
		_n: null,
		
		_c: -1,
		
		settings:{
			onTop: $.noop,
			onEnd: $.noop
		},
		
		next: function (f) {
			
			if (this._n.children().length > this._c) this.jump(this._c + 1, f);
			
			return this;
		},
		
		prev: function (f) {
			
			if (this._c > 0) this.jump(this._c - 1, f);
			
			return this;
		},
		
		top: function () {
			
			this.jump(0, this.settings.onTop);
			
			return this;
		},
		
		end: function () {
			
			this.jump(this._n.children().length - 1, this.settings.onEnd);
			
			return this;
		},
		
		jump: function (c, f) {
			
			if ((this._c !== c) && (this._n.children().length > c) && (c >= 0)) {
				
				var _this = this;
				
				// delay for touch event
				setTimeout(function () {
					
					_this._c = c;
					
					_this._n.children().hide().filter(":eq(" + c + ")").show();
					
					window.scrollTo(0, 0);
					
					if ($.isFunction(f)) f.apply(_this);
					
				}, 250);
			}
			
			return this;
		}
	};
	
	window.Pages = Pages;
	
})(jQuery);