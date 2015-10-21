(function ($) {
	
	window.TOUCH_EVENT = window.ontouchstart === null ? "touchend" : "click";
	
	$(function () {
		
		if (navigator.userAgent.indexOf('Android') > 0 ) $("div.container").addClass("android");
		
		if (navigator.userAgent.indexOf('iPhone') > 0 ) $("div.container").addClass("iPhone");
	});
	
	var Pages = function (node) {
		this._n = $(node);
	};
	
	Pages.prototype = {
		_n: null,
		_c: 0,
		_tf: $.noop,
		_ef: $.noop,
		onTop: function (f) {
			if ($.isFunction(f)) this._tf = f;
			return this;
		},
		onEnd: function (f) {
			if ($.isFunction(f)) this._ef = f;
			return this;
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
			if ((this._n.children().length > c) && (c >= 0)) {
				var _this = this;
				setTimeout(function () {
					_this._c = c;
					_this._n.children().hide().filter(":eq(" + c + ")").show();
					window.scrollTo(0, 0);
					if (c == 0) _this._tf.apply(_this);
					if (c == (_this._n.children().length - 1)) _this._ef.apply(_this);
					if ($.isFunction(f)) f.apply(_this);
				}, 100);
			}
			return this;
		}
	};
	
	window.Pages = Pages;
	
})(jQuery);