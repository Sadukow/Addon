SPSINGLEYTIcon = {
	
	init: function(){
		try
		{
			document.getElementById( "appcontent" ).addEventListener("DOMContentLoaded", function( event ){
				SPSINGLEYTIcon.loadPageListener( event );
			}, true);
		}
		catch( ex ){
			dump( "Fail init YTButton listener. ("+ex+")\r\n" );
		}
		
	},
	
	alert: function(text)
	{
		var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
		aConsoleService.logStringMessage(text);
	},
	
	loadPageListener: function( e ){
		
		try
		{
			var win = e.target.defaultView;
		    if (win.wrappedJSObject)		win = win.wrappedJSObject;				
		    var loc = new XPCNativeWrapper(win, "location").location;
			var href = new XPCNativeWrapper(loc, "href").href;
//			this.alert('---- loadPageListener ----');
//			this.alert('loc = ' + loc);
//			this.alert('href =' + href);
			
           	var script = this.getUrlContents('chrome://sp.single/content/include/safe_page.js');
           	this.insertScript(script, href, win);


		}
		catch( ex )
		{
			dump( "Fail insert FVD Code to page("+ex+").\r\n" );
		}
		
	},

	insertScript: function( script, href, win ){
		
		if( typeof sp_single != "undefined" )
		{
			if( sp_single.silentMode )
			{
				return false;// silent mode activated, no add button
			}
		}
		
		win = new XPCNativeWrapper( win );
		var sandbox = new Components.utils.Sandbox(win);
		
		sandbox.url = href;
		sandbox.window = win;
		sandbox.document = win.document;		
		 
        try 
		{		
			this.evalInSandbox("(function(){" + script + "})()", href, sandbox);
		} 
		catch (ex) 
		{
			dump( "SP_Single: Expception while eval in sandbox - " + href + "("+ex+")\r\n" );
		}	
			
	},
	
	evalInSandbox: function (code, codebase, sandbox) {
        if (Components.utils && Components.utils.Sandbox) 
		{
            // DP beta+
			try 
			{
				Components.utils.evalInSandbox(code, sandbox);
			}		
			catch (ex)   {			this.alert('**!!!**'+ex);    }
        } 
		else if (Components.utils && Components.utils.evalInSandbox) 
		{
            // DP alphas
			try 
			{
				Components.utils.evalInSandbox(code, codebase, sandbox);
			}		
			catch (ex)   {			this.alert('**!*!*!**'+ex);    }
        } 
		else if (Sandbox) 
		{
            // 1.0.x
			try 
			{
				evalInSandbox(code, sandbox, codebase);
			}		
			catch (ex)   {			this.alert('**!*!!!*!**'+ex);    }
        } 
		else 
		{
            dump( "SPSingle: Cannot eval in sandbox\r\n" );
        }
    },
	
	getUrlContents: function (aUrl) {
        var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
        var scriptableStream = Components.classes["@mozilla.org/scriptableinputstream;1"].getService(Components.interfaces.nsIScriptableInputStream);

        var channel = ioService.newChannel(aUrl, null, null);
        var input = channel.open();
        scriptableStream.init(input);
        var str = scriptableStream.read(input.available());
        scriptableStream.close();
        input.close();
        return str;
    },
	

	
}

window.addEventListener("load", SPSINGLEYTIcon.init, true);
