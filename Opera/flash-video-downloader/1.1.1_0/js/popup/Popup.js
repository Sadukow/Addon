(function(){
	
	var Popup = function(){
		
		var self = this;

		const ALLOWED_EXT_IMAGES = [
			"flv",
			"mp3",
			"mp4",
			"pdf",
			"swf",
			"webm",
			"3gp"
		];
		
		const INTERVAL_TO_DISPLAY_WRITE_REVIEW = 3 * 24 * 3600 * 1000; // 3 days
		
		// ----------------------------------------------------------------------
		function getExtImage( ext ){
			if( ALLOWED_EXT_IMAGES.indexOf(ext) == -1 ){
				return;
			}
			
			ext = ext.toLowerCase();
		
			return "images/formats/"+ext+".png";
		}
		
		function str_download_size( size ) {
		
			if (size<1073741824)    return fvdSingleDownloader.Utils.bytesToMb(size) + "MB";
			        else return fvdSingleDownloader.Utils.bytesToGb(size) + "GB";
		
		}
		
		// ----------------------------------------------------- построение строки
		function buildThreadItem( media ){

			function fbc( className ){
				return item.getElementsByClassName(className)[0];
			}

			var item = document.getElementById("download_item_template").cloneNode( true );
			
			item.removeAttribute( "id" );
			
			fbc("download_button").setAttribute( "href", "#" );			
				
			var displayName = media.downloadName; 	
				
			fbc("download_url").textContent = displayName;
			fbc("download_url").setAttribute( "href", media.url );
			fbc("download_url").setAttribute( "title", media.url );
			
			if( media.size )
			{
				fbc("size").textContent = str_download_size(media.size);
			}
			else
			{
				fbc("size").setAttribute( "loading", 1 );
				fvdSingleDownloader.Utils.getSizeByUrl( media.url, function( size ){
					
								fbc("size").removeAttribute( "loading" );
								if( size )
								{
									fvdSingleDownloader.Utils.getActiveTab( function( tab ){		fvdSingleDownloader.Media.Storage.setData_Attribute( tab.id, media.id, "size", size );		});
									fbc("size").textContent = str_download_size( size );
								}
					
							} );				
			}
			
			function onClick( event ) {
							console.log('fvdSingleDownloader.Media.startDownload',media);
			
							fvdSingleDownloader.Media.startDownload( media );
				
							fbc("download_button").setAttribute( "loading", 1 );
				
							setTimeout( function(){
												fbc("download_button").removeAttribute( "loading" );					
											}, 5000 );

							event.stopPropagation();												
						}
					
/*			item.addEventListener("mouseover", function(){
				
							fvdSingleDownloader.Utils.getActiveTab( function( tab ){
												fvdSingleDownloader.ContentScriptController.processMessage( tab.id, {
																							action: "highlightMedia",
																							media: media
																						} );					
											} );
				
						}, false);					
			
			item.addEventListener("mouseout", function(){
				
							fvdSingleDownloader.Utils.getActiveTab( function( tab ){
												fvdSingleDownloader.ContentScriptController.processMessage( tab.id, {
																							action: "unhighlightMedia"
																						} );					
											} );
				
						}, false);	*/							
									
			fbc("download_button").addEventListener("click", onClick, false);
			
			fbc("copyLink").addEventListener( "click", function( event ){
				
							fvdSingleDownloader.Utils.copyToClipboard( media.url );
				
							event.stopPropagation();
								
						}, false );
			
			fbc("removeLink").addEventListener( "click", function( event ){
				
							fvdSingleDownloader.Media.Storage.removeItem( media.id );
				
							item.parentNode.removeChild( item );
				
							event.stopPropagation();
				
						}, false );
			
			var topOfImageText = "";
			if( media.quality )		topOfImageText = media.quality;
			if( topOfImageText )
			{
				fbc("media_quality").textContent = topOfImageText;
			}
			
			var extImage = getExtImage( media.ext );
			
			if( extImage )
			{
				fbc("media_format").getElementsByTagName("img")[0].setAttribute( "src", extImage );
			}
			
			return item;
			
		}
		
		// ---------------------------------------------- INIT ---------------------------
		this.init = function(){		
		
			self.rebuildThreadsList();
									
			self.refreshTopHints();

			if( !chrome.webRequest )
			{
				var x = document.getElementById("updateChromeNotice");
				if (x) x.removeAttribute("hidden");
				x = document.getElementById("multiple_download_block_title");
				if (x) x.setAttribute("hidden", true);
			}
			
			if( fvdSingleDownloader.noYoutube )
			{
				var x = document.getElementById("help_link_converter");
				if (x) x.style.display = "none";	
			}
			else
			{
			
			}
			
			if( !fvdSingleDownloader.noYoutube )
			{
				var x = document.getElementById("help_link_convert_video");
				if (x) x.style.display = "none";				
			}
			
			var now = new Date().getTime();

			if( now - fvdSingleDownloader.Prefs.get( "install_time" ) < INTERVAL_TO_DISPLAY_WRITE_REVIEW )
			{
				var x = document.getElementById("help_link_write_review");
				if (x) x.style.display = "none";	
			}
			
			chrome.extension.onRequest.addListener( function( request ){
				
							if( request.subject == "mediaForTabUpdate" )
							{
					
								fvdSingleDownloader.Utils.getActiveTab( function( tab ){
						
													if( tab.id == request.data )
													{
							
														self.rebuildThreadsList();
							
													}
						
												});
					
							}
				
						} );
			
			
			var e = document.getElementById("help_link_options").addEventListener( "click", function(){
				
								self.display_setting();
				
							}, false );
			
			var e = document.getElementById("returnToThreads").addEventListener( "click", function(){
				
								displayDownloads();
				
							}, false );
			
			var e = document.getElementById("help_link_donate").addEventListener( "click", function(){
				
								displayDonate();
				
							}, false );	
			
			var e = document.getElementById("slowDownloadHint_close").addEventListener( "click", function(){
				
								fvdSingleDownloader.Prefs.set( "popup.display_slow_download_hint", false );
								self.refreshTopHints();
				
							}, false );
			
			var e = document.getElementById("androidDownloadHint_close");
			if (e) e.addEventListener( "click", function(){
				
											fvdSingleDownloader.Prefs.set( "popup.display_download_android_getthemall", false );
											self.refreshTopHints();
				
										}, false );
				
			var e = document.getElementById("help_link_help");
			if (e) e.addEventListener( "click", function(){
										self.navigate_url("http://www.flashvideodownloader.org/fvd-suite/contact/index.php");
									}, false );
			var e = document.getElementById("help_link_clear");
			if (e) e.addEventListener( "click", function(){
										self.clearList();
									}, false );
			
			var e = document.getElementById("help_link_convert_video");
			if (e) e.addEventListener( "click", function(){
										self.navigate_url("http://fvd-converter.com/");
									}, false );
			var e = document.getElementById("help_link_android");
			if (e) e.addEventListener( "click", function(){
										self.navigate_url("http://flashvideodownloader.org/fvd-suite/to/s/andr_getthemall/");
									}, false );
			var e = document.getElementById("help_link_converter");
			if (e) e.addEventListener( "click", function(){
										self.navigate_url("http://flashvideodownloader.org/fvd-suite/to/s/chrome_converter/");
									}, false );
			
			
			fvdSingleDownloader.Utils.getActiveTab(function( tab ){
				
									if( fvdSingleDownloader.noYoutube )
									{
										if (fvdSingleDownloader.MainButton.isYoutubeUrl(tab.url)) 
										{
											var x = document.getElementById("noYoutubeMessage");
											if (x) x.removeAttribute( "hidden" );
										}
									}
									else
									{
										var x = document.getElementById("noYoutubeMessage");
										if (x) x.setAttribute( "hidden" );
									}
				
								});
			
			fvdSingleDownloader.AD.rotateOnPage();
			
		}

		// ----------------------------------------------
		this.display_setting = function(){
			chrome.tabs.query( 	{
							url: chrome.extension.getURL( "/options.html" )
						}, function( tabs ){

									if( tabs.length > 0 )
									{
										foundTabId = tabs[0].id;
										chrome.tabs.update( foundTabId, {
																		active: true
																		} );
									}
									else
									{
										chrome.tabs.create( {	active: true,
																url: chrome.extension.getURL("/options.html")
															}, function( tab ){ }
														);
									}
					} );
		}
		// ----------------------------------------------
		this.navigate_url = function( url ){
			chrome.tabs.query( 	{
							url:  url 
						}, function( tabs ){

									if( tabs.length > 0 )
									{
										foundTabId = tabs[0].id;
										chrome.tabs.update( foundTabId, {
																		active: true
																		} );
									}
									else
									{
										chrome.tabs.create( {	active: true,
																url: url
															}, function( tab ){ }
														);
									}
					} );
		}
		// ----------------------------------------------
		this.clearList = function(){
			
			var container = document.getElementById("download_item_container");
			while( container.firstChild )
			{
				container.removeChild( container.firstChild );
			}
			
			fvdSingleDownloader.Utils.getActiveTab( function( tab ){
				
				if( tab )
				{
					fvdSingleDownloader.Media.Storage.removeTabData( tab.id );
				}
				
			} );
		}


		
		this.refreshTopHints = function(){
			
			var e = document.getElementById("slowDownloadHint");
			if (e) e.setAttribute("hidden", true);
			e = document.getElementById("androidDownloadHint");
			if (e) e.setAttribute("hidden", true);
			
			if( _b(fvdSingleDownloader.Prefs.get( "popup.display_download_android_getthemall" )) ){
				e = document.getElementById("androidDownloadHint");
				if (e) e.removeAttribute("hidden");
				return;
			}
			
			if( _b(fvdSingleDownloader.Prefs.get( "popup.display_slow_download_hint" )) ){
				e = document.getElementById("slowDownloadHint");
				if (e) e.removeAttribute("hidden");
				return;
			}			

			
		}

		// ----------------------------------------------  запрос к данным
		function threadsOfActiveTab( callback ){
			
			fvdSingleDownloader.Utils.getActiveTab( function( tab ){
				
								if( !tab )
								{
									callback( null );
								}
								else
								{
									var media = fvdSingleDownloader.Media.Storage.getDataForTab( tab.id );
									var media = fvdSingleDownloader.MainButton.filter_Media( media );
									
									media.sort( function( item1, item2 )  {	  
														return (item1.priority < item2.priority ? 1 : (item1.priority == item2.priority ? (item1.id < item2.id ? 1 : -1) : -1));  
													} );
									
									callback( media );
								}
				
							} );
		}
		
		// ------------------------------------------------- перестроить дерево
		this.rebuildThreadsList = function(){

			threadsOfActiveTab( function( threads ) {
			
						if( threads )
						{
						
							var container = document.getElementById("download_item_container");
							while( container.firstChild )
							{
								container.removeChild( container.firstChild );
							}
					
							var currentGroup = null;
					
							threads.forEach(function( thread )  {
											try
											{
												var item = buildThreadItem( thread );	
												container.appendChild( item );				
								
											}	
											catch( ex )
											{
												console.log( ex );				
											}
										});
						}
					} );
		}	
		
	}
	
	this.Popup = new Popup();
	
}).apply( fvdSingleDownloader );
