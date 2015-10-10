(function ($) {
	
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