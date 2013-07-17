const nsISupports = Components.interfaces.nsISupports;
const CLASS_ID = Components.ID('{213bea84-5789-4ff2-a3da-24ea819eb505}');
const CLASS_NAME = 'FVD media sniffer';
const CONTRACT_ID = '@flashvideodownloader.org/single_media_sniffer;1';

const TITLE_MAX_LENGTH = 96;

const SETTINGS_KEY_BRANCH = 'fvd_single.';
const mediatypes_video2ext = {

	'mpeg' : 'mp4',
	'3gpp' : '3gp',
	'flv' : 'flv',
	'quicktime' : 'mov',
	'msvideo' : 'avi',
	'ms-wmv' : 'wmv',
	'ms-asf' : 'asf'
};

const mediatypes_audio2ext = {

	'realaudio' : 'ra',
	'pn-realaudio' : 'rm',
	'midi' : 'mid',
	'mpeg' : 'mp3',
	'mpeg3' : 'mp3',
	'wav' : 'wav',
	'aiff' : 'aif'
};

const video_extensions = [
	"flv",	
	"ram",
	"mpg",
	"mpeg",
	"avi",	
	"rm",
	"wmv",
	"mov",
	"asf",
	"mp3",
	"rbs",
	"movie",
	"divx",
	"mp4",
	"ogg",
	"mpeg4"
];
const audio_extensions = ["mp3"];

const games_extensions = ["swf"];

const ignore_extensions = [
	"jpg",
	"jpeg",
	"gif",
	"png",
	"bmp",
	"tiff"
];

const IGNORE_SNIFFER_URL_SIGNS = [
	"soloset.net",
	"solosing.com",
	"canalrcn.com",
	"canalrcnmsn.com",
	"noticiasrcn.com"
];

const triggerVideoSize = 1048576; 
const minFileSizeToCheck = 100 * 1024;

const VK_SETTINGS = {
	
    videoResolutions: [360, 480, 720],

	defaultVideoExt: "mpg",
	videosResolutionsExts: {
		240: "flv",
		360: "mp4",
		480: "mp4",
		720: "mp4"
	}
};

var KeyValueStore = new function(){
	
	var items = {};
	
	var event = {
		observe: function(subject, topic, data) {
			
			var now = new Date().getTime();
			
			var toRemove = [];
			for( var k in items ){
				if( items[k].expires && items[k].expires <= now ){
					toRemove.push( k );
				}
			}
			
			toRemove.forEach( function(){
				delete items[k];	
			} );
						
		}
	}
	var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
	
	timer.init(event, 60*1000, Components.interfaces.nsITimer.TYPE_REPEATING_PRECISE_CAN_SKIP);
	
	this.set = function( key, value, ttl ){
		
		var now = new Date().getTime();
		
		var expires = now + ttl;
		if( !ttl ){
			expires = 0;
		}
		
		items[key] = {
			value: value,
			expires: expires
		};
		
	}
	
	this.get = function( key ) {
		
		if( typeof items[key] != "undefined" ){
			return items[key].value;
		}
		
		return null;
		
	}	
	
}

//---------------------------  Log  --------------------------
function Log(text)
{
	var aConsoleService = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
	aConsoleService.logStringMessage(text);
};


