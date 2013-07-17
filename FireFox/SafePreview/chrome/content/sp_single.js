try
{
	// try import addon manager for extension version detection in firefox4
	Components.utils.import('resource://gre/modules/AddonManager.jsm');
	
	Components.utils.import("resource://sp.single.modules/storage.js");

} catch (e) {alert(e);}


function Log(outputString) 
{
	Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage(outputString);
}

function SP_SINGLE()
{	
	const DISPLAY_FVDSD_HINT_AFTER = 3600 * 24 * 5 * 1000; // five days after install
	const DISPLAY_FVDSD_HINT_EVERY = 3600 * 24 * 1 * 1000; // one day
	const EXTENSION_GUID = 'safepreview@everhelper.me';
	const TOOLBAR_ID = "{9051303c-7e41-4311-a783-d6fe5ef2832d}";
	const SETTINGS_KEY_BRANCH = 'extensions.SafePreview.';
	const COUNTERS_KEY_BRANCH = SETTINGS_KEY_BRANCH + 'counters.';
	const TITLE_MAX_LENGTH = 32;
	
	const STORAGE_FOLDER = 'Save_Preview';
	const AD_SIGNS_FILE = 'hosts.txt';
	
	const PERMS_FILE      = 0644;
	const PERMS_DIRECTORY = 0755;

	const MODE_RDONLY   = 0x01;
	const MODE_WRONLY   = 0x02;
	const MODE_CREATE   = 0x08;
	const MODE_APPEND   = 0x10;
	const MODE_TRUNCATE = 0x20;

	this.contract = "sp.single";
	this.spPreview = null;

	var self = this;
	this.settings_window = null;
	
	this.registry = null;
	this.branch = null;
	this.observer = null;
	this.storage = null;
	
	this.objContextMenu = null;
	this.objContextMenu_Link = null;

	this.curr_link = '';
	
	this.supported = false;
	this.silentMode = false; // activated if fvd toolbar installed
	
	this.ListFrames = {};

	
	this.mouseX = 0;
	this.mouseY = 0;
	this.mouse_x = 0;
	this.mouse_y = 0;
	this.mouse_w_x = 0;
	this.mouse_w_y = 0;


	// --- NodeType
	this.onImage=false;
	this.onLoadedImage=false;
	this.onStandaloneImage=false;
	this.onMetaDataItem=false;
	this.onTextInput=false;
	this.onKeywordField=false;
	this.imageURL="";
	this.onLink=false;
	this.linkURL="";
	this.linkURI=null;
	this.linkProtocol="";
	this.onMathML=false;
	this.inFrame=false;
	this.hasBGImage=false;
	this.bgImageURL="";
	this.target=null;
	this.docURL='';
	// ---
	
	
	this.alert = function(text)
	{
		var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
		aConsoleService.logStringMessage(text);
	};

	// ----------------- переход по адресу
	this.navigate_url = function(url, event, in_new_page = true, in_background = false)
	{
		if (gBrowser)
		{
			if (in_new_page)
			{
				var tab = gBrowser.addTab(url);
				if (!in_background)
				{
					if (tab) gBrowser.selectedTab = tab;
				}
			} 
			else
			{
				gBrowser.loadURI(url);
			}
		}
	};
	
	
	this.trimWhitespace = function(str){
		if(!str)	return;
			
		return str.replace(/^\s*(\S*(\s+\S+)*)\s*$/,"$1");
	}
	
	// ---------------------------------------- на закрытие 
	this.handlerTabClosing = function(event){
		//self.alert('---------addEventListener  TabClose --------------');
		try
		{
			var browser = gBrowser.getBrowserForTab(event.target);			
		}
		catch( ex )
		{
			dump( "EX " + ex.message + "\r\n" );
		}
	}
	
	// ----------------------------------------  
	this.handlerTabSelect = function(event){
		//self.alert('---------addEventListener  TabSelect --------------');
		sp_single.spSafe.Run_initPreviewHide( 1 );

	}
	
	// ----------------------------------------  
	this.handlerTabAttrModified = function(event){
		//Log('---------addEventListener  TabAttrModified --------------');
	}
	
	
	// ----------------------------------------------------- 
	this.decode_html = function(html)
	{
		var converter = Components.classes['@mozilla.org/widget/htmlformatconverter;1'].createInstance(Components.interfaces.nsIFormatConverter);
		var fstr = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
		var tstr = {value:null};
		var text = html;
		fstr.data = html;

		try
		{
			converter.convert('text/html', fstr, fstr.toString().length, 'text/unicode', tstr, {});
		} catch(e) {}
		if (tstr.value)
		{
			tstr = tstr.value.QueryInterface(Components.interfaces.nsISupportsString);
			text = tstr.toString();
		}
		return text;
	};
	


	// -------------- слушатель прогресса отслеживания загрузки документов
	this.browser_progress_listener = {

		onLocationChange: function(aWebProgress, aRequest, aURI)		{			
		},

		onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus){

		},
		onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {},
		onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) {
			
		},
		
		onSecurityChange: function(aWebProgress, aRequest, aState) {},
		onLinkIconAvailable: function(){},

		QueryInterface: function(aIID)
		{
			if (aIID.equals(Components.interfaces.nsIWebProgressListener) || aIID.equals(Components.interfaces.nsISupportsWeakReference) || aIID.equals(Components.interfaces.nsISupports)) return this;
			throw Components.results.NS_NOINTERFACE;
		}
	};

    this.restartFirefox = function(){
        try {
            var boot = Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(Components.interfaces.nsIAppStartup);
            boot.quit(Components.interfaces.nsIAppStartup.eForceQuit | Components.interfaces.nsIAppStartup.eRestart);
        } 
        catch (ex) {       }
    };

	// -------------- событие на DOMContentLoaded
	this.browser_dom_loaded_listener = function( elem ) 	{
//		Log('---------addEventListener  DOMContentLoaded -------------- ' );

		var document = gBrowser.selectedBrowser.contentDocument;
//		Log(doc.location.href);
//		Log(doc.body.parentNode.tagName);

		// -----------	
//		Log(elem.target.location.href);

		var doc = elem.target;
		if ( doc != null )
		{
			var ifrms = doc.getElementsByTagName("iframe");
			for(var i=0; i<ifrms.length; i++)
			{
				var e = ifrms[i];
				var r = e.parentNode.getBoundingClientRect();
				var m = {
						src:  e.src,
						left: Math.round(r.left),
						top:  Math.round(r.top),
						};
						
//				Log('---'+media.left + ' - ' + media.top + ' == ' + media.src);
				this.ListFrames[this.md5( e.src )] = m;
			}
		}
		
	}		

	// ----------------------------------  Чтение настроек
	this.reloadPrefs = function(  )  {      

		var nastr = {	"closeTime": 	this.branch.getIntPref("single.scale_hide_icon"),
						"showTime" : 	this.branch.getIntPref("single.scale_show_icon"),
						"x":			this.branch.getIntPref("single.display_icon_x"),
						"y":			this.branch.getIntPref("single.display_icon_y"),
						"closePreview":	this.branch.getIntPref("single.scale_close_preview"),
						"mode":			this.branch.getCharPref("mode_display"),

						"google":		this.branch.getBoolPref('service_google'),
						"mcafee":		this.branch.getBoolPref('service_mcafee'),
						"norton":		this.branch.getBoolPref('service_norton'),
						"wot":			this.branch.getBoolPref('service_wot'),
						"trust":		this.branch.getBoolPref('service_trust'),
						"drweb":		this.branch.getBoolPref('service_drweb'),

						"isSafe":		this.branch.getBoolPref('enable_safe'),
						"isPreview":	this.branch.getBoolPref('enable_preview'),
						"isLive":		this.branch.getBoolPref('enable_live'),
						"isShowIcons":	this.branch.getBoolPref('show_icons')

						};

		return nastr;				
	};
	
	this.md5 = function(str)
	{
		var converter = Components.classes['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = 'UTF-8';
		
		var result = {};
		var data = converter.convertToByteArray(str, result);

		var ch = Components.classes['@mozilla.org/security/hash;1'].createInstance(Components.interfaces.nsICryptoHash);
		ch.init(ch.MD5);
		ch.update(data, data.length);
		var hash = ch.finish(false);
		
		var s = '';
		for (var i = 0; i < 16; i++)
		{
			s += ('0' + hash.charCodeAt(i).toString(16)).slice(-2);
		}
		return s;
	};
	// ================================================================================  SERVICE
	this.LinkService = function( url, tip )  {  
		var host = this.gethostname(url);
		if (!host)	return;
		if (tip == 'mcafee') 		this.navigate_url('http://www.siteadvisor.com/sites/'+host);
		else if (tip == 'norton') 	this.navigate_url('http://safeweb.norton.com/report/show?url='+host);
		else if (tip == 'wot') 		this.navigate_url('http://www.mywot.com/en/scorecard/'+host);
		else if (tip == 'google') 	this.navigate_url('http://safebrowsing.clients.google.com/safebrowsing/diagnostic?site='+url);
		else if (tip == 'trust') 	this.navigate_url('https://www.trustwave.com/securebrowsing/faq.php');
		else if (tip == 'drweb') 	this.navigate_url(this.serviseLink);
	}
	
	this.Sbros = function( url, tip )  {      
		var host = this.gethostname(url);
		if (!host)	return;
		if (tip == 'mcafee')
		{
			this.spSafeMcAfee.mcafee[host] = null;
		}
		else if (tip == 'norton')
		{
			this.spSafeNorton.norton[host] = null;
		}
		else if (tip == 'wot')
		{
			this.spSafeWOT.wot[host] = null;
		}
		else if (tip == 'google')
		{
			this.spSafeGoogle.google[url] = null;
		}
		else if (tip == 'trust')
		{
			this.spSafeTrust.trust[url] = null;
		}
		else if (tip == 'drweb')
		{
			this.spSafeDrWeb.drweb[url] = null;
		}
		else if (tip == 'all')
		{
			this.spSafeMcAfee.mcafee[host] = null;
			this.spSafeNorton.norton[host] = null;
			this.spSafeWOT.wot[host] = null;
			this.spSafeGoogle.google[url] = null;
			this.spSafeTrust.trust[url] = null;
			this.spSafeDrWeb.drweb[url] = null;
		}
	
	}
	
	// --------------------------- HOST
	// -- получить сервер
	this.getservername = function(url)	{
		try 
		{
			if (!url || !url.length) 	return null;
			var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

			var parsed = ios.newURI(url, null, null);
			
			if (!parsed || !parsed.host ||	!this.issupportedscheme(parsed.scheme))   return null;
			var host = parsed.host.toLowerCase();
			var scheme = parsed.scheme.toLowerCase();

			if (!host) 	return null;

			while (this.isequivalent(host)) 
			{
				host = host.replace(/^[^\.]*\./, "");
			}
			return scheme+'://'+host;
		} 
		catch (e) {		}

		return null;
	}
	// -- получить host 
	this.gethostname = function(url)	{
		try 
		{
			if (!url || !url.length) 	return null;
			var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

			var parsed = ios.newURI(url, null, null);
			
			if (!parsed || !parsed.host ||	!this.issupportedscheme(parsed.scheme))   return null;

			var host = parsed.host.toLowerCase();

			if (!host) 	return null;

			while (this.isequivalent(host)) 
			{
				host = host.replace(/^[^\.]*\./, "");
			}
			return host;
		} 
		catch (e) {		}

		return null;
	}
	
	this.issupportedscheme = function(scheme)	{
		try 
		{
			return /^(https?|ftp|mms|rtsp)$/i.test(scheme);
		} catch (e) {		}
		return false;
	}

	this.isequivalent = function(name)	{
		try 
		{
			if (!/^www(\d[^\.]*)?\..+\..+$/i.test(name)) 	return false;

			var component = Components.classes["@mozilla.org/network/effective-tld-service;1"];

			if (!component) 	return true;

			var ts = component.getService(	Components.interfaces.nsIEffectiveTLDService  );

			if (!ts) 	return true;
			
			var domain = name.replace(/^[^\.]*\./, "");
			var tld = ts.getPublicSuffixFromHost(domain);

			return (domain != tld);
		} 
		catch (e) {    }
		return false;
	}
	
	
	// ================================================================================  SEND в СКРИПТ
	this.sendEvent = function( data  ){
	
		var numTabs = gBrowser.browsers.length;;
		
		for (var index = 0; index < numTabs; index++) 
		{
			var currentBrowser = gBrowser.getBrowserAtIndex(index);

			var document = currentBrowser.contentDocument;
			if (document)
			{
				var event = document.createEvent("Events");
				event.initEvent("runCommandEvent", true, false);
				var element = document.getElementById("sp_console_event");
				if (element)
				{
					element.setAttribute("data", JSON.stringify(data));
					element.dispatchEvent(event);	
				}	
			}
		}
		
		
	}
	
	
	// ================================================================================  СЧИТАТЬ СПИСОК РАНЕЕ ПРОВЕРЕННЫХ ХОСТОВ
	this.read_list_host = function(  )  {      

//		this.storage.download_hosts_from_local();	
		
		// удалим старые данные
		var current_dt = new Date();
		var current_time = current_dt.getTime();
		var t = this.branch.getIntPref('single.scale_daily_history');
		var predel_time = current_time - DISPLAY_FVDSD_HINT_EVERY * t;
		this.storage.deleteOldHost(predel_time);
		
		// Обнуляем данные по хостам				 
		if (this.spSafeGoogle.google && this.spSafeGoogle.google.length > 0) this.spSafeGoogle.google.length = 0;
		if (this.spSafeWOT.wot && this.spSafeWOT.wot.length > 0) this.spSafeWOT.wot.length = 0;
		if (this.spSafeMcAfee.mcafee && this.spSafeMcAfee.mcafee.length > 0) this.spSafeMcAfee.mcafee.length = 0;
		if (this.spSafeNorton.norton && this.spSafeNorton.norton.length > 0) this.spSafeNorton.norton.length = 0;
		if (this.spSafeTrust.trust && this.spSafeTrust.trust.length > 0) this.spSafeTrust.trust.length = 0;
		if (this.spSafeDrWeb.drweb && this.spSafeDrWeb.drweb.length > 0) this.spSafeDrWeb.drweb.length = 0;

		// Считываем данные по хостам				 
		var tmp = this.storage.readHosts();
		
        for (var i = 0; i != tmp.length; i++) 
		{
			var host = tmp[i].host;	
			var srv  = tmp[i].srv;	
			var rez  = tmp[i].rez;
			var dat  = tmp[i].dat;
										
			if (srv == 'WOT')				this.spSafeWOT.wot[host] = rez;			
			else if (srv == 'McAfee')		this.spSafeMcAfee.mcafee[host] = rez;			
			else if (srv == 'Norton')		this.spSafeNorton.norton[host] = rez;			
			else if (srv == 'Google')		this.spSafeGoogle.google[host] = rez;			
			else if (srv == 'Trust')		this.spSafeTrust.trust[host] = rez;			
			else if (srv == 'DrWeb')		this.spSafeDrWeb.drweb[host] = rez;			
        }
	}
	
	// -------------------------------- setting  -----------
	this.display_settings = function(event)
	{
		if (this.settings_window == null)
		{
			var ww = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].getService(Components.interfaces.nsIWindowWatcher);
			if (ww)
			{
				this.settings_window = ww.openWindow(window, 'chrome://sp.single/content/sp_settings.xul', '', 'chrome,titlebar=yes,toolbar,centerscreen,dialog=yes,minimizable=no,close=yes,dependent=yes', null);
				ww.registerNotification(this.settings_observer_struct);
			}
		} else
		{
			this.settings_window.focus();
		}
		event.stopPropagation();
	};
	this.setting_reload = function()
	{
		// запрос на reload option
		this.sendEvent({"a": "ReloadOptions" });
	};
	
	
	// ================================================================================   CONTEXT 
	this.previewContextMenuPopup = function( event ){

		var showSafe = document.getElementById("safe_preview___context_safe");
		var showPreview = document.getElementById("safe_preview___context_preview");
		var showLiveRegular = document.getElementById("safe_preview___context_regular");
		var showLiveIncognito = document.getElementById("safe_preview___context_incognito");
		
		showSafe.hidden = true;
		showPreview.hidden = true;
		showLiveRegular.hidden = true;
		showLiveIncognito.hidden = true;
		
		if (!gContextMenu.onLink)	return;

		var isSafe = this.branch.getBoolPref('enable_safe');
		var isPreview = this.branch.getBoolPref('enable_preview');
		var isLive = this.branch.getBoolPref('enable_live');
		
		if (isLive)
		{
			showLiveRegular.hidden = false;
			showLiveIncognito.hidden = false;
		}	
		
		this.mouseX=event.clientX;
		this.mouseY=event.clientY;
		
		this.getNodeType();
	
		if(this.onImage)
		{
			url=this.linkURL;
			if(url=="")
			{
				url=this.imageURL;
			}
		}
		else
		{
			if(this.onLink)
			{
				url=this.linkURL;
			}
			else
			{
				url=gBrowser.currentURI.spec;
			}
		}

		if (isSafe || isPreview)
		{
			if (isSafe) showSafe.hidden = false;
			if (isPreview) showPreview.hidden = false;
		
			var loc = this.docURL;
			url = sp_single.spLink.getLinkURL( url, loc );
			if (url == "")
			{
				showPreview.hidden = true;
				return;
			}	

			// проверка на необходимость проверки, на исключаемые субдомены
			var flag_Preview = sp_single.spLink.checkLinkUrl( url );
			if (!flag_Preview)
			{
				showPreview.hidden = true;
				return;
			}
		}	

	}	

	this.start_it_safe = function( event ){
	
		this.getNodeType();
	
		if(this.onImage)
		{
			url=this.linkURL;
			if(url=="")
			{
				url=this.imageURL;
			}
		}
		else
		{
			if(this.onLink)
			{
				url=this.linkURL;
			}
			else
			{
				url=gBrowser.currentURI.spec;
			}
		}
		
		
		var doc = gBrowser.selectedBrowser.contentDocument;
		var top = self.pageYOffset || (doc.documentElement && doc.documentElement.scrollTop) || (doc.body && doc.body.scrollTop);
		var left = self.pageXOffset || (doc.documentElement && doc.documentElement.scrollLeft) || (doc.body && doc.body.scrollLeft);

		var loc = this.docURL;
		url = sp_single.spLink.getLinkURL( url, loc );
		if (url == "") return false;
		
		if (this.ListFrames[this.md5( loc )] != null)
		{
			var media = this.ListFrames[this.md5( loc )];
			this.alert(media.left + ' - ' + media.top);
			ppx = this.mouse_x + media.left;
			ppy = this.mouse_y + media.top;	
		}
		else
		{
			var ppx = this.mouse_x + left;
			var	ppy = this.mouse_y + top;
		}
		
		// проверка на редирект
		sp_single.spLink.check_search( url,  function( new_url )  {

						Log('start_it_safe: '+url + ' x = '+ppx + '  y = ' + ppy);
						self.spSafe.Proverka( new_url, ppx, ppy, doc.location.href );
		
					});
		
	}	
	this.start_preview = function( event ){
	
		this.getNodeType();
	
		if(this.onImage)
		{
			url=this.linkURL;
			if(url=="")
			{
				url=this.imageURL;
			}
		}
		else
		{
			if(this.onLink)
			{
				url=this.linkURL;
			}
			else
			{
				url=gBrowser.currentURI.spec;
			}
		}

		var loc = this.docURL;
		url = sp_single.spLink.getLinkURL( url, loc );
		if (url == "") return false;
		
		// проверка на редирект
		sp_single.spLink.check_search( url,  function( new_url )  {

						var host = sp_single.spLink.parseURL(new_url).hostname;
						
						// проверка на необходимость проверки, на исключаемые субдомены
						var flag_Preview = sp_single.spLink.checkLinkUrl( new_url );
								
						if ( !flag_Preview)
						{
							var purl = sp_single.spLink.parseURL( new_url );
							purl.file = "";
							new_url = sp_single.spLink.complitURL( purl );
						}
						
						Log('start_preview: '+new_url+'  <-  '+url  );
						sp_single.spPreview.ShowThumbnail( new_url, host );
		
					});
		
	}	

	this.start_regular = function( event ){
	
		this.getNodeType();
	
		if(this.onImage)
		{
			url=this.linkURL;
			if(url=="")
			{
				url=this.imageURL;
			}
		}
		else
		{
			if(this.onLink)
			{
				url=this.linkURL;
			}
			else
			{
				url=gBrowser.currentURI.spec;
			}
		}

		var loc = this.docURL;
		url = sp_single.spLink.getLinkURL( url, loc );
		if (url == "") return false;

		// открыть
		Log('start_regular: ' + url  );
		sp_single.spLive.ShowLiveRegular( url );
	}	
	
	this.start_incognito = function( event ){
	
		this.getNodeType();
	
		if(this.onImage)
		{
			url=this.linkURL;
			if(url=="")
			{
				url=this.imageURL;
			}
		}
		else
		{
			if(this.onLink)
			{
				url=this.linkURL;
			}
			else
			{
				url=gBrowser.currentURI.spec;
			}
		}

		var loc = this.docURL;
		url = sp_single.spLink.getLinkURL( url, loc );
		if (url == "") return false;

		// открыть
		Log('start_incognito: ' + url  );
		sp_single.spLive.ShowLiveIncognito( url );

	}	

	
	// ================================================================================   NODE_TYPE
	this.getNodeType = function(){
		this.setTarget(document.popupNode);
		this.isTextSelected=this.isTextSelection();
		this.isContentSelected=this.isContentSelection();
	}
	this.setTarget = function( elem ){
		this.onImage=false;
		this.onLoadedImage=false;
		this.onStandaloneImage=false;
		this.onMetaDataItem=false;
		this.onTextInput=false;
		this.onKeywordField=false;
		this.imageURL="";
		this.onLink=false;
		this.linkURL="";
		this.linkURI=null;
		this.linkProtocol="";
		this.onMathML=false;
		this.inFrame=false;
		this.hasBGImage=false;
		this.bgImageURL="";
		this.target=elem;
		this.docURL=elem.ownerDocument.location.href;
		
		if(this.target.nodeType==Node.ELEMENT_NODE)
		{
			if(this.target instanceof Components.interfaces.nsIImageLoadingContent&&this.target.currentURI)
			{
				// баннеры
				this.onImage=true;
				this.onMetaDataItem=true;
				var req = this.target.getRequest(Components.interfaces.nsIImageLoadingContent.CURRENT_REQUEST);
				if(req && (req.imageStatus & req.STATUS_SIZE_AVAILABLE))
				{
					this.onLoadedImage=true;
				}
				this.imageURL=this.target.currentURI.spec;
				if(this.target.ownerDocument instanceof ImageDocument)
				{
					this.onStandaloneImage=true;
				}
			}
			else
			{
				// обыкновенные сылки
				if(this.target instanceof HTMLInputElement)
				{
					this.onTextInput=this.isTargetATextBox(this.target);
					this.onKeywordField=this.isTargetAKeywordField(this.target);
				}
				else
				{
					if(this.target instanceof HTMLTextAreaElement)
					{
						this.onTextInput=true;
					}
					else
					{
						if(this.target instanceof HTMLHtmlElement)
						{
							var tag = this.target.ownerDocument.getElementsByTagName("body")[0];
							if( tag )
							{
								var b_img = this.getComputedURL(tag ,"background-image");
								if(b_img)
								{
									this.hasBGImage=true;
									this.bgImageURL=makeURLAbsolute(tag.baseURI, b_img);
								}
							}
						}
						else
						{
							if("HTTPIndex" in content&&content.HTTPIndex instanceof Components.interfaces.nsIHTTPIndex)
							{
								this.inDirList=true;
								var x=this.target;
								while(x && !this.link)
								{
									if(x.tagName=="tree")
									{
										break;
									}
									if(x.getAttribute("URL"))
									{
										this.onLink=true;
										
										this.link = {
												href:x.getAttribute("URL"),
												getAttribute:function( t ){
																		if(t=="title")		return x.firstChild.firstChild.getAttribute("label");
																		else				return "";
																	}
												};
												
										if(x.getAttribute("container")=="true")
										{
											this.onSaveableLink=false;
										}
										else
										{
											this.onSaveableLink=true;
										}
									}
									else
									{
										x=x.parentNode;
									}
								}
							}
						}
					}
				}
			}
		}
		
		var osn = "http://www.w3.org/XML/1998/namespace";
		while( elem )
		{
			if(elem.nodeType==Node.ELEMENT_NODE)
			{
				if(!this.onLink&&((elem instanceof HTMLAnchorElement&&elem.href)||elem instanceof HTMLAreaElement||elem instanceof HTMLLinkElement||elem.getAttributeNS("http://www.w3.org/1999/xlink","type")=="simple"))
				{
					this.onLink=true;
					this.onMetaDataItem=true;
					this.link=elem;
					this.linkURL=this.getLinkURL();
					this.linkURI=this.getLinkURI();
					this.linkProtocol=this.getLinkProtocol();
					this.onMailtoLink=(this.linkProtocol=="mailto");
					this.onSaveableLink=this.isLinkSaveable(this.link);
				}
				if(!this.onMetaDataItem)
				{
					if((elem instanceof HTMLQuoteElement&&elem.cite)||(elem instanceof HTMLTableElement&&elem.summary)||(elem instanceof HTMLModElement&&(elem.cite||elem.dateTime))||(elem instanceof HTMLElement&&(elem.title||elem.lang))||elem.getAttributeNS(osn,"lang"))
					{
						this.onMetaDataItem=true;
					}
				}
				if(!this.hasBGImage)
				{
					var _a=this.getComputedURL(elem,"background-image");
					if(_a)
					{
						this.hasBGImage=true;
						this.bgImageURL=makeURLAbsolute(elem.baseURI,_a);
					}
				}
			}
			elem=elem.parentNode;
		}
		var _b="http://www.w3.org/1998/Math/MathML";
		if((this.target.nodeType==Node.TEXT_NODE&&this.target.parentNode.namespaceURI==_b)||(this.target.namespaceURI==_b))
		{
			this.onMathML=true;
		}
		if(this.target.ownerDocument!=window.content.document)
		{
			this.inFrame=true;
		}
	}
	this.getComputedURL = function( tag, b) {
		var url = tag.ownerDocument.defaultView.getComputedStyle(tag,"").getPropertyCSSValue(b);
		return (url.primitiveType==CSSPrimitiveValue.CSS_URI)?url.getStringValue():null;
	}
	this.getLinkURL = function(){
		var href = this.link.href;
		if(href)
		{
			return href;
		}
		var _f=this.link.getAttributeNS("http://www.w3.org/1999/xlink","href");
		if(!href||!href.match(/\S/))
		{
			throw "Empty href";
		}
		href=makeURLAbsolute(this.link.baseURI,href);
		return href;
	},
	this.getLinkURI = function(){
		var x=Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		try
		{
			return x.newURI(this.linkURL,null,null);
		}
		catch(ex)
		{
			return null;
		}
	};
	this.getLinkProtocol = function(){
		if(this.linkURI)
		{
			return this.linkURI.scheme;
		}
		else
		{
			return null;
		}
	}
	this.isLinkSaveable = function( x ){
		return this.linkProtocol&&!(this.linkProtocol=="mailto"||this.linkProtocol=="javascript"||this.linkProtocol=="news"||this.linkProtocol=="snews");
	};
	this.isTextSelection = function(){
		var fl = false;
		var sel = this.searchSelected(16);
		var str;
		if(sel)
		{
			str = sel.toString();
			if(str.length>15)
			{
				str=str.substr(0,15)+"...";
			}
			fl = true;
		}
		return fl;
	};
	
	this.isContentSelection = function(){
		return !document.commandDispatcher.focusedWindow.getSelection().isCollapsed;
	};
	this.searchSelected = function( len ){
		var w = document.commandDispatcher.focusedWindow;
		var sel=w.getSelection();
		sel=sel.toString();
		if(!len)
		{
			len=150;
		}
		if(len<sel.length)
		{
			var z = new RegExp("^(?:\\s*.){0,"+len+"}");
			z.test(sel);
			sel=RegExp.lastMatch;
		}
		sel=sel.replace(/^\s+/,"");
		sel=sel.replace(/\s+$/,"");
		sel=sel.replace(/\s+/g," ");
		return sel;
	}
	

	
	// ================================================================================
	// проверка на первый старт	
	this.is_first_start = function(callback, anyWayCallback) {
	
		var xai = Components.classes['@mozilla.org/xre/app-info;1'].getService(Components.interfaces.nsIXULAppInfo);
		var vc = Components.classes['@mozilla.org/xpcom/version-comparator;1'].getService(Components.interfaces.nsIVersionComparator);
		
		var isFirstStart = false;
		
		if (vc.compare(xai.platformVersion, '1.9.3') >= 0)
		{			
			// works via addon manager
			AddonManager.getAddonByID(EXTENSION_GUID, function(addon)
			{				
				
				var lastVersion = self.branch.getCharPref('sp_last_used_version');
				
				if( lastVersion != addon.version )
				{
					if( callback )			callback();
					
					isFirstStart = true;						
						
					self.branch.setCharPref('sp_last_used_version', addon.version);
				}
				
				if( anyWayCallback )
				{
					var isFirstRun = self.branch.getBoolPref('is_first_run');
					
					if( isFirstRun )		self.branch.setBoolPref('is_first_run', false);
					
					anyWayCallback( isFirstStart, isFirstRun );
				}
			});
		} 
		else
		{
			// works via extension manager
			try
			{
				var loc = Components.classes['@mozilla.org/extensions/manager;1']
						.getService(Components.interfaces.nsIExtensionManager)
						.getInstallLocation(EXTENSION_GUID)
						.location;

				if (loc)
				{ 
					loc.append(EXTENSION_GUID);
					if (loc.exists())
					{
						var last_install = '';
						try
						{
							last_install = this.branch.getCharPref('install_date');
			        	
						} catch (e) {}

						if (loc.lastModifiedTime.toString() != last_install)
						{
							try
							{
                				this.branch.setCharPref('install_date', loc.lastModifiedTime.toString());
							} 
							catch (e) {}
							if ((callback != undefined) && (typeof(callback) == 'function')) callback();
							
							isFirstStart = true;
						}
					}
					
					if( anyWayCallback )	anyWayCallback( isFirstStart );
				}
			} catch (e) {}
		}
	};


	//  иконка в панели дополнений
	this.is_status_button_exists = function(){
		
		var exists = false;	
		var ff3StatusButton = document.getElementById( "sp_single_status_bar" );
		if( ff3StatusButton )
		{
			if( !ff3StatusButton.hasAttribute("hidden") )				exists = true;
		}
		return exists;
	}
	
	this.status_button_insert = function(){
		
		var ff3StatusButton = document.getElementById( "sp_single_status_bar" );
		if( ff3StatusButton )
		{
			ff3StatusButton.removeAttribute( "hidden" );
			self.registry.setBoolPref('display.statusbar_button', true);
			return;
		}
	}

	this.status_button_remove = function(){
		
		var ff3StatusButton = document.getElementById( "sp_single_status_bar" );
		if( ff3StatusButton )
		{
			ff3StatusButton.setAttribute( "hidden", true );
			
			self.branch.setBoolPref('display.statusbar_button', false);
			
			return;
		}
	}	


	
	this.openInNewTab = function( url ){
		var browser = window.getBrowser();
		var tab = browser.addTab(url);
		if (tab) browser.selectedTab = tab;		
	}
	
	this.load_installed_page = function( firstRun )
	{
		try
		{
			var url = "";
			
			var osString = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;  
			
			if( osString == "Darwin" )
			{
				url = "http://flashvideodownloader.org/welcome-firefox-mac.php";
			}
			else if( osString != "Linux" )
			{				
				if( firstRun )		url = "http://flashvideodownloader.org/fvd-suite/to/s/welcome_ff_mozil/";
				else				url = "http://flashvideodownloader.org/fvd-suite/to/s/update_ff_mozill/";
			}		
			
//			if( url )	this.openInNewTab( url );



		} catch (e) {}
	};
	
	
	
	this.settings_observer_struct = {
	observe : function(aSubject, aTopic, aData)
	{
		switch ( aTopic )
		{
			case 'domwindowclosed':
			{
				if (aSubject == self.settings_window)
				{
					self.settings_window = null;
				}
				break;
			}

			case "FVD.Single-StatusButton-Change":
				var exists = fvd_single.is_status_button_exists();
				if (exists.toString() != aData.toString())
				{
					if (exists)
					{
						self.status_button_remove.call(self);
					} 
					else
					{
						try{
							self.status_button_insert.call(self);
						}
						catch( ex ){

						}
					}
				}
				break;
			
			break;

			case 'nsPref:changed':
			{
				switch (aData)
				{
					case 'hotkey.button':
					case 'hotkey.modifier':
					{
						var k = self.registry.getCharPref('hotkey.button');
						var m = self.registry.getCharPref('hotkey.modifier');
						self.install_hotkey.call(self, k, m);
						break;
					}
				}
				
				//dump( "CHANGE " + aData + "\r\n" );
				
			}
		}
	}};

	this.refreshContextMenus = function(){
		// install FF menus
		var tabContextMenu = document.getElementById( "tabContextMenu" );
		var contentAreaContextMenu = document.getElementById( "contentAreaContextMenu" );	
		
		if( !document.getElementById( "safe_preview_context_search" ) )
		{
			var tabMenu = document.getElementById( "safe_preview___context_search" ).cloneNode( true );			
			tabMenu.setAttribute( "id", "safe_preview_context_search" );
			
			if(contentAreaContextMenu)
			{
				contentAreaContextMenu.appendChild( tabMenu );
//				document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",function(evt)		{
//									self.previewContextMenuPopup( evt);
//								},false);
			}
			
//			var menupopup=document.createElement("menupopup");
//			menupopup.setAttribute( "label", "safe_preview_context_search" );
//			menu.appendChild(menupopup);
			
			
		}
		
	}	

	//---------------------------------------- init -------------------------------------
	this.init = function()
	{
	
		this.registry = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);	
		this.branch = this.registry.getBranch(SETTINGS_KEY_BRANCH);
		
		this.registry.QueryInterface(Components.interfaces.nsIPrefBranch2);
		
		this.registry.addObserver('', this.settings_observer_struct, false);

		this.observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
		this.observer.addObserver(this.settings_observer_struct, 'FVD.Single-StatusButton-Change', false);

		try
		{
			this.spLink = new SP_SINGLE_LINK();		
			this.spLink.init(this.branch);
			
			this.spSafe = new SP_SINGLE_SAFE();			
			this.spSafeGoogle = new SP_SINGLE_SAFE_GOOGLE();			
			this.spSafeMcAfee = new SP_SINGLE_SAFE_MCAFEE();			
			this.spSafeNorton = new SP_SINGLE_SAFE_NORTON();			
			this.spSafeWOT = new SP_SINGLE_SAFE_WOT();			
			this.spSafeAvast = new SP_SINGLE_SAFE_AVAST();			
			this.spSafeTrust = new SP_SINGLE_SAFE_TRUST();			
			this.spSafeDrWeb = new SP_SINGLE_SAFE_DRWEB();			
			
			this.spPreview = new SP_SINGLE_PREVIEW();			
			
			this.spWebcache = new SP_SINGLE_WEBCACHE();			
			
			this.spLive = new SP_SINGLE_LIVE();			
			this.spLive.init(this.branch);
		}
		catch( ex ){	alert(ex);	}	

		// база данных
		try
		{
	        this.storage = sp_single_Storage;			
		}
		catch( ex ){		}	
		
		
		// устанавливает слушатель прогресса отслеживания загрузки документов
		gBrowser.addProgressListener(this.browser_progress_listener);
		
		// устанавливает событие на DOMContentLoaded
		gBrowser.addEventListener("DOMContentLoaded", function( elem ) {
								self.browser_dom_loaded_listener(elem);
							},false);
		
		
		// событие на закрытие страницы
		gBrowser.tabContainer.addEventListener("TabClose", this.handlerTabClosing, false);
		
		// событие на выбор страницы
		gBrowser.tabContainer.addEventListener("TabSelect", this.handlerTabSelect, false);

