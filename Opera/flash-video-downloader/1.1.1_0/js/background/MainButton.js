if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var MainButton = function(){
		
			var self = this;

			const TRIGGER_VIDEO_SIZE = 1048576;
			const MIN_FILESIZE_TO_CHECK = 100 * 1024;
			
			const YOUTUBE_URL_SIGNS = [
				"//youtube.com",
				"//www.youtube.com",
				"//soloset.net",
				"//www.soloset.net",
				"//solosing.com",
				"//www.solosing.com"
			];
			
			const DAILYMOTION_URL_SIGNS = [
				"//dailymotion.com",
				"//www.dailymotion.com",
				"//dmcdn.net"
			];
			
			// ----------------------------------------------
			function getActiveTab(callback){
				fvdSingleDownloader.Utils.getActiveTab(callback);
			}
			
			// -------------------------------------------- состояние кнопки в панели
			function setMainButtonStatus(can, tabId){
				
				var img = chrome.extension.getURL('images/' + (can ? 'fvd.single.can_download.png' : 'fvd.single.cant_download.png'));
				chrome.browserAction.setIcon({
										path: img,
										tabId: tabId
									});
			}
			
			// -----------------------------------------  window.addEventListener( "load"
			function refreshMainButtonStatus(){
			
				getActiveTab(function(tab){
				
								var flag_YT = true;
				
								if (fvdSingleDownloader.noYoutube) 
								{
					
									if (self.isYoutubeUrl(tab.url)) 
									{
										chrome.browserAction.setTitle({
														title: _("noyoutube_message"),
														tabId: tab.id
													});
													
										flag_YT = false;			
									}
						
								}
					
								if (!tab) 
								{
									setMainButtonStatus(false);
									return;
								}
					
								if (fvdSingleDownloader.Media.Storage.hasDataForTab(tab.id) && flag_YT) 
								{

									var items = fvdSingleDownloader.Media.Storage.getDataForTab( tab.id );

									var items = self.filter_Media( items );

									var flag = false;
									if (items.length > 0) flag = true;
						
									setMainButtonStatus(flag, tab.id);
								}
								else 
								{
									setMainButtonStatus(false, tab.id);
								}
							});
			}
			this.refreshMainButtonStatus = function(){
				refreshMainButtonStatus();
			}

			// -------------------------------------------------------------------------------
			this.filter_Media = function( media )  {

				var rezult = [];

				var x = fvdSingleDownloader.Prefs.get( "fvd.trigger_video_more" );
				var min_filesize = MIN_FILESIZE_TO_CHECK;
				if ( x == 'video_100kb')  min_filesize = 102400;
				else if (x == 'video_1mb') min_filesize = 1048576;
				
				media.forEach(function( item ){

											if (self.checkExtByContentType( item.ext ))
											{
												var size = item.size;
												if (size && size < min_filesize )  return;
            
												rezult.push( item );
												
											}
										});
										
				return rezult;						
			}	
			
			// -------------------------------------------------------------------------------
			this.checkExtByContentType = function( contentType )
			{
				var name = "fvd.enable_" + contentType;
				var x = fvdSingleDownloader.Prefs.get( name );
				if( x == 'false' )  return false;
				return true;
			}
			
			// -------------------------------------------------------------------------------
			this.isYoutubeUrl = function(url) {
			
				var url = url.toLowerCase();
				
				for( var i = 0; i != YOUTUBE_URL_SIGNS.length; i++ )
				{
					if( url.indexOf( YOUTUBE_URL_SIGNS[i] ) != -1 )		return true;
				}
				
				return false;
			}
			
			chrome.tabs.onUpdated.addListener(function(tabId, info){
			
				getActiveTab(function(tab){
				
					if (!info.status) {
						return;
					}
					
					if (tab.id == tabId) {
						refreshMainButtonStatus();
					}
					
				});
				
				
				
			});
			
			chrome.tabs.onActivated.addListener(function(info){
			
				refreshMainButtonStatus();
				
			});
			
			fvdSingleDownloader.Media.onMediaForTabUpdate.addListener(function(tabId){
			
				getActiveTab(function(tab){
				
					if (!tab) {
						return;
					}
					
					if (tabId == tab.id) {
						refreshMainButtonStatus();
					}
					
				});
				
			});
			
		}
		
		this.MainButton = new MainButton();
		
	}).apply(fvdSingleDownloader);
}
else{
	fvdSingleDownloader.MainButton = chrome.extension.getBackgroundPage().fvdSingleDownloader.MainButton;
}