// =========================================================================================
function FVD_Media_Sniffer()
{
	
	var self = this;
	this.detector = null;
	this.observer = null;
	this.files = {};
	this.media_pages = {};
	this.media = {};

	this.debug = false;
	
	this.timers = []; // timers for youtube
	
	this.allowYoutube = true;

	// ----------------------------------------------------------------------------------
/*	function YTVideoExists( root_url, ytId, ytFormat ){
		
		//dump( ytFormat + "|" + ytId + " <--- check\n" );
						
		for( var k in self.files ){
			
			//dump( self.files[k].yt_format + "|" + self.files[k].yt_id + "\n" );
			
			if( self.files[k].yt_id == ytId && self.files[k].yt_format == ytFormat && self.files[k].root_url == root_url ){
				return true;
			}
		}
		
		return false; 
			
	}*/

	// ----------------------------------------------------------------------------------
    this.isPlayable = function(ext, contentType){
        var playable = false;
        
        if (video_extensions.indexOf(ext) != -1)            playable = true;
        
        if (audio_extensions.indexOf(ext) != -1)            playable = true;
        
        if (contentType) 
		{
            if (contentType.toLowerCase().indexOf("video") != -1)              playable = true;
			
            if (contentType.toLowerCase().indexOf("audio") != -1)              playable = true;
        }
        
        return playable;
    }

	// ----------------------------------------------------------------------------------
	this.alert = function(text)
	{
		var aConsoleService = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
		aConsoleService.logStringMessage(text);
	};
	
	// ----------------------------------------------------------------------------------
	this.getSwfDisplayState = function()
	{
		var branch = this.registry.getBranch(SETTINGS_KEY_BRANCH);
		try
		{
			return branch.getBoolPref('download.swf_display' );

		} catch (e){	}
		
		return false;
	};

	// ----------------------------------------------------------------------------------
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

	// ----------------------------------------------------------------------------------
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
	
	// ----------------------------------------------------------------------------------
	this.event = {
		observe: function(subject, topic, data) {
					try
					{
						var b = null;
						var index = -1;
						for( var i = 0; i != self.timers; i++ )
						{
							if( self.timers[i].timer == subject )
							{
								b = self.timers[i].browser;
								index = i;
								break;
							}
						}
												
						if( b && b.contentDocument )
						{
							var url = b.contentDocument.location.toString();
							if( url.indexOf("#") != -1 )
							{
								return false;
							}
						}
				
						if( index != -1 )
						{
							self.timers.splice( index, 1 );				
						}
					}
					catch(ex)
					{
						dump( "FAIL ANALYZER " + ex + "\r\n" );
					}
				}
	}
	
	// ----------------------------------------------------------------------------------
    this.getBrowserFromChannel = function(aChannel){
        try 
		{
            var notificationCallbacks = aChannel.notificationCallbacks ? aChannel.notificationCallbacks : aChannel.loadGroup.notificationCallbacks;
            
            if (!notificationCallbacks)               return null;
            
			var domWin = notificationCallbacks.getInterface(Components.interfaces.nsIDOMWindow);
			
			var  gBrowser   = domWin.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		                       .getInterface(Components.interfaces.nsIWebNavigation)
		                       .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
		                       .rootTreeItem
		                       .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		                       .getInterface(Components.interfaces.nsIDOMWindow);

			var gBrowser = mainWindow.gBrowser;			
           
            return gBrowser.getBrowserForDocument(domWin.top.document);
        } 
        catch (e) 
		{
            return null;
        }
    }
	
	
	// ----------------------------------------------------------------------------------
	this.browser_progress_listener = {	
					onLocationChange: function(aWebProgress, aRequest, aURI){
									}
	}
	
	// ----------------------------------------------------------------------------------
	this.pageLoadListener = function( event ){
	
	}
	
	// ----------------------------------------------------------------------------------
	this.observer_struct = {observe : function(aSubject, aTopic, aData)
	{
		switch (aTopic)
		{
			case 'http-on-examine-cached-response':
			case 'http-on-examine-response':
			{
				try
				{						
					aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
					
					// all successed GET responces
					if ((aSubject.requestMethod == 'GET') && (aSubject.responseStatus < 400))
					{
						// check for video and audio types
						if (self.needed_media.call(self, aSubject))
						{
							// save link
							self.save_link.call(self, aSubject);
						}
					}

				} 
				catch (e)
				{
					dump("ERROR " + e + "\r\n");
				}
				break;
			}

			case 'nsPref:changed':
			{
				switch (aData)
				{
					case 'news.update_interval':
					{
						self.news_update_interval = self.registry.getIntPref(aData);
						break;
					}
					break;
				}
			}
		}
	}};

	// ----------------------------------------------------------------------------------
	this._get_file_ext = function( path ){
		try
		{
			var tmp = path.split("?");
			tmp = tmp[0].split( "." );
			var ext = tmp[tmp.length-1].toLowerCase();		
			return ext;	
		}
		catch(ex)
		{
			return null;
		}		
	};
	
	// ----------------------------------------------------------------------------------
	this._is_video_ext = function( ext ){
		for( var i = 0; i != video_extensions.length; i++ )
		{			
			if( ext == video_extensions[i] )	return true;
		}		
		return false;
	};
	
	// ----------------------------------------------------------------------------------
	this._is_game_ext = function( ext ){
		for( var i = 0; i != games_extensions.length; i++ )
		{			
			if( ext == games_extensions[i] )		return true;
		}		
		return false;
	};
	
	// ----------------------------------------------------------------------------------
	this._is_ignored_ext = function( ext ){
		for( var i = 0; i != ignore_extensions.length; i++ )
		{			
			if( ext == ignore_extensions[i] )		return true;
		}		
		return false;
	};

	// ----------------------------------------------------------------------------------
	this._extract_file_name_from_channel = function(http_channel){
		// check disposition name
		try
		{
			var dn = this.disposition_name(http_channel);
			if( dn )	return dn;
		}
		catch(ex){}
		return  null;		
	};
	
	// ----------------------------------------------------------------------------------
	// obtain video extension from Content-type header
	// extensions patters:
	// video/x-(.+)
	// video/(.+?)
	this._get_ext_from_content_type = function( http_channel ){
		try
		{
			var contentType = http_channel.getResponseHeader( "Content-Type" );
			if( contentType )
			{
				var m = null;
				
				if( m = /video\/x-([^;]+)/.exec(contentType) )
				{
					return m[1];
				}
				else if( m = /video\/([^ ,]+)/.exec(contentType) )
				{
					return m[1];
				}
				
				return null;
			}
		}
		catch(ex){}		
		
		return null;
	}
	
	// --------------------------------------------   
	this.needed_media = function(http_channel) 
	{	
	
		var url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
		if (url.indexOf("#") != -1)  url = url.substring(0, url.indexOf("#"));
		
		// youtube || vk
		if( url.indexOf("://s.ytimg.com") != -1 || url.indexOf("://o-o.preferred.") != -1 || url.indexOf("youtube.com") != -1 )  return false;
		if( url.indexOf( "vk.com" ) != -1  ) return false;
		
		// check url is in ignore list
		var ignore = false;
		IGNORE_SNIFFER_URL_SIGNS.forEach(function( sign ){
						if( url.indexOf( sign ) != -1 )
						{
							ignore = true;
							return false;
						}
					});
		if( ignore )			return;
			
		// if scheme is chrome - ignore this video
		if( http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.scheme == "chrome" )
		{
			return false;
		}
			
		// check min size
		try
		{
			var contentLength = http_channel.getResponseHeader('Content-Length');
			if( contentLength )
			{
				if( contentLength < minFileSizeToCheck )		return false;
			}
		}
		catch(e)
		{
			return false; // fail check media length
		}
			
		var ext = this._get_file_ext( url );
		if( this._is_ignored_ext( ext ) )			return false;
		
		// check Location header, if set, no handle this url
		try
		{
			var ct = http_channel.getResponseHeader('Location');
			if( ct )		return false;
		} catch (e) {}		
	
		// Content-type check	
		try
		{
			var ct = http_channel.getResponseHeader('Content-Type');
			var cta = ct.match(/^([a-z0-9]+)\//i);
			if (cta != null)
			{
				var t = cta[1].toLowerCase();
				if ((t == 'audio') || (t == 'video'))		return true;	
			}
		} catch (e) {}		
		
		// check extension								
		if( this._is_video_ext( ext ) )		return true;
		
		if( this._is_game_ext( ext ) )		return true;
	
		// check disposition extension
		try
		{
			var dn = this.disposition_name(http_channel);
			var ext = this._get_file_ext( dn );			
			
			if( this._is_video_ext( ext ) || this._is_game_ext( ext ) )		return true;
		} 
		catch (e) {		}
		
		// check size
		try
		{
			var contentLength = http_channel.getResponseHeader('Content-Length');
			if( contentLength >= triggerVideoSize )		return true;
		}
		catch(e){		}
				
		return false;
	};

	// ----------------------------------------------------------------------------------
	this.disposition_name = function(http_channel)
	{
		try
		{
			var cd = http_channel.getResponseHeader('Content-Disposition');
			var at = cd.match(/^(inline|attachment);/i);

			if ((at != null) && (at[1].toLowerCase() == 'attachment'))
			{
				cd = cd.substr(at[0].length);
				if (cd.charAt(cd.length - 1) != ';') cd += ';';

				var fnm = cd.match(/filename="(.*?)"\s*?(?:;|$)/i);
				if (fnm == null) fnm = cd.match(/filename=(.*?)\s*?(?:;|$)/i);
				if (fnm != null) return fnm[1];
			}

		} catch (e) {}
		return '';
	};

	// ----------------------------------------------------------------------------------
	this.parent_window = function( http_channel ){
		var wnd = null;
		
		try
		{
			ir = http_channel.loadGroup.notificationCallbacks.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
			wnd = ir.getInterface(Components.interfaces.nsIDOMWindow);  
		}
		catch(ex)
		{			
//			ir = http_channel.notificationCallbacks.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
//			wnd = ir.getInterface(Components.interfaces.nsIDOMWindow);
			wnd = http_channel.notificationCallbacks.getInterface(Components.interfaces.nsIDOMWindow);
		}
		
		return wnd;
	}

	// ----------------------------------------------------------------------------------
	this.parent_document_title = function(http_channel)
	{
		try
		{
			var ir = ((http_channel.notificationCallbacks != null) ? http_channel.notificationCallbacks : http_channel.loadGroup.notificationCallbacks).QueryInterface(Components.interfaces.nsIInterfaceRequestor);
			var wnd = ir.getInterface(Components.interfaces.nsIDOMWindow);

			if (wnd != null)
			{
				var ogt = (wnd.document.evaluate('/html/head/meta[@property="og:title"]', wnd.document.documentElement, null, 9, null)).singleNodeValue; // 9 - XPathResult.FIRST_ORDERED_NODE_TYPE
				if (ogt != null)
				{
					return ogt.getAttribute('content');
				} 
				else
				{
					return wnd.document.title;
				}
			}

		} catch (e) {}
		return '';
	};

	// ----------------------------------------------------------------------------------
	this._requester_url = function( http_channel ){		
		var wnd = this.parent_window( http_channel );

        return wnd.top.document.location.toString();	
	}

	// ----------------------------------------------------------------------------------
	this.root_document_url = function(http_channel)
	{
		try
		{
			try
			{
				return this._requester_url( http_channel );
			}
			catch( ex )
			{				
				http_channel = http_channel.QueryInterface(Components.interfaces.nsIHttpChannel);
				return this._requester_url( http_channel );
			}

		} 
		catch (e) 
		{			
			// get from referer
			try
			{
				var ref = http_channel.getRequestHeader('Referer');	
				if(ref)
				{
					return ref;
				}
			}
			catch(ex){		}
		}
		return '';
	};

	// ----------------------------------------------------------------------------------
	this.parent_document_ext = function(http_channel)
	{
		try
		{
			var ct = http_channel.getResponseHeader('Content-Type');
			var cta = ct.match(/^([a-z0-9]+)\/([a-z0-9\-\.]+)/i);
			if (cta != null)
			{
				var t = cta[1].toLowerCase();
				if ((t == 'audio') || (t == 'video'))
				{
					var it = cta[2];

					var itx = cta[2].match(/^x-(.*)$/i);
					if (itx != null) it = itx[1];
					it = it.toLowerCase();

					var cts = ((t == 'video') ? mediatypes_video2ext : mediatypes_audio2ext); 
					if (it in cts)
					{
						return cts[it];
					}
				}
			}

		} catch (e) {}
		return '';
	};

	// ----------------------------------------------------------------------------------
	this.getSizeByUrl = function( url, callback ){
	
		var cached = KeyValueStore.get( "sizefor:"+url );
		if( cached )
		{			
			var event = {
						notify: function(timer) {
									callback( url, cached );
								}
					}
			 
			// Now it is time to create the timer...  
			var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			timer.initWithCallback(event, 100, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
			
			return;
		}
		
		function _setToCache( size ){
			KeyValueStore.set( "sizefor:"+url, size, 5 * 60 * 1000 );
		}
	
        var ajax = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
		ajax.open('GET', url, true);
		ajax.setRequestHeader('Cache-Control', 'no-cache');
		ajax.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;  
		ajax.url = url;
				
		ajax.onreadystatechange = function(){
						if( this.readyState == 3 )
						{
							var size = this.getResponseHeader("Content-Length");
							if (this.status == 200) 
							{
								if( size )
								{
									_setToCache( size );
									callback( this.url, size );											
									this.abort();
								}
							}				
						}
			
						if (this.readyState == 4) 
						{
							if (this.status == 200) 
							{
								var size = null;
								try
								{
									size = this.getResponseHeader("Content-Length");
								}
								catch(ex){}
								
								_setToCache( size );							
								callback( this.url, size );					
							}
							else
							{
								callback( this.url, null );
							}
						}
			
					}		
		
		ajax.send( null );
	}

	// ----------------------------------------------------------------------------------
	this.save_link = function(http_channel)
	{
		var dn ='';
		var dt = '';
		var url = '';
		var ext = '';
		var root_url = '';

		// get ext from content-type
		ext = this._get_ext_from_content_type( http_channel );		

		try
		{
			dn = this.disposition_name(http_channel);

		} catch (e) {}

		try
		{
			dt = this.parent_document_title(http_channel);
			if (dn)
			{
				var exs = dn.match(/([^\.]+)$/i);
				if ((exs != null) && (exs[1] != dn))
				{
					if( !ext )
					{
						ext = exs[1].toLowerCase();						
					}				

					dn = dn.substr(0, dn.length - ext.length - 1);
				}
			}
			else
			{
				if( !ext )
				{
					ext = this._get_file_ext(http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec);									
				}
			}

			if (!ext) ext = this.parent_document_ext(http_channel);

		} catch (e) {}

		try
		{
			url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
			if (url.indexOf("#") != -1)  url = url.substring(0, url.indexOf("#"));
		} 
		catch (e) {}

		try
		{
			root_url = this.root_document_url(http_channel);

		} 
		catch (e) {	}
		
		var nameFromChannel = this._extract_file_name_from_channel(http_channel);
		var size = null;
		try
		{
			var size = 	http_channel.getResponseHeader( "Content-Length" );			
		}
		catch(ex){}

		if( ext && ext.toLowerCase() == "swf" )
		{
			if(!this.getSwfDisplayState())	return false; // not add swf
		}
		
		if( root_url.indexOf("chrome://") != -1 )
		{
			return false;//ignore chrome
		}		
				
		var contentType = http_channel.getResponseHeader( "Content-Type" );		
		
		var referer = null;
		
		try
		{
			referer = http_channel.getRequestHeader( "Referer" );		
		}
		catch( ex ){	}
				
		var file_item = {
			'display_name': nameFromChannel ? nameFromChannel : url,
			'download_name' : nameFromChannel,
			'dn' : dn,
			'pn' : dt,
			'url': url,
			'ext': this._is_video_ext(ext) ? ext : null,
			'raw_file_ext': ext,
			'root_url' : root_url,
			'time' : (new Date()).toUTCString(),
			'playable': this.isPlayable(ext, contentType),
			'direct': true,
			'size': size,
			'referer': referer
		};

		this.files[this.md5(dt + ext + root_url)] = file_item;
		this.media_pages[root_url] = url;
		
		if (this.observer != null) this.observer.notifyObservers(null, 'FVD.Single-Media-Detect', root_url);		
	};

	// ----------------------------------------------------------------------------------
	this.remove_files_by_page_url = function( page_url )
	{
		for (var i in this.files)
		{
			if (this.files[i]['root_url'] == page_url)	delete this.files[i];
		}
		
		if( typeof this.media_pages[page_url] != "undefined" )
		{
			delete this.media_pages[page_url];
		}
	}

	// ----------------------------------------------------------------------------------
	this.get_files = function(url)
	{
		var f = {};

		for (var i in this.files)
		{
			if (this.files[i]['root_url'] == url) f[i] = this.files[i];
		}		
			
		return f;
	};
	
	// ----------------------------------------------------------------------------------  выдать все media-файлы
	this.get_files_all = function(  ){
		var media = {};
		
		for( var i in this.files )
		{			
			var file = this.files[i];
			
			if( !file.root_url )		continue;
			
			if( !( file.root_url in media ) )
			{
				media[file.root_url] = {};
			}
			media[file.root_url][i] = file;
		}
		
		return media;
	}
	
	// ----------------------------------------------------------------------------------
	this.get_files_url = function( url ){
		var media = {};
		
		for( var i in this.files )
		{			
			var file = this.files[i];

			if( !file.root_url )	continue;
			
			if (this.fileroot_url == url)
			{	
				if( !( file.root_url in media ) )		media[file.root_url] = {};
				media[file.root_url][i] = file;
			}
		}
		return media;
	}
	
	// ----------------------------------------------------------------------------------
	this.has_media = function(url)
	{
		if (url in this.media_pages)
		{
			return true;
		}
		return false;
	};

	// ----------------------------------------------------------------------------------
	try
	{
		this.detector = Components.classes['@flashvideodownloader.org/single_site_detector;1'].getService(Components.interfaces.IFVDSingleDetector);
	
		this.observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
		this.observer.addObserver(this.observer_struct, 'http-on-examine-response', false);
		this.observer.addObserver(this.observer_struct, 'http-on-examine-cached-response', false);

		this.registry = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);	

		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
		var mainWindow = wm.getMostRecentWindow("navigator:browser");  
		
		try
		{
			mainWindow.document.getElementById( "appcontent" ).addEventListener("DOMContentLoaded", function( event ){
								self.pageLoadListener( event );
							}, true);
			mainWindow.gBrowser.addProgressListener(this.browser_progress_listener);
		}
		catch(ex)
		{
			dump( "!!! FAIL SET document appcontent listener " + ex + "\n" );
		}
		

    } 
	catch (e) 
	{
		dump( "!!! FAIL INIT SNIFFER " + e + "\n" );	
	};

	this.wrappedJSObject = this;
};

// -----------------------------------------------------
// class factory
var FVD_Media_Sniffer_Factory = 
{
	createInstance: function (aOuter, aIID)
	{
		if (aOuter != null) throw Components.results.NS_ERROR_NO_AGGREGATION;
		return (new FVD_Media_Sniffer());
	}
};

// Moduel definition
var FVD_Media_Sniffer_Module =
{
	registerSelf: function(aCompMgr, aFileSpec, aLocation, aType)
	{
		aCompMgr = aCompMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
		aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME, CONTRACT_ID, aFileSpec, aLocation, aType);
	},

	unregisterSelf: function(aCompMgr, aLocation, aType)
	{
		aCompMgr = aCompMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
		aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);
	},

	getClassObject: function(aCompMgr, aCID, aIID)
	{
		if (!aIID.equals(Components.interfaces.nsIFactory)) throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
		if (aCID.equals(CLASS_ID)) return FVD_Media_Sniffer_Factory;

		throw Components.results.NS_ERROR_NO_INTERFACE;
	},

	canUnload: function(aCompMgr)
	{
		return true;
	}
};

// Module initialization
function NSGetModule(aCompMgr, aFileSpec)
{
	return FVD_Media_Sniffer_Module;
};


function NSGetFactory()
{
	return FVD_Media_Sniffer_Factory; 
};



