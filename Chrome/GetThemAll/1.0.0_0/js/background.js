/*
chrome.extension.onRequest.addListener ( function(request, sender, sendResponse) {        
	
						if(request.akce=="get_pref")
						{
							var r={};
							r.showTime			= parseInt(GetThemAll.Prefs.get("sp.scale_show_icon"));

							r.isShowIcons		= _b(GetThemAll.Prefs.get("sp.show_icons"));

							r.modeLive	= GetThemAll.Prefs.get("sp.live_mode");
							
							sendResponse(r);
						}
						
						if(request.akce=="SettingOptions")
						{
							display_settings();  
						}


						
					});

*/
window.addEventListener( "load", function(){

		GetThemAll.Media.init();

}, false );


// ---------------------------------------- ОПЦИИ  --------------------------
function display_settings(  )  {

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



// --------------------------------------------------------


