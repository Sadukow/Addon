// developed by Moiseev Vladimir (cdb@linkycat.com, icq: 625986105)
// revised by Denis CaliberoV


chrome.extension.onRequest.addListener ( function(request, sender, sendResponse) {        
	
						if(request.akce=="get_pref")
						{
							var r={};
							r.offset_x			= parseInt(SafePreview.Prefs.get("sp.display_icon_x"));
							r.offset_y			= parseInt(SafePreview.Prefs.get("sp.display_icon_y"));
							r.showTime			= parseInt(SafePreview.Prefs.get("sp.scale_show_icon"));
							r.closeTime			= parseInt(SafePreview.Prefs.get("sp.scale_hide_icon"));
							r.closePreviewTime	= parseInt(SafePreview.Prefs.get("sp.scale_close_window"));
							
							r.isServiceGoogle	= _b(SafePreview.Prefs.get("sp.enable_google"));
							r.isServiceMcAfee	= _b(SafePreview.Prefs.get("sp.enable_mcafee"));
							r.isServiceNorton	= _b(SafePreview.Prefs.get("sp.enable_norton"));
							r.isServiceWOT		= _b(SafePreview.Prefs.get("sp.enable_wot"));
							r.isServiceAvast	= _b(SafePreview.Prefs.get("sp.enable_avast"));
							r.isServiceTrust	= _b(SafePreview.Prefs.get("sp.enable_trust"));
							r.isServiceDrWeb	= _b(SafePreview.Prefs.get("sp.enable_drweb"));
							
							r.isShowIcons		= _b(SafePreview.Prefs.get("sp.show_icons"));
							r.isEnableSafe		= _b(SafePreview.Prefs.get("sp.enable_safe"));
							r.isEnableLive		= _b(SafePreview.Prefs.get("sp.enable_live"));

							r.modeLive	= SafePreview.Prefs.get("sp.live_mode");
							r.pos_mouse	= SafePreview.Prefs.get("sp.display_icon_pos");
							
							sendResponse(r);
						}
						
						if(request.akce=="Navigate")
						{
							if (request.tip == 0) SafePreview.Safe.currentTab(request.url);
							else if (request.tip == 1) SafePreview.Safe.newTab(request.url);
							else if (request.tip == 2) SafePreview.Safe.backgroundTab(request.url);
						}
						
						if(request.akce=="zGoogle")
						{
							SafePreview.SafeGoogle.advisory_Google(request.u, request.h, request.f);
						}
						if(request.akce=="zWOT")
						{
							SafePreview.SafeWOT.read_WOT(request.h, request.f);
						}
						if(request.akce=="zMcAfee")
						{
							SafePreview.SafeMcAfee.read_McAfee(request.h, request.f);
						}
						if(request.akce=="zNorton")
						{
							SafePreview.SafeNorton.read_Norton(request.h, request.f);
						}
						if(request.akce=="zAvast")
						{
							SafePreview.SafeAvast.advisory_Avast(request.u, request.h, request.f);
						}
						if(request.akce=="zTrust")
						{
							SafePreview.SafeTrust.advisory_Trust(request.u, request.h, request.f);
						}
						if(request.akce=="zDrWeb")
						{
							SafePreview.SafeDrWeb.read_DrWeb(request.u, request.h, request.f);
						}

						if(request.akce=="isLink")
						{
							SafePreview.Safe.isLink(request.u, request.l);  
						}

						if(request.akce=="ShowLiveFrame")
						{
							SafePreview.Live.ShowLiveFrame(request.u, sender.tab.id );  
						}
						if(request.akce=="ShowLiveIncognito")
						{
							SafePreview.Live.ShowLiveIncognito(request.u);  
						}
						if(request.akce=="ShowLiveWindow")
						{
							SafePreview.Live.ShowLiveWindow(request.u, request.m);  
						}


						if(request.akce=="GetHostSafe")
						{
							SafePreview.Safe.GetHostSafe(request.u, request.l, request.x, request.y);  
						}
						if(request.akce=="SettingOptions")
						{
							display_settings();  
						}
						if(request.akce=="content_load_success")
						{
							SafePreview.Live.Script_LiveWindow( sender.tab.id, sender.tab.windowId );
						}
						if(request.akce=="live_window_navigation")
						{
							SafePreview.Live.navigation_LiveWindow( request.url, request.tip );
						}
						if(request.akce=="live_window_close")
						{
							SafePreview.Live.close_LiveWindow(  );
						}


						
					});


