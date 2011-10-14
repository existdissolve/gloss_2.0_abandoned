component displayname="Custom Content" {
	remote any function loadcustompage(required string target, required string title, required string content) {
		// turn this into a coldfusion object so it's a bit easier to work with
		str = deserializejson(arguments.content);
		cstrheader = "<table id='page_content_table'><tbody><tr><td><div id='content_wrapper'>";
		cstrfooter = "</div></td></tr></table>";
		// title
		cstr =  "<h1>#str.title#</h1>";	
		// description
		cstr = cstr &  "<div class='section'><h4 class='sectiontitle'>Description</h4><p>#str.description#</p></div>";	
		if(str.syntax != "") {
			cstr = cstr &  "<div class='section'><h4 class='sectiontitle'>Syntax</h4><pre>#str.syntax#</pre></div>";
		}
		// attributes
		params = deserializejson(str.params);
		if(arraylen(params)) {
			cstr = cstr &  "<div class='section'><h4 class='sectiontitle'>Attributes</h4><div class='tablenoborder'><table border='1' cellpadding='4' cellspacing='4'>";
			cstr = cstr &  "<thead align='left'><tr><th valign='top'>Attribute</th><th valign='top'>Req/Opt</th><th valign='top'>Default</th><th valign='top'>Description</th></tr></thead>";
			for(i=1;i<=arraylen(params);i++) {
				cstr = cstr &  "<tr><td valign='top'><p><samp class='codeph'>#params[i].title#</samp></p></td><td valign='top'><p>#yesnoformat(params[i].required)#</p></td><td valign='top'><p>#params[i].defaultvalue#</p></td><td valign='top'><p>#params[i].description#</p></td></tr>";
			}
			cstr = cstr &  "</table></div></div>";
		}
		// usage
		if(str.usage != "") {
			cstr = cstr &  "<div class='section'><h4 class='sectiontitle'>Usage</h4><p>#str.usage#</p></div>";
		}
		// example
		if(str.example != "") {
			cstr = cstr &  "<div class='section'><h4 class='sectiontitle'>Example</h4><pre>#str.example#</pre></div>";
		}
		return {"content"=cstrheader & cstr & cstrfooter};
	}
}