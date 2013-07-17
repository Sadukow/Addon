if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var Live = function(){

			const iframeAttr = {	small:		{width:800,		height:600},
									middle:		{width:1000,	height:700},
									big:		{width:1200,	height:800}};
		
			var self = this;

			this.parent_tabId = null;
			
			// -----------------------------------------------------------------------------------------
			this.navigation_LiveWindow = function( url, tip ){
			
				if (tip == 0)
				{
					chrome.tabs.get( this.parent_tabId,  function(tab) { 
								chrome.tabs.update( tab.id, {		url: url	} );
							}); 			
				}	
				else if (tip == 1) SafePreview.Safe.newTab(url);
				else if (tip == 2) SafePreview.Safe.backgroundTab(url);
				
				// закрываем окно
				chrome.windows.get(this.curWin.id, function(gw) {
				
							if (gw)
							{
								chrome.windows.remove( self.curWin.id );
								self.curWin = null;
							}
							
						});				
				

			}	
			// -----------------------------------------------------------------------------------------
			this.close_LiveWindow = function(  ){
				// закрываем окно
				chrome.windows.get(this.curWin.id, function(gw) {
				
							if (gw)
							{
								chrome.windows.remove( self.curWin.id );
								self.curWin = null;
							}
							
						});				
			}	
			// =============================================================================================
			this.Script_LiveWindow = function( tabId, winId ){
//				console.log('content_load_success:', tabId, winId );  
				
				if (this.curWin == null) return;
				
				if (tabId == this.curWin.tabs[0].id)
				{
				
					var file = "/js/contentScripts/windowScript.js";
			
					chrome.tabs.executeScript( tabId, {
							file: file
						}, function(){

								var port = chrome.tabs.connect( tabId );
				
								port.postMessage( { action: "init_windowScript"  } );
				
								port.onMessage.addListener(function( message ){
					
											switch( message.action )
											{
												case "download":
						
						
												break;
											}
					
										});
							});
				
				}
			
			}
			// =============================================================================================
			this.ShowLiveFrame = function( url, tabId ){
			
				this.parent_tabId = tabId;  
				
				this.show_LiveWindow( url );

			}		
			this.ShowLiveIncognito = function( url ){
			
				// Команда Loading
				this.show_LiveIncognito( url );

			}		
			// -----------------
			this.winId = null;
			this.show_LiveFrame = function( url ){

				SafePreview.Utils.getActiveTab( function( tab ){
											SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "LivePreview_frame",
															url: url
														} );
										});
										
			}
			// -----------------------------------------------------------------------------------------
			this.show_LiveIncognito = function( url ){

				SafePreview.Utils.getActiveTab( function( tab ){
				
								chrome.windows.get(tab.windowId, function(win) {
								
								
												var mode	= SafePreview.Prefs.get("sp.live_mode");
				
												var l = win.left + (win.width - iframeAttr[mode].width) - 50;

												spec = {
														left: l,
														top: win.left + 100, 				
														width: iframeAttr[mode].width,
														height: iframeAttr[mode].height, 				
														type: "popup",
														incognito: true,	
														focused: true,
														url: url
														};
						
												chrome.windows.create(spec, function(w) {
																				try
																				{
																					chrome.history.deleteUrl({   url: url    });
																				}
																				catch(e) { }	
																			});
												
											} );
														
							});
				
			}
			// =============================================================================================
			this.curWin = null;
			this.show_LiveWindow = function( url ){

				if (this.curWin)			
				{

					chrome.windows.get(this.curWin.id, function(gw) {

							// нашли окно
							if (gw)
							{
								chrome.tabs.update( self.curWin.tabs[0].id, {
																	url: url,
																	active: true
																} );
							}
							else
							{
								self.create_LiveWindow( url );
							}
							
						});				
				}
				else
				{
					this.create_LiveWindow( url );
				}	
										
										
			}
			//-------------------------------------------------------------------
			this.create_LiveWindow = function( url ){

				SafePreview.Utils.getActiveTab( function( tab ){
				
								chrome.windows.get(tab.windowId, function(win) {
								
								
												var mode	= SafePreview.Prefs.get("sp.live_mode");

												var width = iframeAttr[mode].width;
												if ( width > (window.screen.width-200) ) width = window.screen.width-200;
												var height = iframeAttr[mode].height;
												if ( height > (window.screen.height-300) ) height = window.screen.height-300;

												var l = win.left + (win.width - width) - 50;
												
												
												spec = {
														left: l,
														top: win.left + 100, 				
														width: width,
														height: height, 				
														type: "popup",
														incognito: false,	
														focused: true,
														url: url
														};
														
						
												chrome.windows.create(spec, function(w) {
																				self.curWin = w;
																			});
												
											} );
														
							});
				
			}
			// =============================================================================================
			
			
			
		}
		
		this.Live = new Live();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.Preview = chrome.extension.getBackgroundPage().SafePreview.Preview;
}
