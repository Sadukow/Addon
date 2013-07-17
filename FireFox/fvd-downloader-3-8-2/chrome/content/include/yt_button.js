/*
 * Insert FVD Download button in youtube interface.
 */

FVDSINGLEYTButton = {
	
	init: function(){
		try{
			document.getElementById( "appcontent" ).addEventListener("DOMContentLoaded", function( event ){
				FVDSINGLEYTButton.loadPageListener( event );
			}, true);
		}
		catch( ex ){
			dump( "Fail init YTButton listener. ("+ex+")\r\n" );
		}
		
	},
	
	loadPageListener: function( e ){
		
		try{
			// check youtube insertion allowed
			if( !fvd_single.registry.getBoolPref("display_youtube_button") ){
				return;
			}
			
			var win = e.target.defaultView;
		    if (win.wrappedJSObject){
				win = win.wrappedJSObject;				
			}
		
		    var loc = new XPCNativeWrapper(win, "location").location;
			var href = new XPCNativeWrapper(loc, "href").href;
			
			var regExp = new RegExp("http(s)?:\/\/.*\.youtube\.com\/");
			
			if( regExp.test( href ) ){				
				//dump( "Insert youtube button JS\n" );
				
            	var script = this.getUrlContents('chrome://fvd.single/content/include/yt_button_insert.js');
            	this.insertScript(script, href, win);
			}
		}
		catch( ex ){
			dump( "Fail insert FVD Code to page("+ex+").\r\n" );
		}
		
	},
	
	insertScript: function( script, href, win ){
		
		if( typeof fvd_single != "undefined" ){
			if( fvd_single.silentMode ){
				return false;// silent mode activated, no add button
			}
		}
		
		win = new XPCNativeWrapper( win );
		var sandbox = new Components.utils.Sandbox(win);
		
		/*
		sandbox.sharedObject = {
			url: href,
			window: win,
			document: win.document,
			sniffer: Components.classes['@flashvideodownloader.org/single_media_sniffer;1'].getService().wrappedJSObject,
			
			__exposedProps__:{
				url: "r",
				window: "r",
				document: "r",
				sniffer: "r"
			}			
		};
		*/
		sandbox.url = href;
		sandbox.window = win;
		sandbox.document = win.document;		
		sandbox.sniffer = Components.classes['@flashvideodownloader.org/single_media_sniffer;1'].getService().wrappedJSObject;
		
		sandbox.__proto__ = win;
		 
		var bundle = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://fvd.single/locale/fvd.single.properties');
		
		sandbox.BUTTON_TITLE = bundle.GetStringFromName( "yt_button.title" );
		sandbox.BUTTON_FORMATS_TITLE = bundle.GetStringFromName( "yt_button.formats_title" );
		sandbox.BUTTON_FOLDER_TITLE = bundle.GetStringFromName( "yt_button.folder_title" );
		sandbox.BUTTON_RATING_TITLE = bundle.GetStringFromName( "yt_button.rating_title" );
		sandbox.CONVERTER_MENU_TITLE = bundle.GetStringFromName( "yt_button.converter_menu_title" );
		sandbox.AD = fvd_single_AD;
		 
        try {		
			this.evalInSandbox("(function(){" + script + "})()", href, sandbox);
		} 
		catch (ex) {
			dump( "FVDSingle: Expception while eval in sandbox - " + href + "("+ex+")\r\n" );
		}	
			
	},
	
	/*
	 * Thanks, bestvideodownloader!
	 */	
	
	evalInSandbox: function (code, codebase, sandbox) {
        if (Components.utils && Components.utils.Sandbox) {
            // DP beta+
            Components.utils.evalInSandbox(code, sandbox);
        } else if (Components.utils && Components.utils.evalInSandbox) {
            // DP alphas
            Components.utils.evalInSandbox(code, codebase, sandbox);
        } else if (Sandbox) {
            // 1.0.x
            evalInSandbox(code, sandbox, codebase);
        } else {
            dump( "FVDSingle: Cannot eval in sandbox\r\n" );
        }
    },
	
	/*
	 * Thanks, bestvideodownloader!
	 */
	
	getUrlContents: function (aUrl) {
        var ioService = Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService);
        var scriptableStream = Components
		.classes["@mozilla.org/scriptableinputstream;1"]
		.getService(Components.interfaces.nsIScriptableInputStream);

        var channel = ioService.newChannel(aUrl, null, null);
        var input = channel.open();
        scriptableStream.init(input);
        var str = scriptableStream.read(input.available());
        scriptableStream.close();
        input.close();

        return str;
    },
	
}

window.addEventListener("load", FVDSINGLEYTButton.init, true);
