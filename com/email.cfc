component displayname="email" {
    remote void function sendemail(required string name,required string email,required string comment) {
    	cfmail = new mail();
    	cfmail.setto("existdissolve@gmail.com");
    	cfmail.setfrom(arguments.email);
    	cfmail.setsubject("Feedback for Gloss");
    	cfmail.settype("html");
    	cfmail.setserver("localhost");
    	savecontent variable="mailbody" {
    		writeoutput("From #arguments.name#<br /><br />#comment#");
    	}
    	cfmail.send(body=mailbody);
    }
}