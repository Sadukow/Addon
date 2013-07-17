try
{
	// try import addon manager for extension version detection in firefox4
	Components.utils.import('resource://gre/modules/AddonManager.jsm');

} catch (e) {}


Components.utils.import("resource://fvd.single.modules/ad.js");
Components.utils.import("resource://fvd.single.modules/superfish.js");

function FVD_SINGLE()
{	
	const DISPLAY_FVDSD_HINT_AFTER = 3600 * 24 * 5 * 1000; // five days after install
	const DISPLAY_FVDSD_HINT_EVERY = 3600 * 24 * 1 * 1000; // one day
	const EXTENSION_GUID = 'artur.dubovoy@gmail.com';
	const TOOLBAR_ID = "{9051303c-7e41-4311-a783-d6fe5ef2832d}";
	const SETTINGS_KEY_BRANCH = 'fvd_single.';
	const COUNTERS_KEY_BRANCH = SETTINGS_KEY_BRANCH + 'counters.';
	const MEDIA_EXTENSIONS_PPT = 'mpg|mpeg|mp3|mp4|avi|rm|wmv|mov|flv|swf';
	const TITLE_MAX_LENGTH = 32;
	const EMBED_URLS_RX = [

		{
			tst: '\\.youtube\\.com',
			rx : 'youtube\\.com/v/(.{11})',
			rep : 'http://www.youtube.com/watch?v=$1'
		},

		{
			tst: '\\.youtube-nocookie\\.com',
			rx : 'youtube-nocookie\\.com/v/(.{11})',
			rep : 'http://www.youtube.com/watch?v=$1'
		},

		{
			tst: '\\.santabanta\\.com',
			rx : 'video_id=([\\d]+)',
			rep : 'http://www.santabanta.com/video.asp?video=$1',
			attr: 'flashvars'
		},

		{
			tst: 'video\\.google\\.com',
			rx : 'docid=([0-9\-]+)',
			rep : 'http://video.google.com/videoplay?docid=$1'
		},

		{
			tst: 'mediaservices\\.myspace\\.com',
			rx : 'embed.aspx/m=([\\d]+)',
			rep : 'http://vids.myspace.com/index.cfm?fuseaction=vids.individual&videoid=$1'
		},

		{
			tst: '\\.collegehumor\\.com',
			rx : 'clip_id=([\\d]+)',
			rep : 'http://www.collegehumor.com/video:$1'
		},

		{
			tst: '\\.metacafe\\.com',
			rx : 'fplayer/([\\d]+)/(.*)\\.swf',
			rep : 'http://www.metacafe.com/watch/$1/$2/'
		},

		{
			tst: '\\.dailymotion\\.com',
			rx : 'swf/([^&]+)',
			rep : 'http://www.dailymotion.com/video/$1'
		},

		{
			tst: '\\.dada\\.net',
			rx : 'mediaID=([\\d]+)',
			rep : 'http://ru.dada.net/video/$1/',
			attr: 'flashvars'
		},

		{
			tst: '\\.redtube\\.com',
			rx : '\\?id=([\\d]+)',
			rep : 'http://www.redtube.com/$1'
		}
	];

	const BAD_LOCATIONS_FOR_SUPPORTED_SITES = ['/', '/index.php', '/index.htm', '/index.html', '/index.asp'];
	const SHORT_URLS_PROTO = ['http', 'https', 'ftp', 'ftps', 'ed2k'];

	this.contract = "fvd.single";

	var self = this;
	this.download_window = null;
	this.settings_window = null;

	this.downloadIdsUrls = {};

	this.supported = false;
	this.downloading = 0;
	this.detector = null;
	this.sniffer = null;
	this.registry = null;
	this.observer = null;
	
	this.silentMode = false; // activated if fvd toolbar installed
	
	this.downloadInstance = null;
	
	this.faviconsCache = {};
	
	this.downloadWindowFeatures = 'chrome,titlebar=yes,centerscreen,dialog=yes,minimizable=yes,close=yes,resizable=yes';
	
	var ytCookiesCleared = false;
	
	var prefsGlobal = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	
	var downloadListener = {
		
		onSecurityChange : function(prog, req, state, dl)
		{
		},

		onProgressChange : function(aWebProgress, req, prog, progMax, tProg, tProgMax, dl)
		{		
			var urlHash = fvd_single.downloadInstance.md5( dl.source.spec );
	
			var menuId = "menu_" + urlHash;
			
			var menuElem = document.getElementById(menuId);
			
			if( !menuElem )		return;
				
			var percents = document.getAnonymousElementByAttribute(menuElem, "class", "fvd-speed-dial-fastmenu-item-percentage");
			//dump( "SET PROGRESS " + prog + "/" + progMax + " = " + prog / progMax + "\n" );
			//percents.setAttribute( "value", Math.round( prog / progMax * 100 ) + "%" );
			percents.textContent = Math.round( prog / progMax * 100 ) + "%";
		},

		onStateChange : function(prog, req, flags, status, dl)
		{						
			var urlHash = fvd_single.downloadInstance.md5( dl.source.spec );
			
			var menuId = "menu_" + urlHash;
			
			var menuElem = document.getElementById(menuId);
			
			if( !menuElem )				return;

			switch (dl.state)
			{
				case Components.interfaces.nsIDownloadManager.DOWNLOAD_QUEUED:          // START  (5)
					self.downloading++;
				break;
				
				
				case Components.interfaces.nsIDownloadManager.DOWNLOAD_DOWNLOADING:     // ВОЗОБНОВИТЬ (0)
				
					self.setFastMenuDownloadState( menuElem, "downloading" );		
					self.downloading++;
				
				break;
				
				case Components.interfaces.nsIDownloadManager.DOWNLOAD_FINISHED:		// (1)
				case Components.interfaces.nsIDownloadManager.DOWNLOAD_SCANNING:		//  (7)
				{
					self.setFastMenuDownloadState( menuElem, "not" );	
					self.downloading--;

					var label = menuElem.getAttribute( "label" );
					self.show_win_download(label, 3);
					break;
				}

				case Components.interfaces.nsIDownloadManager.DOWNLOAD_CANCELED:
				{
					self.setFastMenuDownloadState( menuElem, "not" );
					self.downloading--;
					
					break;
				}

				case Components.interfaces.nsIDownloadManager.DOWNLOAD_PAUSED:           // (4)
				
					self.setFastMenuDownloadState( menuElem, "paused" );
					self.downloading--;
					
					break;
				

                case Components.interfaces.nsIDownloadManager.DOWNLOAD_FAILED:
				case Components.interfaces.nsIDownloadManager.DOWNLOAD_BLOCKED_PARENTAL:
				case Components.interfaces.nsIDownloadManager.DOWNLOAD_BLOCKED_POLICY:
				{
					
					self.setFastMenuDownloadState( menuElem, "not" );
					self.downloading--;
					
					break;
				}
			}
			
			self.alert(self.downloading);
			self.setup_buttons.call(self);
			
		},

		onDownloadStateChange : function(state, dl)
		{
		}
	};
	
	this.downloadInfoByUrlHash =  function( urlHash ){
		
		var dm = Components.classes["@mozilla.org/download-manager;1"].getService(Components.interfaces.nsIDownloadManager);		
		var enumerator = dm.activeDownloads;
		
		while( enumerator.hasMoreElements() ){
			var download = enumerator.getNext().QueryInterface( Components.interfaces.nsIDownload );
			if( self.downloadInstance.md5( download.source.spec ) == urlHash ){
				return download;
			}
		}
				
		return null;
	}
	
	this.setting_reload = function()
	{
		var numTabs = gBrowser.browsers.length;;
		
		for (var index = 0; index < numTabs; index++) 
		{
			var currentBrowser = gBrowser.getBrowserAtIndex(index);
			this.sniffer.remove_files_by_page_url(currentBrowser.currentURI.spec);
			
			currentBrowser.reload();
		}
	};

	this.alert = function(text)
	{
		var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
		aConsoleService.logStringMessage(text);
	};

	this.navigate_url = function(url, event)
	{
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		                       .getInterface(Components.interfaces.nsIWebNavigation)
		                       .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
		                       .rootTreeItem
		                       .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		                       .getInterface(Components.interfaces.nsIDOMWindow);
        var browser = mainWindow.getBrowser();
	
		if (browser)
		{
			var in_new_page = this.registry.getBoolPref('in_new_tab');
			if (in_new_page)
			{
				var tab = browser.addTab(url);
				if (tab) browser.selectedTab = tab;
			} else
			{
				if (event)
				{
					var shift = event.shiftKey;
					var ctrl = event.ctrlKey;
					if (ctrl) 
					{    
						var tab = browser.addTab(url);
						if (tab) browser.selectedTab = tab;
		
					} else if (shift)
					{
						window.openDialog('chrome://browser/content/browser.xul', '_blank', 'chrome,all,dialog=no', url);
					} else
					{
						browser.loadURI(url);
					}
				} else
				{
					browser.loadURI(url);
				}
			}
		}
	};
	
	this.notDisplaySetupNote = function( value ){
		try{
			this.registry.setBoolPref('single.dont_display_features_hint', value);
		}
		catch(ex){
			dump("EX " + ex.message);
		}
	}
	
	this.closeSetupNote = function(){
		document.getElementById("fvd-setup-note").hidePopup();	
	}
	
	this.handlerTabClosing = function(event){
		try{
			var browser = gBrowser.getBrowserForTab(event.target);			
			self.removeMediaForUrl( browser.currentURI.spec );		
		}
		catch( ex ){
			dump( "EX " + ex.message + "\r\n" );
		}
	}
	
	this.removeMediaForUrl = function( url ){
		// remove media from sniffer
		this.sniffer.remove_files_by_page_url( url );
		
		// notify download window
		var args = {};
		args['window'] = window;
		args.url = url
		args.wrappedJSObject = args;
		
		this.observer.notifyObservers(args, 'FVD.Single-Download-Close-Tab', true);
	}
	
	this.tools_menu_showing = function(event)
	{
		
		fvd_single_AD.getRotateItem( {
			num: "buttonmenu"
		}, function( item ){
			
			if( prefsGlobal.getCharPref("general.useragent.locale").indexOf("ru") != -1 ){
				item = {
					url: "http://fvdsearch.com/mac/go.php?sid=8",
					title: "Купим и доставим товар из США"
				};
			}
			
			if( item ){
				var elems = document.getElementsByClassName( "fvd_tools_free_registry_scan" );
				
				for( var i = 0; i != elems.length; i++ ){
					var elem = elems[i];
					
					elem.setAttribute("label", item.title);
					elem.setAttribute("adurl", item.url);												
				}

			}
			
		} );
		
		var menu = event.originalTarget;
		try
		{
			var val = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch).getBoolPref('javascript.enabled');
			var it = (document.evaluate('.//xul:menuitem[@id="fvd_single_tools_js_enabled"]', menu, this.xul_ns_resolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null)).singleNodeValue;
			if (it != null)
			{
				if (val == true)
				{
					it.setAttribute('checked', 'true');
				} else
				{
					it.removeAttribute('checked');
				}
			}

		} catch (e) {}
	};

	this.tools_menu_command = function(event)
	{
		var it = event.originalTarget;

		event.stopPropagation();
		switch (it.id)
		{
			case 'fvd_single_tools_short_urls':
			{
				var location = gBrowser.webNavigation.currentURI;
				var url = '';
				if (SHORT_URLS_PROTO.indexOf(location.scheme) != -1) url = location.spec;
				openDialog('chrome://fvd.single/content/fvd_short_urls.xul', null, 'chrome,titlebar=yes,centerscreen,modal,dialog=yes,minimizable=no,resizable=no,close=yes', url);
				break;
			}

			case 'fvd_single_tools_js_enabled':
			{
				try
				{
					var reg = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
					reg.setBoolPref('javascript.enabled', !reg.getBoolPref('javascript.enabled'));

				} catch (e){}
				break;
			}

			case 'fvd_single_tools_check_ip':
			{
				this.navigate_url('http://x2t.com/ip-check/', event);
				break;
			}

			case 'fvd_single_tools_speed_test':
			{
				this.navigate_url('http://x2t.com/test-internet-speed/', event);
				break;
			}

			case 'fvd_single_tools_share_urls':
			{
				var location = gBrowser.webNavigation.currentURI;
				var url = '';
				if (SHORT_URLS_PROTO.indexOf(location.scheme) != -1) url = location.spec;
				
				var arg =  {
					'accept': false,
					'value' : url,
					'type': 'share_url'
				}
		
				openDialog('chrome://fvd.single/content/fvd_input_window.xul', null, 'chrome,titlebar=yes,centerscreen,modal,dialog=yes,minimizable=no,resizable=no,close=yes', arg);
				if (arg.accept == true) this.navigate_url('http://www.addthis.com/bookmark.php?url=' + arg.value, event);
				break;
			}

			case 'fvd_single_tools_whois':
			{
				var location = gBrowser.webNavigation.currentURI;
				var domain = '';
				try
				{
					if (location != null) domain = location.host;

				} catch (e) {}
				
				var arg = {
					type:'whois',
					value: domain,
					accept: false
				};
				
				openDialog('chrome://fvd.single/content/fvd_input_window.xul', null, 'chrome,titlebar=yes,centerscreen,modal,dialog=yes,minimizable=no,resizable=no,close=yes', arg);
				if (arg.accept == true) this.navigate_url('http://x2t.com/whois/?domain=' + arg.value, event);
				break;
			}
			
            case 'fvd_tools_free_registry_scan':{
                //this.navigate_url('http://www.uniblue.com/cm/flashvideodownloader/speedupmypc/toolbarlink/download/?aff=19825', event);
                this.navigate_url('http://www.uniblue.com/cm/general/speedupmypc/spunit/download/?aff=19825', event);				
                break;
            }	
		}
	};


	this.display_search = function(event)
	{
		var it = event.originalTarget;
		var panel = document.getElementById('fvd_single_search_panel');
		var textbox = document.getElementById('fvd_single_search_text');
		if (textbox)
		{
			textbox.value = '';
			var search_button = document.getElementById('fvd_single_search_button');
			if (search_button) search_button.setAttribute('disabled', (textbox.value == ''));
		}

		if (it.parentNode.parentNode.getAttribute('id') == 'fvd_single_button')
		{
			// via button
			var button = document.getElementById('fvd_single_button');
			panel.openPopup(button, 'after_start', 0, 0, false, false);
		} else
		{
			// via toolbar
			var button = document.getElementById('fvd_single_status');
			panel.openPopup(button, 'before_end', 0, 0, false, false);
		}

		event.stopPropagation();
	};

	this.input_search = function(event)
	{
		var textbox = event.originalTarget;
		var search_button = document.getElementById('fvd_single_search_button');
		if (search_button) search_button.setAttribute('disabled', (textbox.value == ''));
	};

	this.keypress_search = function(event)
	{
		if (event.keyCode == event.DOM_VK_RETURN) this.start_search(event);
	};

	this.start_search = function(event)
	{
		var panel = document.getElementById('fvd_single_search_panel');
		var text = (document.getElementById('fvd_single_search_text')).value;
		panel.hidePopup();
	
		if (text)
		{
			var url = 'http://fvdvideo.com/search/?q=' + encodeURIComponent(text);
			this.navigate_url(url, event);
		}
	};

	this.goto_site = function(event, type)
	{
		var url = '';
		switch (type)
		{
			case 'help':
			{
				url = 'http://www.flashvideodownloader.org/helpfirefox.php';
				break;
			}

			case 'video_converter':
			{
				url = 'http://flashvideodownloader.org/fvd-suite/to/s/ff_mozilla_conve/';
				break;
			}

			case 'feedback':
			{
				url = 'http://www.flashvideodownloader.org/fvd-suite/contact/index.php';
				break;
			}
			
			case "android_version":
			
				url = 'https://play.google.com/store/apps/details?id=com.fvd';
			
			break;
			
			case "betterfox":
			
				url = 'https://addons.mozilla.org/En-us/firefox/addon/betterfox/';
			
			break;
}

		if (url)
		{
			this.navigate_url(url, event);
			event.stopPropagation();
		}
	};

	this.display_settings = function(event)
	{
		if (this.settings_window == null)
		{
			var ww = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].getService(Components.interfaces.nsIWindowWatcher);
			if (ww)
			{
				this.settings_window = ww.openWindow(window, 'chrome://fvd.single/content/fvd_settings.xul', '', 'chrome,titlebar=yes,toolbar,centerscreen,dialog=yes,minimizable=no,close=yes,dependent=yes', null);
				ww.registerNotification(this.settings_observer_struct);
			}
		} else
		{
			this.settings_window.focus();
		}
		event.stopPropagation();
	};

	this.check_usage_license = function()
	{
		var usage_accepted = this.registry.getBoolPref('license.usage.agree');
		if (!usage_accepted)
		{
			var arg = {
				title: 'fvd.single.license.usage.title',
				ddw: false,
				url: 'chrome://fvd.single/locale/fvd.single.license.usage.txt'
			};
			openDialog('chrome://fvd.single/content/fvd_license.xul', null, 'chrome,titlebar=yes,centerscreen,modal,dialog=yes,minimizable=no,close=yes', arg);

			if (arg.accept == true)	
			{
				usage_accepted = true;
				try
				{
					this.registry.setBoolPref('license.usage.agree', true);

				} catch (e) {}
			}
		}

		return usage_accepted;
	};

	this.check_adult_license = function()
	{
		var adult_accepted = this.registry.getBoolPref('license.adult.agree');
		if (!adult_accepted)
		{
			var arg = {
				title: 'fvd.single.license.adult.title',
				ddw: true,
				url: 'chrome://fvd.single/locale/fvd.single.license.adult.txt'				
			}
			openDialog('chrome://fvd.single/content/fvd_license.xul', null, 'chrome,titlebar=yes,centerscreen,modal,dialog=yes,minimizable=no,close=yes', arg);

			if (arg.accept)	
			{
				adult_accepted = true;
				if (arg.ddw)
				{
					try
					{
						this.registry.setBoolPref('license.adult.agree', true);
				
					} catch (e) {}
				}
			}
		}

		return adult_accepted;

	};


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


	this._getYoutubeMedia = function( doc ){
		var emb_res = doc.evaluate('//embed[@src]', doc.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		var i = emb_res.iterateNext();
		
		if( i == null ){
			return false; // this is not video page
		}
		
		var content = doc.body.innerHTML;
		
		var head = doc.getElementsByTagName("head")[0].innerHTML;
		
		content = head + content;
		
		// search formats string
		var info = null;						
		
		var media = null;
		
		// search in embeds
		
		var jsr = content.match(/<embed[^>]+flashvars="([^\"]+?)"/i);
				
		if (jsr != null) {
			var tmp = jsr[1].split('&amp;');
			for (var i = 0, j = tmp.length; i < j; i++) {
				if (tmp[i].indexOf('fmt_url_map') == 0) {
					info = (decodeURIComponent(tmp[i].substr(tmp[i].indexOf('fmt_url_map') + 12)));	
					break;
				}
			}
		}
		
		/*
		var embed = doc.getElementsByTagName("embed")[0];
		if( embed ){
			var tmp = embed.getAttribute("flashvars").split('&');
			
			for (var i = 0, j = tmp.length; i < j; i++) {
				if (tmp[i].indexOf('fmt_url_map') == 0) {
					info = (decodeURIComponent(tmp[i].substr(tmp[i].indexOf('fmt_url_map') + 12)));	
					break;
				}
			}
		}
		*/
		
		if( !info ){					
			var jsr = content.match(/"fmt_url_map"\s*:\s*"(.+?)"/i);
			if (jsr) {				
				info = JSON.parse("\"" + jsr[1] + "\"");//jsr[1].replace("\u0026", "&");			
			}
		}
									
		
		if (info) {
			var list = document.getElementById('fvd_single_download_snipets_list');
			
			
			var formats = {};
			var map = info.split(',');
			map.forEach(function(el, i, a){
				var mk = el.split('|');
				if (mk.length == 2) {
					formats[mk[0]] = mk[1];
				}
			});
			
			var ytf = {
			
				37: {
					title: 'Full HD',
					frm: 'mp4'
				},
				22: {
					title: 'HD',
					frm: 'mp4'
				},
				35: {
					title: 'High',
					frm: 'flv'
				},
				34: {
					title: 'Low',
					frm: 'flv'
				},
				18: {
					title: 'SD',
					frm: 'mp4'
				},
				6: {
					title: ' Low',
					frm: 'flv'
				},
				5: {
					title: 'Low ',
					frm: 'flv'
				},
				17: {
					title: 'Mobile',
					frm: '3gp'
				},
				13: {
					title: 'Mobile ',
					frm: '3gp'
				}
			};
			
			var title = content.match(/<meta\sname=\"title\" content=\"([^\"]+)\">/i);
			if (title != null) {
				title = self.decode_html.call(self, self.decode_html.call(self, title[1]));
				if (title.length > TITLE_MAX_LENGTH) 
					title = title.substr(0, TITLE_MAX_LENGTH) + '...';
			}
			
			var items = {};
			var media = {};
			var node = doc.getElementById("movie_player");
			for (var i in formats) {
				var u = formats[i];
					
				var ft = ((title != null) ? title + ' (' + ytf[i].title + ')' : null);
				
				// google player can append some parameters to video URL
				/*
				for (var jj in self.media) {
					if (jj.indexOf(u) == 0) {
						var bi = (document.evaluate('./xul:hbox[@url="' + jj + '"]', list, self.xul_ns_resolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null)).singleNodeValue;
						if (bi != null) {
							var bb = (document.evaluate('./xul:button', bi, self.xul_ns_resolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null)).singleNodeValue;
							if ((bb != null) && (!bb.disabled)) {
								list.removeChild(bi);
								delete self.media[jj];
							}
						}
					}
				}
				*/								

				media[u] = {
					display_name: u,
					url: u,
					type: ((i in ytf) ? (ytf[i].title) : 'FLV'),
					node: node,
					ext: ((i in ytf) ? ytf[i].frm : 'FLV'),
					file_title: ft,
					direct: true,
					yt_format: i
				};	
			}
		}
		
		return media;
	}
	
	this._checkYoutubeChannelUrlReady = function( currentUrl, doc ){
		if( !/youtube.com\/user\//i.test(currentUrl) ){
			return true;
		}
		
		var embed = doc.getElementsByTagName("embed")[0];
		if( embed ){
			var info = embed.getAttribute("flashvars");
			
			var tmp = currentUrl.split("#");
			if( tmp.length < 2 ){
				return true;
			}
			
			var hash = tmp[tmp.length - 1];
			
			if( !/\/(.+)$/.test( hash  ) ){
				return true;
			}
			
			tmp = hash.split( "/" );
			var videoId = tmp[tmp.length - 1];
			
			if( info.indexOf( videoId ) != -1 ){
				return true;
			}
			
			return false;
		}
		else{
			return false;
		}	

	}
	
	this._getYoutubeEmbed = function( doc, videoId ){
		// search in embeds		
		var embeds = doc.getElementsByTagName( "embed" );
		for( var i = 0; i != embeds.length; i++  ){
			if( embeds[i].src.indexOf(videoId) != -1 ){
				return embeds[i];
			}
		}
		
		// search in objects
		var objects = doc.getElementsByTagName( "object" );
		for( var i = 0; i != objects.length; i++  ){
			if( objects[i].innerHTML.indexOf(videoId) != -1 ){
				return objects[i];
			}
		}
		
		return null;
	}
	
	this.clearCookiesForHost = function( host ){
		
		var cookieManager = Components.classes["@mozilla.org/cookiemanager;1"]
                   		 .getService(Components.interfaces.nsICookieManager2);
						 
		var cookiesEnum = cookieManager.getCookiesFromHost( host );
		
		while( cookiesEnum.hasMoreElements() ){
			var cookie = cookiesEnum.getNext().QueryInterface(Components.interfaces.nsICookie); ;
			
			cookieManager.remove( cookie.host, cookie.name, cookie.path, false );
		}
					
	}
	
	this.displayYTClearCookieMessage = function( parentWindow ){
		
		if( ytCookiesCleared ){
			return;
		}
		
		ytCookiesCleared = true;
		
		var bundle = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://fvd.single/locale/fvd.single.properties');
		
		parentWindow = parentWindow || window;
		
		var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                              .getService(Components.interfaces.nsIPromptService);
							  
		var result = promptService.confirm( parentWindow, bundle.GetStringFromName( "yt_cookies_trouble.title" ), bundle.GetStringFromName( "yt_cookies_trouble.text" ) );
		
		if( result ){
			
			self.clearCookiesForHost( "youtube.com" );
			self.clearCookiesForHost( "www.youtube.com" );			
			
		}
		
	}

	this.parseFaviconUrl = function (doc){
		var linkTags=doc.getElementsByTagName("link")
		var iconUrl=null;
		for(var i=0;i<linkTags.length;i++){
			var item=linkTags[i];
			if(item.hasAttribute("rel") 
				&& item.getAttribute("rel").indexOf("icon")!=-1
				&& item.hasAttribute("href")){
				iconUrl=item.getAttribute("href");
			} 
		}
		
		var _host = doc.location.host;
		
		if(iconUrl){
			var urlStart=iconUrl.indexOf("//");
			if(urlStart!==-1){
				if(urlStart>1){
					return iconUrl;
				}else{
					var path=iconUrl.substr(urlStart+2);
					return "http://"+path;
				}				
			}else{
				if(iconUrl.substr(0,1)!="/") iconUrl="/"+iconUrl;
				return "http://"+_host+iconUrl;
			}
		}else{
			return _host+"/favicon.ico";
		}
	}

	this.prepareSniffedMedia = function( doc, media ){
		var result = {};
		
		var pageEmbeds = doc.getElementsByTagName( "embed" );
		var pageObjects = doc.getElementsByTagName( "object" );
		var pageVideos = doc.getElementsByTagName( "video" );
		var pageIframes = doc.getElementsByTagName( "iframe" );
		
		/*
		dump( "EMBEDS " + pageEmbeds.length  + "\r\n" );
		dump( "Objects " + pageObjects.length  + "\r\n" );
		dump( "Videos " + pageVideos.length  + "\r\n" );
		dump( "Iframes " + pageIframes.length  + "\r\n" );
		*/
		for (var page_url in media)
		{
			for( var hash in media[page_url] ){				
				var mediaFile = media[page_url][hash];
				var url = mediaFile.url;				
				if ( /*!this.detector.is_supported(url)*/ true ){
					var it = {display_name: mediaFile["display_name"], node: null, url: url, direct:true, ad: this.detector.is_ad(url)};	
					var t = (mediaFile['pn'] ? mediaFile['pn'] : (mediaFile['dn'] ? mediaFile['dn'] : ''));
					if (t) 
						it['file_title'] = t;
					if (mediaFile['ext'])
						it['ext'] = mediaFile['ext'];
					
					if(  "file_title" in mediaFile ){
						it.file_title = mediaFile.file_title;
					}
					
					if(  "raw_file_ext" in mediaFile ){
						it.raw_file_ext = mediaFile.raw_file_ext;
					}
					
					if(  "download_name" in mediaFile ){
						it.download_name = mediaFile.download_name;
					}
					
					if(  "playable" in mediaFile ){
						it.playable = mediaFile.playable;
					}
					
					if(  "type" in mediaFile ){
						it.type = mediaFile.type;
					}		
					
					if(  "height" in mediaFile ){
						it.height = mediaFile.height;
					}
					
					if(  "referer" in mediaFile ){
						it.referer = mediaFile.referer;
					}				
	
					if( "yt_id" in mediaFile ){
						var youtube_id = mediaFile.yt_id;
						it.node = this._getYoutubeEmbed( doc, youtube_id );
						it.yt_id = mediaFile.yt_id;
					}
					
					if( "size" in mediaFile ){
						it.size = mediaFile.size;
					}
	
					
					if( !it.node ){
						if( pageVideos.length == 1 ){
							it.node = pageVideos[0];
						}
						else if( pageEmbeds.length == 1 ){
							it.node = pageEmbeds[0];
						}
						else if( pageObjects.length == 1 ){
							it.node = pageObjects[0];
						}
						else if( pageIframes.length == 1 ){
							it.node = pageIframes[0];
						}						
					}
					
					
					if( !(page_url in result) ){
						result[page_url] = {};
					}
					result[page_url][url] = it;
				}
					
			}
		}
		
		return result;
	}
	
 	this.extendMediaByUrl = function( media, extendData, url ){				
		if( !(url in media) ){
			//media[url] = {};
		}
		
		for( var mediaUrl in extendData ){
			media[url][mediaUrl] = extendData[ mediaUrl ];
		}
		
		return media;
	}
	
	this._searchDocInTabsByUrl = function( url ){
		var numTabs = gBrowser.browsers.length;;
		
		for (var index = 0; index < numTabs; index++) {
			var currentBrowser = gBrowser.getBrowserAtIndex(index);
			if (url == currentBrowser.currentURI.spec) {
				return currentBrowser.contentDocument;
			}
		}
		
		return null;
	}
	
	this.parseFavicons = function( media ){
		var favicons = {};
		for( var pageUrl in media ){
			if( pageUrl in this.faviconsCache ){
				favicons[pageUrl] = this.faviconsCache[pageUrl];
			}
			else{
				var doc = this._searchDocInTabsByUrl( pageUrl );
				if( doc ){
					favicons[pageUrl] = this.parseFaviconUrl(doc);					
				}
				else{
					favicons[pageUrl] = "";
				}
				
				this.faviconsCache[pageUrl] = favicons[pageUrl];
			}			
		}
		
		return favicons;
	}
	
	this._display_download_window = function( updateDownloadWindowPageUrl, focus ){
		if( typeof 	updateDownloadWindowPageUrl == "undefined" ){
			updateDownloadWindowPageUrl = true;
		}
		
		if( typeof focus == "undefined" ){
			focus = true;
		}
				
		// via internal downloader
		var media = {};
		var doc = gBrowser.selectedBrowser.contentDocument;
		var location = gBrowser.webNavigation.currentURI;
		
		// only for youtube check for embeds
		if( this.is_youtube( doc ) ){	
		
		}
		
	
//		var f = this.sniffer.get_files(location.spec);
		var sniffedMedia = this.prepareSniffedMedia( doc, this.sniffer.get_files_all() );
	
	
		media = this.extendMediaByUrl( sniffedMedia, media, location.spec );
		
		var args = {media:media};				
		
		// update download windoe page url url, or simple sends content to window
		if( updateDownloadWindowPageUrl ){
			args.page_url = doc.location.href;					
		}
		else{

		}

		args.favicons = this.parseFavicons( media );
		args.sniffer = this.sniffer;
		
		if (this.download_window == null)
		{
			args.wrappedJSObject = args;
			var ww = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].getService(Components.interfaces.nsIWindowWatcher);
			if (ww)
			{
				this.download_window = ww.openWindow(window, 'chrome://fvd.single/content/fvd_download.xul', '_blank', self.downloadWindowFeatures, args);
				ww.registerNotification(this.settings_observer_struct);
			}
		} else
		{
			args['window'] = window;
			args.wrappedJSObject = args;

			this.observer.notifyObservers(args, 'FVD.Single-Download-New', true);
			if( focus ){
				this.download_window.focus();				
			}
		}	
	}
	
	this.status_button_click = function( event ){
		
		if (this.supported) 
		{
		
			if (!this.check_usage_license()) 	return false;
			
			this.showDownloadWindow(event);
			
		}
		
	}
	
	this.setFastMenuDownloadState = function( menuItem, state ){
		
		menuItem.setAttribute( "download_state", state );
		
		//dump( "SET STATE " + state + "\n" );
		
		var pause = menuItem.getElementsByClassName( "pause" )[0];
		var resume = menuItem.getElementsByClassName( "resume" )[0];	
		var cancel = menuItem.getElementsByClassName( "cancel" )[0];			
		
		pause.setAttribute( "disabled", true );
		resume.setAttribute( "disabled", true );		
		cancel.setAttribute( "disabled", true );		
		
		if( state == "downloading" )
		{
			pause.removeAttribute( "disabled" );
		}
		
		if( state == "paused" )
		{
			resume.removeAttribute( "disabled" );
		}
		
		if( state != "not" )
		{
			cancel.removeAttribute( "disabled" );
		}
		
	}
	
	this.pauseDownload = function( urlHash ){
		var dlInfo = self.downloadInfoByUrlHash( urlHash );
		
		if( dlInfo ){
			try{
				var dm = Components.classes["@mozilla.org/download-manager;1"].getService(Components.interfaces.nsIDownloadManager);
				dm.pauseDownload( dlInfo.id );				
			}
			catch( ex ){
				
			}
		}
	}
	
	this.resumeDownload = function( urlHash ){
		var dlInfo = self.downloadInfoByUrlHash( urlHash );
		
		if( dlInfo ){
			try{
				var dm = Components.classes["@mozilla.org/download-manager;1"].getService(Components.interfaces.nsIDownloadManager);
				dm.resumeDownload( dlInfo.id );				
			}
			catch( ex ){
				
			}
		}
	}	
	
	this.cancelDownload = function( urlHash ){
		var dlInfo = self.downloadInfoByUrlHash( urlHash );
		
		if( dlInfo ){
			try{
				var dm = Components.classes["@mozilla.org/download-manager;1"].getService(Components.interfaces.nsIDownloadManager);
				dm.cancelDownload( dlInfo.id );				
			}
			catch( ex ){
				
			}
		}
	}	

	this.check_like_status = function()
	{	
		try
		{
		    var likeStatus = this.registry.getCharPref("counters.like_status");
			if( likeStatus != "already_done" )
			{
				var y = this.registry.getIntPref("counters.youtube");
				if( likeStatus == "like" )
				{
					return true;
				}				
				else
				{
					if( y >= this.registry.getIntPref( "counters.like_message_after" ) )
					{
						return true;
					}
					else
					{
						return false;
					}
				}
			}
			else
			{
				return false;
			}			
		} catch (e)
		{
			return false;
		}
	}
	
	this.give_us_rating = function(event)
	{	
		//this.navigate_url( "https://addons.mozilla.org/en-US/firefox/addon/flash-video-downloader-youtube/reviews/" );
		this.navigate_url( "http://flashvideodownloader.org/fvd-suite/to/s/rate_ff_cn" );
	}
	
	this.main_button_click = function( event ){
		
		try{
			if (this.supported)
			{
			
				if (!this.check_usage_license()) return false;
				var location = gBrowser.webNavigation.currentURI;
				if (this.detector.is_adult(location.spec) && (!this.check_adult_license())) return false;
	
				if (this.detector.is_supported(location.spec))
				{
					if (BAD_LOCATIONS_FOR_SUPPORTED_SITES.indexOf(location.path) != -1)
					{
						try
						{
							var bundle = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://fvd.single/locale/fvd.single.properties');
							var nb = getBrowser().getNotificationBox();
							var n = nb.getNotificationWithValue('popup-blocked');
							if (n)
							{
								    n.label = bundle.GetStringFromName('errmsg.unsupported_from_root');
							} else 
							{
								const priority = nb.PRIORITY_WARNING_MEDIUM;
								nb.appendNotification(bundle.GetStringFromName('errmsg.unsupported_from_root'), 'popup-blocked', 'chrome://fvd.single/skin/fvd.single.notify.unsupported.png', priority, null);
							}
						} catch (e) {}
					} else
					{
						// via site
						this.navigate_url('http://www.flashvideodownloader.org/download2.php?u=' + location.spec, event);
					}
				} 
				else
				{
					if( this.registry.getCharPref("default_mode") == "full" )
					{
						this.showDownloadWindow(  );
						return;
					}
					
					
					var menu = document.getElementById("fvd_single_streams_menu");
					
					// setup converter link
					try
					{
						fvd_single_AD.getRotateItem( null, function( item ){
														
							if( item )
							{
								var converterMenu = menu.getElementsByClassName( "converter" )[0];
								converterMenu.setAttribute( "label", item.title );
								converterMenu.setAttribute( "adurl", item.url );							
							}
							else{						
							}
							
						} );
					}
					catch(ex){
						dump( ex + "\n" );
					}
					
					var location = gBrowser.webNavigation.currentURI;
					var doc = gBrowser.selectedBrowser.contentDocument;
					
					var sniffedMedia = this.prepareSniffedMedia( doc, this.sniffer.get_files_all() );		
				
					var media = {};
					media = this.extendMediaByUrl( sniffedMedia, media, location.spec );
					
					var haveTypedMedia = false;
					for( var k in media )
					{
						for( var j in media[k] )
						{
							if( "type" in media[k][j] )
							{
								haveTypedMedia = true;
								break;
							}							
						}						
					}
					
					if( haveTypedMedia )
					{
						// remove not typed media
						for( var k in media )
						{
							for( var j in media[k] )
							{
								if( !("type" in media[k][j]) )
								{
									delete media[k][j];
								}								
							}							
						}
					}
					
					// remove childs
					while( menu.childNodes.length != 8 )
					{
						menu.removeChild( menu.firstChild );
					}
					
					// Rate us MenuItem
					var rb = document.getElementById('fvd_single_rate_us');
					if (this.check_like_status()) rb.hidden = false;
											 else rb.hidden = true;
					
					var fullModeButton = menu.getElementsByClassName("fullmode")[0];
					if( !fullModeButton )		return false;	
					
					for( var i in media ){
						if( i != location.spec ){
							continue;
						}
						var  m = media[i];
						for( k in m )
						{
							var elem = document.getElementById("fvd_single_fast_menu_item_prototype").cloneNode( true ); //document.createElement( "menuitem" );	
							//elem.setAttribute("class", "menuitem-iconic");
							
							var label;
							
							if( m[k].file_title )
							{
								label = m[k].file_title;
							}
							else if(m[k].display_name)
							{
								label = m[k].display_name;
							}
							
							if( !label )			continue;
							
							var extImage = this.downloadInstance.getExtImage( m[k] );

							if( extImage )
							{
								var imageUrl = "chrome://fvd.single/skin/"+extImage;
								elem.style.listStyleImage = "url("+imageUrl+")";
							}
							
							var labelTemplate = label += " (%size%)";
							
							var size = "...";
							
							if( "size" in m[k] ){
								size = this.downloadInstance._prepareVideoSize(m[k].size)+" MB";
							}
							else{
								
								var clearCookieMessageDisplayed = false;
								
								(function( item ){
										
									self.sniffer.getSizeByUrl(item.url, function( url, size ){
										var urlHash = fvd_single.downloadInstance.md5( url );
										var elem = document.getElementById( "menu_"+urlHash );
										if( elem ){
											var labelTemplate = elem.getAttribute("labelTemplate");
											
											if( size ){
												elem.setAttribute( "label", labelTemplate.replace("%size%", fvd_single.downloadInstance._prepareVideoSize(size)+" MB") );
											}
											else{
												elem.setAttribute( "label", labelTemplate.replace("%size%", "N/A") );
												
												if( item.yt_id ){
												
													if( !clearCookieMessageDisplayed ){
														//clearCookieMessageDisplayed = true;
														//self.displayYTClearCookieMessage();
													}
												
												}
											}
										}
									} );
									
								})(  m[k] );
								
							}
																	
							elem.setAttribute( "label", labelTemplate.replace("%size%", size) );
							
														
							var urlHash = this.downloadInstance.md5( m[k].url );
							elem.setAttribute( "id", "menu_"+urlHash );
							elem.setAttribute( "urlHash", urlHash );
							elem.setAttribute( "url", m[k].url );
							elem.setAttribute( "labelTemplate", labelTemplate );
							
							(function(elem, downloadUrl, downloadName, downloadExt, urlHash, referer){
								elem.addEventListener( "click", function(){
									menu.hidePopup();
									
									try{
										var downloadId = fvd_single.downloadInstance.downloadByWindow(downloadUrl, downloadName, "." + downloadExt, referer);					
										if( downloadId )
										{
											self.downloadIdsUrls[downloadId] = urlHash;
										}			
																				
									}
									catch( ex ){
										dump( "ERROR WHILE START DOWNLOAD: " + ex + "\n" );
									}
									
						
								}, false );
								
								var quickDownloadButton = elem.getElementsByClassName( "quick_download" )[0];
								quickDownloadButton.addEventListener( "click", function( event ){
									
									try
									{
										var downloadId = fvd_single.downloadInstance.quickDownload(downloadUrl, downloadName, "." + downloadExt, referer);					
										if( downloadId )
										{
											self.downloadIdsUrls[downloadId] = urlHash;
											self.show_win_download(downloadName + "." + downloadExt, 1);
										}			
																				
									}
									catch( ex ){
										dump( "ERROR WHILE START DOWNLOAD: " + ex + "\n" );
									}
									
									event.stopPropagation();
									
								}, false );
								
							})( elem, m[k].url,  m[k].download_name ? m[k].download_name : m[k].file_title, m[k].ext, urlHash, m[k].referer );
											
							var dlInfo = self.downloadInfoByUrlHash( urlHash );
							
							var percentComplete = 0;
							
							if( dlInfo )
							{
								if( dlInfo.state == Components.interfaces.nsIDownloadManager.DOWNLOAD_DOWNLOADING )
								{
									self.setFastMenuDownloadState( elem, "downloading" );
								}
								else if( dlInfo.state == Components.interfaces.nsIDownloadManager.DOWNLOAD_PAUSED )
								{
									self.setFastMenuDownloadState( elem, "paused" );									
								}	
								
								percentComplete = dlInfo.percentComplete;
								if( percentComplete == -1 ){
									percentComplete = "N/A";
								}							
							}										
								
							try
							{
								var percentsLabel = document.getAnonymousElementByAttribute(elem, "class", "fvd-speed-dial-fastmenu-item-percentage");
								//percentsLabel.setAttribute( "value", percentComplete + "%" );				
								percentsLabel.textContent = percentComplete + "%";			
								
							}
							catch( ex ){		}	
												
							menu.insertBefore( elem, fullModeButton );				
							
							/*
							try{
								var picContainer = document.getAnonymousElementByAttribute(elem, "class", "menu-iconic-left");
								var percentsLabel = document.createElement( "label" );
								percentsLabel.className = "percents";
								percentsLabel.setAttribute( "value", percentComplete + "%" );
								picContainer.appendChild( percentsLabel );								
							}
							catch( ex ){
								
							}*/			
							
						}
					}
					
					//downloadInstance
					
					menu.openPopup( document.getElementById("fvd_single_button"), "after_start" );		
				}
			}
			
	
		}
		catch( ex ){

		}
	}

	// окошко в стили пришло письмо
	this.show_win_download = function(file, tip) {

		try 
		{
			var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
				
			var bundle = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://fvd.single/locale/fvd.single.download.properties');
			
			var iconUrl="chrome://fvd.single/skin/fvd.single.icon.png";  
			var title;
			var message;
			if (tip == 1)
			{
				title = bundle.GetStringFromName('fvd.single.quick-download.txt');
				message = file;
				alertsService.showAlertNotification(iconUrl,title,message,false, "", null, "");
			}	
			else if(tip == 2)
			{
				title = bundle.GetStringFromName('fvd.single.quick-download-start.txt');  
				message = bundle.GetStringFromName('fvd.single.quick-download-config.txt'); 
				var listener = {
					observe: function(subject, topic, data) {
						if (topic == "alertclickcallback")
						{
							var t = document.createTextNode("");
							document.documentElement.appendChild(t);  
							var data = {"a": "setDefautlFormats"};
							
							t.setUserData( "fvdData", data, null );
							var evento = document.createEvent('Events');  
							evento.initEvent('FVDSingleApiEvent',true,false);  
							t.dispatchEvent(evento);  	
							
							document.documentElement.removeChild(t);  
						
						}
					}
				}				
				alertsService.showAlertNotification(iconUrl, title, message, true, "cookie", listener, "");
			}
			else if(tip == 3)
			{
				title = bundle.GetStringFromName('fvd.single.quick-download-finish.txt');  
				message = file;
				alertsService.showAlertNotification(iconUrl, title, message, false, "", null, "");
			}
			
		} catch(e) {}
	}
	
	// -- проверить формат по умолчанию
	this.check_default_format = function(type, url)
	{
		var name;
		if (url.toLowerCase().indexOf("youtube.com") != -1)    name = "default_yt_type_"+type;
												else		   name = "default_type_"+type;
		try
		{
			return this.registry.getBoolPref(name);
		} 
		catch (e){	}
		return true;
	}
	
	this.check_default_format_yt = function(type)
	{
		var name = "default_yt_type_"+type;
		try
		{
			return this.registry.getBoolPref(name);
		} 
		catch (e){	}
		return true;
	}
	
	this.set_default_formats = function(event)
	{	
		if (this.settings_window == null)
		{
			var ww = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].getService(Components.interfaces.nsIWindowWatcher);
			if (ww)
			{
				var location = gBrowser.webNavigation.currentURI;
				var url = location.spec;
				var name = "default_formats";
				if (url.toLowerCase().indexOf("youtube.com") != -1)    name = "default_formats_yt";
			
				var args = {};
				args.path = name;
				args.wrappedJSObject = args;
			
				this.settings_window = ww.openWindow(window, 'chrome://fvd.single/content/fvd_settings.xul', '', 'chrome,titlebar=yes,toolbar,centerscreen,dialog=yes,minimizable=no,close=yes,dependent=yes', args);
				ww.registerNotification(this.settings_observer_struct);
			}
		} else
		{
			this.settings_window.focus();
		}
		event.stopPropagation();
	}
		
	this.set_file_types = function(event)
	{	
		if (this.settings_window == null)
		{
			var ww = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].getService(Components.interfaces.nsIWindowWatcher);
			if (ww)
			{
				var location = gBrowser.webNavigation.currentURI;
				var url = location.spec;
				var name = "file_types";
				if (url.toLowerCase().indexOf("youtube.com") != -1)    name = "file_types_yt";
			
				var args = {};
				args.path = name;
				args.wrappedJSObject = args;
			
				this.settings_window = ww.openWindow(window, 'chrome://fvd.single/content/fvd_settings.xul', '', 'chrome,titlebar=yes,toolbar,centerscreen,dialog=yes,minimizable=no,close=yes,dependent=yes', args);
				ww.registerNotification(this.settings_observer_struct);
			}
		} else
		{
			this.settings_window.focus();
		}
		event.stopPropagation();
	}
		
	this.set_default_formats_yt = function(event)
	{	
		if (this.settings_window == null)
		{
			var ww = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].getService(Components.interfaces.nsIWindowWatcher);
			if (ww)
			{
				var args = {};
				args.path = 'default_formats_yt';
				args.wrappedJSObject = args;
			
				this.settings_window = ww.openWindow(window, 'chrome://fvd.single/content/fvd_settings.xul', '', 'chrome,titlebar=yes,toolbar,centerscreen,dialog=yes,minimizable=no,close=yes,dependent=yes', args);
				ww.registerNotification(this.settings_observer_struct);
			}
		} else
		{
			this.settings_window.focus();
		}
		event.stopPropagation();
	}
		
	this.set_default_folder = function(event)
	{	
		if (this.settings_window == null)
		{
			var ww = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].getService(Components.interfaces.nsIWindowWatcher);
			if (ww)
			{
				var args = {};
				args.path = 'default_folder';
				args.wrappedJSObject = args;
			
				this.settings_window = ww.openWindow(window, 'chrome://fvd.single/content/fvd_settings.xul', '', 'chrome,titlebar=yes,toolbar,centerscreen,dialog=yes,minimizable=no,close=yes,dependent=yes', args);
				ww.registerNotification(this.settings_observer_struct);
			}
		} else
		{
			this.settings_window.focus();
		}
		event.stopPropagation();
	}
		
	// -- проверить на наличие в списке открытых окон
	this.is_tab_page = function(page_url){
		var found = false;
		var numTabs = gBrowser.browsers.length;;
		for (var index = 0; index < numTabs; index++) 
		{
			var currentBrowser = gBrowser.getBrowserAtIndex(index);
			if (page_url == currentBrowser.currentURI.spec) 
			{
				found = true;
			}
		}
		return found;
	}
		
	this.download_all = function(event)
	{	
		var location = gBrowser.webNavigation.currentURI;
		var doc = gBrowser.selectedBrowser.contentDocument;
			
		var sniffedMedia = this.prepareSniffedMedia( doc, this.sniffer.get_files_all() );		
				
		var media = {};
		media = this.extendMediaByUrl( sniffedMedia, media, location.spec );

		var count_download = 0;
		for( var i in media )
		{
//			if (!this.is_tab_page(i)) continue;
			
			var  m = media[i];
			for( k in m )
			{
				var label;
				if( m[k].file_title )       label = m[k].file_title;
				else if(m[k].display_name)	label = m[k].display_name;
				else label = 'filename';
							
				var ext = m[k].ext;			
				var url = m[k].url;			
				var urlHash = this.downloadInstance.md5( m[k].url );
							
				if( this.check_default_format( ext, location.spec ) )  
				{
					var downloadId = fvd_single.downloadInstance.quickDownload(url, label, "." + ext, m[k].referer);					
					if( downloadId )
					{		
						self.downloadIdsUrls[downloadId] = urlHash;
						count_download++;
					}	
				}					
			}
		}
		
		if (count_download > 0)
		{
			if (count_download == 1)	this.show_win_download(label + "." + ext, 1);
			else this.show_win_download("", 2);
		}
		
		
	};
	
	// --- скачать все из YouTube
	this.download_default = function(event)
	{	
		var location = gBrowser.webNavigation.currentURI;
		var doc = gBrowser.selectedBrowser.contentDocument;
			
		var sniffedMedia = this.prepareSniffedMedia( doc, this.sniffer.get_files_all() );		
				
		var media = {};
		media = this.extendMediaByUrl( sniffedMedia, media, location.spec );

		var count_download = 0;
		for( var i in media )
		{
			if( i != location.spec )	continue;
		
			var  m = media[i];
			
			for( k in m )
			{
				var label;
				if( m[k].file_title )       label = m[k].file_title;
				else if(m[k].display_name)	label = m[k].display_name;
				else label = 'filename';
							
				var ext = m[k].ext;			
				if( this.check_default_format_yt( ext ) )  
				{
					var url = m[k].url;			
					var urlHash = this.downloadInstance.md5( m[k].url );
							
					var downloadId = fvd_single.downloadInstance.quickDownload(url, label, "." + ext, m[k].referer);					
					if( downloadId )
					{
						self.downloadIdsUrls[downloadId] = urlHash;
						count_download++;
					}	
				}	
			}
			
		}
		if (count_download > 0)
		{
			if (count_download == 1)	this.show_win_download(label + "." + ext, 1);
			else this.show_win_download("", 2);
		}
		
	};
	
	
	this.showDownloadWindow = function(event)
	{		
		this._display_download_window();	
	};

	this._get_media_by_url = function(url){
		var media = {};
		var f = this.sniffer.get_files(url);
		for (var i in f)
		{			
			var url = f[i]['url'];		
			
			if (!(url in media))
			{
				var it = {display_name: f[i]["display_name"], node: null, url: url, direct:true, ad: this.detector.is_ad(url) };
				var t = (f[i]['pn'] ? f[i]['pn'] : (f[i]['dn'] ? f[i]['dn'] : ''));
				if (t) it['file_title'] = t;
				if (f[i]['ext']) it['ext'] = f[i]['ext'];
				media[url] = it;
			}
		}
		
		return media;
	};
	
	this._update_download_window_content = function( args, url ){		
		args.page_url = url;
		
		if (this.download_window == null)
		{	
			args.wrappedJSObject = args;
			
			var ww = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].getService(Components.interfaces.nsIWindowWatcher);
			if (ww)
			{
				this.download_window = ww.openWindow(window, 'chrome://fvd.single/content/fvd_download.xul', '_blank', this.downloadWindowFeatures, args);
				ww.registerNotification(this.settings_observer_struct);
			}
		} else
		{			
			args['window'] = window;
			args.wrappedJSObject = args;

			this.observer.notifyObservers(args, 'FVD.Single-Download-New', true);
			this.download_window.focus();
		}
	}

	this.fill_download_window = function( url ){
		var args = {
			media: this._get_media_by_url( url )
		}
		this._update_download_window_content( args, url );
	};
	
	this.alternative_download_click = function(event)
	{
		event.stopPropagation();

		if (this.supported && this.sniffer.has_media(gBrowser.currentURI.spec))
		{
			if (!this.check_usage_license()) return false;
			var location = gBrowser.webNavigation.currentURI;
			if (this.detector.is_adult(location.spec) && (!this.check_adult_license())) return false;

			//this.fill_download_window( location.spec )
			
			this._display_download_window();
		}
	};

	this.embed_to_url = function(embed)
	{
		var src = embed.getAttribute('src');
		for (var i = 0, j = EMBED_URLS_RX.length; i < j; i++)
		{
			var rx = new RegExp(EMBED_URLS_RX[i].tst, 'i');
			if (rx.test(src))
			{
				var txt = src;
				if ('attr' in EMBED_URLS_RX[i]) txt = embed.getAttribute(EMBED_URLS_RX[i].attr);
				var rxe = new RegExp(EMBED_URLS_RX[i].rx, 'i');
				var matches = rxe.exec(txt);
				if (matches != null)
				{
					var url = EMBED_URLS_RX[i].rep;
					for (k = 1, l = matches.length; k < l; k++)
					{
						url = url.replace('$' + k, matches[k]);
					}
					return url;
				}
			}
		}

		return src;
	};

    this._searchBrowserByDomWindow = function(window){
        var numTabs = gBrowser.browsers.length;
        
        for (var index = 0; index < numTabs; index++) {
            var currentBrowser = gBrowser.getBrowserAtIndex(index);
            if (currentBrowser.contentDocument.defaultView == window) {
                return currentBrowser;
            }
        }
        
        return null;
    }

    this.handlerUrlChange = function(oldUrl, newUrl){
        self.removeMediaForUrl(oldUrl);
    }

	this.browser_progress_listener = {

		onLocationChange: function(aWebProgress, aRequest, aURI)
		{			
			if (aURI != null)
			{
	            if (aWebProgress.DOMWindow) {
					try{
		                var browser = self._searchBrowserByDomWindow(aWebProgress.DOMWindow);
											
		                if (browser.oldUrlSingle) {
		                    if (browser.oldUrlSingle != aURI.spec) {
		                        self.handlerUrlChange(browser.oldUrlSingle, aURI.spec);
		                    }
		                }
		                browser.oldUrlSingle = aURI.spec;	              
						
					}
					catch( ex ){
						
					}
	            }
				
				var sch = aURI.scheme.toString().toLowerCase();
				if ((sch == 'http') || (sch == 'https'))
				{
					if (self.detector.is_supported(aURI.spec))
					{
						// supported
						self.supported = true;
					} else
					{

						if (self.sniffer.has_media(aURI.spec))
						{
							self.supported = true;
						} else
						{
							// not supported
							self.supported = false;
							try
							{
								self.document_embed_check.call(self);
							} catch (e) {} // dom not ready
						}
					}
					
					if( self.sniffer.has_media( aURI.spec ) && self.download_window ){				
						self._display_download_window( true, false ); // update download window content
					}	
					
					self.setup_buttons.call(self);					
				}
				else{
					self.supported = false;
					self.setup_buttons.call(self);
				}
				

				
				return;
			}

			self.supported = false;
			self.setup_buttons.call(self);
			return;
		},

		onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus){

		},
		onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {         },
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
        catch (ex) {
        
        }
    }

	this.browser_dom_loaded_listener = function(event)
	{
	
		var browser = gBrowser.getBrowserForDocument(event.target);
		if ((browser != null) && (browser == gBrowser.selectedBrowser))
		{
			if (!self.supported)
			{
				self.document_embed_check.call(self);
				self.setup_buttons.call(self);
			}
		}
	};

	this.is_youtube = function(doc){
		return /http:\/\/(?:www\.)?youtube\.com/i.test(doc.location.href);
	},

	this.document_embed_check = function()
	{
		// not check
		
		return false;
	
		try
		{
			var doc = gBrowser.selectedBrowser.contentDocument;
						
			if (doc)
			{
				// check only for youtube
				if( !this.is_youtube(doc) ){
					return false;
				}
				
				var emb_res = doc.evaluate('//embed[@src]', doc.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
				if (emb_res.singleNodeValue)
				{
					this.supported = true;
					return;
				}

				var m_rx = new RegExp('^.*\\.(?:'+ MEDIA_EXTENSIONS_PPT + ')$', 'i');
				var a_itr = doc.evaluate('//a[@href]', doc.documentElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
				var a_link = a_itr.iterateNext();
				while(a_link != null)
				{
					if (m_rx.test(a_link.getAttribute('href')))
					{
						this.supported = true;
						return;
					}
					a_link = a_itr.iterateNext();
				}
			}

		} catch (e) {}
	};

	this.setup_buttons = function()
	{			
		this.setup_item( );

		var main_btn = document.getElementById('fvd_single_button');
		if (main_btn)
		{
			if (this.supported)
			{
				main_btn.setAttribute('supported', 'true');
				
				if (this.downloading > 0)
				{
					main_btn.setAttribute('downloading', 'true');
				} 
				else
				{
					if (main_btn.hasAttribute('downloading')) main_btn.removeAttribute('downloading');
				}
				
			} 
			else
			{
				if (main_btn.hasAttribute('supported')) main_btn.removeAttribute('supported');
				if (main_btn.hasAttribute('downloading')) main_btn.removeAttribute('downloading');
			}
			
		}

		var status_btn = document.getElementById('fvd_single_status');
		if( !status_btn ){
			status_btn = document.getElementById( "fvd_single_status_ff3" );
		}
		if (status_btn)
		{			
			if (this.supported)
			{
				status_btn.setAttribute('supported', 'true');
			} else
			{
				if (status_btn.hasAttribute('supported')) status_btn.removeAttribute('supported');
			}
		}
		else{
						
		}
		
		// setup alternative download button
		var alt_download_btns = document.getElementsByClassName("menu_item_alt_download" );
		var currentUri = gBrowser.currentURI.spec;
		for( var i = 0; i != alt_download_btns.length; i++ ){
			alt_download_btns[i].setAttribute( "disabled", this.sniffer.has_media( currentUri ) /*this.supported*/ ? "false" : "true" );			
		}



	};

/*	this.contextButtonClick = function( event ){
		var menu = document.getElementById( "fvd_single_popup_menu" );
		menu.openPopup( event.target, "before_start", 0, 0, false, false );
	}*/
	
	this.setup_item = function(i)
	{
		var button = document.getElementById( 'fvd_single_button' );
		var menu = null;
		if( button && button.childNodes.length == 0 )
		{
			menu = document.getElementById( "fvd_single_popup_menu" ).cloneNode(true);
			menu.removeAttribute("id");
			button.appendChild( menu );		 	
		}
	};

	this.create_item = function(event)
	{		
		if ((event.originalTarget != null) && ('getAttribute' in event.originalTarget))
		{
			if (event.originalTarget.getAttribute('id') == 'fvd_single_button')
			{
				if (!event.originalTarget.firstChild) self.setup_item(event.originalTarget);
			}
		}
	};

	this.xul_ns_resolver = function(prefix)
	{
		var ns = {
				'xul' : 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
				'html' : 'http://www.w3.org/1999/xhtml'
		};
		return ns[prefix] || null;
	};

	this.is_main_button_exists = function()
	{
		
		var btn = document.getElementById("fvd_single_button");
		if( btn  ){
			return true;
		}
	
		return false;
	
		/*
		var button_exists = false;
		try
		{
			var tr = document.evaluate('//xul:toolbox[@id="navigator-toolbox"]/xul:toolbar[@customizable="true"]', document.documentElement, this.xul_ns_resolver, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
			var toolbar = null;
			while ((toolbar = tr.iterateNext()) != null)
			{
				if (toolbar.currentSet.indexOf('fvd_single_button') > -1)
				{
					button_exists = true;
					break;
				}
			}

		} catch (e) {}

		return button_exists;
		*/
	};
	
	this.is_status_button_exists = function(){
		
		var exists = document.getElementById("fvd_single_status") ? true : false;	
		
		if( !exists ){
			var ff3StatusButton = document.getElementById( "fvd_single_status_ff3" );
			if( ff3StatusButton ){
				if( !ff3StatusButton.hasAttribute("hidden") ){
					exists = true;
				}
			}
		}
		
		return exists;
			
	}

	this.status_button_insert = function(){
		if( document.getElementById("fvd_single_status") ){
			return;
		}
		
		var ff3StatusButton = document.getElementById( "fvd_single_status_ff3" );
		if( ff3StatusButton ){
			ff3StatusButton.removeAttribute( "hidden" );
			
			self.registry.setBoolPref('display.statusbar_button', true);
			
			return;
		}
	
		try{
			var addonBar = document.getElementById("addon-bar");
			if (addonBar) {
				var addonBarCloseButton = document.getElementById("addonbar-closebutton");
				addonBar.insertItem("fvd_single_status", addonBarCloseButton.nextSibling);
				addonBar.collapsed = false;
				addonBar.setAttribute("currentset", addonBar.currentSet);  
				document.persist(addonBar.id, "currentset");  
			}
		}
		catch( ex ){

		}
	}
	
	this.status_button_remove = function(){
		
		var ff3StatusButton = document.getElementById( "fvd_single_status_ff3" );
		if( ff3StatusButton ){
			ff3StatusButton.setAttribute( "hidden", true );
			
			self.registry.setBoolPref('display.statusbar_button', false);
			
			return;
		}
		
		
		var addonBar = document.getElementById("addon-bar");
		if (addonBar) {
			var btn = document.getElementById(self.SPEED_DIAL_STATUSBAR_BUTTON_ID);
			
			var set = [];
			for each( var item in addonBar.currentSet.split(",") ){
				if( item == "fvd_single_status" ){
					continue;
				}
				set.push( item );
			}
			
			addonBar.currentSet = set.join(',');
			addonBar.setAttribute('currentset', addonBar.currentSet);
			document.persist(addonBar.id, "currentset");  			
		}
	}	

	this.main_button_insert = function(  )
	{		
		var btn = document.getElementById("fvd_single_button");
		if( btn  ){
			return; // button exists
		}
	
		var insertBefore = "search-container";
	
		var toolbar = document.getElementById('nav-bar');
//		if (toolbar)
		if (toolbar && toolbar.currentSet.indexOf("fvd_single_button") == -1)
		{
			var sci = toolbar.currentSet.split(',');
			var nsci = [];
			if (sci.indexOf(insertBefore) != -1)
			{
				var i = null;
				while ((i = sci.shift()) != undefined)
				{	
					if ((i == insertBefore) && (nsci.indexOf('fvd_single_button') == -1)) nsci.push('fvd_single_button');	
					nsci.push(i);					
				}
			} else
			{
				nsci = sci;
				nsci.push('fvd_single_button');
			}

			toolbar.currentSet = nsci.join(',');
			toolbar.setAttribute('currentset', toolbar.currentSet);

			var toolbox = document.getElementById('navigator-toolbox');
			if (toolbox)
			{
				toolbox.ownerDocument.persist(toolbar.id, 'currentset');
			}
			
			this.setup_item( );
		}
	};

	this.main_button_remove = function()
	{		
		try
		{
			var toolbox = document.getElementById('navigator-toolbox');
			var tr = document.evaluate('//xul:toolbox[@id="navigator-toolbox"]/xul:toolbar[@customizable="true"]', document.documentElement, this.xul_ns_resolver, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
			var toolbar = tr.iterateNext();
			while (toolbar != null)
			{
				if (toolbar.currentSet.indexOf('fvd_single_button') > -1)
				{
					var cs = toolbar.currentSet.split(',');
					var ncs = [];

					var i = null;
					while ((i = cs.shift()) != undefined)
					{
						if (i != 'fvd_single_button') ncs.push(i);
					}

					toolbar.currentSet = ncs.join(',');
					toolbar.setAttribute('currentset', toolbar.currentSet);
					toolbox.ownerDocument.persist(toolbar.id, 'currentset');
					break;
				}
                		toolbar = tr.iterateNext();
			}

		} catch (e) {}

	};

	this.install_hotkey = function(key, modifier)
	{
		var mks = document.getElementById('mainKeyset');
		if (mks)
		{
			var el = document.getElementById('fvd_single_keyset');
			if (el) el.parentNode.removeChild(el);

			var ks = document.createElement('keyset');
			if (ks)
			{
				ks.setAttribute('id', 'fvd_single_keyset');
				var hk = document.createElement('key');
				if (hk)
				{
					hk.setAttribute('id', 'fvd_single_hotkey');
					hk.setAttribute('modifiers', modifier + ',control');
					hk.setAttribute('key', key);
					hk.setAttribute('oncommand', 'fvd_single.alternative_download_click(event)');

					ks.appendChild(hk);
				}

				mks.parentNode.insertBefore(ks, mks.nextSibling);
			}
		}
	};


	this.is_first_start = function(callback, anyWayCallback)
	{
		var xai = Components.classes['@mozilla.org/xre/app-info;1'].getService(Components.interfaces.nsIXULAppInfo);
		var vc = Components.classes['@mozilla.org/xpcom/version-comparator;1'].getService(Components.interfaces.nsIVersionComparator);
		
		var isFirstStart = false;
		
		if (vc.compare(xai.platformVersion, '1.9.3') >= 0)
		{						
			// works via addon manager
			AddonManager.getAddonByID(EXTENSION_GUID, function(addon)
			{				
				
				var lastVersion = self.registry.getCharPref('fvdsd_last_used_version');
				
				if( lastVersion != addon.version ){
					
					if( callback ){
						callback();
					}
					
					isFirstStart = true;						
						
					self.registry.setCharPref('fvdsd_last_used_version', addon.version);
				}
				
				if( anyWayCallback ){
					
					var isFirstRun = self.registry.getBoolPref('is_first_run');
					
					if( isFirstRun ){
						self.registry.setBoolPref('is_first_run', false);
					}
					
					anyWayCallback( isFirstStart, isFirstRun );
				}

			});
		} else
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
							last_install = this.registry.getCharPref('install_date');
			        	
						} catch (e) {}

						if (loc.lastModifiedTime.toString() != last_install)
						{
							try
							{
                						this.registry.setCharPref('install_date', loc.lastModifiedTime.toString());

							} catch (e) {}
							if ((callback != undefined) && (typeof(callback) == 'function')) callback();
							
							isFirstStart = true;
						}
					}
					
					if( anyWayCallback ){
						anyWayCallback( isFirstStart );
					}
				}
			} catch (e) {}
		}
	};
	
	this.openInNewTab = function( url ){
		var browser = window.getBrowser();
		var tab = browser.addTab(url);
		if (tab) browser.selectedTab = tab;		
	}
	
	this.load_installed_page = function( firstRun )
	{
		try{
			AddonManager.getAddonByID(TOOLBAR_ID, function(addon){					
				if( addon && !addon.disabled && !addon.userDisabled )
				{
					AddonManager.getAddonByID(EXTENSION_GUID, function(addon){	
						fvd_single.silentMode = true;
					});
				}
				else
				{
					var url = "";
			
					var osString = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;  
			
					if( osString == "Darwin" )
					{
						url = "http://flashvideodownloader.org/welcome-firefox-mac.php";
					}
					else if( osString != "Linux" )
					{				
						if( firstRun )
						{
							url = "http://flashvideodownloader.org/fvd-suite/to/s/welcome_ff_mozil/";
						}
						else
						{
							url = "http://flashvideodownloader.org/fvd-suite/to/s/update_ff_mozill/";
						}				
					}		
			
					if( url )	fvd_single.openInNewTab( url );
				
				}
			});
		}
		catch( ex ){ }
		
	};

	this.setFVDSDHintDontDisplayStatus = function(){
	
		var cb = document.getElementById("fvd_single_fvd_speeddial").getElementsByTagName( "checkbox" )[0];
	
		var status = cb.checked;
		
		this.registry.setBoolPref('dont_display_fvdsd_hint', status);
		
	}

	this.toMozillaFVDSD = function(){
		document.getElementById("fvd_single_fvd_speeddial").hidePopup();
		this.openInNewTab( "https://addons.mozilla.org/en-US/firefox/addon/fvd-speed-dial/" );
	}

	this.settings_observer_struct = {
	observe : function(aSubject, aTopic, aData)
	{
		switch ( aTopic )
		{
			case 'domwindowclosed':
			{
				
				if (aSubject == self.download_window)
				{
					self.download_window = null;
				} 
				else if (aSubject == self.settings_window)
				{
					self.settings_window = null;
				}
				break;
			}

			case 'FVD.Single-MainButton-Change':
			{
				
				var exists = self.is_main_button_exists.call(self);
				if (exists.toString() != aData.toString())
				{
					if (exists)
					{
						self.main_button_remove.call(self);
					} else
					{
						self.main_button_insert.call(self);
					}
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
					} else
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

		
			case 'FVD.Single-Media-Detect':
			{
								
				if (gBrowser.currentURI.spec == aData) {
					self.supported = true;
					self.setup_buttons.call(self);
				}
				
				// if window is displayed - update this
				if( self.download_window ){						
					//self.fill_download_window( aData );		
					self._display_download_window( gBrowser.currentURI.spec == aData, false );			
				}
			
				break;
			}

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


	this.checkFVDToolbarIstalledAndRemoveLegacy = function(){

		try{
			var toolbarGuid = this.registry.getCharPref('fvd_toolbar_guid_wait');
			if( toolbarGuid ){
				AddonManager.getAddonByID(toolbarGuid, function(addon){	
					if( !addon || addon.appDisabled || addon.userDisabled ){	
						// display button
						self.registry.clearUserPref('fvd_toolbar_guid_wait');		
						self.main_button_insert();
					}
					else{
						
					}			
				});
			}
		}
		catch(ex){

		}		
		
	}

	this.displaySpeedDialHintIfNeed = function(){
		
		/*
		
		if( this.registry.getBoolPref('dont_display_fvdsd_hint') ){
			return;
		}
			
		var now = new Date().getTime();	
						
		var lastShow = this.registry.getCharPref( "fvdsd_hint_last_display_time" );
		
	 	if( lastShow == 0 ){
			this.registry.setCharPref( "fvdsd_hint_last_display_time", now + DISPLAY_FVDSD_HINT_AFTER - DISPLAY_FVDSD_HINT_EVERY );
			return;
		}		
		
		if( now - lastShow < DISPLAY_FVDSD_HINT_EVERY ){
			return;
		}
		
		this.registry.setCharPref( "fvdsd_hint_last_display_time", now );
		
		var panel = document.getElementById( "fvd_single_fvd_speeddial" );
	
		var panelHeight = 140;
		
		panel.openPopup( document.getElementById("browser"), "before_end", 0, panelHeight + 5, false, false, null );
		
		*/
		
	}

	this.init = function()
	{
		try
		{
			this.detector = Components.classes['@flashvideodownloader.org/single_site_detector;1'].getService(Components.interfaces.IFVDSingleDetector);
			this.sniffer = Components.classes['@flashvideodownloader.org/single_media_sniffer;1'].getService().wrappedJSObject;

        } catch (e) {};
		
		try
		{
			this.downloadInstance = new FVD_SINGLE_DOWNLOAD(true);			
		}
		catch( ex ){
			// remove

		}

			
		try
		{
			
			var dm = Components.classes['@mozilla.org/download-manager;1'].getService(Components.interfaces.nsIDownloadManager);
			dm.addListener( downloadListener );					
			
		}	
		catch( ex ){
			dump( "Fail add download listener. Progress/Start/Stop in fast menu will not work.\n" );
		}
		
			
		setTimeout( function(){
			
			self.displaySpeedDialHintIfNeed();
			
		}, 5000 );

		

		var reg = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);

		this.registry = reg.getBranch(SETTINGS_KEY_BRANCH);
		this.registry.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.registry.addObserver('', this.settings_observer_struct, false);


		

		this.observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
		this.observer.addObserver(this.settings_observer_struct, 'FVD.Single-MainButton-Change', false);
		this.observer.addObserver(this.settings_observer_struct, 'FVD.Single-Media-Detect', false);
		this.observer.addObserver(this.settings_observer_struct, 'FVD.Single-StatusButton-Change', false);
										
//		this.setup_item(document.getElementById('fvd_single_button'));
		
		gBrowser.addProgressListener(this.browser_progress_listener/*, Components.interfaces.nsIWebProgress.NOTIFY_LOCATION*/);
		gBrowser.addEventListener('DOMContentLoaded', this.browser_dom_loaded_listener, false);
		
		
		
		// set listener for tab closing		
		gBrowser.tabContainer.addEventListener("TabClose", this.handlerTabClosing, false);

		this.install_hotkey(this.registry.getCharPref('hotkey.button'), this.registry.getCharPref('hotkey.modifier'));
		
		try{
			AddonManager.addAddonListener( this.addonListener );			
		}
		catch( ex ){
			
		}

		
		// check for first start
		this.is_first_start(function()
		{
			
		}, 
		function( isFirstStart, isFirstRun ){
			if( isFirstStart ){
				// NO reset hint settings
				//self.registry.setBoolPref('single.dont_display_features_hint', false);	
				// reset size settings
				//self.registry.clearUserPref('download.window_height');	
				//self.registry.clearUserPref('download.window_width');	
				
				// check counter settings
				var countersBranch = reg.getBranch(COUNTERS_KEY_BRANCH);
				if( countersBranch.getCharPref("like_status") == "already_done" ){
					countersBranch.setCharPref("like_status", "like"); // return to like status
				}
				
				if( isFirstRun ){
					self.main_button_insert();		
					//self.status_button_insert();
					
					self.load_installed_page( true );		
				}
				else{
					self.load_installed_page();	
				}	
				
				
			}
			
			var timerFunc = function(){
				var toolbarHint = document.getElementById( "fvd_toolbar_helper_note" );
				var button = document.getElementById( "fvd_single_button" );
				if( toolbarHint && toolbarHint.state == "open" ){
					setTimeout( timerFunc, 5000 );
					return false;
				}
				if( !gBrowser.contentWindow.opener && button && !button.getAttribute("hidden") && self.is_main_button_exists() ){
					self.openHint();
				}				
			}
			
			setTimeout( timerFunc, 5000 );
		});
		
		
		try{
			this.checkFVDToolbarIstalledAndRemoveLegacy();			
		}
		catch( ex ){
			
		}
		
		

		
		try{
			AddonManager.getAddonByID(TOOLBAR_ID, function(addon){					
				if( addon && !addon.disabled && !addon.userDisabled ){
					AddonManager.getAddonByID(EXTENSION_GUID, function(addon){	  
						delete addon.optionsURL;
						fvd_single.main_button_remove();
						fvd_single.status_button_remove();
						fvd_single.silentMode = true;
					});
					
					self.registry.setBoolPref('buttons_hided_by_toolbar', true);
				}
				else{
					
					var forceShow = false;
					try{
						forceShow = self.registry.getBoolPref('buttons_hided_by_toolbar');
					}
					catch( ex ){
						
					}
					
					if( forceShow ){
						self.registry.setBoolPref('buttons_hided_by_toolbar', false);
						
						self.main_button_insert();
					}
										
				}
				
				if( addon && (addon.disabled || addon.userDisabled) ){
					var disabledByUser = false;
					try{
						disabledByUser = fvd_single.registry.getBoolPref( 'toolbar_user_disabled' );
					}
					catch( ex ){
						
					}
										
					if( !disabledByUser ){
						addon.userDisabled = false;		
						fvd_single.restartFirefox();			
					}
					
				}
			});
		}
		catch( ex ){
			
		}
		
		 
		 
		// firefox 3 status bar compatibility
		
		if (this.registry.getBoolPref('display.statusbar_button'))
		{
			var sb = document.getElementById('fvd_single_status_ff3');
			if(sb){
				sb.removeAttribute( "hidden" );
			}
		}


	};
	
    this.addonListener = {
		onDisabling: function( addon ){
			if( TOOLBAR_ID == addon.id ){
				fvd_single.registry.setBoolPref( 'toolbar_user_disabled', true );
			}
		},
		onEnabling: function( addon ){
			if( TOOLBAR_ID == addon.id ){
				fvd_single.registry.setBoolPref( 'toolbar_user_disabled', false );
			}		
		},
		onOperationCancelled: function( addon ){
			if( TOOLBAR_ID == addon.id ){
				fvd_single.registry.setBoolPref( 'toolbar_user_disabled', false );
			}
		}	
	};


	this.openHint = function(){
		try{
			var v = self.registry.getBoolPref('single.dont_display_features_hint');
			if( v ){
				return false;
			}
		}
		catch(ex){
			dump( "EX " + ex.message  + "\r\n");
		}
		
		var hint = document.getElementById("fvd-setup-note");		
		//hint.openPopup(document.getElementById('fvd_single_button'), 'after_start', 15, 0, false, false);
	}
	
	this.openDonateDialog = function(){
		openDialog( 'chrome://fvd.single/content/donate.xul', null, 'chrome,titlebar=yes,centerscreen,modal,dialog=yes,minimizable=no,resizable=no,close=yes' );
	}
	

	this.uninit = function()
	{
		this.registry.removeObserver('', this.settings_observer_struct);
		this.observer.removeObserver(this.settings_observer_struct, 'FVD.Single-MainButton-Change');
		this.observer.removeObserver(this.settings_observer_struct, 'FVD.Single-Media-Detect');
		this.observer.removeObserver(this.settings_observer_struct, 'FVD.Single-StatusButton-Change');

		gBrowser.removeEventListener('DOMContentLoaded', this.browser_dom_loaded_listener, false);
		gBrowser.removeProgressListener(this.browser_progress_listener);

		this.detector = null;
		this.registry = null;
		this.observer = null;
	};

	window.addEventListener('load', function () {
		try{
			self.init.call(self);			
		}
		catch( ex ){

		}
	}, false);
	window.addEventListener('unload', function() {self.uninit.call(self)}, false);
}


var fvd_single = new FVD_SINGLE();

window.addEventListener("aftercustomization", function(){
	fvd_single.setup_buttons();
}, false);  