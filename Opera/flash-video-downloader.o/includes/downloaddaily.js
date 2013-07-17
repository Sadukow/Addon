// ==UserScript==
// @include http://www.dailymotion.com/*
// @include https://www.dailymotion.com/*
// ==/UserScript==

(function () {
  var DOWNLOAD_LINK_MESSAGES={'en':'Download', 'ru':'Скачать'};
  var DOWNLOAD_TOOLTIP_MESSAGES={'en':'Download this video', 'ru':'Скачать это видео'};
  var DOWNLOAD_LINK_MESSAGE='Download';
  var DOWNLOAD_TOOLTIP_MESSAGE='Download this video';
  var DOWNLOAD_DAILYMOTION_SPAN_ID='download-dailymotion-video';      
  var DOWNLOAD_DAILYMOTION_FMT_ID='download-dailymotion-video-fmt';
  var DOWNLOAD_DAILYMOTION_BUTTON_ID='download-dailymotion-video-button';
  var OLD_UI=1, NEW_UI=2;
   
  var videoId, videoTicket, videoFormats2, videoTitle=''; 
  var interfaceVersion=OLD_UI;
  
  var mediaFound = false;
                
  var parsedMediaList = [];
  var dailymotion_title  = "";

  var pagetop=document.getElementById('watch-pagetop-section');
  if (pagetop)  // Ajax UI
  {
	if (pagetop.addEventListener)  // Ajax UI - Firefox, Chrome, Opera      
	{
		pagetop.addEventListener('DOMNodeInserted', run, false);
	} 
  } 
  else  // Classic UI: Flash or HTML5
  {
    window.addEventListener('DOMContentLoaded', run, false);
  } 

//-----------------------------------------------------
function sendRequest(request, callback) 
{
	opera.postError("DAILYMOTION: sendRequest=  "+request);
	
    if (typeof request == 'string')        request = {cmd: request};
    var channel = new MessageChannel();
    channel.port1.onmessage = function(event) {     if (callback) callback(event.data);    channel.port1.close();    };
    opera.extension.postMessage(request, [channel.port2]);
}
  
// ----------------------------------------------------------
function get_JSON_param( name, val ){			
		
	var x = '"' + name + '"\s*:\s*"([^\"]+?)"';
	var rxe = new RegExp( x, 'i');
	var m  = rxe.exec(val);
	if (m)	return m[1];
	return null;
}
  
  
// ----------------------------------------------------------
function parseDailyMotionEmbed( ){			
		
    var e = document.querySelectorAll('param[name="flashvars"]');
	
    for(var i = 0; i < e.length; i++)
    {
        var fv = e[i].getAttribute('value', false);
        if(fv)
        {
			var video = fv.match(/(?:^|&)video=([^\s\"\'\&]+)/i);
			if(video && video.length > 1)
			{
				embed = e[i];
				opera.postError("DAILYMOTION1:  "+decodeURIComponent(video[1]));
				return decodeURIComponent(video[1]);
			}
			else
			{
				var sequence = fv.match(/(?:^|&)sequence=([^\s\"\'\&]+)/i);
				if(sequence && sequence.length > 1)
				{
					var data = decodeURIComponent(sequence[1]);
					if(data)
					{
						links = [];

						var p = ['ldURL', 'sdURL', 'hqURL', 'hdURL', 'hd\\d+URL'];
						for(var j = 0; j < p.length; j++)
						{
							var re = new RegExp("[\\x22\\x27]" + p[j] + "[\\x22\\x27]\s*:\s*[\\x22\\x27]([^\\s\\x22\\x27]+)", "ig");
							while(l = re.exec(data))
							{
								if(l && l.length > 1)              links.push(l[1]);
							}
						}

						if(links)
						{
							var t = data.match(/videoTitle=([^\s\"'&]+)/i);
							if(t && t.length > 1)
							{
								t[1] = decodeURIComponent(t[1]);
							}	
							else
							{
								data = data.replace(/\\\"/g, '&quot;').replace(/'/g, '&#39;');
								t = data.match(/[\"']videoTitle[\"']\s*:\s*[\"']([^\s\"']+)/i);
							}
							if(t && t.length > 1)
							{
								var videoTitle = t[1].replace(/\\u([\da-f]{4})/g, function(p1, p2){
																			p2 = p2.replace(/^0+/, '');
																			return String.fromCharCode(parseInt(p2, '16'));
																		});
								dailymotion_title = videoTitle.replace(/\+/ig, ' ');
//opera.postError("DAILYMOTION: dailymotion_title=  "+dailymotion_title);
							}

							embed = e[i];
							return links;
						}
					}
				}
			}
        }
	}		
}

// ----------------------------------------------------------------------------  
function checkLinksDailyMotion( video ){			
    var result = new Array();
    var links = null;

    if(typeof(video) == 'object')       links = video;
							else        links = video.split('||');

    if(links && links.length > 0)
    {
		for(var i = 0; i < links.length; i++)
        {
		
			links[i] = links[i].replace(/\\\//g, '/');
			links[i] = links[i].replace(/\@\@[\w\-]+$/, '');
			var size = '';
			var t = links[i].match(/\/cdn\/\w+\-(\d+x\d+)\//i);
			if(t && t.length > 1)
			{
				size = t[1];
			}
			else
			{
				t = links[i].match(/\D(\d+x\d+)\D/i);
				if(t && t.length > 1)
				{
					size = t[1];
				}
			}

			var ext = 'FLV';
			var t = links[i].match(/\.(\w{1,6})(?:$|\?)/);
			if(t && t.length > 1)
			{
				ext = t[1].toUpperCase();
			}

			if(size !== '80x60')
			{
				var url = links[i];
				 media = {
                        display_name: url,
                        url: url,
                        quality: size,
						size: size,
                        format: ext,
                        file_title: '',
                        direct: true,
						title: dailymotion_title,
                        name: dailymotion_title,
                        xpath:size,
						};
			
				result.push(media);
			}
        }
    }

    if(!result)        return null;

    return result;
}
  
// ----------------------------------------------------------------------------  
function createButtonElementDM( buttonId ){

	var buttonImg = '<span style="margin-right:5px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoZJREFUeNpsk0trE1EUx899zEyatk6xImotaLUgFXGnIijddS/FhVsxwb1fQFz5GfwIElwX68JFN6JQi0VbU/rQJmmbTmIm874Pz0zoZHwcuDB35v5/95z/OUMuPnsNJyGVOn9j6vTynctnphKp5Ml7Til0o9haWmu86IfJS0ZzCXApVb4JhaJzF+zJx/dnbT9K8vclg8HusQfv1xujThyDydgQAEDyDcVnL5LiR9cHP84TAMug0HRDkBoUIaQoAc4owdR1tkm/RZhRL5TgJwUAKvuRApWdIdlBgmVRRhCQFkQ0CKUyciQUOIGAqAAwOIVeJDOATvV4KTfYSQkAaRapWsrMB+iEAmJRAAgExAKU1kDxZm7wogdI1SkEUyIKTZa6F0gEiCEAs+wjVEodpmlnGhhYgR7Q51gXwRYmJZNPlEcsuxskkBS6w6iCSFGwx0oLwg1QQjgjdFxI+ZZj3J6+NL1gWhYorEFZBmx4KX/YqoHBDKZmZubPCjVP0ZN26zA8ODhc4b4fPNpvtl7N3rz+wBotQ5IkxS79ESZlMMIZNLZ2Oq3WURVLf8PRUafXdp7Uv3xV1+7dWixP2iAT8Y84bR/lHPbXN529b/WKkqpGEZYNJePc+dVqVzdWPtZEHIE1bgErGcBGBouXTTDHTGhubjnbn9aqGsXpHGRa++7DwRRSEgRdd7l35Fw5NWnPGei2iiLQ2A2CM/Jzve5sfVitKCFrFEvJhglXDhhAaBD0vXfu4fHVssnmCM699DxobG47O5+/V7VCMf4HBEgO4H/XyhhzXMet1Fc39PS5iUXXjzv7zU5Fq2HaxeD/c5sy6nh+/HR3ry1ipZawqTWSTav+5+xvAQYADRQ40Hwcd4cAAAAASUVORK5CYII=" align="left"></span>';
	var buttonContent = buttonImg + DOWNLOAD_LINK_MESSAGE + '<span class="icn_wrap"><span class="icn icon_select"></span></span>';

	var button = document.createElement("button");
				
	button.setAttribute("class", "tool_addto icn_right button action:toggleOrUpdate action:arg0:#moveto_container");
	button.setAttribute("data-tooltip",  DOWNLOAD_LINK_MESSAGE);					
	button.setAttribute("title",  DOWNLOAD_TOOLTIP_MESSAGE);					
	button.setAttribute("type", "button");
	button.setAttribute("id", DOWNLOAD_DAILYMOTION_SPAN_ID);
						
	button.innerHTML = buttonContent;
						
	button.addEventListener( "click", function( event ){
						
							var elem = document.getElementById('download_container');
							
							var x = elem.getAttribute("style");
					        if( x.indexOf( "none" ) != -1 )  	elem.setAttribute("style", "display: block; z-index: 30; position:relative;");
													else   	elem.setAttribute("style", "display: none; z-index: 30; position:relative;");
							
						}, false );
						
						
	return button;
}

// ----------------------------------------------------------------------------  
function buildMediaListDM( parent ){

	var menus = document.getElementById('download_menu'); 
												
	var menu = null;
	if( menus )
	{
		while( menus.firstChild )
		{
			menus.removeChild( menus.firstChild );
		}
		menu = menus;
	}
	else
	{
		menu = document.createElement( "div" );
		menu.setAttribute( "class", "dmco_html dmpi_video_list_moveto dmco_select chrome_options foreground2 light_border background" );
		menu.setAttribute( "style", "position: absolute; top: -1px; left: 0; border: 1px solid #ddd; -webkit-box-shadow: rgba(0,0,0,0.3) 0 0 1px; -moz-box-shadow: rgba(0,0,0,0.3) 0 0 1px; margin-right: 0; padding: 8px 0 4px;" );
		menu.setAttribute("id", "download_menu");
		parent.appendChild(menu);
	}
		opera.postError("DAILYMOTION:  ------------"+parsedMediaList.length);
						
    for(var i = 0; i < parsedMediaList.length; i++)
    {
		var h = parsedMediaList[i].url;
		var s = parsedMediaList[i].size;
		var e = parsedMediaList[i].format;
		var span = document.createElement("a");
		span.href = h;
		span.innerHTML = '<span>['+s+'].'+e+'</span>';
        span.setAttribute('download',  dailymotion_title+'.'+e  );
        span.setAttribute('title',  dailymotion_title );
		menu.appendChild( span );	

	}
}	

// ----------------------------------------------------------------------------  
function run() 
{
	// download-video is a container for the download button
	if (document.getElementById(DOWNLOAD_DAILYMOTION_SPAN_ID)) return;

	// obtain video ID, temporary ticket, formats map  
	var video = parseDailyMotionEmbed(  );
    if(!video)     return;	
	
    parsedMediaList = checkLinksDailyMotion( video );
	if (!parsedMediaList) return;

	// сообщение аддону о результате
	opera.extension.postMessage( { cmd:'fvd_set_parset_videos', result: parsedMediaList, url:document.location.href } );
	
	
	// Язык
	var uiLanguage=document.documentElement.getAttribute('lang');
	if (/^lt|bg|ru|uk$/.test(uiLanguage)) 
	{
		var likeButton=document.getElementById('watch-like');
		if (likeButton) 
		{
			var spanElements=likeButton.getElementsByTagName('span');
			if (spanElements) 
			{
				spanElements[0].style.display='none';
			}
		}
	}
    
	if (DOWNLOAD_LINK_MESSAGES[uiLanguage]!=null) 
	{ 
		DOWNLOAD_LINK_MESSAGE=DOWNLOAD_LINK_MESSAGES[uiLanguage];
	}
	if (DOWNLOAD_TOOLTIP_MESSAGES[uiLanguage]!=null) 
	{   
		DOWNLOAD_TOOLTIP_MESSAGE=DOWNLOAD_TOOLTIP_MESSAGES[uiLanguage];
	}   
	
	// рисуем кнопку	
	var button = createButtonElementDM( DOWNLOAD_DAILYMOTION_SPAN_ID );
	
	var elemFlag = document.getElementsByClassName('social_bar')[0];
	if( elemFlag )
	{
		var elemB = document.getElementsByClassName('sd_video_socialbuttons')[0];
		var dv = document.createElement("div");
		dv.setAttribute("style", "margin-left: 10px; float:left;");
		dv.appendChild( button );	
		elemFlag.insertBefore( dv, elemB );
	}
	else
	{
		elemFlag = document.getElementById('dmpi_video_tools');
		var dv = document.createElement("li");
		dv.appendChild( button );	
		elemFlag.appendChild( dv );					
	}
				
	if( elemFlag )
	{
		var div = document.createElement("div");
		div.setAttribute("style", "display: none; z-index: 30; position:relative;");
		div.setAttribute("id", "download_container");
		dv.appendChild( div );	
							
		buildMediaListDM( div );						
	}
}
 
})();