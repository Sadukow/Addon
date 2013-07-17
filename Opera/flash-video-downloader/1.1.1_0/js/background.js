// developed by Moiseev Vladimir (cdb@linkycat.com, icq: 625986105)
// revised by Denis CaliberoV


window.addEventListener( "load", function(){
	
	fvdSingleDownloader.Media.init();
	fvdSingleDownloader.MainButton.refreshMainButtonStatus();

//	chrome.tabs.create({	url: chrome.extension.getURL( "/welcome-pages/installed.html" ),		active: true		});			return;
//	chrome.tabs.create({	url: chrome.extension.getURL( "/welcome-pages/updated.html" ),		active: true		});			return;
//	fvdSingleDownloader.Prefs.set( "install_time", 0 );
//	fvdSingleDownloader.Prefs.set( "popup.display_rate", true );
	
	if( fvdSingleDownloader.Utils.isVersionChanged() && !fvdSingleDownloader.noWelcome )
	{
		var url = null;
		
		if( fvdSingleDownloader.noYoutube ){
			
			//url = "http://fvdconverter.com/page/welcome-fvd-downloader-chrome";
			
/////			url = chrome.extension.getURL( "/welcome-pages/updated.html" );
			
			if (fvdSingleDownloader.Prefs.get("install_time") == 0) {
				url = chrome.extension.getURL( "/welcome-pages/installed.html" );
			}
			
		}	
		else{
			
			if (fvdSingleDownloader.Prefs.get("install_time") == 0) {
				url = "http://flashvideodownloader.org/fvd-suite/to/s/welcome_chrome/";
			}
			else{
				url = "http://flashvideodownloader.org/fvd-suite/to/s/update_chrome/";
			}			
			
		}	
		
		if( url ){
			chrome.tabs.create({
				url: url,
				active: true
			});			
		}

	}
	
	if( fvdSingleDownloader.Prefs.get( "install_time" ) == 0 )
	{
		fvdSingleDownloader.Prefs.set( "install_time", new Date().getTime() )
	}
	
	if( fvdSingleDownloader.noSuperfish )
	{
		fvdSingleDownloader.Prefs.set( "fvd.superfish.b_enable", false );
	}
	
	
}, false );

