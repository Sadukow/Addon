(function(){

	const EXTENSION_NAME = fvdSingleDownloader;
	
	var SitePage = function(){		
	
		var self = this;
		
		const TITLE_MAX_LENGTH  = 96;
	
		var mediaDetectCallbacks = [];

		// ----------------------------------------------------------
		function get_JSON_param( name, val ){			
		
			var x = '"' + name + '"\s*:\s*"([^\"]+?)"';
			var rxe = new RegExp( x, 'i');
			var m  = rxe.exec(val);
			if (m)	return m[1];
			return null;
		}
		
		// --------------------------------------------------------------------------
		function prepareMedia( media ){

			var u = EXTENSION_NAME.Utils.convertURL(media.url);
			
			if (u.type)
			{
				if ( !media.type )  media.type = u.type;
				else if ( media.type == "link" )  media.type = u.type;
			}	
			
			if ( !EXTENSION_NAME.Utils.check_enable_type(media.type) )  return null;
			
			var result = {				
				url: media.url,
				title: media.title,
				ext: u.ext,
				format: "",
				downloadName: u.name,
				type: media.type,
				size: "",
				priority: 0,
				groupId: 0,
				orderField: 0
			};

			return result;
		}
		
		// --------------------------------------------------------------------------------
		function storeMedia( media, tabId ){
			
			media.forEach(function( item ){
			
						item.tabId = tabId;
						if (!item.priority) item.priority = 1;
						item.vubor = 0;
						item.source = "SitePage";
				
					});
					
			mediaDetectCallbacks.forEach( function( callback ){
						callback( media );
					} );
					
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

		// --------------------------------------------------------  
		function get_youtube_format( availFormats, fileName, length_seconds ){
		
			var ytf = {     5: 		{  title: 'Low',           frm: 'flv',		size: "240p", 	video_bitrate: 0.25, 	audio_bitrate: 64        },
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

			var parsedMediaList = [];
			
			var title = "video";					
			if (fileName != null) 
			{
				title = fileName;
			
				title = EXTENSION_NAME.Utils.decodeHtmlEntities( title );
					
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
					
					var media = {
								url: u,
								title: ft,
								ext: ext,
								format: q,
								downloadName: ft + "." + ext,
								type: "video",
								quality: ytf[i].size,
								size: size, 
								groupId: 0,
								orderField: 0
								};
                    
					parsedMediaList.push(media);
				}
			}

			return 	parsedMediaList;
		}	
		
		// --------------------------------------------------------------------------------
		this.check_YT_User = function( tabId, answer, url, link, callback ){
	
			var parsedMediaList = [];
            var mediaFound = false;
				
			for (var i = 0; i < link.length; i++) 
			{
				if( link[i].type == "video" )
				{
					var availFormats={};
					var fileName = link[i].title;
					var length_seconds = link[i].size;
				
					var fum=link[i].value;
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
						}
					}										
				
					if ( availFormats )
					{	
						parsedMediaList = get_youtube_format( availFormats, fileName, length_seconds );
						if (parsedMediaList.length > 0) mediaFound = true;
					}					
					
					
				}	
				else
				{
					var m = prepareMedia( link[i] );
						
					if (m) parsedMediaList.push(m);
				}
			}
				
//console.log( parsedMediaList );
			if ( mediaFound && ! EXTENSION_NAME.noYoutube )
			{
				
				EXTENSION_NAME.ContentScriptController.processMessage( tabId, {
													action: "insertYTButton",
													media: parsedMediaList
												} );				
			}
							
			callback( parsedMediaList, tabId );

		}
		// --------------------------------------------------------------------------------
		this.check_VK_Audio = function( tabId, answer, url, link, callback ){
	
			var parsedMediaList = [];
			for (var i = 0; i < link.length; i++) 
			{
				if( link[i].type == "audio" )
				{
					var m = EXTENSION_NAME.Utils.convertURL(link[i].url);

					var result = {				
									url: link[i].url,
									title: link[i].title,
									ext: m.ext,
									format: "",
									downloadName: link[i].title + "." + m.ext,
									type: "audio",
									size: null,
									groupId: 0,
									orderField: 0
								};
									
					parsedMediaList.push(result);
				}	
				else
				{
					var m = prepareMedia( link[i] );
						
					if (m) parsedMediaList.push(m);
				}
			}
				
			callback( parsedMediaList, tabId );

		}
		// --------------------------------------------------------------------------------
		this.check_Links = function( tabId, answer, url, link, callback ){
		
//console.log("check_Links:", tabId, answer, url, link);
			if (link == null) return;
			
			// - - - - - - - - - - - - - - - - - - - - - - - - - 
			if (answer == "vk_audio")
			{
				var parsedMediaList = [];
				for (var i = 0; i < link.length; i++) 
				{
					
					if( link[i].type == "input" && link[i].id && link[i].id.indexOf( "audio_info" ) != -1 )
					{
						var v = link[i].value;
						if ( !v) continue;
						
						var t = v.split(",");
						if ( !t) continue;
						
						var u = t[0]
						if ( u.length > 0)
						{
							var m = EXTENSION_NAME.Utils.convertURL(u);

							var result = {				
										url: u,
										title: link[i].title,
										ext: m.ext,
										format: "",
										downloadName: m.name + "." + m.ext,
										type: "audio",
										size: null,
										groupId: 0,
										orderField: 0
									};
									
							parsedMediaList.push(result);
						
						}
					}
					else if( link[i].type != "input"  )
					{
						var m = prepareMedia( link[i] );
						
						if (m) parsedMediaList.push(m);
					}
				}			
	
//				console.log("vk_audio", parsedMediaList);
				callback( parsedMediaList, tabId );
				return true;
			}
			// - - - - - - - - - - - - - - - - - - - - - - - - - 
			else if (answer == "vk_video")
			{
				var parsedMediaList = [];
				for (var i = 0; i < link.length; i++) 
				{
					
					if( link[i].id && link[i].id == "video_player" )
					{
						var flvVars = link[i].value;

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
//				console.log("vk_video", parsedMediaList);
				if ( parsedMediaList.length > 0 )
				{
					callback( parsedMediaList, tabId );

					EXTENSION_NAME.ContentScriptController.processMessage( tabId, {
									action: "insertVKButton",
									media: parsedMediaList
								} );				
				}	
				return true;
			}
			// - - - - - - - - - - - - - - - - - - - - - - - - - 
			else if (answer == "dm_video")
			{
				var parsedMediaList = [];
                var mediaFound = false;
				
				for (var i = 0; i < link.length; i++) 
				{
					
					if( link[i].type == "object" && link[i].title && link[i].title.indexOf( "flashvars" ) != -1 )
					{
						var paramFlashvars = link[i].value;
						if ( !paramFlashvars) continue;
						
						//var paramElements = decodeURIComponent( paramFlashvars );
						var paramElements = unescape( paramFlashvars );
						
						var videoTitle  = get_JSON_param( 'videoTitle', paramElements );
						videoTitle = videoTitle.replace(/\+/g,"\\u0020");
						videoTitle = unescapeFromUtf16(videoTitle);
						
						var tags={
								"hd1080": {		label: "HD1080",	size: "1080p",			  },
								"hd720":  {		label: "HD720",		size: "720p",	  		  },
								"hq":     {		label: "HQ",		size: "480p",			  },
								"sd":     {	    label: "SD",		size: "480p",			  },
								"ld":     {		label: "LD",		size: "480p",			  },
							}

						for(var n in tags) 
						{
							var m  = get_JSON_param( n+"URL", paramElements );
				
							if (m)
							{
								var url = m.replace(new RegExp("\/", "g"), "");

								var label=tags[n].label + "[" + tags[n].size + "]";
								var extension="flv";
								var mExt=/\.([0-9a-zA-Z]+)(?:$|\?)/.exec(url);
								if(mExt)	extension=mExt[1];

								var media = {
										url: url,
										title: videoTitle,
										ext: extension,
										format: label,
										downloadName: videoTitle + "." + extension,
										type: "video",
										size: null,
										quality: tags[n].size,
										groupId: 0,
										orderField: 0
									};
					
								parsedMediaList.push(media);
								var mediaFound = true;
                    
							}	
						}	
					}
					else
					{
						var m = prepareMedia( link[i] );
						
						if (m) parsedMediaList.push(m);
					}
				}			
	
//				console.log("dm_video", parsedMediaList);
				if ( mediaFound )
				{
					EXTENSION_NAME.ContentScriptController.processMessage( tabId, {
									action: "insertDMButton",
									media: parsedMediaList
								} );				
				}
				callback( parsedMediaList, tabId );
			
				
				return true;
			}	
			// - - - - - - - - - - - - - - - - - - - - - - - - - 
			else if (answer == "yt_video")
			{
				var parsedMediaList = [];
                var mediaFound = false;
							
				for (var iii = 0; iii < link.length; iii++) 
				{
					if( link[iii].type == "embed" && link[iii].id && link[iii].id == "movie_player" )
					{
						var flvVars = link[iii].value;

						if (flvVars != null)	
						{
							var p=flvVars.split("&");
//console.log(p);							
							var availFormats={};
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
//console.log(fmts);										
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
							
							if ( availFormats )
							{	
								parsedMediaList = get_youtube_format( availFormats, fileName, length_seconds );
								if (parsedMediaList.length > 0) mediaFound = true;
							}	
						}	
					}
					else if ( link[iii].type != "embed" )
					{
						var m = prepareMedia( link[iii] );
						
						if (m) parsedMediaList.push(m);
					}
				}
				
				if ( mediaFound && ! EXTENSION_NAME.noYoutube )
				{
				
					EXTENSION_NAME.ContentScriptController.processMessage( tabId, {
													action: "insertYTButton",
													media: parsedMediaList
												} );				
				}
							
				callback( parsedMediaList, tabId );
				
			}
			// - - - - - - - - - - - - - - - - - - - - - - - - - 
			else if (answer == "other")
			{
				var parsedMediaList = [];
				
				link.forEach(function( mm ){
			
						var m = prepareMedia( mm );
						
	                    if (m) parsedMediaList.push(m);

					});
				
//				console.log("other", parsedMediaList);
				callback( parsedMediaList, tabId );
				return true;
			}
		}

		function convertEscapedCodesToCodes(str, prefix, base, num_bits) {
			var parts = str.split(prefix);
			parts.shift();  // Trim the first element.
			var codes = [];
			var max = Math.pow(2, num_bits);
			for (var i = 0; i < parts.length; ++i) 
			{
				var code = parseInt(parts[i], base);
				if (code >= 0 && code < max) 
				{
					codes.push(code);
				} 
				else 
				{
					// Malformed code ignored.
				}
			}
			return codes;
		}

		function convertEscapedUtf16CodesToUtf16Codes(str) {
			return convertEscapedCodesToCodes(str, "\\u", 16, 16);
		}

		function convertUtf16CodesToString(utf16_codes) {
			var unescaped = '';
			for (var i = 0; i < utf16_codes.length; ++i) 
			{
				unescaped += String.fromCharCode(utf16_codes[i]);
			}
			return unescaped;
		}
		
		function unescapeFromUtf16(str)  {
			var utf16_codes = convertEscapedUtf16CodesToUtf16Codes(str);
			return convertUtf16CodesToString(utf16_codes);
		}

		
		// --------------------------------------------------------------------------------
		this.getPage_All_URLs = function( url, tab, callback ){

//			console.log("getPage_All_URLs: ", url );
		
			if( url.toLowerCase().indexOf( "vk.com/audio" ) != -1 )
			{
				EXTENSION_NAME.Media.Storage.removeTabSourceData( tab.id, "SitePage" );
//				callback( { command: "Get_Links", tip: "link, image, input", answer: "vk_audio", tabId: tab.id } );
				callback( { command: "Get_VK_Audio", tip: "link, image", answer: "vk_audio", tabId: tab.id } );
				return "input";
			}
			else if( (url.toLowerCase().indexOf( "vk.com/video" ) != -1) && (url.length > 19) )
			{
				EXTENSION_NAME.Media.Storage.removeTabSourceData( tab.id, "SitePage" );
				callback( { command: "Get_Links", tip: "embed", answer: "vk_video", tabId: tab.id } );
				return "vk_video";
			}
			else if ( url.toLowerCase().match( /http:\/\/(www\.)?dailymotion(\.co)?\.([^\.\/]+)\//i ) )		
			{
				EXTENSION_NAME.Media.Storage.removeTabSourceData( tab.id, "SitePage" );
				callback( { command: "Get_Links", tip: "link, image, object", answer: "dm_video", tabId: tab.id } );
				return "dm_video";
			}
			else if (url.toLowerCase().match(/https?:\/\/(?:www\.)?youtube\.com\/watch.*[\?|&]v=([^\?&]+)/i) )
			{
				EXTENSION_NAME.Media.Storage.removeTabSourceData( tab.id, "SitePage" );
				callback( { command: "Get_Links", tip: "link, image, embed", answer: "yt_video", tabId: tab.id } );
				return "yt_video";
			}
			else if (url.toLowerCase().match(/https?:\/\/(?:www\.)?youtube\.com\/user\/([^\/\?&]+)/i) )
			{
				EXTENSION_NAME.Media.Storage.removeTabSourceData( tab.id, "SitePage" );
				//callback( { command: "Get_Links", tip: "embed", answer: "yt_video", tabId: tab.id } );
				callback( { command: "Get_YT_User", tip: "embed", answer: "yt_video", tabId: tab.id } );
				return "yt_video";
			}
			else
			{	
				EXTENSION_NAME.Media.Storage.removeTabSourceData( tab.id, "SitePage" );
				callback( { command: "Get_Links", tip: "all", answer: "other", tabId: tab.id } );
				return null;
			}
			
		}
		
		// --------------------------------------------------------------------------------
		this.getContentFromYoutubePage = function( videoId, callback ){
			getContentFromYoutubePage( videoId, callback );
		}
		
		// --------------------------------------------------------------------------------
		this.onMediaDetect = {
						addListener: function( callback ){
						
									if( mediaDetectCallbacks.indexOf( callback ) == -1 )
									{
										mediaDetectCallbacks.push( callback );
									}
									
								}
					}
		
		// --------------------------------------------------------------------------------
		this.isEqualItems = function( item1, item2 ){
			
			if(  item1.url == item2.url  )
			{
				if ( (item1.type == "video") || (item1.type == "audio") ) return false;
				else return true;
			}	
			
			return false;
			
		}
		
		chrome.extension.onRequest.addListener ( function(request, sender, sendResponse) {        
	
						if(request.akce=="Page_URL")
						{
							self.getPage_All_URLs(request.url, sender.tab, sendResponse );  
							
						}
						else if(request.akce=="Get_Links")
						{
							if (request.tabId == sender.tab.id)
							{
								self.check_Links(request.tabId, request.answer, request.url, request.link, function( mediaToSave, tabId ){

																if( mediaToSave )
																{
																	storeMedia( mediaToSave, tabId );
																}
																
															} );
							}	
						}
						else if(request.akce=="Get_VK_Audio")
						{
							if (request.tabId == sender.tab.id)
							{
								self.check_VK_Audio(request.tabId, request.answer, request.url, request.link, function( mediaToSave, tabId ){

																if( mediaToSave )
																{
																	storeMedia( mediaToSave, tabId );
																}
																
															} );
							}	
						}
						else if(request.akce=="Get_YT_User")
						{
							if (request.tabId == sender.tab.id)
							{
								self.check_YT_User(request.tabId, request.answer, request.url, request.link, function( mediaToSave, tabId ){

																if( mediaToSave )
																{
																	storeMedia( mediaToSave, tabId );
																}
																
															} );
							}	
						}
						
					});
	
	}
	
	this.SitePage = new SitePage();
	
}).apply( fvdSingleDownloader.Media );
