component displayname="future" {
    public void function compilepages(required string type="cfmlref") {
        navigation = createobject("component","navigation").init();
        links = navigation.gettoc(type=arguments.type);
        allkeys = arraynew(1);
        propertype = application.navigation.getpropertype(arguments.type);
        for(key in links) {
            arrayappend(allkeys,key);
        }
        for(i=1;i<=arraylen(allkeys);i++) {
            key = allkeys[i];
            content = navigation.getpage(title=links[key].title,target=links[key].href,type=arguments.type).content;
            path = replacenocase(links[key].href,'http://help.adobe.com/en_US/ColdFusion/#propertype.version#/#propertype.type#/','','all');
            thread action="run" name="thread#i#" content="#content#" path="#path#" type="#arguments.type#" {
                filewrite("#application.basepath#content/#attributes.type#/#attributes.path#",attributes.content,"utf-8");
            }
        }
    }
    public void function compilepage(required string type,required string target, required string title) {
    	navigation = application.navigation;
    	propertype = application.navigation.getpropertype(arguments.type);
        fulltarget = "http://help.adobe.com/en_US/ColdFusion/#propertype.version#/#propertype.type#/#arguments.target#";
        content = navigation.getpage(title=arguments.title,target=fulltarget,type=arguments.type).content;
        filewrite("#application.basepath#content/#arguments.type#/#arguments.target#",content,"utf-8");
    }
}