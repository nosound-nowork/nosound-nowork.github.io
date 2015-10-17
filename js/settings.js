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
	document.write("");
	
})();