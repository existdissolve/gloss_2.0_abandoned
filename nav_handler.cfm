<cfparam name="url.type" default="regular">
<cfparam name="url.source" default="web">
<cfset navobj = application.navigation>
<cfif url.source eq "web">
    <cfif url.type eq "regular">
    	<cfset tree = navobj.gettree("cfmlref")>
    	<cfif not isdefined("application.builtnav") or not isobject(application.builtnav)>
        	<cfset result = navobj.buildnavigation(tree=tree,type="cfmlref")>
        	<cfset index = {
                    "title" = "About This App",
                    "text" = "About This App",
                    "id" = "index",
                    "cls" = "list-item",
                    "iconCls" = "no-icon",
                    "leaf" = true,
                    "target" = "index.html",
                    "type" = "CFMLRef",
                    "description" = "gloss is a simple way to browse the ColdFusion 9 online reference documentation with some handy extensions to improve the experience.",
                    "qtip" = "gloss is a simple way to browse the ColdFusion 9 online reference documentation with some handy extensions to improve the experience."
        	}>
        	<cfset arrayprepend(result,index)>
    		<cfset application.builtnav = result>
    	<cfelse>
    		<cfset result = application.builtnav>
    	</cfif>
    	<cfoutput>#serializejson(result)#</cfoutput>
    </cfif>
    <cfif url.type eq "developing">
    	<cfset tree = navobj.gettree("developing")>
    	<cfset result = navobj.buildnavigation(tree=tree,type="developing")>
    	<cfoutput>#serializejson(result)#</cfoutput>
    </cfif>
    <cfif url.type eq "cflib">
    	<!---<cfset cflibobj = createobject("component","com.cflib").init()>
    	<cfset result = cflibobj.getnavigation(returnformat="json")>--->
    	<cfset result = application.cflib.getnavigation()>
    	<cfoutput>#serializejson(result)#</cfoutput>
    </cfif>
<cfelseif url.source eq "mobile">
	<cfif url.type eq "regular">
		<cfset tree = navobj.gettree("cfmlref")>
        <cfif not isdefined("application.builtnav")>
            <cfset result = navobj.buildnavigation(tree=tree,type="cfmlref")>
            <!---<cfset index = {
                    "title" = "About This App",
                    "text" = "About This App",
                    "id" = "index",
                    "cls" = "list-item",
                    "iconCls" = "no-icon",
                    "leaf" = true,
                    "target" = "index.html",
                    "type" = "CFMLRef",
                    "description" = "gloss is a simple way to browse the ColdFusion 9 online reference documentation with some handy extensions to improve the experience.",
                    "qtip" = "gloss is a simple way to browse the ColdFusion 9 online reference documentation with some handy extensions to improve the experience."
            }>
            <cfset arrayprepend(result,index)>--->
            <cfset arraydeleteat(result,1)>
            <cfset application.builtnav = result>
        <cfelse>
			<cfset arraydeleteat(application.builtnav,1)>
            <cfset result = {"text"="Gloss","children"=application.builtnav}>
        </cfif>
        <cfoutput>#serializejson(result)#</cfoutput>
	</cfif>
	<cfif url.type eq "cflib">
        <cfset result = {"text"="CFLib","children"=application.cflib.getnavigation()}>
        <cfoutput>#serializejson(result)#</cfoutput>
    </cfif>
</cfif>