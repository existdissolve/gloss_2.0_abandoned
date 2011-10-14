<cfcomponent output="false">
    <cfscript>
        this.name = "cfgloss";
    </cfscript>
    <cffunction name="onApplicationStart" output="false" returntype="void">
        <cfscript>
			application.rootpage = "index.html";
			application.roottitle= "About this App";
			application.basepath = getdirectoryfrompath(getcurrenttemplatepath());
			navigation = createobject("component","com.navigation").init();
			application.navigation = navigation;
			application.cflib = createobject("component","com.cflib").init();
			application.uselocal = islocalhost(cgi.remote_addr) ? true : false;
			application.localpath = "http://127.0.0.1:8500/gloss/index.cfm";
			application.docspath = "http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/";
			if(application.uselocal) {
				application.urlpath = "http://127.0.0.1:8500/gloss/content/";
				application.rootpath = application.localpath;
			}
			else {
				application.urlpath = "http://cfgloss.com/content/";
                application.basepath= "http://cfgloss.com/";
                application.rootpath = application.localpath;
			}
        </cfscript>
    </cffunction>
    <cffunction name="onrequeststart" output="false" returntype="void">
		<cfif isdefined("url.reinit")>
			<cfset application.navigation = "">
			<cfset application.builtnav= "">
			<cfset this.onapplicationstart()>
		</cfif>
	</cffunction>
</cfcomponent>