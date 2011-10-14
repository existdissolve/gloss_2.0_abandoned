<cfparam name="url.title" default="" />
<cfparam name="url.notificationid" default="" />
<cfparam name="url.content" default="" />
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<style type="text/css">
			body {background-color:#000;}
			.wrap {
				padding:0;;
				margin:0px;
				background-color:black;
				font-family:Arial, Helvetica, sans-serif;
				min-height:48px;
				/*max-height:80px;*/
				overflow:auto;
				margin:-8px -8px -8px -8px;
				background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#333), to(#000));
				width:300px;
			}
			.inner {margin:0;padding:0;}
			h2 	{font-size:8pt;padding:2px 0 0px;margin:5px 0 2px;text-shadow: 0 1px 1px rgba(0,0,0,.25);}
			h2 a{color:#99FF33;text-decoration:none;}
			p	{font-size:7pt;color:#fafafa;margin:0 0 5px 10px;padding:0 5px 0 0;}
			a	{color:#FF9933;font-weight:bold;}
			img {float:left;margin:0 0 0 0;border:none;height:60px;width:60px;}
		</style>
		<!---<script type="text/javascript" src="js/delegate.js"></script>--->
	</head>
	<body>
		<cfoutput>
		<div class="wrap">
			<div class="inner">
				<img src="images/icon_128.png" />
				<h2><a href="javascript:void(0)">#url.title#</a></h2>
				<!---<p>#left(url.content,140)#<cfif len(url.content) gt 50>...</cfif></p>--->
				<p>#url.content#</p>
			</div>
		</div>
		</cfoutput>
	</body>
</html>