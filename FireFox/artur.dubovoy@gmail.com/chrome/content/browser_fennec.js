function FVD_SINGLE(){
	
	var detector = null;
	var sniffer = null;
	var downloadInstance = null;
	var observer = null;
	
	var propertiesBundle = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://fvd.single/locale/fvd.single.properties');
	var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	
	// --------------------------------------------------------------------------
	var observerStruct = {
		
		observe: function(aSubject, aTopic, aData){
			switch (aTopic) {	
					
				case 'FVD.Single-Media-Detect':
				
					dump( "!!! Media found\n" );
				
					/*
					for( var k in Browser ){
						if( typeof Browser[k] == "function" ){
							continue;
						}
						dump( k + " = " + Browser[k] + "\n" );
					}
					*/
					
					
					/*
					for( var k in Browser.selectedTab ){
						
						if( typeof Browser.selectedTab[k] == "function" ){
							continue;
						}
						
						dump( k + " = " + Browser.selectedTab[k] + "\n" );
					}
					*/
					
					dump( "!!! COMPARE PAGES()?\n" );
			
					dump( "!!! " + BrowserApp.selectedBrowser.currentURI.spec + " - " + aData + "\n" );					
					
					
					if (isUrlsEqual(BrowserApp.selectedBrowser.currentURI.spec, aData)) {
						setupCurrentPage();						
					}
				
				break;
					
			}
		}				
				
	};
	
	// --------------------------------------------------------------------------
	function setupCurrentPage(  ){
		
		dump( "!!! start setup\n" );
		
		try
		{
			BrowserApp.selectedBrowser.messageManager.sendAsyncMessage( "FVDSingle:mediaFound", {
							found: true
						} );		
		}
		catch( ex )
		{
			dump( "SEUPT " + ex + "\n" );
		}
		
	}
	
	// --------------------------------------------------------------------------
	function extendMediaByUrl( media, extendData, url ){				
		if( !(url in media) ){
			//media[url] = {};
		}
		
		for( var mediaUrl in extendData )
		{
			media[url][mediaUrl] = extendData[ mediaUrl ];
		}
		
		return media;
	}
	
	// --------------------------------------------------------------------------
	function isUrlsEqual( u1, u2 ){
		
		u1 = u1.toLowerCase();
		u2 = u2.toLowerCase();		
		
		if( u1.indexOf("youtube.com") != -1 && u2.indexOf("youtube.com") != -1 ){
			var m1 = u1.match( /v=([^&]+)/i );
			var m2 = u1.match( /v=([^&]+)/i );			
			
			if( m1 && m2 && m1[1] == m2[1] ){
				return true;
			}
		}
		
		return u1 == u2;
		
	}
	
	// --------------------------------------------------------------------------
	function mediaForUrl( activeUrl ){
		
		var sniffedMedia = sniffer.get_files_all();			
					
		var media = {};
		media = extendMediaByUrl( sniffedMedia, media, activeUrl );
		
		var haveTypedMedia = false;
		for( var k in media ){
			for( var j in media[k] ){
				if( "type" in media[k][j] ){
					haveTypedMedia = true;
					break;
				}							
			}						
		}
		if( haveTypedMedia ){
			// remove not typed media
			for( var k in media ){
				for( var j in media[k] ){
					if( !("type" in media[k][j]) ){
						delete media[k][j];
					}								
				}							
			}
		}
		
		var mediaList = [];
		
		for( var url in media ){
			
			if( !isUrlsEqual( url, activeUrl ) ){
				continue;
			}					
			
			for( var k in media[url] ){
					
				mediaList.push( media[ url ][ k ] );
				 
			}	
				
		}
		
		return mediaList;
				
	}	
	
	// --------------------------------------------------------------------------
	function prepareFileSize( size ){
	
		return Math.round(size / 1024 / 1024 * 100) / 100 + "MB"; 
	
	}
	
	// --------------------------------------------------------------------------
	function init(){		
				
		try{
			
			detector = Components.classes['@flashvideodownloader.org/single_site_detector;1'].getService(Components.interfaces.IFVDSingleDetector);
			sniffer = Components.classes['@flashvideodownloader.org/single_media_sniffer;1'].getService().wrappedJSObject;

			sniffer.allowYoutube = false;
			
			downloadInstance = new FVD_SINGLE_DOWNLOAD(true);	
				
		}
		catch( ex ){
			
			dump( "Fail init detector/sniffer " + ex + "\n"  );
			
		}
		
		try{
			observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
			observer.addObserver(observerStruct, 'FVD.Single-Media-Detect', false);			
		}
		catch( ex ){
			
			dump( "Fail observer " + ex + "\n"  );
						
		}
		
		window.messageManager.loadFrameScript( "chrome://fvd.single/content/fennec_content.js", true );
				
		window.messageManager.addMessageListener("FVDSingle:Content:clickIcon", function( message ){
			
			var activeUrl = BrowserApp.selectedBrowser.currentURI.spec;

			
			buttons = [
				{
					label: propertiesBundle.GetStringFromName( "fennec.button.start_download" ),
					callback: function() {
						
						var media = mediaForUrl( activeUrl );
						
						dump( JSON.stringify(media) );
						
						var mediaNames = [];
						media.forEach( function( m ){							
							var name = prepareFileSize( m.size ) + ", " + m.ext + " - " + m.display_name
							mediaNames.push( name );
						} );
						
						var selected = {};
						
						promptService.select( window, propertiesBundle.GetStringFromName( "fennec.download_window.title" ), 
							propertiesBundle.GetStringFromName( "fennec.download_window.text" ), mediaNames.length, mediaNames, selected );
						
						var media = media[ selected.value ];
						var downloadId = downloadInstance.downloadByWindow(media.url, media.download_name ? media.download_name : media.file_title, "." + media.ext);
						
					}
				} ,
				{
					label: propertiesBundle.GetStringFromName( "fennec.button.hide_icon" ),
					callback: function() {
						
						message.target.messageManager.sendAsyncMessage( "FVDSingle:hideIcon", {
	
						} );
										
					}
				}
			];
			
			NativeWindow.doorhanger.show(propertiesBundle.GetStringFromName( "fennec.click_icon_message.title" ),
				propertiesBundle.GetStringFromName( "fennec.click_icon_message.text" ), buttons);

			
		});
		
		window.messageManager.addMessageListener("FVDSingle:Content:Download", function( message ){
			
			var media = message.json.media;
			
			var downloadId = downloadInstance.downloadByWindow(media.url, media.download_name ? media.download_name : media.file_title, "." + media.ext);
			
		});
		
		window.messageManager.addMessageListener("FVDSingle:Content:cleanUp", function( message ){
			
			dump( "Clean UP!" );
			
		});
		
		window.messageManager.addMessageListener("FVDSingle:Content:getMediaSize", function( message ){
			
			sniffer.getSizeByUrl( message.json.url, function( _, size ){
				
				message.target.messageManager.sendAsyncMessage( "FVDSingle:urlSize", {
					url: message.json.url,
					size: size
				} );
				
				dump( "SEND RESPONSE " + message.json.url + ", " + size + "\n" );
								
			} );
			
		});
		
		window.messageManager.addMessageListener("FVDSingle:Content:requestMedia", function( data ){
			
			var activeUrl = data.json.url || BrowserApp.selectedBrowser.currentURI.spec;

			dump( "Found media request for " + activeUrl + "("+JSON.stringify(data.json)+")\n" );
			
			try{
				
				var mediaList = mediaForUrl( activeUrl );
				
				BrowserApp.selectedBrowser.messageManager.sendAsyncMessage( "FVDSingle:mediaResponse", {
					media: mediaList
				} );
				
			}
			catch( ex ){
				dump( ex + "\n" );
			}
			
		});
		
		dump( "FENNECT DOWNLOADER INITIATED\n" );
		
	}
	
	// --------------------------------------------------------------------------
	window.addEventListener( "load", function(){		

		init();

		
	}, false );
	
}

var fvd_single = new FVD_SINGLE();