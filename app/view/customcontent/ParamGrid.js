Ext.define("Gloss.view.customcontent.ParamGrid", {
	extend: 	"Ext.grid.Panel",
	alias:		"widget.paramgrid",
	store:		"CustomParameters",
	scroll:		"vertical",
	title:		"Parameter List",
	cls:		"nobg",
	viewConfig: {
    	stripeRows: true,
		emptyText:	"<div class='emptytext'>No parameters</div>",
		deferEmptyText: true
   	},
	minWidth: 200,
	initComponent: function() {
		this.columns = [
			{
				text:		"Name",
				dataIndex:	"title"
			},
			{
				text:		"Req/Opt",
				dataIndex:	"required",
                renderer: function(val) {
                    if(val==true) {
                        return "Yes";
                    }
                    else {
                        return "No";
                    }
                }
			},
			{
				text:		"Default",
				dataIndex:	"defaultvalue"
			},
			{
				text:		"Description",
				dataIndex:	"description",
				flex: 1
			},
			{
	            xtype:	"actioncolumn", 
	            width:	24,
				tdCls:	"deleteparameter",
	            items: [
					{
	                	icon: 	"images/delete.png",
	                	tooltip:"Delete"
	            	}              
	            ]
	        }
		];
		this.tools = [
			{
				type: "plus",
				tooltip: "Add Parameter",
				tooltipType: "qtip",
				itemId: "plus"
			}
		];
		this.callParent(arguments);
	}
});
								