(function ($) {
	
	window.TOUCH_EVENT = window.ontouchstart === null ? "touchend" : "click";
	
	$(function () {
		
		if (navigator.userAgent.indexOf("Android") > 0) $("div.container").addClass("android");
		
		if (navigator.userAgent.indexOf("iPhone") > 0) $("div.container").addClass("iPhone");
		
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
		
		if (typeof options !== "undefined") $.extend(this.options, options);
	};
	
	Pages.prototype = {
		
		_n: null,
		
		_c: -1,
		
		_fixed: false,
		
		options:{
			top: $.noop,
			end: $.noop
		},
		
		fixed: function (bool) {
			
			if (typeof bool === "undefined") {
				
				return this._fixed;
				
			} else {
				
				this._fixed = bool;
				
				return this;
			}
		},
		
		isTop: function () {
			
			return (this._c === 0);
		},
		
		isEnd: function () {
			
			return (this._c === (this._n.children().length - 1));
		},
		
		next: function (f) {
			
			if (this._n.children().length > this._c) this.jump(this._c + 1, f);
			
			return this;
		},
		
		prev: function (f) {
			
			if (this._c > 0) this.jump(this._c - 1, f);
			
			return this;
		},
		
		top: function (f) {
			
			this.jump(0, f);
			
			return this;
		},
		
		end: function (f) {
			
			this.jump(this._n.children().length - 1, f);
			
			return this;
		},
		
		jump: function (c, f) {
			
			if ((this._c !== c) && (this._n.children().length > c) && (c >= 0) && !this.fixed()) {
				
				var _this = this;
				
				// delay for touch event
				setTimeout(function () {
					
					if (!_this.fixed()) {
						
						_this._c = c;
						
						_this._n.children().hide().filter(":eq(" + c + ")").show();
						
						window.scrollTo(0, 0);
						
						if (_this.isTop() && $.isFunction(_this.options.top)) _this.options.top.apply(_this);
						
						if (_this.isEnd() && $.isFunction(_this.options.end)) _this.options.end.apply(_this);
						
						if ($.isFunction(f)) f.apply(_this);
					}
					
				}, 250);
			}
			
			return this;
		}
	};
	
	window.Pages = Pages;
	
})(jQuery);