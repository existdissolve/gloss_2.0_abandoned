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
    <cfif url.type eq "cf10">
        <cfset tree = navobj.gettree("cfmlref10")>
        <cfif not isdefined("application.builtnav10") or not isobject(application.builtnav10)>
            <cfset result = navobj.buildnavigation(tree=tree,type="cfmlref10")>
            <cfset index = {
                    "title" = "About This App",
                    "text" = "About This App",
                    "id" = "index",
                    "cls" = "list-item",
                    "iconCls" = "no-icon",
                    "leaf" = true,
                    "target" = "index.html",
                    "type" = "CFMLRef",
                    "description" = "gloss is a simple way to browse the ColdFusion 10 online reference documentation with some handy extensions to improve the experience.",
                    "qtip" = "gloss is a simple way to browse the ColdFusion 10 online reference documentation with some handy extensions to improve the experience."
            }>
            <cfset arrayprepend(result,index)>
            <cfset application.builtnav10 = result>
        <cfelse>
            <cfset result = application.builtnav10>
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
            <cfif result[1].target eq 'index.html'>
                <cfset arraydeleteat(result,1)>
			</cfif>
            <cfset application.builtnav = result>
        <cfelse>
			<!------>
			<cfif application.builtnav[1].target eq 'index.html'>
                <cfset arraydeleteat(application.builtnav,1)>
            </cfif>
            <cfset result = {"text"="Gloss","children"=application.builtnav}>
        </cfif>
        <cfoutput>#serializejson(result)#</cfoutput>
	</cfif>
	<cfif url.type eq "cflib">
        <cfset result = {"text"="CFLib","children"=application.cflib.getnavigation()}>
        <cfoutput>#serializejson(result)#</cfoutput>
    </cfif>
</cfif>