//		gBrowser.tabContainer.addEventListener("TabAttrModified", this.handlerTabAttrModified, false);
//		gBrowser.tabContainer.addEventListener("SSTabRestored", function(event) {  Log('SSTabRestored');     }, false);
//		gBrowser.tabContainer.addEventListener("TabOpen", function(event) {  Log('TabOpen');     }, false);
//		gBrowser.tabContainer.addEventListener("TabMove", function(event) {  Log('TabMove');     }, false);

		//gBrowser.tabContainer.addEventListener("TabHide", self.handlerTabHide, false);

		// позиция мыши
		gBrowser.addEventListener("mousemove", function(event) {
								self.mouse_x = event.clientX;
								self.mouse_y = event.clientY;
							}, false);
		
		try
		{
			AddonManager.addAddonListener( this.addonListener );			
		}
		catch( ex ){		}

		this.refreshContextMenus();
		
		
		// check for first start
		this.is_first_start(
								function(){		}, 
								function( isFirstStart, isFirstRun ){
										if( isFirstStart )
										{
											var countersBranch = self.registry.getBranch(COUNTERS_KEY_BRANCH);
											if( isFirstRun )
											{
												self.status_button_insert();
												self.load_installed_page( true );		
											}
											else
											{
												self.load_installed_page();	
											}	
										}
			
									});

		// считать хосты
		this.read_list_host(  );
		
		
		// в панели дополнений показать значок аддона	
