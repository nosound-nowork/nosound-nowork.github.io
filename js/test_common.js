(function ($) {
	
	var Pages = function (node) {
		this._n = $(node);
		this.top();
	};
	
	Pages.prototype = {
		_n: null,
		_c: 0,
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
				this._c = c;
				this._n.children().hide().filter(":eq(" + c + ")").show();
			}
			return this;
		}
	};
	
	window.Pages = Pages;
	
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
	
})(jQuery);