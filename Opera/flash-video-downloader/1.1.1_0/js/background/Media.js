if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		const EXTENSION_NAME = fvdSingleDownloader;
	
		var Media = function(){

			var self = this;

			var _onMediaForTabUpdateListeners = [];
			
			const DETECT_MODULES = ["Sniffer", "SitePage"];
			
			// ===============================================================
			this.init = function(){
			
/*				console.log("Media - init ");
				
				chrome.tabs.getSelected(undefined, function(tab) {
								incognito = tab.incognito;
								url = tab.url;
								var types = ['cookies', 'images', 'javascript', 'plugins', 'popups', 'notifications']; // плагины, вспл.окна, оповещения
								
								types.forEach(function(type) {
											chrome.contentSettings[type].get({
															'primaryUrl': url,
															'incognito': incognito
														},
														function(details) {   console.log(type, details.setting);  });
													});				
							});				*/
				
				
				this.Storage.onMediaRemove.addListener(function( tabId ) {

							console.log( "REMOVE ITEM " + tabId );
					
							_onMediaForTabUpdateListeners.forEach(function(listener) {
						
										try
										{
											listener(tabId);							
										}
										catch( ex ){			}
						
									});
				
						});
				
		
				
												
				function mediaDetectListener(media){
			
					var tabId = null;
					
					EXTENSION_NAME.Utils.Async.chain ( [
							function( chainCallback ){
						
										chainCallback();
									},
					
							function() {
							
										if (media)
										{	
											if( media.length )
											{							
							
												media.forEach(function( item ) {
																tabId = item.tabId;
																self.Storage.addItemForTab(item.tabId, item);							
															});
											}
											else
											{							
												tabId = media.tabId;
												self.Storage.addItemForTab(media.tabId, media);
											}
				
											chrome.extension.sendMessage( {
																		subject: "mediaForTabUpdate",
																		data: tabId
																	} );
				
											_onMediaForTabUpdateListeners.forEach(function(listener){
							
															try
															{
																listener(tabId);							
															}
															catch( ex ){	}
							
														});
										}
									}] );
					
				};
				
				// --------------------------- перебираем модули Sniffer, Youtube
				DETECT_MODULES.forEach( function( module ){
				
					if( self[module] )
					{
						self[module].onMediaDetect.addListener(mediaDetectListener);						
					}
					
				} );
				
				// --------------------------- закрытие вкладки  
				chrome.tabs.onRemoved.addListener( function( tabId ){
				
							if( EXTENSION_NAME.Media.Storage.hasDataForTab( tabId ) )
							{
								EXTENSION_NAME.Media.Storage.removeTabData( tabId );
						
								_onMediaForTabUpdateListeners.forEach(function( listener ){
												listener( tabId );
											});
							}
						} );
				
				// --------------------------- изменение вкладки
				chrome.tabs.onUpdated.addListener( function( tabId, changeInfo ){
				
							if( changeInfo.url )
							{
								if( EXTENSION_NAME.Media.Storage.hasDataForTab( tabId ) )
								{
									EXTENSION_NAME.Media.Storage.removeTabData( tabId );
								
								
									_onMediaForTabUpdateListeners.forEach(function( listener ){
												listener( tabId );
											});
								}
							}
					
						} );
				
				// --------------------------- реакция на SendRequest
				chrome.extension.onRequest.addListener ( function(request, sender, sendResponse) {        
				
									if(request.command=="getVideoData")
									{
										EXTENSION_NAME.Utils.getActiveTab( function( tab ) {
													if( tab )
													{
														var media = EXTENSION_NAME.Media.Storage.getMedia( tab.id );
														sendResponse(media);
													}
												});	
									}

								});
				
				
			}
			
			// ===============================================================
			this.startDownload = function( media ){
				
				EXTENSION_NAME.Utils.Async.chain( [
				
							function( chainCallback ){

										if( chrome.downloads )
										{							
											chrome.downloads.download({
																	url: media.url,
																	filename: media.downloadName,
																	saveAs: true
																});
										}
										else
										{
											EXTENSION_NAME.Utils.getActiveTab(function( tab ){
															EXTENSION_NAME.ContentScriptController.processMessage( tab.id, {
																			action: "startDownload",
																			media: media
																		} );
														});
										}						
						
									}
					
						] );
						
			}
			
			// ===============================================================
			this.onMediaForTabUpdate = {
				addListener: function(callback){
							if (_onMediaForTabUpdateListeners.indexOf(callback) == -1) 
							{
								_onMediaForTabUpdateListeners.push(callback);
							}
						}
			}
		}
		
		this.Media = new Media();
		
	}).apply(fvdSingleDownloader);
	
}
else
{
	fvdSingleDownloader.Media = chrome.extension.getBackgroundPage().fvdSingleDownloader.Media;
}
