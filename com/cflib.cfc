component displayname="cflib" output="false" {
	public any function init() {
		variables.navigation = buildnavigation();
		variables.search = buildsearch();
		variables.rundate = "#dateformat(now(),'yyyy-mm-dd')# #timeformat(now(),'HH:mm:ss')#";
		return this;
	}
	
	public string function getrundate() {
		return variables.rundate;
	}
	
	public query function getsearch() {
		return variables.search;
	}
	
	public any function getnavigation() {
		return variables.navigation;
	}
		
	remote any function buildnavigation() {
		cfnav = arraynew(1);
		
		req = new http();
		req.setmethod("get");
		req.seturl("http://www.cflib.org/api/api.cfc");
		req.addparam(type="url",name="method",value="getlibraries");
		req.addparam(type="url",name="returnformat",value="json");
		result = req.send().getprefix();
		
		libs = deserializejson(result.filecontent).data;
		
		for(i=1;i<=arraylen(libs);i++) {
				ldescription = getlibrarydescription(libs[i][2]);
				navparent = {
				"title" = libs[i][2],
				"text"  = libs[i][2],
				"id"    = "cflib_lib_" & libs[i][1],
				"cls"	= "list-item",
				"iconCls"="no-icon",
				"leaf"  = false,
				"target"= "cflib_lib_" & libs[i][1],
				"description" = ldescription,
				"type" = "library",
				"qtip" = ldescription
			};	
					
			req = new http();
			req.setmethod("get");
			req.seturl("http://www.cflib.org/api/api.cfc");
			req.addparam(type="url",name="method",value="getudfs");
			req.addparam(type="url",name="returnformat",value="json");
			req.addparam(type="url",name="libraryid",value="#libs[i][1]#");
			result = req.send().getprefix();
			
			udfs = deserializejson(result.filecontent).data;
			
			children = arraynew(1);
			for(x=1;x<=arraylen(udfs);x++) {
				navchild = {
					"title" = udfs[x][2],
					"text"  = udfs[x][2],
					"id"    = "cflib_udf_" & udfs[x][1],
					"cls"	= "list-item",
					"iconCls"="no-icon",
					"leaf"  = true,
					"target"= "cflib_udf_" & udfs[x][1],
					"description" = udfs[x][3],
					"type" = "udf",
					"qtip" = udfs[x][3]
				};
				arrayappend(children,navchild);
			}	
			navparent["children"] = children;
			arrayappend(cfnav,navparent);		
		}
		return cfnav;
	}
	
	public query function buildsearch() {
		res = querynew("summary,title,target,type","varchar,varchar,varchar,varchar");
		for(i=1;i<=arraylen(variables.navigation);i++) {
			children = variables.navigation[i].children;
			for(x=1;x<=arraylen(children);x++) {
				queryaddrow(res);
				querysetcell(res,"summary",children[x].description);
				querysetcell(res,"title",children[x].title);
				querysetcell(res,"target",children[x].target);
				querysetcell(res,"type",children[x].type);
			}
		}
		return res;
	}
	
	public string function getlibrarydescription(required string lib) {
		switch(lib) {
			case "CFMLLib":
				description = "A library that mimics CFML tags.";
				break;
			case "DatabaseLib":
				description = "A library containing database specific functions (written in CFML).";
				break;
			case "DataManipulationLib":
				description = "A set of functions that work with data. For example, converting a query to a structure.";
				break;
			case "DateLib":
				description = "A library of date/time related functions.";
				break;
			case "FileSysLib":
				description = "A set of functions that interact with the file system at various levels (drive, directory, file).";
				break;
			case "FinancialLib":
				description = "A library devoted to financial (monetary) based functions.";
				break;
			case "MathLib":
				description = "A set of mathematical functions. This includes geometry, trig, statistical, and general math functions.";
				break;
			case "NetLib":
				description = "A library for Internet related UDFs.";
				break;
			case "ScienceLib":
				description = "A set of UDFs dedicated to scientific equations.";
				break;
			case "SecurityLib":
				description = "A set of security related functions.";
				break;
			case "StrLib":
				description = "A set of string functions. This includes HTML stripping and other string manipulating functions.";
				break;
			case "UtilityLib":
				description = "A set of utility functions for dealing with miscellaneous tasks.";
				break;
		};
		return description;
	} 
	
	remote any function getlibrary(required string target,required string title) {
		arguments.target = replace(arguments.target,"cflib_lib_","","all");
		
		req = new http();
		req.setmethod("get");
		req.seturl("http://www.cflib.org/api/api.cfc");
		req.addparam(type="url",name="method",value="getudfs");
		req.addparam(type="url",name="returnformat",value="json");
		req.addparam(type="url",name="libraryid",value="#arguments.target#");
		result = req.send().getprefix();
		
		udfs = deserializejson(result.filecontent).data;
		libdescription  = getlibrarydescription(arguments.title);
		
		content = "<table id='page_content_table'><tbody><tr><td><div id='content_wrapper'>";
		content = content & "<h1>" & arguments.title & "</h1>";
		content = content & "<div><p>" & libdescription & "</p>";
		content = content & "<ul class='navlinklis'>";
		for(i=1;i<=arraylen(udfs);i++) {
			content = content & "<li>";
			content = content & '<a class="glosslink" href="javascript:void(0);" linktitle="' & udfs[i][2] & '" title="' & udfs[i][3] & '" linktype="udf" linktarget="cflib_udf_' & udfs[i][1] & '">' & udfs[i][2] & '</a>';
			content = content & "</li>";
		}
		content = content & "</ul></div></td></tr></table>";
		content = content & "<br /><br /><a href=http://cflib.org/library/" & arguments.title & " target='_blank'>View this library at cflib.org</a>";
		
		return {"content"=content};	         
	}
	
	remote any function getudf(required string target,required string title) {
		arguments.target = replace(arguments.target,"cflib_udf_","","all");
			
		req = new http();
		req.setmethod("get");
		req.seturl("http://www.cflib.org/api/api.cfc");
		req.addparam(type="url",name="method",value="getudf");
		req.addparam(type="url",name="returnformat",value="json");
		req.addparam(type="url",name="udfid",value="#arguments.target#");
		result = req.send().getprefix();
		
		udf = deserializejson(result.filecontent);
		content = "<table id='page_content_table'><tbody><tr><td><div id='content_wrapper'>";
		content = content & "<h1>" & arguments.title & "</h1>";
		content = content & "<div><p>" & udf.shortdescription & "</p></div>";
		content = content & "<div class='section'><h4>The Code</h4><div class='para'><pre>";
		content = content & xmlformat(udf.code);
		content = content & "</pre></div></div></div></td></tr></table>";
		content = content & "<br /><br /><a href=http://cflib.org/udf/" & arguments.title & " target='_blank'>View this UDF at cflib.org</a>";

		return {"content"=content,"title"=arguments.title,"target"=arguments.target};	  
	}
}