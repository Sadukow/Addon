const nsISupports = Components.interfaces.nsISupports;
const CLASS_ID = Components.ID('{213bea84-5789-4ff2-a3da-24eb505ea819}');
const CLASS_NAME = 'FVD media page';
const CONTRACT_ID = '@flashvideodownloader.org/single_media_page;1';
const TITLE_MAX_LENGTH  = 96;

// -----------------------------------------------------
function FVD_Media_Page()  {
	
	var self = this;
	this.detector = null;
	this.sniffer = null;
	
	this.pageLoadTimer = null;
	
	// --------------------------------------------------------------------------------
	this.alert = function(text)
	{
		var aConsoleService = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
		aConsoleService.logStringMessage(text);
	};
	
	// --------------------------------------------------------------------------------
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
	// --------------------------------------------------------------------------------
	function trimMore(t) {
		if (t == null) return '';
		return t.replace(/^[\s_]+|[\s_]+$/gi, '').replace(/(_){2,}/g, "_");
	}

	// --------------------------------------------------------  
	function parse_str(str){
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
	
	// --------------------------------------------------------------------------------
	this.browser_progress_listener = {	
	
		
		onLocationChange: 	function(aWebProgress, aRequest, aURI){
									var doc = aWebProgress.DOMWindow.document;
									var url = doc.location.href;
								},
		onStateChange: 		function(aWebProgress, aRequest, aFlag, aStatus) {
									if(aFlag & Components.interfaces.nsIWebProgressListener.STATE_STOP)  
									{
										var doc = aWebProgress.DOMWindow.document;
										var url = doc.location.href;
										self.pageLoad();  
									} 
								},
								
	}
	
	// --------------------------------------------------------------------------------
	this.pageLoadListener = function( event )  {
	
		var win = event.target.defaultView;
	    if (win.wrappedJSObject)	win = win.wrappedJSObject;				
		var doc = win.document;
		var url = doc.location.href;
		
		this.pageLoad();
		
	}
	
	// ========================================================================================================================
	this.pageLoad = function(  )  {

		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
		var mainWindow = wm.getMostRecentWindow("navigator:browser");  
		var gBrowser = mainWindow.gBrowser;			
		var doc = gBrowser.selectedBrowser.contentDocument;
	
		var url = doc.location.href;
//		dump("-------fvd_single_media_page - pageLoad\r\n"+url+"\r\n\n");

		if (url.toLowerCase().match(/https?:\/\/(?:www\.)?youtube\.com\/watch.*[\?|&]v=([^\?&]+)/i) )
		{
			this.get_YT_Watch( doc );
		}
		else if (url.toLowerCase().match(/https?:\/\/(?:www\.)?youtube\.com\/user\/([^\/\?&]+)/i) )
		{
			this.get_YT_User( doc );
		}
		else if ( url.toLowerCase().match( /http:\/\/(www\.)?dailymotion(\.co)?\.([^\.\/]+)\//i ) )		
		{
			this.get_DM_Video( doc );
		}
		else if( url.toLowerCase().indexOf( "vk.com/audio" ) != -1 )
		{
			this.get_VK_Audio( doc );
		}
		else if( (url.toLowerCase().indexOf( "vk.com/video" ) != -1) && (url.length > 30) )
		{
			this.get_VK_Video( doc );
		}
	}
	// ============================================================  VK  ============================================================
	this.get_VK_Video = function( document )  {

		var root_url = document.location.href;
        var mediaFound = false;
		var parsedMediaList = [];
		
		for (var iii = 0; iii < document.embeds.length; iii++) 
		{
			var ee = document.embeds[iii];
			var id = ee.id ? ee.id : "";		
			
			if( id == "video_player" )
			{
				var flvVars = "";
				if (ee.hasAttribute('flashvars')) 
				{
					flvVars = trimMore(ee.getAttribute('flashvars'));
				}
			
				if (flvVars != null)	
				{
					var param_js = parse_str(flvVars);
					var title = param_js['md_title'];
					var url;

					if (param_js['hd']=="0")
					{
						if (param_js['no_flv']=="")
						{
							var proverka=param_js["host"].search(/(vkadre.ru)/i);
							if (proverka!=-1)
							{
								url = 'http://'+param_js["host"]+'/assets/videos/'+param_js["vtag"]+param_js["vkid"]+'.vk.flv';
								name = param_js["vkid"]+'.vk.flv';
								parsedMediaList.push( { url: url, title: title,	ext: "flv",	format: "Low[240p]",  quality: "240p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
							}
							else
							{
								url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.flv';
								name = param_js["vtag"]+'.flv';
								parsedMediaList.push( { url: url, title: title,	ext: "flv",	format: "Low[240p]",  quality: "240p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
							}
						}
						if (param_js['no_flv']=="0")
						{
							var proverka=param_js["host"].search(/(vkadre.ru)/i);
							if (proverka!=-1)
							{
								url = 'http://'+param_js["host"]+'/assets/videos/'+param_js["vtag"]+param_js["vkid"]+'.vk.flv';
								name = param_js["vkid"]+'.vk.flv';
								parsedMediaList.push( { url: url, title: title,	ext: "flv",	format: "Low[240p]",  quality: "240p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
							}
							else
							{
								url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.flv';
								name = param_js["vtag"]+'.flv';
								parsedMediaList.push( { url: url, title: title,	ext: "flv",	format: "Low[240p]",  quality: "240p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
							}
						}
						if (param_js['no_flv']=="1")
						{
							url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4';
							name = param_js["vtag"]+'.240.mp4';
							parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "SD[240p]",  quality: "240p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
						}
					}
					else if (param_js['hd']=="1")
					{       
						url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4';
						name = param_js["vtag"]+'.360.mp4';
						parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "HD[360p]",  quality: "360p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
						
						url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4';
						name = param_js["vtag"]+'.240.mp4';
						parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "HD[240p]",  quality: "240p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
					} 
					else if (param_js['hd']=="2")
					{      
						url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.480.mp4';
						name = param_js["vtag"]+'.480.mp4';
						parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "HD[480p]",  quality: "480p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
								
						url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4';
						name = param_js["vtag"]+'.360.mp4';
						parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "HD[360p]",  quality: "360p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
								
						url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4';
						name = param_js["vtag"]+'.240.mp4';
						parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "HD[240p]",  quality: "240p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
					} 
					else if (param_js['hd']=="3")
					{       
						url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.720.mp4';
						name = param_js["vtag"]+'.720.mp4';
						parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "HD[720p]",  quality: "720p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );

						url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.480.mp4';
						name = param_js["vtag"]+'.480.mp4';
						parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "HD[480p]",  quality: "480p",	downloadName: name,  type: "video",	groupId: 0, 	orderField: 0} );
								
						url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4';
						name = param_js["vtag"]+'.360.mp4';
						parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "HD[360p]",  quality: "360p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
								
						url = 'http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4';
						name = param_js["vtag"]+'.240.mp4';
						parsedMediaList.push( { url: url, title: title,	ext: "mp4",	format: "HD[240p]",  quality: "240p",	downloadName: name,  type: "video", groupId: 0, 	orderField: 0} );
					} 		   			 
				}	
					
			}
		}	
		
		parsedMediaList.forEach(function( item ){

						var file_item = {
									'display_name': item.url,
									'download_name' : item.title,
									'dn' : item.title,
									'pn' : item.title,
									'url': item.url,
									'ext': item.ext,
									'raw_file_ext': item.format,
									'root_url' : root_url,
									'time' : (new Date()).toUTCString(),
									'playable': self.sniffer.isPlayable(item.ext),
									'direct': true,
									'yt_format': item.quality,
									'referer': ""
								};
		
						self.sniffer.files[self.sniffer.md5(item.url + root_url)] = file_item;
						self.sniffer.media_pages[root_url] = item.url;
		
						mediaFound = true;	
					});
		
	
		if ( mediaFound )
		{
            if (self.sniffer.observer != null) 
			{
				self.sniffer.observer.notifyObservers(null, 'FVD.Single-Media-Detect', document.location.href);
				self.sniffer.observer.notifyObservers(null, 'FVD.Single-Media-VKontakte', document.location.href);
            }
		}
	
	}
	// --------------------------------------------------------------------------------
	this.get_VK_Audio = function( document )  {
	
		var root_url = document.location.href;

		var elements = document.querySelectorAll( ".audio" );
        var mediaFound = false;

		for (var i = 0; i < elements.length; i++) 
		{
			var m = elements[i];
		
			var url = "";
			var title = "";
			var duration = "";
		
			var input = m.getElementsByTagName("input")[0];
			if( input.id && input.id.indexOf( "audio_info" ) != -1 )
			{
				var v = input.value;
				if ( !v) continue;
				var t = v.split(",");
				if ( !t) continue;
				url = t[0]
			}
			if ( url.length < 4) continue;
		
			var div_title = m.getElementsByClassName("title_wrap")[0];
			if (div_title)
			{
				title = div_title.textContent;	
			}

			var div_duration = m.getElementsByClassName("duration")[0];
			if (div_duration)
			{
				duration = div_duration.textContent;	
			}
			
			var ext = this.sniffer._get_file_ext( url );
			
			var file_item = {
								'display_name': url,
								'download_name' : title,
								'dn' : title,
								'pn' : title,
								'url': url,
								'ext': ext,
								'raw_file_ext': ext,
								'root_url' : root_url,
								'time' : (new Date()).toUTCString(),
								'playable': self.sniffer.isPlayable((ext)),
								'direct': true,
								'yt_format': i,
								'referer': ""
								};
		
			this.sniffer.files[this.sniffer.md5(url + root_url)] = file_item;
			this.sniffer.media_pages[root_url] = url;
			mediaFound = true;
		}
		
		if (self.sniffer.observer != null && mediaFound) 
		{
			self.sniffer.observer.notifyObservers(null, 'FVD.Single-Media-Detect', root_url);
		}
	}
	
	// =======================================================   DAILYMOTION   ======================================================
	this.get_DM_Video = function( document )  {

		var parsedMediaList = [];
        var mediaFound = false;
		var videoTitle  = "";

		var params = document.getElementsByTagName('param');
		if (params)
		{
			for (var iii = 0; iii < params.length; iii++) 
			{
				p = params[iii];
				
				var name = '';
				if (p.hasAttribute('name')) 
				{
					name = trimMore(p.getAttribute('name'));
				}
				
				if( name.indexOf( "flashvars" ) != -1 )
				{
				
					var paramFlashvars = null;
					if (p.hasAttribute('value')) 
					{
						paramFlashvars = trimMore(p.getAttribute('value'));
					}
					if ( !paramFlashvars) continue;
					
					var data = paramFlashvars.split("&");

					for (var j = 0; j < data.length; j++) 
					{
						var t = data[j].split("=");
						if (t[0] == "sequence")
						{
							var paramSequence = unescape(t[1]);
							var obj = JSON.parse(paramSequence);
							videoTitle = obj.config.metadata.title.replace(/\+/g," ");
								
						}
					}
				}
			}
		}	
		
		if ( mediaFound )
		{
            if (self.sniffer.observer != null) 
			{
				self.sniffer.observer.notifyObservers(null, 'FVD.Single-Media-Detect', document.location.href);
				self.sniffer.observer.notifyObservers(null, 'FVD.Single-Media-DailyMotion', document.location.href);
            }
		}
	}	
	// =========================================================   YOUTUBE   ========================================================
	this.get_YT_User = function( document )  {
	
		var element = document.getElementById( "upsell-video" );
		var flvVar = element.getAttribute("data-swf-config");
		flvVar = flvVar.replace(/&quot;/g, "\"");
		
		var data = JSON.parse(flvVar);
		
		var jsn = data.args.url_encoded_fmt_stream_map;	
		var length_seconds = data.args.length_seconds;
		var title = "";
		var sps = document.getElementsByClassName( "title" );
		if (sps) title = trimMore(sps[0].textContent);
		
		var availFormats=[];
        var mediaFound = false;
				
		var fmts=jsn.split(",");
				
		for(var j in fmts) 
		{
			var parts=fmts[j].split("&");
			var fmts2={}
			var sig=null;
			for(var k in parts) 
			{
				var pline=decodeURIComponent(parts[k]);
				var m=/^sig=(.*)/.exec(pline);
				if(m)	sig=m[1];
				var match2=/^(.*?)=(.*)$/.exec(pline);
				if(match2 && match2.length==3) 
				{
					fmts2[match2[1]]=match2[2];
				}
			}
			if(fmts2['itag'] && fmts2['url']) 
			{
				if(sig) 	fmts2['url']+="&signature="+sig;
				availFormats[fmts2['itag']]=fmts2['url'];
				mediaFound = true;
			}
		}										
		
		if ( mediaFound )
		{	
			this.get_youtube_format( availFormats, title, length_seconds, document.location.href );
		}	
		
		if ( mediaFound )
		{
            if (self.sniffer.observer != null) 
			{
                self.sniffer.observer.notifyObservers(null, 'FVD.Single-Media-Detect', document.location.href);
                self.sniffer.observer.notifyObservers(null, 'FVD.Single-Media-Youtube', document.location.href);
            }
		}
					
	}
	// --------------------------------------------------------------------------------
	this.get_YT_Watch = function( document )  {

		var mediaFound = false;
		var embeds = new Array(document.embeds.length);
		for (var iii = 0; iii < document.embeds.length; iii++) 
		{
			if( document.embeds[iii].id && document.embeds[iii].id == "movie_player" )
			{
				var flvVars = null;
				if (document.embeds[iii].hasAttribute('flashvars')) flvVars = document.embeds[iii].getAttribute('flashvars');
				
				if (flvVars != null)	
				{
					var p=flvVars.split("&");
					var availFormats=[];
					var fileName=null;
					var length_seconds = 0;

					for(var i in p) 
					{
						var m=/^(.*?)=(.*)$/.exec(p[i]);
						if(m!=null && m.length==3) 
						{
							if(m[1]=="fmt_url_map") 
							{
								var fum=decodeURIComponent(m[2]);
								var fmts=fum.split(",");
								for(var j in fmts) 
								{
									var m2=/^([0-9]+)\|(.*)/.exec(fmts[j]);
									if(m2 && m2.length==3) 
									{
										availFormats[m2[1]]=m2[2];
									}
								}
							} 
							else if(m[1]=="url_encoded_fmt_stream_map") 
							{
								var fum=decodeURIComponent(m[2]);
								var fmts=fum.split(",");
										
								for(var j in fmts) 
								{
									var parts=fmts[j].split("&");
									var fmts2={}
									var sig=null;
									for(var k in parts) 
									{
										var pline=decodeURIComponent(parts[k]);
										var m=/^sig=(.*)/.exec(pline);
										if(m)	sig=m[1];
										var match2=/^(.*?)=(.*)$/.exec(pline);
										if(match2 && match2.length==3) 
										{
											fmts2[match2[1]]=match2[2];
										}
									}
									if(fmts2['itag'] && fmts2['url']) 
									{
										if(sig) 	fmts2['url']+="&signature="+sig;
										availFormats[fmts2['itag']]=fmts2['url'];
										mediaFound = true;
									}
								}										
							} 
							else if(m[1]=="title") 
							{
								fileName=decodeURIComponent(m[2]);
								fileName=fileName.replace(/\+/g," ");
								fileName=fileName.replace(/(?:[\/"\?\*:\|"'\\_]|&quot;|&amp;|&gt;|&lt;)+/g,"_");
							}
							else if(m[1]=="length_seconds") 
							{
								length_seconds = decodeURIComponent(m[2]);
							}
						}
					}
					if ( mediaFound )
					{	
						this.get_youtube_format( availFormats, fileName, length_seconds, document.location.href );
					}	
				}	
			}
		}			
		
		if ( mediaFound )
		{
            if (self.sniffer.observer != null) 
			{
                self.sniffer.observer.notifyObservers(null, 'FVD.Single-Media-Detect', document.location.href);
                self.sniffer.observer.notifyObservers(null, 'FVD.Single-Media-Youtube', document.location.href);
            }
		}
	}
	// ---------------------------------------------------------------------------
	this.get_youtube_format = function(availFormats, fileName, length_seconds, root_url )	{

		var ytf = {
					5: 		{  title: 'Low',           frm: 'flv',		size: "240p", 	video_bitrate: 0.25, 	audio_bitrate: 64        },
					6: 		{  title: 'Low',           frm: 'flv',		size: "270p", 	video_bitrate: 0.8, 	audio_bitrate: 64        },
					13: 	{  title: 'Mobile',        frm: '3gp',		size: "144p", 	video_bitrate: 0.5, 	audio_bitrate: 64        },
					17: 	{  title: 'Mobile',        frm: '3gp',	    size: "144p", 	video_bitrate: 0.05, 	audio_bitrate: 24        },
					36: 	{  title: 'Mobile',        frm: '3gp',		size: "240p", 	video_bitrate: 0.17, 	audio_bitrate: 38        },
					18: 	{  title: 'Low',           frm: 'mp4',		size: "360p", 	video_bitrate: 0.5, 	audio_bitrate: 96	     },
					22: 	{  title: 'HD',            frm: 'mp4',		size: "720p", 	video_bitrate: 2.5, 	audio_bitrate: 192       },
					34: 	{  title: 'Low',           frm: 'flv',		size: "360p", 	video_bitrate: 0.5, 	audio_bitrate: 128       },
					35: 	{  title: 'SD',            frm: 'flv',		size: "480p", 	video_bitrate: 1.0, 	audio_bitrate: 128       },
					37: 	{  title: 'Full HD',       frm: 'mp4',		size: "1080p", 	video_bitrate: 3.0, 	audio_bitrate: 192       },
					38: 	{  title: '4K',            frm: 'mp4',		size: "3072p", 	video_bitrate: 4.0, 	audio_bitrate: 192       },
					43: 	{  title: "Low",           frm: 'webm',		size: "360p", 	video_bitrate: 0.5, 	audio_bitrate: 128       },
					44: 	{  title: "SD",            frm: 'webm',		size: "480p", 	video_bitrate: 1.0, 	audio_bitrate: 128       },
					45: 	{  title: "HD",            frm: 'webm',		size: "720p", 	video_bitrate: 2.0, 	audio_bitrate: 192       },
					46: 	{  title: "Full HD",       frm: 'webm',    	size: "1080p", 	video_bitrate: 3.0, 	audio_bitrate: 192       },
					82: 	{  title: "3D Low",        frm: 'mp4',	    size: "360p", 	video_bitrate: 0.5, 	audio_bitrate: 96        },
					83: 	{  title: "3D Low",        frm: 'mp4',	    size: "240p", 	video_bitrate: 0.5, 	audio_bitrate: 96        },
					84: 	{  title: "3D HD",         frm: 'mp4',	    size: "720p", 	video_bitrate: 2.0, 	audio_bitrate: 152       },
					85: 	{  title: "3D SD",         frm: 'mp4',     	size: "520p", 	video_bitrate: 2.0, 	audio_bitrate: 152       },
					100: 	{  title: "3D Low",        frm: 'webm',		size: "360p", 	video_bitrate: 0.5, 	audio_bitrate: 128       },
					101: 	{  title: "3D Low",        frm: 'webm',		size: "360p", 	video_bitrate: 0.5, 	audio_bitrate: 192       },
					102: 	{  title: "3D HD",         frm: 'webm',		size: "720p", 	video_bitrate: 2.0, 	audio_bitrate: 192       },				 
				};

		var title = "video";					
		if (fileName != null) 
		{
			title = fileName;
            title = self.sniffer.decode_html.call(self.sniffer, self.sniffer.decode_html.call(self.sniffer, title));
			if (title.length > TITLE_MAX_LENGTH)   title = title.substr(0, TITLE_MAX_LENGTH) + '...';
		}	
							
		for (var i in ytf) 
		{
			if(typeof(availFormats[i]) != "undefined") 
			{
				var u = availFormats[i];
                    
				var ft = ((title != null) ? title + ' (' + ytf[i].title + '-' + ytf[i].size + ')' : null);
                   
				var ext = ytf[i].frm.toLowerCase();
					
				var q = ytf[i].title + "[" + ytf[i].size + "]";
										
				var size = (ytf[i].audio_bitrate * 128 * length_seconds) + (ytf[i].video_bitrate * 131072 * length_seconds);
				var file_item = {
								'url': u,
								'ext': ext,
								'display_name': u,
								'download_name' : ft + "." + ext,
								'dn' : ft,
								'pn' : ft,
								'raw_file_ext': ((i in ytf) ? (ytf[i].title) : 'FLV'),
								'root_url' : root_url,
								'time' : (new Date()).toUTCString(),
								'playable': (i in ytf) ? self.sniffer.isPlayable((ytf[i].frm)) : false,
								'direct': true,
								'yt_format': i,
								'size': size,
								'referer': ""
								};
				
				this.sniffer.files[this.sniffer.md5(i + root_url)] = file_item;
				this.sniffer.media_pages[root_url] = u;
			}
		}

		return;
	}
	
	// ===============================================================================================================================
	try
	{
		this.detector = Components.classes['@flashvideodownloader.org/single_site_detector;1'].getService(Components.interfaces.IFVDSingleDetector);
		this.sniffer = Components.classes['@flashvideodownloader.org/single_media_sniffer;1'].getService().wrappedJSObject;
	

		this.registry = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);	

		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
		var mainWindow = wm.getMostRecentWindow("navigator:browser");  
		
		try
		{
			mainWindow.document.getElementById( "appcontent" ).addEventListener("DOMContentLoaded", function( event ) {
			
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
			
		dump( "!!! FAIL INIT MEDIA_PAGE " + e + "\n" );	
		
	};

	this.wrappedJSObject = this;
};

// -----------------------------------------------------
// class factory
var FVD_Media_Page_Factory = {
	createInstance: function (aOuter, aIID)
	{
		if (aOuter != null) throw Components.results.NS_ERROR_NO_AGGREGATION;
		return (new FVD_Media_Page());
	}
};

// -----------------------------------------------------
// Moduel definition
var FVD_Media_Page_Module =
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

// -----------------------------------------------------
// Module initialization
function NSGetModule(aCompMgr, aFileSpec)
{
	return FVD_Media_Page_Module;
};


// -----------------------------------------------------
function NSGetFactory()
{
	return FVD_Media_Page_Factory; 
};
