/*
 * Insert flash video downloader links in Vkontakte pages
 */



FVDSINGLEVKButton = {

    videoReqSigns: [/http:\/\/(www\.)?vkontakte\.ru\/swf\/VideoPlayer.+?\.swf/i, /http:\/\/(www\.)?vk\.com\/swf\/VideoPlayer.+?\.swf/i],
    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoZJREFUeNpsk0trE1EUx899zEyatk6xImotaLUgFXGnIijddS/FhVsxwb1fQFz5GfwIElwX68JFN6JQi0VbU/rQJmmbTmIm874Pz0zoZHwcuDB35v5/95z/OUMuPnsNJyGVOn9j6vTynctnphKp5Ml7Til0o9haWmu86IfJS0ZzCXApVb4JhaJzF+zJx/dnbT9K8vclg8HusQfv1xujThyDydgQAEDyDcVnL5LiR9cHP84TAMug0HRDkBoUIaQoAc4owdR1tkm/RZhRL5TgJwUAKvuRApWdIdlBgmVRRhCQFkQ0CKUyciQUOIGAqAAwOIVeJDOATvV4KTfYSQkAaRapWsrMB+iEAmJRAAgExAKU1kDxZm7wogdI1SkEUyIKTZa6F0gEiCEAs+wjVEodpmlnGhhYgR7Q51gXwRYmJZNPlEcsuxskkBS6w6iCSFGwx0oLwg1QQjgjdFxI+ZZj3J6+NL1gWhYorEFZBmx4KX/YqoHBDKZmZubPCjVP0ZN26zA8ODhc4b4fPNpvtl7N3rz+wBotQ5IkxS79ESZlMMIZNLZ2Oq3WURVLf8PRUafXdp7Uv3xV1+7dWixP2iAT8Y84bR/lHPbXN529b/WKkqpGEZYNJePc+dVqVzdWPtZEHIE1bgErGcBGBouXTTDHTGhubjnbn9aqGsXpHGRa++7DwRRSEgRdd7l35Fw5NWnPGei2iiLQ2A2CM/Jzve5sfVitKCFrFEvJhglXDhhAaBD0vXfu4fHVssnmCM699DxobG47O5+/V7VCMf4HBEgO4H/XyhhzXMet1Fc39PS5iUXXjzv7zU5Fq2HaxeD/c5sy6nh+/HR3ry1ipZawqTWSTav+5+xvAQYADRQ40Hwcd4cAAAAASUVORK5CYII=",
    linkTextStyles: {
        "marginLeft": "20px",
		"fontWeight": "bold"
    },
	
	downloadTitleDefault: "Download Video",
        videoResolutionsTitles: {
		360: "Download HD(360)",
		480: "Download HD(480)",
		720: "Download HD(720)"
	},	

	
    observer: null,
    
    init: function(){
        try {
		
			if( fvd_single.silentMode )
			{
				// fvd toolbar installed. exit
				return false;
			}
						
            this.observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
            this.observer.addObserver(this.httpObserver, 'http-on-examine-response', false);
            this.observer.addObserver(this.httpObserver, 'http-on-examine-cached-response', false);
    			
			// for audio pages
			gBrowser.addProgressListener(this.browser_progress_listener);				
			
			document.getElementById( "appcontent" ).addEventListener("DOMContentLoaded", function( event ){
				FVDSINGLEVKButton.pageLoadListener( event );
			}, true);	
        } 
        catch (ex) {
            dump("Fail init VKButton listener. (" + ex + ")\r\n");
        }
    },
    
	pageLoadListener: function(event){
		if( event.target.location.host.indexOf("vk.com") != -1 )
		{
			FVDSINGLEVKButton.tryInjectInAudioPage(event.target);
		}
			
	},
	
	alert: function(text)
	{
		var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
		aConsoleService.logStringMessage(text);
	},

	
	
	browser_progress_listener: {	
		onLocationChange: function(aWebProgress, aRequest, aURI){
			try{
				if( aWebProgress.DOMWindow.document.location.host.indexOf("vkontakte.ru") != -1 ){	
					FVDSINGLEVKButton.tryInjectInAudioPage(aWebProgress.DOMWindow.document);
				}					
			}
			catch( ex ){
				dump( "Ex: " + ex + "\r\n" );
			}
			
		}
	},
	
    processHTTPRequest: function(req){
        var url = req.URI.spec;
		
        try 
		{
            if (this.helper.isVideoRequestSign(url)) 
			{
                var doc = this.helper.getRequestorDocument(req);
                
				setTimeout( function(){    FVDSINGLEVKButton.injectInVideoPage(doc);	}, 1000 );

            }
            else 
			{           
            }
        } 
        catch (ex) {
            dump("processHTTPRequest: " + ex + "\r\n");
        }
        
    },
    
	tryInjectInAudioPage: function( doc ){
	
		setTimeout( function(){
        	var injected = FVDSINGLEVKButton.injectInAudioPage( doc);		
						
			if( injected ){
				// add timer to check and inject
				var interval = setInterval(function(){
					FVDSINGLEVKButton.injectInAudioPage( doc );
				}, 1000);
				
				doc.defaultView.addEventListener( "unload", function(){
					clearInterval( interval );
				}, true );
			}
		}, 1000 );
	},
	
	injectInAudioPage: function( doc ){
		
		var elements = doc.getElementsByClassName( "audio" );
				
		var anyAudioFound = false;
		
		var root_url = doc.location.href;
		
		//var files = fvd_single.sniffer.get_files( root_url );
		
		var anyInjected = false;
		
		for (var i = 0; i != elements.length; i++) {
			try{
				var audioBlock = elements[i];
								
				if( audioBlock.hasAttribute("fvd-injected") ){
					continue;
				}
				audioBlock.className += " fvd-vk-audio";
				audioBlock.setAttribute( "fvd-injected", true );
				
				var id = this.helper.extractAudioId(audioBlock.getAttribute("id"));
				if( !id ){
					continue;
				}
				
				//var info = this.helper.getItemByYtFormat( files, id );
				
				//info.url, info.file_title, "." + info.ext
				
				var info = {};
				var hidden = audioBlock.getElementsByTagName( "input" )[0];
				var tmp = hidden.value.split(",");
				info.url = tmp[0];
				
				var titleBlock = audioBlock.getElementsByClassName("audio_title_wrap")[0];
				
				info.file_title = titleBlock.textContent.replace(/\(.+?\)$/i, "");
						
				//info.file_title = titleBlock.getElementsByTagName( "a" )[0].textContent;
				//info.file_title += "-" + titleBlock.getElementsByTagName( "span" )[0].textContent;
										
				info.ext = "mp3";
				
				if( !info ){
					continue;
				}
				
				var td = audioBlock.getElementsByTagName("td")[0];				
				var a = this.helper.createAudioLink( doc, info );
				td.appendChild( a );				
												
				audioBlock.getElementsByClassName("playline")[0].style.width = "auto !important";
				
				anyInjected = true;
			}
			catch( ex ){
				//dump( "Ex in video block: " + ex + "\n" );	
			}			
		}	
		
		
		if (anyInjected) 
		{
			if( !doc.head.hasAttribute( "fvd-injected" ) ){
				var css = doc.createElement("style");
				css.textContent = this.helper.getUrlContents("chrome://" + fvd_single.contract + "/content/include/vk_button.css");	
				doc.head.appendChild(css);	
				
				doc.head.setAttribute( "fvd-injected", true )			
			}			
		}
		
		return anyInjected;
		
	},
    
    injectInVideoPage: function(doc){	
	
//		var actionsContainer = doc.getElementById("mv_actions");	
		var actionsContainer = doc.getElementById("mv_content");	
		
		if( actionsContainer.hasAttribute( "fvdSingleInjected" ) )		return false;
		
		var video_links='';
		var m_top=4;
		var media = fvd_single.sniffer.get_files_all( );
		
		var page_url = doc.location.href
		
		var div_vk_save = doc.createElement('div');
		div_vk_save.setAttribute('id', 'vk_save_kachestvo');	
		
		for( var hash in media[page_url] )
		{				
			var mediaFile = media[page_url][hash];
			var url = mediaFile.url;				
			var ext = mediaFile.ext;
			if 	(mediaFile.yt_format)
			{
				var size = mediaFile.yt_format;
				var a = doc.createElement('a');
				a.setAttribute('href', url);	
				a.setAttribute('title', 'Скачать видео в формате '+ext );
				a.textContent = ext+' '+size;
				div_vk_save.appendChild(a);   
				
				m_top += 19;
			}
		}
		div_vk_save.setAttribute('style', 'margin-top: -' + m_top.toString() + 'px;');

		var mv_controls_line=doc.getElementById("mv_controls_line");
		if (mv_controls_line)
		{		 					
			var table = doc.createElement('div');
			table.setAttribute('class', 'vk_save_table');					
			mv_controls_line.appendChild(table);
			var div = doc.createElement('div');
			div.setAttribute('title', 'Скачать видео');
			div.setAttribute('id', 'vk_save_link');	
			div.addEventListener('mouseover', function() {doc.getElementById("vk_save_kachestvo").style.display='block';}, false);
			div.addEventListener('mouseout', function() {doc.getElementById("vk_save_kachestvo").style.display='none';}, false);
			table.appendChild(div);   
			
			div.appendChild(div_vk_save);   
			
			var span_vk_save = doc.createElement('div');
			span_vk_save.setAttribute('style', 'padding:2px;');
			span_vk_save.textContent = 'Скачать видео';
			div.appendChild(span_vk_save);   
			
		}	

		if( !doc.head.hasAttribute( "fvd-injected" ) )
		{
			var css = doc.createElement("style");
			css.textContent = this.helper.getUrlContents("chrome://" + fvd_single.contract + "/content/include/vk_button.css");	
			doc.head.appendChild(css);	
			doc.head.setAttribute( "fvd-injected", true )			
		}			
		
        actionsContainer.setAttribute( "fvdSingleInjected", true );
    },
        
    
    
    helper: {
		extractAudioId: function( fullId ){
			var tmp = fullId.split( "_" );
			return tmp[1];
		},
	
		getUrlContents: function (aUrl) {
		    var ioService = Components.classes["@mozilla.org/network/io-service;1"]
			.getService(Components.interfaces.nsIIOService);
		    var scriptableStream = Components
			.classes["@mozilla.org/scriptableinputstream;1"]
			.getService(Components.interfaces.nsIScriptableInputStream);
		
		    var channel = ioService.newChannel(aUrl, null, null);
		    var input = channel.open();
		    scriptableStream.init(input);
		    var str = scriptableStream.read(input.available());
		    scriptableStream.close();
		    input.close();
		
		    return str;
		},
	
		
		getItemByYtFormat: function( files, format ){
			for( var k in files ){
				var info = files[k];
								
				if( info.yt_format == format ){					
					return info;
				}
			}
			
			return false;
		},
		
		createAudioLink: function( doc, info ){			
			var a = doc.createElement( "a" );
			
			a.addEventListener( "click", function( event ){
				fvd_single.downloadInstance.downloadByWindow(info.url, info.file_title, "." + info.ext);
			} );
			
			var img = doc.createElement("img");
            img.setAttribute("src", FVDSINGLEVKButton.imageSrc);
			
			a.appendChild( img );
			
			return a;
		},
		
        createActionsLink: function(doc, url, title, ext, videoTitle){
            var link = doc.createElement('a');
            
			link.addEventListener( "click", function( event ){
				fvd_single.downloadInstance.downloadByWindow(url, videoTitle, "." + ext);
			} );
			
            var text = doc.createElement("span");
            text.textContent = title;
            var img = doc.createElement("img");
            img.setAttribute("src", FVDSINGLEVKButton.imageSrc);
            
            img.style.position = "absolute";
            img.style.marginTop = "-1px";
            
            for (stName in FVDSINGLEVKButton.linkTextStyles) {
                text.style[stName] = FVDSINGLEVKButton.linkTextStyles[stName];
            }
            
            link.appendChild(img);
            link.appendChild(text);
            
            return link;
        },
        
        isVideoRequestSign: function(requestUrl){
            for (var i = 0; i != FVDSINGLEVKButton.videoReqSigns.length; i++) 
			{
                if (FVDSINGLEVKButton.videoReqSigns[i].test(requestUrl)) 
				{
                    return true;
                }
            }
            
            return false;
        },
        
		
		
        getRequestorDocument: function(http_channel){
            var ir;
            var wnd;
            
            try {
                ir = http_channel.loadGroup.notificationCallbacks.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
                wnd = ir.getInterface(Components.interfaces.nsIDOMWindow);
            } 
            catch (ex) {
                ir = http_channel.notificationCallbacks.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
                wnd = ir.getInterface(Components.interfaces.nsIDOMWindow);
            }
            
            return wnd.top.document;
        }
        
        
    },
    
    httpObserver: {
        observe: function(aSubject, aTopic, aData){
            switch (aTopic) {
                case 'http-on-examine-cached-response':
                case 'http-on-examine-response':
                    try 
					{
                        aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
                        FVDSINGLEVKButton.processHTTPRequest(aSubject);
                    } 
                    catch (ex) {
                    
                    }
                    
                    
                    break;
            }
        }
        
    }

}

window.addEventListener("load", function(){
    FVDSINGLEVKButton.init();
});
