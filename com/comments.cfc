component displayname="comments" output="false" {
    remote any function getComments(required string target) {
    	req = new http();
        req.setmethod("get");
        req.seturl("http://community.adobe.com/help/rss/comments.html");
        req.addparam(type="url",name="resource_id",value="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/#arguments.target#");
        req.addparam(type="url",name="hl",value="en_US");
        result = req.send().getprefix();
        
        root = xmlparse(result.filecontent).rss.channel;
        items= xmlsearch(root,"item");
        comments = arraynew(1);
        for(i=1;i<=arraylen(items);i++) {
            description = replace(items[i].description.xmltext,'<','&lt;','all');
            description = replace(description,'>','&gt;','all');
            comment = {"description"=description,"pubdate"=dateformat(items[i].pubdate.xmltext,'mm.dd.yyyy'),"author"=items[i].author.xmltext};
            arrayappend(comments,comment);
        }
        return {"comments"=comments};
    }
}