window.addEventListener( "load", function(){

		SafePreview.Safe.init();

}, false );

// добавим пункт к контекстному меню
var context = "link";
var MenuParent = chrome.contextMenus.create({
					type: "normal",
					"title": "SafePreview", 
					"contexts":[context]});
					
if (_b(SafePreview.Prefs.get("sp.enable_safe")))
{
	var MenuSafe="sp_link";
	var MenuSafe  = chrome.contextMenus.create( {
					type: "normal",
					"title": "Is it Safe?", 
					"contexts":[context], 
					"parentId": MenuParent,
					"id": MenuSafe, 
					"onclick": genericOnClick_Safe});
}					
if (_b(SafePreview.Prefs.get("sp.enable_live")))
{
	var MenuLiveFrame="sp_live_frame";
	var MenuLiveFrame = chrome.contextMenus.create( {
					type: "normal",
					"title": "Regular Live View", 
					"contexts":[context], 
					"parentId": MenuParent, 
					"id": MenuLiveFrame, 
					"onclick": genericOnClick_LiveFrame});

	var MenuLiveIncognito="sp_live_incognito";
	var MenuLiveIncognito = chrome.contextMenus.create( {
					type: "normal",
					"title": "Chrome Incognito Mode", 
					"contexts":[context], 
					"parentId": MenuParent, 
					"id": MenuLiveIncognito, 
					"onclick": genericOnClick_LiveIncognito});
}					

					
// --------------------------------------------------------
function genericOnClick_Safe(elem, tab)
{
	var n =elem.menuItemId;
	if(n=="sp_link")
	{
		var url = elem.linkUrl;
		var loc = elem.pageUrl;
		url = SafePreview.Safe.getLinkURL( url, loc );
		if (url == "") return false;
		
		// проверка на редирект
		console.log('----contextMenu-Safe: ('+tab.id+') '+url);
		SafePreview.Safe.resolve( url,  function( u ) {
		
								SafePreview.Link.Redirect( u,  function( url ) {

												var host = SafePreview.Safe.parseURL(url).hostname;

												open_SP_Analysis( tab, host, url );

											} );
		
							} );
	}
}
 
function open_SP_Analysis( tab, host, url )
{
	if (host=="chrome:"||
		host=="file:"||
		host=="chrome-extension:"||
		host=="view-source:http:"||
		host=="view-source:https:"||
		host=="chrome-devtools:")
	{
		return
	}
	else
	{
		SafePreview.Utils.getActiveTab( function( tab ){
										SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "contextMenu",
															host: host,
															url: url
														} );
											});
	}
}

// --------------------------------------------------------
function genericOnClick_LiveFrame(elem, tab)
{
	var n =elem.menuItemId;
	if(n=="sp_live_frame")
	{
		var url = elem.linkUrl;
		var loc = elem.pageUrl;
		url = SafePreview.Safe.getLinkURL( url, loc );
		if (url == "") return false;
		
		console.log('----contextMenu-LiveFrame: ('+tab.id+') '+surl+'   <- '+url);
		SafePreview.Live.ShowLiveFrame(url);  
		
	}
}
// --------------------------------------------------------
function genericOnClick_LiveIncognito(elem, tab)
{
	var n =elem.menuItemId;
	if(n=="sp_live_incognito")
	{
		var url = elem.linkUrl;
		var loc = elem.pageUrl;
		url = SafePreview.Safe.getLinkURL( url, loc );
		if (url == "") return false;
		
		console.log('----contextMenu-LiveIncognito: ('+tab.id+') '+surl+'   <- '+url);
		SafePreview.Live.ShowLiveIncognito(url);  
		
	}
}

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


