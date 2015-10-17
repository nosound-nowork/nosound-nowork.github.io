(function ($) {
	
	$(function () {
		
		if (navigator.userAgent.indexOf('Android') > 0 ) $("div.container").addClass("android");
		
		if (navigator.userAgent.indexOf('iPhone') > 0 ) $("div.container").addClass("iPhone");
	});
	
})(jQuery);