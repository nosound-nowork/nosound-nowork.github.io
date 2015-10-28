(function () {
	
	var PATH = (function () {
		
		var p = document.getElementsByTagName("script")[0].src.split("/");
		
		p.pop();
		p.pop();
		
		return p.join("/") + "/";
	})();
	
	var tags = [
		{
			"name": "link",
			"attr": {
				"rel": "stylesheet",
				"type": "text/css",
				"href": PATH + "css/common.css"
			}
		},
		{
			"name": "script",
			"attr": {
				"src": "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"
			}
		},
		{
			"name": "script",
			"attr": {
				"src": PATH + "js/common.js"
			}
		},
	];
	
	for (var i = 0; i < tags.length; i++) {
		
		var t = [tags[i].name];
		
		for (var key in tags[i].attr) {
			
			t.push(key + '="' + tags[i].attr[key] + '"');
		}
		
		document.write("<" + t.join(" ") + ">" + (tags[i].name == "script" ? "</script>" : ""));
	}
	
	/**
	 * Google Analytics
	 */
	if ((location.hash === "") && (location.hostname === "nosound-nowork.github.io")) {
		
		document.write("<!-- Google Analytics -->");
		document.write("<script>");
		document.write("  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){");
		document.write("  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),");
		document.write("  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)");
		document.write("  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');");
		document.write("  ga('create', 'UA-68962662-1', 'auto');");
		document.write("  ga('send', 'pageview');");
		document.write("</script>");
	}
	
})();