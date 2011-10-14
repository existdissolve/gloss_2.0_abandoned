<cfcomponent displayname="navigation" hint="handles navigation for gloss" output="false">
	<cffunction name="init" access="public" returntype="any">
		<cfscript>
			variables.tocbase = "http://help.adobe.com/en_US/ColdFusion/9.0/";
			variables.tocfile = "/toc.js";
			cfmlref = createtoc(type="CFMLRef");
			variables.cfmlref_toc = cfmlref.structure;
			variables.search = buildsearch(variables.cfmlref_toc);
			variables.cfmlref_tree= cfmlref.tree;
			return this;
		</cfscript>
	</cffunction>
	
	<cffunction name="createtoc" access="private" returntype="struct" hint="creates navigation structure">
		<cfargument name="type" required="true" type="string" default="cfmlref">
		<cfset propertype = getpropertype(arguments.type)>
		<cfhttp url="http://help.adobe.com/en_US/ColdFusion/9.0/#propertype#/toc.js" result="docs">
		<cfset toc = rematch('(var dataObjWS.*?\);)',docs.tostring())>
		<cfset links = structnew()>
		<cfset tree = querynew("key,href,parent,title,target")>
		<cfset navigation = structnew()>
		<cfloop from="1" to="#arraylen(toc)#" index="i">
			<cfset key = replace(rematch('var WS.*?html',toc[i])[1],"var ","","all")>
			<cfset href = ''>
			<cfset titlematch 	= '(?:label: ")(.*?)(?=",)'>
			<cfset hrefmatch 	= '(?:href:")(.*?)(?=")'>
			<cfset pathmatch	= '(?:html, )(.*?)(?=, false)'>
		
			<cfset links[key] = key>
			<cfset parent	= replace(rematch(pathmatch,toc[i])[1],'html, ','','all')>
			<cfset title	= replace(rematch(titlematch,toc[i])[1],'label: "','','all')>
			<cfset href		= "http://help.adobe.com/en_US/ColdFusion/9.0/#propertype#/"&replace(rematch(hrefmatch,toc[i])[1],'href:"','','all')>
			<cfset links[key] = {"title"=trim(title),"href"=trim(href),"parent"=trim(parent),"key"=trim(key)}> 
			
			<cfscript>
				queryaddrow(tree,1);
				querysetcell(tree,"key",key);
				querysetcell(tree,"parent",replace(rematch(pathmatch,toc[i])[1],'html, ','','all'));
				querysetcell(tree,"href","http://help.adobe.com/en_US/ColdFusion/9.0/#propertype#/"&replace(rematch(hrefmatch,toc[i])[1],'href:"','','all'));
				querysetcell(tree,"title",replace(rematch(titlematch,toc[i])[1],'label: "','','all'));
				querysetcell(tree,"target",replace(rematch(hrefmatch,toc[i])[1],'href:"','','all'));
			</cfscript>
		</cfloop>
		<cfset navigation.structure = links>
		<cfset navigation.tree = tree>
		<cfreturn navigation>
	</cffunction>
	
	<cffunction name="buildsearch" access="private" returntype="query" hint="creates a query-able search query from nav toc">
		<cfargument name="toc" required="true" type="struct">
		<cfset local.results = querynew("summary,title,target,type","varchar,varchar,varchar,varchar")>
        <cfloop collection="#arguments.toc#" item="key">
            <cfset queryaddrow(local.results)>
            <cfset querysetcell(local.results,"title",arguments.toc[key].title)>
            <cfset querysetcell(local.results,"target",replacenocase(arguments.toc[key].href,'http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/','','all'))>
            <cfset querysetcell(local.results,"type","cfmlref")>
            <cfset querysetcell(local.results,"summary",arguments.toc[key].title)>
        </cfloop>
        <cfreturn local.results>
	</cffunction>
	
	<cffunction name="gettoc" access="public" returntype="struct" hint="returns navigation structure">
		<cfargument name="type" required="true" type="string">
		<cfreturn variables[arguments.type & "_toc"]>
	</cffunction>
	
	<cffunction name="getsearch" access="public" returntype="query" hint="returns search query">
        <cfreturn variables.search>
    </cffunction>
	
	<cffunction name="gettree" access="public" returntype="query" hint="returns tree-based navigation">
		<cfargument name="type" required="true" type="string">
		<cfreturn variables[arguments.type & "_tree"]>
	</cffunction>
	
	<cffunction name="buildnavigation" access="remote" returntype="any">
		<cfargument name="tree" type="query" required="true">
		<cfargument name="selector" type="string" required="true" default="root">
		<cfargument name="type" type="string" required="true">
		<cfset var links = "">
		<cfset var qlevel= "">
		
		<cfquery name="qlevel" dbtype="query">
			select	*
			from	arguments.tree
			where	parent = '#arguments.selector#'
		</cfquery>
		
		<cfset links = arraynew(1)>	
		<cfloop query="qlevel">
			<cfset sublinks = buildnavigation(selector=key,tree=tree,type=lcase(arguments.type))>
			<cfset tmptitle = replace(title,'\','',"all")>
			<cfset links[currentrow] = structnew()>
			<cfset links[currentrow]["title"] = tmptitle>
			<cfset links[currentrow]["text"] = tmptitle>
			<cfset links[currentrow]["id"] = key>
			<cfset links[currentrow]["cls"] = "list-item">
			<cfset links[currentrow]["iconCls"] = "no-icon">
			<cfset links[currentrow]["leaf"] = arraylen(sublinks) ? false : true>
			<cfset links[currentrow]["target"] = target>
			<cfset links[currentrow]["type"] = lcase(arguments.type)>
			<cfset links[currentrow]["description"] =  tmptitle>
			<cfset links[currentrow]["qtip"] =  tmptitle>
			<!---<cfset links[currentrow]["href"] = href>--->
			
			<cfif arraylen(sublinks)>
				<cfset links[currentrow]["children"] = sublinks>
			</cfif>
		</cfloop>
		<cfreturn links>
	</cffunction>
	
	<cffunction name="loadPage" access="remote" returntype="any" returnformat="json">
		<cfargument name="target" required="yes" type="string">
		<cfargument name="title" required="yes" type="string" default="">
		<cfargument name="type" required="true" type="string">
		<cfset redirect = "">
		<cfset propertype = getpropertype(arguments.type)>
		<cfset lastresort = false>
		<!---if we have a hash tag in the target, we know it's coming from our app...so we can trust that link exists and just parse it out--->
		<cfif arguments.target contains "##">
			<cfset redirect = rereplacenocase(arguments.target,'(.*.html)(##.*)','\2','all')>
			<cfset arguments.target = rereplacenocase(arguments.target,'(.*.html)(##.*)','\1','all')>
		<cfelse>
			<!---check to make sure target is in the authoritative navigation; if it isn't, it's going to be an obsolete page and will break stuff--->
			<!----<cfset matchedhref = structfindvalue(application.toc.getTOC(),arguments.target,"all")>--->
			<cfset nav = application.navigation.gettoc(arguments.type)>
			<!---<cfset matchedhref = structfindvalue(nav,trim(arguments.target),"all")>--->
			<cfset matchedhref = restructfindvaluenocase(top=application.navigation.gettoc(arguments.type),reg_expression=arguments.target,scope="all",path="href")>
			<cfif not arraylen(matchedhref) and target neq "index.html">
				<cfset end = len(arguments.target)-5>
				<cfset trimmed = mid(arguments.target,findnocase('WS',arguments.target),end)>
				<cfset redirect = replace(trimmed,'.html','','all')>
				<cfif arguments.title contains ' functions'>
					<cfset arguments.target = 'WSc3ff6d0ea77859461172e0811cbec1a60c-7ffc.html'>
				<cfelseif arguments.title contains ' tags'>
					<cfset arguments.target = 'WSc3ff6d0ea77859461172e0811cbec17576-7ffc.html'>
				<cfelseif arguments.title contains '::'>
					<cfset arguments.target = 'WSc3ff6d0ea77859461172e0811cbec22c24-5eac.html'>
				<cfelse>
					<!---if we can't find the url, hit up remote server--->
					<cfhttp url="http://help.adobe.com/en_US/ColdFusion/9.0/#propertype#/#arguments.target#" result="result" resolveurl="yes" redirect="yes" />
					<!---check to make sure a faux-redirect page hasn't been returned--->
					<cfset match = rematch('<meta http-equiv="refresh" content="0;url=([0-9a-zA-Z-.##]*)" />',result.filecontent)>
					<!---if there's a match, we need to strip out the redirect link and re-run the http call--->
					<cfif arraylen(match)>
						<!---this will get the reference to the parent--->
						<cfset arguments.target = rereplacenocase(match[1],'<meta http-equiv="refresh" content="0;url=([0-9a-zA-Z-.##]*)" />','\1','all')>
					</cfif>
					<cfif result.statuscode eq '200 OK'>
					   <!---now that we have the remote page, go ahead and write it to file so that we have it for later--->
					   <cfset writer = createobject("component","future")>
					   <cfset writer.compilepage(title=arguments.title,target=arguments.target,type=arguments.type)>
					</cfif>
				</cfif>
			</cfif>
		</cfif>
		
		<!---by this point, we've done a few things to make sure that there's a local file to retrieve. let's make sure, though, that it's there--->
		<cfif fileexists('#application.basepath#content/#arguments.target#')>
			<!---if it's there, go ahead and get it. we'll be done loading the page, and can simply return contet--->
			<cfhttp url="#application.urlpath##arguments.target#" result="result" resolveurl="no" redirect="yes" />
		<cfelse>
			<!---if it's not there, let's try to get it again from the remote server and write it to file--->
			<cfhttp url="http://help.adobe.com/en_US/ColdFusion/9.0/#arguments.type#/#arguments.target#" result="result" resolveurl="yes" redirect="yes" timeout="3" />
			<!---check to make sure a faux-redirect page hasn't been returned--->
			<cfset match = rematch('<meta http-equiv="refresh" content="0;url=([0-9a-zA-Z-.##]*)" />',result.filecontent)>
			<!---if there's a match, we need to strip out the redirect link and re-run the http call--->
			<cfif arraylen(match)>
				<!---this will get the reference to the parent--->
				<cfset arguments.target = rereplacenocase(match[1],'<meta http-equiv="refresh" content="0;url=([0-9a-zA-Z-.##]*)" />','\1','all')>
			</cfif>
			<!---now that we have the remote page, go ahead and write it to file so that we have it for later--->
			<cfif result.statuscode eq '200 OK'>
                <cfset writer = createobject("component","future")>
                <cfset writer.compilepage(title=arguments.title,target=arguments.target,type=arguments.type,reference=arguments.type)>
			</cfif>
			<!---now, check more time that the file exists and load it--->
			<cfif fileexists('#application.basepath#content/#arguments.target#')>
				<cfhttp url="#application.urlpath##arguments.target#" result="result" resolveurl="no" redirect="yes" timeout="3" />
			</cfif>
		</cfif>
		<cfscript>		
			content = trim(result.filecontent);
			return {"content"=content,"title"=arguments.title,"target"=arguments.target,"redirect"=redirect};
		</cfscript>
	</cffunction>
	
	<cffunction name="delegate" access="public">
		<cfargument name="target" required="yes" type="string">
		<cfargument name="title" required="yes" type="string" default="">
		<cfargument name="type" required="true" type="string">
		<cfset me = application.navigation.loadpage(target=arguments.target,title=arguments.title,type=arguments.type)>
	</cffunction>
	
	<cffunction name="getPage" access="remote" returntype="any">
		<cfargument name="target" required="yes" type="string">
		<cfargument name="title" required="yes" type="string" default="">
		<cfargument name="type" required="true" type="string">
		<cfset redirect = "">
		<cfset propertype = getpropertype(arguments.type)>
		<!---check to make sure target is in the authoritative navigation; if it isn't, it's going to be an obsolete page and will break stuff--->
		<cfset matchedhref = structfindvalue(gettoc(type=arguments.type),arguments.title,"all")>
		<cfif not arraylen(matchedhref)>
			<cfset end = len(arguments.target)-5>
			<cfset trimmed = mid(arguments.target,findnocase('WS',arguments.target),end)>
			<cfset redirect = replace(trimmed,'.html','','all')>
			<cfif arguments.title contains ' functions'>
				<cfset arguments.target = 'WSc3ff6d0ea77859461172e0811cbec1a60c-7ffc.html##'&redirect>
			<cfelseif arguments.title contains ' tags'>
				<cfset arguments.target = 'WSc3ff6d0ea77859461172e0811cbec17576-7ffc.html##'&redirect>
			<cfelseif arguments.title contains '::'>
				<cfset arguments.target = 'WSc3ff6d0ea77859461172e0811cbec22c24-5eac.html##'&redirect>
			</cfif>
		</cfif>
		<cfhttp url="#arguments.target#" result="result" resolveurl="yes" redirect="yes" />
		<!---check to make sure a faux-redirect page hasn't been returned--->
		<cfset match = rematch('<meta http-equiv="refresh" content="0;url=([0-9a-zA-Z-.##]*)" />',result.filecontent)>
		<!---if there's a match, we need to strip out the redirect link and re-run the http call--->
		<cfif arraylen(match)>
			<cfset newurl = rereplacenocase(match[1],'<meta http-equiv="refresh" content="0;url=([0-9a-zA-Z-.##]*)" />','\1','all')>
			<cfset newurl = "http://help.adobe.com/en_US/ColdFusion/9.0/#arguments.reference#/"&newurl>
			<cfhttp url="#newurl#" result="result" resolveurl="yes" redirect="yes" />
		</cfif>
		<cfscript>		
			content = trim(result.filecontent);
			// remove adobe top bar
			content = rereplacenocase(content,'(<div id="mnemonic">(.*?)</div>)','',"all");
			// remove adobe search bar
			content = rereplacenocase(content,'(<div id="searchbar">(.*?)</div>)','',"all");
			// remove search form
			content = rereplacenocase(content,'(<form id="search"(.*?)</form>)','',"all");
			// remove hierarchy
			content = rereplacenocase(content,'(<div class="hierarchy"(.*?)</div>)','',"all");
			// remove breadcrumb
			content = rereplacenocase(content,'(<div id="breadcrumb")>(.*?)</div>','',"all");
			// remove the dump "navigation" buttons
			content = rereplacenocase(content,'<ul class="navigation">.*?</ul>','','all');
			// try to remove logo column
			content = rereplacenocase(content,'<td id="col3">(.*?)</td>','','all');
			// remove adobe logo
			content = rereplacenocase(content,'(<img src="http://help.adobe(.com|.com:80)/en_US/ColdFusion/9.0/CFMLRef/images/adobe-lq.png" />)','','all');
			// remove stupid and worthless 'home' link
			content = rereplacenocase(content,'<a href="http://help.adobe(.com|.com:80)/en_US/ColdFusion/9.0/CFMLRef/WSf01dbd23413dda0e50e0885e12057559231-8000.html"><b>Home</b></a> / ','',"all");
			// remove stupid and worthless 'reference' link
			content = rereplacenocase(content,'<a href="http://help.adobe(.com|.com:80)/en_US/ColdFusion/9.0/CFMLRef/WSf01dbd23413dda0e50e0885e12057559231-8000.html"><b>ColdFusion.*?Reference</b></a> / ','','all');
			// remove other version of refrence link
			content = rereplacenocase(content,'<a href="http://help.adobe(.com|.com:80)/en_US/ColdFusion/9.0/CFMLRef/WSf01dbd23413dda0e50e0885e12057559231-8000.html"><b>ColdFusion.*?Reference</b></a>','','all');			
			// match on regular documentation links; replace href with onlick event so we can intercept page navigation
			content = rereplacenocase(content,'<a href="(http://help.adobe(.com|.com:80)/en_US/ColdFusion/9.0/(CFMLRef)/)([0-9a-zA-Z-]*\.html)">([0-9a-zA-Z,\-+: \n\r\.]*)</a>','<a class="glosslink" href="javascript:void(0);" linktitle="\5" linktarget="\4" linktype="\L\3\E">\5</a>','all');
			// match on links to other coldfusion references ... removing everything but cfmlref for right now  -- |Developing|Admin|Installing
			content = rereplacenocase(content,'<a href="(http://help.adobe(.com|.com:80)/en_US/ColdFusion/9.0/(CFMLRef)/)([0-9a-zA-Z-]*\.html)" target="_self">([0-9a-zA-Z,\-+: \n\r\.]*)</a>','<a class="glosslink" href="javascript:void(0);" linktitle="\5" linktarget="\4" linktype="\L\3\E">\5</a>','all');
			
			
			
			// match on breadcrumb navigation links; replace href with onclick event so we can intercept page navigation
			content = rereplacenocase(content,'<a href="(http://help.adobe(.com|.com:80)/en_US/ColdFusion/9.0/#propertype#/)([0-9a-zA-Z-]*\.html)">(<b>)([a-zA-Z0-9,\-+: \n\r\.]*)(</b>)</a>','<a class="glosslink" href="javascript:void(0);" linktitle="\5" linktarget="3" linktype="#arguments.type#">\4\5\6</a>','all');
			
			// get rid of unneeded script tags
			content = rereplacenocase(content,'<\s*script.*?>(.*?)<\/\s*?script[^>\w]*?>','','all');
			// get rid of unneeded style tags
			content = rereplacenocase(content,'<\s*style.*?>(.*?)<\/\s*?style[^>\w]*?>','','all');
			// get rid of html comments
			content = rereplacenocase(content,'<!(--.*?--)?>|<!(--.*?--)>','','all');
			// remove unnecessary whitespace
			content = htmlremovewhitespace(input=content);
			// strip internal page links of the protocol and target, and just leave the # and link
			content = rereplacenocase(content,'(href=")(http://help.adobe(.com|.com:80)/en_US/ColdFusion/9.0/#propertype#/)(.*?)(")','href="\4"',"all");
			// for external links, push targer to _blank so the current app isn't redirected
			content = rereplacenocase(content,'target="_self"','target="_blank"','all');
			// swap out any port 80 urls with the real mccoy
			content = rereplacenocase(content,':80','','all');
			// strip css files
			content = rereplacenocase(content,'<link rel="stylesheet" type="text/css" href=".*\.css" />','','all');
			// add bookmark icon to content
			//content = rereplacenocase(content,'(<h1>)(.*)(</h1>)','\1\2<a href="javascript:void(0)" onclick="bookmark()" class="bookmark" title="Bookmark this page!"></a><a href="javascript:void(0)" onclick="getNote()" class="note-icon" title="Leave a note for this page"></a>\3','all');
			// return our cleaned up and re-appropriated content :)
			return {"content"=content,"title"=arguments.title,"target"=arguments.target,"redirect"=redirect};
		</cfscript>
	</cffunction>
	
	<cffunction name="htmlRemoveWhiteSpace" returntype="string" output="no" hint="A simple function to remove white space from HTML (Except for <pre> tags)">
		<cfargument name="input" type="string" required="yes" />
		<cfargument name="remcoms" type="boolean" required="no" default="false" />
		<cfset var locvar = StructNew() />
		<cfset locvar.str = arguments.input />
		<cfif Len(locvar.str) gt 0>
		  <cftry>
			 <cfif FindNoCase("<pre>", locvar.str) gt 0>
				<cfset locvar.newstr = "" />
				<cfset locvar.pos = 1 />
				<cfset locvar.is_done = false />
				<cfloop condition="NOT locvar.is_done">
				   <cfset subex = REFind('(?i)<pre[^>]*>(.+?)</pre>', locvar.str, locvar.pos, true)>
				   <cfif subex.len[1] eq 0>
					  <cfset locvar.is_done = true />
				   <cfelse>
					  <cfset locvar.html_str = ReReplace(Mid(locvar.str, locvar.pos, subex.pos[1] - locvar.pos), '[\r\n\t]+', ' ', 'ALL') />
					  <cfif arguments.remcoms>
						 <!--- replace all the comments --->
						 <cfset locvar.html_str = ReReplace(locvar.html_str, '<!--.*?-->', '', 'ALL') />
						 <cfset locvar.html_str = ReReplace(locvar.html_str, '/\*.*?\*/', '', 'ALL') />
					  </cfif>
					  <cfset locvar.pre = Mid(locvar.str, subex.pos[1], subex.len[1]) />
					  <cfset locvar.newstr = locvar.newstr & locvar.html_str & locvar.pre />
					  <cfset locvar.pos = subex.pos[1] + subex.len[1] />
				   </cfif>
				</cfloop>
				<cfset locvar.newstr = locvar.newstr & ReReplace(Right(locvar.str, Len(locvar.str) - locvar.pos + 1),"[\r\n\t]+"," ","ALL") />
				<cfset locvar.str = locvar.newstr />
			 <cfelse>
				<cfset locvar.str = ReReplace(locvar.str,"[\r\n\t]+"," ","ALL") />
				<cfif arguments.remcoms>
				   <!--- replace all the comments --->
				   <cfset locvar.str = ReReplace(locvar.str, '<!--.*?-->', '', 'ALL') />
				   <cfset locvar.str = ReReplace(locvar.str, '/\*.*?\*/', '', 'ALL') />
				</cfif>
			 </cfif>
			 <cfcatch type="any">
				<cfset locvar.str = cfcatch.message />
			 </cfcatch>
		  </cftry>
		</cfif>
		<cfreturn locvar.str />
	</cffunction>
	
	<cffunction name="getpropertype" access="public" returntype="string" output="false" hint="gets properly capitalized reference name">
		<cfargument name="type" type="string" required="true">
		<cfset local.propertype = "">
		<cfswitch expression="#arguments.type#">
			<cfcase value="cfmlref">
				<cfset local.propertype = "CFMLRef">
			</cfcase>
			<cfcase value="developing">
				<cfset local.propertype = "Developing">
			</cfcase>
			<cfcase value="admin">
				<cfset local.propertype = "Admin">
			</cfcase>
			<cfcase value="installing">
				<cfset local.propertype = "Installing"> 
			</cfcase>
		</cfswitch>
		<cfreturn local.propertype>
	</cffunction>
	<!---
	 Searches recursively through a substructure of nested arrays, structures, and other elements for structures with values that match the search .pattern in the reg_expression parameter.
	 
	 @param top      Top level structure to search. (Required)
	 @param reg_expression      Regular expression used for search. (Required)
	 @param scope      Scope to use for search. If one, finds the first result, otherwise returns all results. Defaults to one. (Optional)
	 @param owner      Pointer to item searched. Normally not passed. Defaults to top. (Optional)
	 @param path      Path to search for within the data. Again, normally not passed. (Optional)
	 @param results      Carries the results value and used recursively.  (Optional)
	 @return Returns an array. 
	 @author Nathan Mische (nmische@gmail.com) 
	 @version 0, July 12, 2009 
	--->
	<cffunction name="REStructFindValueNoCase" returntype="array" output="false">
	    <cfargument name="top" type="any" required="true">
	    <cfargument name="reg_expression" type="string" required="true">
	    <cfargument name="scope" type="string" required="false">
	    <cfargument name="owner" type="any" required="false">
	    <cfargument name="path" type="string" required="false">
	    <cfargument name="results" type="any" required="false">
	    
	    <cfset var key = "">
	    <cfset var i = "">
	    <cfset var result="">    
	    
	    <!--- set default values --->
	    <cfif not StructKeyExists(arguments,"scope")>
	        <cfset arguments.scope = "one">
	    </cfif>
	    
	    <cfif not StructKeyExists(arguments,"owner")>
	        <cfset arguments.owner = arguments.top>
	    </cfif>
	    
	    <cfif not StructKeyExists(arguments,"path")>
	        <cfset arguments.path = "">
	    </cfif>
	    
	    <cfif not StructKeyExists(arguments,"results")>
	        <cfset arguments.results = CreateObject("java","java.util.ArrayList").init()>
	    </cfif>
	    
	    <!--- exit if scope is "one" and we have a result --->
	    <cfif CompareNoCase(arguments.scope,"one") eq 0
	        and ArrayLen(arguments.results) eq 1>
	                
	        <cfreturn arguments.results>
	        
	    </cfif>
	        
	    <!--- recurse or do test depending on type --->
	    <cfif IsStruct(arguments.top)>    
	    
	        <cfloop collection="#arguments.top#" item="key">    
	            <cfset REStructFindValueNoCase(arguments.top[key],arguments.reg_expression,arguments.scope,arguments.top,"#arguments.path#.#key#",arguments.results)>
	        </cfloop>        
	        
	    <cfelseif IsArray(arguments.top)>
	    
	        <cfloop from="1" to="#ArrayLen(arguments.top)#" index="i">    
	            <cfset REStructFindValueNoCase(arguments.top[i],arguments.reg_expression,arguments.scope,arguments.top,"#path#[#i#]",arguments.results)>
	        </cfloop>
	        
	    <cfelseif IsSimpleValue(arguments.top)
	        and IsStruct(arguments.owner)
	        and REFindNoCase(arguments.reg_expression,arguments.top)>            
	            
	        <cfset result = StructNew()>
	        <cfset result["key"] = ListLast(arguments.path,".")>
	        <cfset result["owner"] = arguments.owner>
	        <cfset result["path"] = arguments.path>        
	        <cfset ArrayAppend(arguments.results,result)>
	        
	    </cfif>
	        
	    <cfreturn arguments.results>
	            
	</cffunction>
</cfcomponent>