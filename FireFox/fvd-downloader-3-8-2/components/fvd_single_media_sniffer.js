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


//---------------------------  Log  --------------------------
function Log(text)
{
	var aConsoleService = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
	aConsoleService.logStringMessage(text);
};

// -----------------------------------------------------
function MediaPrepare( data ){
	
	if (data.url.indexOf("#") != -1)  data.url = data.url.substring(0,data.url.indexOf("#"));
	// dailymotion.com
	var lurl = data.url.toLowerCase();		
	if( ( lurl.indexOf( "dailymotion.com" ) != -1 || lurl.indexOf( ".dmcdn.net" ) != -1 ) && lurl.indexOf( "/frag(" ) != -1 )
	{
		// remove fragment data from url
		data.url = data.url.replace( /\/frag\(.?\)/, "" );
		data.size = null;

		if (!data.name)
		{
		
			var url = data.url;
			var tmp = url.split( "?" );
			url = tmp[0];
			tmp = url.split( "/" );
			tmp = tmp[ tmp.length - 1 ];

			data.name = tmp;	
		
		}
		return data;
	}
	return null;
}


const VK_VideoAnalyzer = {
    vars: null,
    videoHost: null,
    resolutions: null,
	maxSize: null,
	
	queryStringToObject: function(str){
		var obj = {};
		str.split('&').forEach(function(param){
		    var parts = param.split('=');
		    var key = decodeURIComponent(parts[0] || '');
		    if (!key) return;
			
		    var value = decodeURIComponent(parts[1] || '');
			
		    if (/^[+-]?[0-9]+$/.test(value))  value = parseInt(value, 10);
		    else 
		        if (/^[+-]?[0-9]+\.[0-9]*$/.test(value)) value = parseFloat(value);
		    
		    obj[key] = value;
		});
		
		return obj;
	},
	
    extractLinks: function(flvString){
    
		this.resolutions = VK_SETTINGS.videoResolutions;
	
		this._prepareAnalyzer( flvString );
		
        var links = { 240: this._flvUrl() };
        var self = this;
        this.resolutions.forEach(function(size) {
            var uri = self._hdUrl(size);
            if (uri)
                links[size] = uri;
        });

        var title = decodeURIComponent(this.vars.md_title || '').replace(/\+/g, ' ');
    	
		return {
			"links": links,
			"title": title
		};
		
    },
    
    _intVal: function(str){
        return parseInt(str);
    },
    
    _prepareAnalyzer: function( flvString ){
        this.vars = this.queryStringToObject(flvString);            
		
		var vars = this.vars;
		
		this.host = vars.host || 'vk.com';   // 'vkontakte.ru';
		
        vars.vkid = this._intVal(vars.vkid);
        vars.uid = this._intVal(vars.uid);
        
        var maxResolutionId = this._intVal(vars.hd);
        var maxSize = this._getMaxSize(maxResolutionId);
        
        vars.no_flv = this._intVal(vars.no_flv) != 0;
        this.isVK = this._intVal(vars.is_vk) != 0;
        
        vars.hd360_link = vars.hd_link || null;
        
        this.resolutions.forEach(function(size){
            var link = vars['hd' + size + '_link'];
            if (link && maxSize < size)  maxSize = size;
        });
        
        this.maxSize = maxSize;
    },
    
    _getMaxSize: function(id){
        if (id == 0) 
            return 240;
        
        return this.resolutions[id - 1];
    },
    
    _flvUrl: function(){
        var vars = this.vars;
        
        if (vars.no_flv)   return this._hdUrl(240);
        
        if (vars.sd_link)  return vars.sd_link;
        
        if (vars.uid <= 0) return 'http://' + this.host + '/assets/videos/' + vars.vtag + '' + vars.vkid + '.vk.flv';
        
        return this._host() + 'u' + this._uid(vars.uid) + '/video/' + vars.vtag + '.flv';
    },
    _hdUrl: function(size){
        var vars = this.vars;
        
        if (size > 240) {
            var link = vars['hd' + size + '_link'];
            if (link) 
                return link;
        }
        
        if (vars.uid <= 0 || size > this.maxSize) 
            return null;
        
        return this._host() + 'u' + this._uid(vars.uid) + '/video/' + vars.vtag + '.' + size + '.mp4';
    },
    _host: function(){
        var host = this.host;
        if (host.substr(0, 4) == 'http') 
            return host;
        
        return 'http://cs' + host + (this.isVK ? '.vk.com/' : '.vkontakte.ru/');
    },
    _uid: function(uid){
        uid = '' + uid;
        while (uid.length < 5) 
            uid = '0' + uid;
        
        return uid;
    }    
}

// -----------------------------------------------------
function loadPageContents( url, callback ){
	
	var url = url;
	
	var ajax = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
	ajax.open('GET', url, true);
	ajax.setRequestHeader('Cache-Control', 'no-cache');
	ajax.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;  	
	ajax.request_url = url;
	
	ajax.onload = function(){
		callback( ajax.responseText );
	}
	
	ajax.onerror = function(){
		callback( null );
	}
	
	ajax.send( null );
	
}

