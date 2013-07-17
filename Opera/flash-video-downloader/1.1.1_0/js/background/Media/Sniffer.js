(function(){

	const EXTENSION_NAME = fvdSingleDownloader;
	
    var MediaSniffer = function(){
    
        var self = this;
        
        var mediaDetectCallbacks = [];

		const VIDEO2EXT = {		
			'mpeg' : 'mp4',
			'm4v': 'mp4',
			'3gpp' : '3gp',
			'flv' : 'flv',
			'quicktime' : 'mov',
			'msvideo' : 'avi',
			'ms-wmv' : 'wmv',
			'ms-asf' : 'asf',
			'web' : 'webm'
		};
		
		const AUDIO2EXT = {		
			'realaudio' : 'ra',
			'pn-realaudio' : 'rm',
			'midi' : 'mid',
			'mpeg' : 'mp3',
			'mpeg3' : 'mp3',
			'wav' : 'wav',
			'aiff' : 'aif'
		};
		
		const IMAGE2EXT = {		
			'jpeg' : 'jpg',
			'jpg': 'jpg',
			'gif' : 'gif',
			'pjpeg' : 'jpg',
			'png' : 'png',
			'msvideo' : 'avi',
			'tiff' : 'tiff'
		};
		
		const TEXT2EXT = {		
			'html' : 'html',
			'css': 'css',
			'jafascript' : 'js',
			'x-jafascript' : 'js',
			'xml' : 'xml'
		};
		
		
		
		// --------------------------------------------------------------------------
		function checkMedia( media ){

			if (media.url.indexOf("#") != -1)  media.url = media.url.substring(0,media.url.indexOf("#"));
			
			return media;
		}
		
		// --------------------------------------------------------------------------
		//function trimMore(t) {
			//return t.replace(/^[\s_]+|[\s_]+$/gi, '').replace(/(_){2,}/g, "_")
		//}
		
		// --------------------------------------------------------------------------
		function prepareMedia( media ){

			if ( media == null ) return null;
			media = checkMedia( media );
			
			var ext = null;
			var type = null;
			var name = "";
			var title = "";
			var size = "";
			var u = EXTENSION_NAME.Utils.convertURL(media.url);
			if ( u.ext != "" )
			{
				ext = u.ext;
				type = u.type;
				name = u.name;
			}
			else
			{
				var type = getHeaderValue( "content-type", media );
				ext = getExtByContentTypeVideo( type );
				if (ext)  type = "video";
				else
				{
					ext = getExtByContentTypeImage( type );
					if (ext)
					{
						type = "image";
					}	
					else
					{
						ext = getExtByContentTypeText( type );
						type = "link";
					}
				}
				
				name = dispositionName( media );
			}
			if ( !type || type == "") type= "link";
			
			size = getHeaderValue( "Content-Length", media );
			if( media.tab && media.tab.title )
			{
				title = media.tab.title;					
			}
			else
			{
				title = name;						
			}
			
			var frmt = "no name";
			if (title)
			{
				frmt = title;
				if ( frmt.length > 10) frmt = frmt.substr(0,10)+"...";
			}	

			if ( !EXTENSION_NAME.Utils.check_enable_type(type) )  return null;
			
			var result = {				
				url: media.url,
				tabId: media.tabId,
				frameId: media.frameId,
				title: title,
				ext: ext,
				format: frmt,
				downloadName: name + "." + ext,
				type: type,
				source: "Sniffer",
				size: size,
				priority: 0,
				vubor:  0,
				groupId: 0,
				orderField: 0
			};
			
			return result;
		}
		
		// ------------------------------------------------------------------
		function getHeadersAll( data ){
			var result = [];
            for (var i = 0; i != data.responseHeaders.length; i++) 
			{
            	result.push( data.responseHeaders[i].name + ": " + data.responseHeaders[i].value );
            }
			return result;
		}
		
		// ------------------------------------------------------------------
        function getHeaderValue(name, data){
            name = name.toLowerCase();
            for (var i = 0; i != data.responseHeaders.length; i++) 
			{
                if (data.responseHeaders[i].name.toLowerCase() == name) 
				{
                    return data.responseHeaders[i].value;
                }
            }
            return null;
        }
		// -------------------------------------------------------------------
		function getExtByContentTypeVideo( contentType ){
			if( !contentType )		return null;
			
			var tmp = contentType.split("/");
			
			if( tmp.length == 2 )
			{
				switch( tmp[0] )
				{
					case "audio":
									if( AUDIO2EXT[tmp[1]] )			return AUDIO2EXT[tmp[1]];
									break;
					case "video":
									if( VIDEO2EXT[tmp[1]] )			return VIDEO2EXT[tmp[1]];
									break;					
				}
			}			
			
			return null;
		}
		// -------------------------------------------------------------------
		function getExtByContentTypeImage( contentType ){
			if( !contentType )		return null;
			
			var tmp = contentType.split("/");
			
			if( tmp.length == 2 )
			{
				if ( tmp[0] == "image") 
				{
					if( IMAGE2EXT[tmp[1]] )			return IMAGE2EXT[tmp[1]];
				}	
			}			
			
			return null;
		}
        
		// -------------------------------------------------------------------
		function getExtByContentTypeText( contentType ){
			if( !contentType )		return null;
			
			var tmp = contentType.split("/");
			
			if( tmp.length == 2 )
			{
				if ( tmp[0] == "text") 
				{
					var tip = tmp[1].split(";");
					if( TEXT2EXT[tip[0]] )			return TEXT2EXT[tip[0]];
				}	
			}			
			
			return null;
		}
        
		// -------------------------------------------------------------------
        function dispositionName(data){
            try 
			{
                var cd = getHeaderValue('Content-Disposition', data);
                var at = cd.match(/^(inline|attachment);/i);
                
                if ((at != null) && (at[1].toLowerCase() == 'attachment')) 
				{
                    cd = cd.substr(at[0].length);
                    if (cd.charAt(cd.length - 1) != ';')            cd += ';';
                    
                    var fnm = cd.match(/filename="(.*?)"\s*?(?:;|$)/i);
                    if (fnm == null)           fnm = cd.match(/filename=(.*?)\s*?(?:;|$)/i);
                    if (fnm != null)           return fnm[1];
                }
                
            } 
            catch (e) {         }
			
            return null;
        }

		// ------------------------  проверка ссылок   ------------------------------	
        function isMedia(data){
		
//console.log("--Sniffer  --", data);
			if( data.tabId <= 0) return false;
			if ( !data.url )	return false;
            if (data.url.indexOf("chrome-extension") != -1)  return false;
			if (data.statusCode != 200) return false;

			var u = EXTENSION_NAME.Utils.convertURL( data.url);
			if ( u.ext == "" )
			{
				var type = getHeaderValue( "content-type", data );
				var ext = getExtByContentTypeVideo( type );
				if ( !ext)
				{
					ext = getExtByContentTypeImage( type );
					if ( !ext)	
					{
						if (data.statusCode == 200) ext = getExtByContentTypeText( type );
						if (!ext) return false;
					}
				}	
			}	
//console.log("-----------------", data);
			
            return true;
        }
        
		// ---------------------------------------------------------------------------
		this.onMediaDetect = {
						addListener: function( callback ) {
									if( mediaDetectCallbacks.indexOf( callback ) == -1 )	mediaDetectCallbacks.push( callback );   
								},
						removeListener: function(  ) {
									mediaDetectCallbacks.length=0;   
								}
					}
		
		// ---------------------------------------------------------------------------
		this.isEqualItems = function( item1, item2 ){  // 1-исходный 2-из массива
//if (item1.url == item2.url) console.log(item1, item2);			
			if (item1.url == item2.url) return true;
			
			if ( (item1.source == "Sniffer") && (item2.source == "Sniffer") && (item1.downloadName == item2.downloadName) && (item1.ext == item2.ext) ) return true;
			
			return false;
			
		}
		
		// -----------------------------------------------------------------------------	
        chrome.webRequest.onResponseStarted.addListener(  function(data){

					if( isMedia( data ) )
					{				
			
						chrome.tabs.get( data.tabId, function( tab ){
					
									data.tab = tab;
					
									mediaDetectCallbacks.forEach(function( callback ){
					
													callback( prepareMedia( data ) );
													
												});			
						
								} );
				
	
					}
            
				}, {
					urls: ["<all_urls>"],
					types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "other"]
					//types: ["object", "other"]
				}, ["responseHeaders"]);
				
        
    }
    
    this.Sniffer = new MediaSniffer();
    
}).apply(fvdSingleDownloader.Media);