/*		if (this.registry.getBoolPref('display.statusbar_button'))
		{
			var sb = document.getElementById('sp_single_status_bar');
			if(sb)		sb.removeAttribute( "hidden" );
		}*/
		
	};
	
	// -----------------------------------------------
    this.addonListener = {
		onDisabling: function( addon ){
			if( TOOLBAR_ID == addon.id ){
				sp_single.registry.setBoolPref( 'toolbar_user_disabled', true );
			}
		},
		onEnabling: function( addon ){
			if( TOOLBAR_ID == addon.id ){
				sp_single.registry.setBoolPref( 'toolbar_user_disabled', false );
			}		
		},
		onOperationCancelled: function( addon ){
			if( TOOLBAR_ID == addon.id ){
				sp_single.registry.setBoolPref( 'toolbar_user_disabled', false );
			}
		}	
	};

	// ------------------------------ выполняется при закрытии
	this.uninit = function()
	{
		gBrowser.removeEventListener('DOMContentLoaded', this.browser_dom_loaded_listener, false);
		gBrowser.removeProgressListener(this.browser_progress_listener);
	};


	
	
	// ---------------------------------------------------  событие на LOAD
	window.addEventListener('load', function ( event ) {
		Log('---------addEventListener  LOAD --------------');

		try
		{
			self.init.call(self);			
		}
		catch( ex ){		}
	}, false);
	
	// ---------------------------------------------------  событие на UNLOAD
	window.addEventListener('unload', function() {self.uninit.call(self)}, false);

	window.addEventListener("mousemove", function(event) {
		self.mouse_w_x = event.clientX;
		self.mouse_w_y = event.clientY;
		}, false);
	
}

var sp_single = new SP_SINGLE();

