(function ($) {
	
	window.TOUCH_EVENT = window.ontouchstart === null ? "touchend" : "click";
	
	$(function () {
		
		if (navigator.userAgent.indexOf('Android') > 0) $("div.container").addClass("android");
		
		if (navigator.userAgent.indexOf('iPhone') > 0) $("div.container").addClass("iPhone");
		
		if (location.hash !== "") $("div.container").addClass("admin");
		
		$("a").each(function () {
			
			var $this = $(this),
				href = $this.attr("href");
			
			if (href.indexOf("javascript") !== 0) {
				
				$this.attr("href", href + location.hash);
			}
		});
		
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		if ($("div.container").hasClass("admin")) {
			var test1 = "Quick Touch",
				test2 = "Rapid Answer";
			if ($("img.logo").length > 0) {
				$("ol.buttons:eq(0) > li > a:eq(0)").text(test1);
				$("ol.buttons:eq(0) > li > a:eq(1)").text(test2);
			}
			if ($("#sound_off").length > 0) {
				$("h1 > span.title").text(test1);
			}
			if ($("#sound_slow").length > 0) {
				$("h1 > span.title").text(test2);
			}
			if ($("span.caution").length > 0) {
				$("h1:eq(0)").text(test1);
				$("h1:eq(1)").text(test2);
			}
			if ($("#test1_off").length > 0) {
				$("h1:eq(0)").text(test1);
				$("h1:eq(1)").text(test2);
			}
		}
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	});
	
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