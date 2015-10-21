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
		next: function () {
			if (this._n.children().length > this._c) this.jump(this._c + 1);
			return this;
		},
		prev: function () {
			if (this._c > 0) this.jump(this._c - 1);
			return this;
		},
		top: function () {
			this.jump(0);
			return this;
		},
		end: function () {
			this.jump(this._n.children().length - 1);
			return this;
		},
		jump: function (c) {
			if ((this._n.children().length > c) && (c >= 0)) {
				var _this = this;
				setTimeout(function () {
					_this._c = c;
					_this._n.children().hide().filter(":eq(" + c + ")").show();
					window.scrollTo(0, 0);
					if (c == 0) _this._tf.apply(_this);
					if (c == (_this._n.children().length - 1)) _this._ef.apply(_this);
				}, 100);
			}
			return this;
		}
	};
	
	window.Pages = Pages;
	
})(jQuery);