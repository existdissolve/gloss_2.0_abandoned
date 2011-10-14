<cfcomponent>	
	<cffunction name="searchcontent" access="remote" returntype="any">
		<cfargument name="query" type="string" required="yes">
		<cfargument name="customcontent" type="string" required="yes" default="">
		<cfset local.ccq = querynew("summary,title,target,type","varchar,varchar,varchar,varchar")>
		<!---if custom content is passed through, try to parse through it for search results--->
		<cfif arguments.customcontent neq "">
			 <cfset cc = deserializejson(arguments.customcontent)>
			 <!---create query object so we can add this in to the main search function--->
			 <cfloop from="1" to="#arraylen(cc)#" index="i">
			    <cfset queryaddrow(local.ccq)>
                <cfset querysetcell(local.ccq,"title",cc[i].title)>
				<cfset querysetcell(local.ccq,"target",cc[i].target)>
				<cfset querysetcell(local.ccq,"type",cc[i].type)>
				<cfset querysetcell(local.ccq,"summary",cc[i].description)>
			 </cfloop>
		</cfif>
		<cfset local.reference  = application.navigation.getsearch()>	
		<cfset local.cflib 		= application.cflib.getsearch()>
		<cfquery name="local.results" dbtype="query">
			select	*
			from	reference
			
			union
			
			select	*
			from	cflib
			
			union
			
			select  *
			from    ccq
		</cfquery>

		<cfquery name="local.searchresults" dbtype="query">
			select 	*, 0 as relevance
			from	results
			where 	lower(title) = '#lcase(arguments.query)#'
			
			union
			
			select 	*, 1 as relevance
			from	results
			where 	lower(title) like '%#lcase(arguments.query)#'
			
			union
			
			select	*, 2 as relevance
			from	results
			where 	lower(title) like '%#lcase(arguments.query)#%'
			
			union
			
			select	*, 3 as relevance
			from	results
			where	lower(summary) like '%#lcase(arguments.query)#%'
			order by relevance
		</cfquery>

		<cfscript>
			sresults = arraynew(1);
			sdupes = arraynew(1);
			maxct = local.searchresults.recordcount > 25 ? 25 : local.searchresults.recordcount;
			for(i=1;i<=maxct;i++) {
				item = {};
				title = rereplacenocase(trim(local.searchresults.title[i]),'.*\* ?','','all');
				item["val"] = local.searchresults.relevance[i];
				item["title"] 	= title;
				item["type"]	= local.searchresults.type[i];
				item["target"]	= local.searchresults.target[i];
				if(!arrayfind(sdupes,item.target)) {
					arrayappend(sdupes,item.target);
					isdupe = false;
				}
				else {
					isdupe = true;
				}
				item["summary"] = xmlformat(htmleditformat(rereplacenocase(local.searchresults.summary[i],'.*Description','','all')));
				item["summary"] = replace(item["summary"],"Adobe&##xa0;ColdFusion&##xa0;9 * ","","all");
				item["row"] 	= i;
				if(!isdupe) {
					arrayappend(sresults,item);
				}
			}
			return {"search"=sresults};
		</cfscript>
	</cffunction>
</cfcomponent>