// -----------------------------------------------------
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

	function YTVideoExists( root_url, ytId, ytFormat ){
		
		//dump( ytFormat + "|" + ytId + " <--- check\n" );
						
		for( var k in self.files ){
			
			//dump( self.files[k].yt_format + "|" + self.files[k].yt_id + "\n" );
			
			if( self.files[k].yt_id == ytId && self.files[k].yt_format == ytFormat && self.files[k].root_url == root_url ){
				return true;
			}
		}
		
		return false; 
			
	}

    this.isPlayable = function(ext, contentType){
        var playable = false;
        
        if (video_extensions.indexOf(ext) != -1) {
            playable = true;
        }
        
        if (audio_extensions.indexOf(ext) != -1) {
            playable = true;
        }
        
        if (contentType) {
            if (contentType.toLowerCase().indexOf("video") != -1) {
                playable = true;
            }
            if (contentType.toLowerCase().indexOf("audio") != -1) {
                playable = true;
            }
        }
        
        return playable;
    }

	

	this.alert = function(text)
	{
		var aConsoleService = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
		aConsoleService.logStringMessage(text);
	};
	
	this.getSwfDisplayState = function()
	{
		var branch = this.registry.getBranch(SETTINGS_KEY_BRANCH);
		try
		{
			return branch.getBoolPref('download.swf_display' );

		} catch (e){

		}
		
		return false;
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



   this._parseYoutubeEmbed = function(content, root_url, request_url, youtube_id, callback){
   	
        try {
            var jsr = content.match(/<embed[^>]+flashvars="([^\"]+?)"/i);
            
            var formats = {};
            var foundFormats = false;
            
            if (jsr != null) {
                var data = jsr[1].split('&amp;');
                for (var i = 0, j = data.length; i < j; i++) {
                    if (data[i].indexOf('fmt_url_map') == 0) {
                        info = (decodeURIComponent(data[i].substr(data[i].indexOf('fmt_url_map') + 12)));
                        
                        var map = info.split(',');
                        map.forEach(function(el, i, a){
                            var mk = el.split('|');
                            if (mk.length == 2) {
                                formats[mk[0]] = mk[1];
                            }
                        });
                        
                        foundFormats = true;
                        
                        break;
                    }
                }
                
                if (!foundFormats) {
                    // try extract url_encoded_fmt_stream_map
                    for (var i = 0, j = data.length; i < j; i++) {
                        if (data[i].indexOf('url_encoded_fmt_stream_map') == 0) {
                            info = (decodeURIComponent(data[i].substr(data[i].indexOf('url_encoded_fmt_stream_map') + "url_encoded_fmt_stream_map".length + 1)));
                            
                            var map = info.split(",");
                            for (var ii = 0; ii != map.length; ii++) {
                                var m = map[ii].match(/itag=([0-9]+)/i);
                                if (!m) {
                                    continue;
                                }
                                var tag = m[1];
                                m = map[ii].match(/url=([^&]+)/i);
                                if (!m) {
                                    continue;
                                }
								
								var url = m[1];
								
								m = map[ii].match(/sig=([^&]+)/);
                                if (!m) {
                                    continue;
                                }
								
								url += "&signature="+m[1];                              
                                
                                formats[tag] = decodeURIComponent(url);
                            }
                            
                            foundFormats = true;
                            
                            break;
                        }
                    }
                }
            }
			
            if(!foundFormats){
				var tmp = content.match( /"url_encoded_fmt_stream_map"\s*:\s*"(.+?)"/i );
				if( tmp ){
							
					//var map = decodeURIComponent( tmp[1] );
					tmp[1] = tmp[1].replace(/\\u0026/g, "&");
					var map = tmp[1].split(",");
                    for (var ii = 0; ii != map.length; ii++) {
                        var m = map[ii].match(/itag=([0-9]+)/i);
                        if (!m) {
                            continue;
                        }
                        var tag = m[1];
                        m = map[ii].match(/url=([^&]+)/i);
                        if (!m) {
                            continue;
                        }
                        var url = m[1];  
						url = decodeURIComponent(url);						
						
						m = map[ii].match(/sig=([^&]+)/);
                        if (!m) {
                            continue;
                        }
						
						url += "&signature="+m[1];      
						
                        formats[tag] = url;
                    }
					
                    
                    foundFormats = true;
				}
			}

            if (foundFormats) 
			{
                var ytf = {
                
                    37: {
                        title: 'Full HD',
                        frm: 'mp4',
						size: "1080p"
                    },
                    22: {
                        title: 'HD',
                        frm: 'mp4',
						size: "720p"
                    },
                    35: {
                        title: 'High',
                        frm: 'flv',
						size: "360p"
                    },
                    34: {
                        title: 'Low',
                        frm: 'flv',
						size: "270p"
                    },
                    18: {
                        title: 'SD',
                        frm: 'mp4',
						size: "270p"						
                    },
                    6: {
                        title: ' Low',
                        frm: 'flv',
						size: "180p"
                    },
                    5: {
                        title: 'Low ',
                        frm: 'flv',
						size: "180p"
                    },
                    17: {
                        title: 'Mobile',
                        frm: '3gp'
                    },
                    13: {
                        title: 'Mobile ',
                        frm: '3gp'
                    },
                    43: {
                        title: "Low",
                        frm: 'webm',
						size: "270p"
                    },
                    44: {
                        title: "High",
                        frm: 'webm',
						size: "360p"
                    },
                    45: {
                        title: "HD",
                        frm: 'webm',
						size: "720p"
                    },
                    46: {
                        title: "Full HD",
                        frm: 'webm',
						size: "1080p"
                    },
                };
                
                var title = content.match(/<meta\sname=\"title\" content=\"([^\"]+)\">/i);
                if (title != null) {
                    title = self.decode_html.call(self, self.decode_html.call(self, title[1]));
                    if (title.length > TITLE_MAX_LENGTH) 
                        title = title.substr(0, TITLE_MAX_LENGTH) + '...';
                }
                
                var items = {};
                //var media = {};
                var mediaFound = false;
                
                var parsedMediaList = [];      
				
				
                for (var i in ytf) {
                    if (!(i in formats)) {				
                        continue;
                    }

					// check youtube video already exists
					if( YTVideoExists( root_url, youtube_id,  i ) ){
						continue;
					}
                    
                    var u = formats[i];
                    
                    if ((i in ytf)) {
                        var ft = ((title != null) ? title + ' (' + ytf[i].title + ')' : null);
                    }

					// -- проверим на shows format
					var ext = (i in ytf) ? ytf[i].frm : 'FLV';
					if( !this.check_shows_format( ext, root_url ) )  continue;

					if (!callback) 
					{
						var file_item = {
								"display_name": u,
								"download_name" : ft,
								'dn' : ft,
								'pn' : ft,
								'url': u,
								'ext': ext,
								'raw_file_ext': ((i in ytf) ? (ytf[i].title) : 'FLV'),
								'root_url' : root_url,
								'time' : (new Date()).toUTCString(),
								"playable": (i in ytf) ? self.isPlayable((ytf[i].frm)) : false,
								'direct': true,
								'yt_format': i,
								referer: ""
								};
//						this.files[this.md5(u + root_url)] = file_item;
						this.files[this.md5(i + root_url)] = file_item;
						this.media_pages[root_url] = u;
                    }
					else
					{
						var media = {
							display_name: u,
							url: u,
							type: ((i in ytf) ? (ytf[i].title) : 'FLV'),
							height: ((i in ytf) ? (ytf[i].size) : null),
							node: null,
							yt_id: youtube_id,
							ext: ((i in ytf) ? ytf[i].frm : 'FLV'),
							file_title: ft,
							direct: true,
							yt_format: i,
							playable: (i in ytf) ? self.isPlayable((ytf[i].frm)) : false,
							"headers": {
								"referer": "",
								"content_type": "video/x-flv",
								"cookies": "",
								"user_agent": ""
							},
							root_url: root_url
						};
						parsedMediaList.push(media);
					}	
                    
                    mediaFound = true;
                }
				
                
                if (callback) 
				{
                    callback(parsedMediaList, youtube_id);
                }
                
                if (mediaFound && !callback) 
				{
					
                    if (self.observer != null) 
					{
                        self.observer.notifyObservers(null, 'FVD.Single-Media-Detect', root_url);
                    }
                }
                
                
            }
        } 
        catch (ex) {
            dump("YT ERROR parse " + ex + "\r\n");
        }
        
    }

	
	this.getContentFromYoutubePage = function( root_url, videoId, callback ){
		// send request to youtube
		var flag = false;
		var scheme = "http";
		
		if( root_url.toLowerCase().indexOf("https") == 0 ){
			scheme = "https";
		}

		var url = scheme + "://www.youtube.com/watch?v="+videoId+"&additional=noparsemeplease";
		
		var ajax = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
		ajax.open('GET', url, true);
		ajax.youtube_id = videoId;
		ajax.setRequestHeader('Cache-Control', 'no-cache');
		ajax.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 5.1; rv:15.0) Gecko/20100101 Firefox/15.0');
		ajax.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;  	
		ajax.root_url = root_url;
		ajax.request_url = url;
		
		ajax.onreadystatechange = function(){
			try {
							
				if (this.readyState == 4) {
					
					if (this.status == 200) {
						
						var content = this.responseText;
						
						flag = self._parseYoutubeEmbed( content, this.root_url, this.request_url, this.youtube_id, callback );
					}
				}
			} 
			catch (e) {			}
		}
		ajax.send( null );
		return flag;
	}
	
	this.check_youtube_channel = function( http_channel ){		
        var url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
        
		if( url.indexOf( "noparsemeplease" ) != -1 ){
			return;
		}
		
        //var matches = url.match(/ytimg\.com\/vi\/(.+?)\/[^\.\/]+?default\.jpg/i);
		
		if (url.toLowerCase().indexOf("youtube.com/user") == -1) {
			return;
		}	
		
        var root_url = url;

       	matches = url.match(/https?:\/\/(?:www\.)?youtube\.com\/user\/.+?[\?&]v=([^&]+)/i);		
		
		if( matches ){  
					  
			this.getContentFromYoutubePage(root_url, matches[1]);			
			
			return;	
		}
		else{

		}		
		
		// try to get video id from channel contents
		
       	matches = url.match(/https?:\/\/(?:www\.)?youtube\.com\/user\/([^\/\?&]+)/i);	
		
		if( matches ){
			
			loadPageContents( "http://www.youtube.com/user/" + matches[1]+"?additional=noparsemeplease", function( contents ){

				if( !contents ){
					return;
				}
		
				
				contents = contents.replace( "\\/", "/" );
							
				matches = contents.match( /data-swf-config\s*=\s*"(.+?)"/i );
				if( matches ){				 	
					
					var conf = matches[1];
					
					matches = conf.match( /\\\/vi\\\/(.+?)\\\//i ); 	
						
					if( matches ){			
												
						self.getContentFromYoutubePage(root_url, matches[1]);							
					}
					else{

					}
			
					
				}
				else{
				
				}
										
			} );
		}
		
	}
	
	this.check_youtube_page = function( http_channel ){
		var url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
		
		if( url.indexOf( "noparsemeplease" ) != -1 )
		{    
			return false; // this is checked request        
		}
		
		var matches = url.match(/https?:\/\/(?:www\.|m\.)?youtube\.com\/watch.*[\?|&]v=([^\?&]+)/i);
		
		if( !matches )
		{        
		 	return false;        
		}
		
		var root_url = url;		
		
		this.getContentFromYoutubePage( root_url, matches[1] );   
	}
	
	this.check_youtube_embeds = function( http_channel ){		
	
		var url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;

		var matches = url.match(/:\/\/(?:www\.)?(?:youtube|youtube-nocookie)\.com\/v\/([^\?&]+)/i);
		
		if( !matches ){
			matches = url.match(/:\/\/(?:www\.)?(?:youtube|youtube-nocookie)\.com\/embed\/([^\?&]+)/i);
		}	

		if( !matches ){
			return false;
		}		
		
		var root_url = "";
		try{
			root_url = this.root_document_url(http_channel);		
			
			try{
				if( root_url && root_url.indexOf( "about:" ) == 0 ){
					root_url = url;
				}						
			}
			catch( ex ){
				
			}
			
		}
		catch(ex){}
		
		this.getContentFromYoutubePage( root_url, matches[1] );		
	
	},
	
	this.event = {
		observe: function(subject, topic, data) {
			try{
				var b = null;
				var index = -1;
				for( var i = 0; i != self.timers; i++ ){
					if( self.timers[i].timer == subject ){
						b = self.timers[i].browser;
						index = i;
						break;
					}
				}
												
				if( b && b.contentDocument ){
					var url = b.contentDocument.location.toString();
					if( url.indexOf("#") != -1 ){
						return false;
					}
									
					// parse youtube id
					var body = b.contentDocument.body;
					
					if( body ){
						var matches = body.innerHTML.match( /playnav\.setVideoId\("(.+?)"\);/i );
						if( matches ){
							self.getContentFromYoutubePage(url, matches[1]);
						}						
					}
				}
				
				if( index != -1 ){
					self.timers.splice( index, 1 );				
				}
			}
			catch(ex){
				dump( "FAIL ANALYZER " + ex + "\r\n" );
			}


		}
	}
	
	
    this.check_youtube_channel_page = function(http_channel){
        // First page of channel (without #<video_id>)
        // check by page contents
        
        try 
		{

            var url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
            
            if( !url.match(/^http:\/\/(www\.)?youtube\.com\/user\//) )		return false;
			
			
			try
			{
				var contentType = http_channel.getResponseHeader( "Content-Type" );
				if( contentType.indexOf("text/html") == -1 )
				{
					return false;
				}
			}
			catch( ex )
			{
				return false;	
			}
									
           	var b = this.getBrowserFromChannel(http_channel);
			if( b )
			{	
				var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
				timer.init(this.event, 5000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
				
				this.timers.push( {
					"timer": timer,
					"browser": b
				});
			}
        } 
        catch (ex) {
            dump("!!FAIL!!" + ex + "\r\n");
        }
        
    }
	
    this.getBrowserFromChannel = function(aChannel){
        try {
            var notificationCallbacks = aChannel.notificationCallbacks ? aChannel.notificationCallbacks : aChannel.loadGroup.notificationCallbacks;
            
            if (!notificationCallbacks) 
                return null;
            
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
        catch (e) {
            return null;
        }
    }
	

	this.checkVkontakteAudio = function( doc ){
				
		try
		{					
			if( doc.location.host.indexOf( "vk.com" ) != -1  )
			{	
				var list=doc.getElementById("initial_list");
			
				var elements = list.getElementsByClassName( "audio" );
			
				var anyAudioFound = false;
				
				var root_url = doc.location.href;

				for( var i = 0; i != elements.length; i++ )
				{
				
					var audioBlock = elements[i];
					
					try
					{
						var id = audioBlock.getAttribute( "id" );	
						
						var tmp = id.split("_");
						id = tmp[1];
						
						// get audio url and title
						var hidden = audioBlock.getElementsByTagName( "input" )[0];
						var tmp = hidden.value.split(",");
						var url = tmp[0];
						
						var titleBlock = audioBlock.getElementsByClassName("info")[0];
						
						var title = titleBlock.getElementsByTagName( "a" )[0].textContent;
						title += "-" + titleBlock.getElementsByTagName( "span" )[0].textContent;
						
						var u = url;						
						var ext = this._get_file_ext( url );
		
						if( !this.check_shows_format( ext, url ) )  continue;  // -- проверим на shows format
						
						var file_item = {
								"display_name": u,
								"download_name" : title,
								'dn' : title,
								'pn' : title,
								'url': u,
								'ext': ext,
								'raw_file_ext': ext,
								'root_url' : root_url,
								'time' : (new Date()).toUTCString(),
								"playable": self.isPlayable(ext),
								'direct': true,
								'yt_format': i,
								referer: ""
								};
		
						this.files[this.md5(u + root_url)] = file_item;
						this.media_pages[root_url] = u;
						
						anyAudioFound = true;									
					}
					catch( ex ){
						dump( "EX2: " + ex + "\n" );
					}
				}

				if (this.observer != null && anyAudioFound) 
				{
					this.observer.notifyObservers(null, 'FVD.Single-Media-Detect', root_url);
				}
				
			}
			
		}
		catch( ex ){
			dump( "Ex while VK Audio check: " + ex + "\r\n" );
		}
	}
	
	this.vk_add_video = function( url, title, type, ext, size, root_url ){
		var file_item = {
				"display_name": url,
				"download_name" : title,
				'dn' : title,
				'pn' : title,
				'url': url,
				'ext': ext,
				'raw_file_ext': type,
				'root_url' : root_url,
				'time' : (new Date()).toUTCString(),
				"playable": self.isPlayable(ext),
				'direct': true,
				'yt_format': size,
				referer: ""
				};
		
		this.files[this.md5(url + root_url)] = file_item;
		this.media_pages[root_url] = url;
	}
						
	
	// --------------------------------------------------------  
	this.parse_str = function (str){
		var glue1 = '=';
		var glue2 = '&';
		var array2 = str.split(glue2);
		var array3 = [];
		for(var x=0; x<array2.length; x++)
		{
			var tmp = array2[x].split(glue1);
			array3[unescape(tmp[0])] = unescape(tmp[1]).replace(/[+]/g, ' ');
		}
		return array3;
	}
	
	// ----------------------------
	this.check_vkontakte = function( http_channel ){
		try{
			var url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
			
			if( !url.match( /http:\/\/(www\.)?vk\.com\/swf\/VideoPlayer.+?\.swf/i ) )		return false;
	
			var wnd = this.parent_window( http_channel );	
			var doc = wnd.document;
			var title=doc.getElementById("mv_min_title").innerHTML;
			var root_url = doc.location.href;
			
			
        	var player = doc.getElementById("video_player");
        	var flvVars = player.getAttribute("flashvars");

			if (flvVars != null)
			{
				var param_js=this.parse_str(flvVars);

				if (param_js['hd']=="0")
				{
					if (param_js['no_flv']=="")
					{
						var proverka=param_js["host"].search(/(vkadre.ru)/i);
						if (proverka!=-1)
						{
							this.vk_add_video('http://'+param_js["host"]+'/assets/videos/'+param_js["vtag"]+''+param_js["vkid"]+'.vk.flv', title, 'Low', 'flv','240p',root_url);					
						}
						else
						{
							this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.flv', title, 'Low', 'flv','240p',root_url);					
						}
					}
					if (param_js['no_flv']=="0")
					{
						var proverka=param_js["host"].search(/(vkadre.ru)/i);
						if (proverka!=-1)
						{
							this.vk_add_video('http://'+param_js["host"]+'/assets/videos/'+param_js["vtag"]+''+param_js["vkid"]+'.vk.flv', title, 'Low', 'flv', '240p',root_url);					
						}
						else
						{
							this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.flv', title, 'Low', 'flv', '240p',root_url);					
						}
					}
					if (param_js['no_flv']=="1")
					{
						this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title, 'SD',  'mp4','240p',root_url);					
					}
				}
				else if (param_js['hd']=="1")
				{       
                    this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4', title, 'High', 'mp4','360p',root_url);					
                    this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title, 'SD', 'mp4','240p',root_url);					
				} 
				else if (param_js['hd']=="2")
				{      
                    this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.480.mp4', title, 'High', 'mp4','480p',root_url);					
                    this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4', title, 'High', 'mp4','360p',root_url);					
                    this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title, 'SD', 'mp4','240p',root_url);					
				} 
				else if (param_js['hd']=="3")
				{       
                    this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.720.mp4', title, 'HD', 'mp4','720p',root_url);					
                    this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.480.mp4', title, 'High', 'mp4','480p',root_url);					
                    this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4', title, 'High', 'mp4','360p',root_url);					
                    this.vk_add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title, 'SD', 'mp4','240p',root_url);					
				} 		   			 
				

				if (this.observer != null) this.observer.notifyObservers(null, 'FVD.Single-Media-Detect', root_url);	
			}	
				
			
		}
		catch( ex ){
			dump( "Exception : " + ex );
		}
		
	}

	// ----------------------------
	this.add_video_dailymotion = function( url, label, fileName, ext, size, type, root_url ){
	
	
		if( !this.check_shows_format( ext, url ) )  return;  // -- проверим на shows format

		var file_item = {
				"display_name": url,
				"download_name" : fileName,
				'dn' : url,
				'pn' : label,
				'url': url,
				'ext': ext,
				'raw_file_ext': type + '  [' + size + ']',
				'root_url' : root_url,
				'time' : (new Date()).toUTCString(),
				"playable": self.isPlayable(ext),
				'direct': true,
				'yt_format': size,
				referer: ""
				};
		
		this.files[this.md5(url + root_url)] = file_item;
		this.media_pages[root_url] = url;
	}
						
	this.check_dailymotion = function( http_channel ){
	
		try{
			var url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
			
			if( !url.match( /http:\/\/(www\.)?dailymotion(\.co)?\.([^\.\/]+)\//i ) )		return false;
			var wnd = this.parent_window( http_channel );	
			var doc = wnd.document;
			try
			{
				root_url = this.root_document_url(http_channel);
			} catch (e) {	}
			
			// название
			var videoTitle='';
			var headTitle = doc.getElementsByClassName("foreground");
			if (headTitle != null)
			{
				videoTitle = headTitle[0].getAttribute("title");
			}	
			
			var paramElements;
			try 
			{
				paramElements=doc.getElementsByTagName("param");
			} 
			catch(e) 
			{
				return false;
			}

			for(var i=0;i<paramElements.length;i++) 
			{
				var paramElement=paramElements[i];
				if(paramElement.getAttribute("name")=="flashvars") 
				{
					var  params=paramElement.getAttribute("value").split("&");
					for(var j=0;j<params.length;j++) 
					{
						var m=/^sequence=(.*)$/.exec(params[j]);
						if(m) 
						{
							var seq=JSON.parse(decodeURIComponent(m[1]));
							for(var k=0; k<seq.sequence[0].layerList[0].sequenceList.length; k++) 
							{
								var seqItem=seq.sequence[0].layerList[0].sequenceList[k];
								if(seqItem.name=="main") 
								{
									var icon="";
									var baseFileName="video";
									var links=doc.getElementsByTagName("link");
									
									for(var u=0;u<links.length;u++) 
									{
										var link=links[u];
										if(link.getAttribute("rel")=="shortcut icon")	icon=link.getAttribute("href");
										if(link.getAttribute("rel")=="canonical")	baseFileName=/([^\/]*)$/.exec(link.getAttribute("href"))[1];
									}
											
									for(var l=0;l<seqItem.layerList.length;l++) 
									{
										var layer=seqItem.layerList[l];
										if(layer.name.toLowerCase()=="video") 
										{
											var tags={
												"hd1080": {
															label: "HD1080",
															size: "1080",
														  },
												"hd720":  {
															label: "HD720",
															size: "720",
												  		  },
												"hq":     {
															label: "HQ",
															size: "480",
														  },
												"sd":     {
														    label: "SD",
															size: "480",
														  },
												"ld":     {
															label: "LD",
															size: "480",
														  },
													}
													
											for(var n in tags) 
											{
														//dump("  "+n+"URL"+": "+layer.param[n+"URL"]+"\n");
												if(layer.param[n+"URL"]) 
												{
													var url=layer.param[n+"URL"];
													var label=tags[n].label;
													var size =tags[n].size; 
													var extension="flv";
													var mExt=/\.([0-9a-zA-Z]+)(?:$|\?)/.exec(url);
													if(mExt)	extension=mExt[1];
													if (videoTitle == '')  videoTitle = baseFileName;
//	                                                this.add_video_dailymotion( url, "["+label+"] "+baseFileName+"."+extension, baseFileName, extension, size, label, root_url );
	                                                this.add_video_dailymotion( url, "["+label+"] "+videoTitle, videoTitle, extension, size, label, root_url );
												}
											}
										}
									}
									return true;																				
								}
							}
						}
					}
			    }
			}
		}
		catch( ex ){
			dump( "Exception : " + ex );
		}
		return false;
	}
	
	
	// listeners
	
	this.browser_progress_listener = {	
		onLocationChange: function(aWebProgress, aRequest, aURI){
			self.checkVkontakteAudio( aWebProgress.DOMWindow.document );
		}
	}
	
	this.pageLoadListener = function( event ){
		this.checkVkontakteAudio( event.target );
	}
	
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
					
					if( self.allowYoutube )
					{
						self.check_youtube_channel( aSubject );
						self.check_youtube_page( aSubject );
						self.check_youtube_embeds(aSubject);						
					}
					else{
						var url = aSubject.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
						
						if( url.indexOf("://s.ytimg.com") != -1 || url.indexOf("://o-o.preferred.") != -1 || url.indexOf("youtube.com") != -1 )
						{
							return;
						}								
					}
					
					self.check_vkontakte( aSubject );

					if (self.check_dailymotion( aSubject )) return;

					
                    try 
					{
                        self.check_youtube_channel_page(aSubject);
                    } 
                    catch (ex) {
                    	dump( "ERROR EX " + ex + "\r\n" );
                    }
										
					
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

				} catch (e){
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

	this._get_file_ext = function( path ){
		try{
			var tmp = path.split("?");
			tmp = tmp[0].split( "." );
			var ext = tmp[tmp.length-1].toLowerCase();		
			return ext;	
		}
		catch(ex){
			return null;
		}		
	};
	
	this._is_video_ext = function( ext ){
		for( var i = 0; i != video_extensions.length; i++ ){			
			if( ext == video_extensions[i] ){
				return true;
			}
		}		
		return false;
	};
	
	this._is_game_ext = function( ext ){
		for( var i = 0; i != games_extensions.length; i++ ){			
			if( ext == games_extensions[i] ){
				return true;
			}
		}		
		return false;
	};
	
	this._is_ignored_ext = function( ext ){
		
		for( var i = 0; i != ignore_extensions.length; i++ ){			
			if( ext == ignore_extensions[i] ){
				return true;
			}
		}		
		return false;
		
	};

	this._extract_file_name_from_channel = function(http_channel){
		// check disposition name
		try{
			var dn = this.disposition_name(http_channel);
			if( dn ){
				return dn;
			}
		}
		catch(ex){}
		/*
		var url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
		var tmp = url.split( "?" );
		url = tmp[0];
		tmp = url.split( "/" );
		tmp = tmp[ tmp.length - 1 ];
		
		if( tmp.indexOf( "." ) != -1 ){
			var replaceExt = this._get_ext_from_content_type( http_channel );
			if( replaceExt ){
				tmp = tmp.split( "." );
				tmp.pop();
				tmp.push( replaceExt );
				tmp = tmp.join(".");
			}
			return decodeURIComponent(tmp);
		}
		*/
		return  null;		
	};
	
	// obtain video extension from Content-type header
	// extensions patters:
	// video/x-(.+)
	// video/(.+?)
	this._get_ext_from_content_type = function( http_channel ){
		try{
			var contentType = http_channel.getResponseHeader( "Content-Type" );
			if( contentType ){
				var m = null;
				
				if( m = /video\/x-([^;]+)/.exec(contentType) ){
					return m[1];
				}
				else if( m = /video\/([^ ,]+)/.exec(contentType) ){
					return m[1];
				}
				
				return null;
			}
		}
		catch(ex){}		
		
		return null;
	}
	
	this.check_shows_format = function(type, url)
	{
		var name;
		if (url.toLowerCase().indexOf("youtube.com") != -1)
		{    
			name = "enable_yt_type_"+type;
		}	
		else	
		{
			name = "enable_type_"+type;
		}	
		var branch = this.registry.getBranch(SETTINGS_KEY_BRANCH);
		try
		{
			return branch.getBoolPref(name);
		} 
		catch (e){	}
		return true;
	}
	
	
	// --------------------------------------------   Проверяем на необходимость данных с youtube
	this.needed_media = function(http_channel) 
	{	
	
		var url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
		if (url.indexOf("#") != -1)  url = url.substring(0, url.indexOf("#"));
		
		// youtube и vk
		if( url.indexOf("://s.ytimg.com") != -1 || url.indexOf("://o-o.preferred.") != -1 || url.indexOf("youtube.com") != -1 )  return false;
		if( url.indexOf( "vk.com" ) != -1  ) return false;
		
		// check url is in ignore list
		
		var ignore = false;
		IGNORE_SNIFFER_URL_SIGNS.forEach(function( sign ){
			if( url.indexOf( sign ) != -1 ){
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
		catch(e){
			return false; // fail check media length
		}
			
		var ext = this._get_file_ext( url );
		
		if( this._is_ignored_ext( ext ) )			return false;
		
		// -- проверим на shows format
		if( !this.check_shows_format( ext, url ) )  return false;
		
		// check Location header, if set, no handle this url
		try
		{
			var ct = http_channel.getResponseHeader('Location');
			if( ct ){
				return false;
			}

		} catch (e) {}		
	
		// Content-type check	
		try
		{
			var ct = http_channel.getResponseHeader('Content-Type');
			var cta = ct.match(/^([a-z0-9]+)\//i);
			if (cta != null)
			{
				var t = cta[1].toLowerCase();
				if ((t == 'audio') || (t == 'video')){
					return true;	
				}
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

	this.parent_window = function( http_channel ){
		var wnd = null;
		
		try{
			ir = http_channel.loadGroup.notificationCallbacks.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
			wnd = ir.getInterface(Components.interfaces.nsIDOMWindow);  
		}
		catch(ex){			
			ir = http_channel.notificationCallbacks.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
			wnd = ir.getInterface(Components.interfaces.nsIDOMWindow);
		}
		
		return wnd;
	}

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
				} else
				{
					return wnd.document.title;
				}
			}

		} catch (e) {}
		return '';
	};

	this._requester_url = function( http_channel ){		
		var wnd = this.parent_window( http_channel );

        return wnd.top.document.location.toString();	
	}

	this.root_document_url = function(http_channel)
	{
		try
		{
			try{
				return this._requester_url( http_channel );
			}
			catch( ex ){				
				http_channel = http_channel.QueryInterface(Components.interfaces.nsIHttpChannel);
				return this._requester_url( http_channel );
			}

		} catch (e) {			
		
			// get from referer
			try{
				var ref = http_channel.getRequestHeader('Referer');	
				if(ref){
					return ref;
				}
			}
			catch(ex){
			}
		}
		return '';
	};

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

	this.getSizeByUrl = function( url, callback ){
	
		var ajax = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
		ajax.open('GET', url, true);
		ajax.setRequestHeader('Cache-Control', 'no-cache');
		//ajax.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 5.1; rv:15.0) Gecko/20100101 Firefox/15.0');
		ajax.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;  
		ajax.url = url;
				
		ajax.onreadystatechange = function(){
			if( this.readyState == 3 ){
				var size = this.getResponseHeader("Content-Length");
				if (this.status == 200) {
					if( size ){
						callback( this.url, size );		
						this.abort();
					}
				}				
			}
			
			if (this.readyState == 4) {
					
				if (this.status == 200) {
					var size = null;
					try{
						size = this.getResponseHeader("Content-Length");
					}
					catch(ex){}
															
					callback( this.url, size );					
				}
				else{
					callback( this.url, null );
				}
			}
			
		}		
		
		ajax.send( null );
	}

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
					if( !ext ){
						ext = exs[1].toLowerCase();						
					}				

					dn = dn.substr(0, dn.length - ext.length - 1);
				}
			}
			else{
				if( !ext ){
					ext = this._get_file_ext(http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec);									
				}
			}

			if (!ext) ext = this.parent_document_ext(http_channel);

		} catch (e) {}

		try
		{
			url = http_channel.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
			if (url.indexOf("#") != -1)  url = url.substring(0, url.indexOf("#"));
		} catch (e) {}

		if( !this.check_shows_format( ext, url ) )  return false;
		
		try
		{
			root_url = this.root_document_url(http_channel);

		} catch (e) {

		}
		
		var nameFromChannel = this._extract_file_name_from_channel(http_channel);
		var size = null;
		try{
			var size = 	http_channel.getResponseHeader( "Content-Length" );			
		}
		catch(ex){}

		if( ext && ext.toLowerCase() == "swf" ){
			if(!this.getSwfDisplayState()){
				return false; // not add swf
			}
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
				
		// url preparations step dailymotion - коррекция
/*		var media = MediaPrepare( {	url: url,  size: size, name: nameFromChannel } );
		if (media)
		{
			url = media.url;
			size = media.size;
			dt = media.name;
		}	*/
				
		var file_item = {
			"display_name": nameFromChannel ? nameFromChannel : url,
			"download_name" : nameFromChannel,
			'dn' : dn,
			'pn' : dt,
			'url': url,
			'ext': this._is_video_ext(ext) ? ext : null,
			'raw_file_ext': ext,
			'root_url' : root_url,
			'time' : (new Date()).toUTCString(),
			"playable": this.isPlayable(ext, contentType),
			'direct': true,
//			"size": size,
			referer: referer
		};

		if( size )		file_item.size = size;
//		this.files[this.md5(url + root_url)] = file_item;
		this.files[this.md5(dt + ext + root_url)] = file_item;
		this.media_pages[root_url] = url;
		
		if (this.observer != null) this.observer.notifyObservers(null, 'FVD.Single-Media-Detect', root_url);		
	};

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

	this.get_files = function(url)
	{
		var f = {};

		for (var i in this.files)
		{
			if (this.files[i]['root_url'] == url) f[i] = this.files[i];
		}		
			
		return f;
	};
	
	this.get_files_all = function(  ){
		var media = {};
		
		for( var i in this.files ){			
			var file = this.files[i];
			
			if( !file.root_url ){
				continue;
			}
			
			if( !( file.root_url in media ) ){
				media[file.root_url] = {};
			}
			media[file.root_url][i] = file;
		}
		
		return media;
	}
	
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
	
	

	this.has_media = function(url)
	{
		if (url in this.media_pages)
		{
			return true;
		}
		return false;
	};

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
		catch(ex){
			dump( "!!! FAIL SET document appcontent listener " + ex + "\n" );
		}
		

    } catch (e) {
			
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



