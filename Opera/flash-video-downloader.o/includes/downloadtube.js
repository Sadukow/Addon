// ==UserScript==
// @include http://www.youtube.com/watch?*
// @include https://www.youtube.com/watch?*
// ==/UserScript==

(function () {
  var DOWNLOAD_LINK_MESSAGES={'en':'Download', 'ru':'Скачать'};
  var DOWNLOAD_TOOLTIP_MESSAGES={'en':'Download this video', 'ru':'Скачать это видео'};
  var DOWNLOAD_LINK_MESSAGE='Download';
  var DOWNLOAD_TOOLTIP_MESSAGE='Download this video';
  var DOWNLOAD_YOUTUBE_SPAN_ID='download-youtube-video';      //"fvd_single_yt_download_button"
  var DOWNLOAD_YOUTUBE_FMT_ID='download-youtube-video-fmt';
  var DOWNLOAD_YOUTUBE_BUTTON_ID='download-youtube-video-button';
  var OLD_UI=1, NEW_UI=2;
   
  var videoId, videoTicket, videoFormats2, videoTitle=''; 
  var interfaceVersion=OLD_UI;

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

  
function run() 
{
	// download-youtube-video is a container for the download button
	if (document.getElementById(DOWNLOAD_YOUTUBE_SPAN_ID)) return;

	// obtain video ID, temporary ticket, formats map  
	var videoPlayer=document.getElementById('watch-player');
	if (videoPlayer && videoPlayer.className!='html5-player')  // Flash
	{
		var flashValues=videoPlayer.innerHTML;
		var videoIdMatches=flashValues.match(/video_id=([^(\&|$)]*)/);
		videoId=(videoIdMatches)?videoIdMatches[1]:null;
		var videoTicketMatches=flashValues.match(/\&amp;t=([^(\&|$)]*)/);
		videoTicket=(videoTicketMatches)?videoTicketMatches[1]:null;
		var videoFormatsMatches2=flashValues.match(/url_encoded_fmt_stream_map=([^(\&|$)]*)/);
		videoFormats2=(videoFormatsMatches2)?videoFormatsMatches2[1]:null;
	} 
  
	if (videoId==null || videoTicket==null)  // HTML5 - Firefox, Opera
	{
		var config=null;
		if(typeof unsafeWindow =='undefined')  // Opera
		{
			unsafeWindow=window; 
		}
		if (unsafeWindow.yt && unsafeWindow.yt.getConfig) 
		{
			config=unsafeWindow.yt.getConfig('PLAYER_CONFIG'); 
		}
		if (config && config['args']) 
		{
			var args=config['args'];
			videoId=args['video_id'];
			videoTicket=args['t'];
			videoFormats2=args['url_encoded_fmt_stream_map'];
		}
	}
  
	if (videoId==null || videoTicket==null)  // everything else (HTML5 - Chrome)
	{
		var pageFooter=document.getElementById('postpage');
		if (pageFooter) 
		{
			var pageFooterContent=pageFooter.innerHTML;
			var videoIdMatches=pageFooterContent.match(/\"video_id\":\s*\"([^\"]*)\"/);
			videoId=(videoIdMatches)?videoIdMatches[1]:null;
			var videoTicketMatches=pageFooterContent.match(/\"t\":\s*\"([^\"]*)\"/);
			videoTicket=(videoTicketMatches)?videoTicketMatches[1]:null;
			var videoFormatsMatches2=pageFooterContent.match(/\"url_encoded_fmt_stream_map\":\s*\"([^\"]*)\"/);
			videoFormats2=(videoFormatsMatches2)?videoFormatsMatches2[1]:null;
		}
	} 
  
	if (videoId==null || videoTicket==null)  // future proof
	{
		var bodyContent=document.body.innerHTML;  
		var videoIdMatches=bodyContent.match(/\"video_id\":\s*\"([^\"]*)\"/);
		videoId=(videoIdMatches)?videoIdMatches[1]:null;
		var videoTicketMatches=bodyContent.match(/\"t\":\s*\"([^\"]*)\"/);
		videoTicket=(videoTicketMatches)?videoTicketMatches[1]:null;
		var videoFormatsMatches2=bodyContent.match(/\"url_encoded_fmt_stream_map\":\s*\"([^\"]*)\"/);
		videoFormats2=(videoFormatsMatches2)?videoFormatsMatches2[1]:null;
	}
  
	if (videoId==null || videoTicket==null) return;
	
	// создаем список
	videoFormats2 = videoFormats2.replace(/\\u0026/g, "&");
	var map = videoFormats2.split(",");

    var formats = {};
	
    for (var ii = 0; ii != map.length; ii++) 
	{
        var m = map[ii].match(/itag=([0-9]+)/i);
        if (!m) continue;
                        
        var tag = m[1];
        m = map[ii].match(/url=([^&]+)/i);
        if (!m) continue;
                
        var url = m[1];  
		url = decodeURIComponent(url);						
						
		m = map[ii].match(/sig=([^&]+)/);
        if (m)	url += "&signature="+m[1];      
						
        formats[tag] = url;
    }
	
	// название
	var headerTitle=document.getElementById('eow-title');
	if (headerTitle!=null) 
	{
		videoTitle=headerTitle.textContent || headerTitle.innerText || '';
	}
	if (videoTitle=='') 
	{
		var titleTag=document.title;
		if (titleTag!=null) 
		{
			videoTitle=titleTag.replace(/^YouTube \- /i,'');
		}
	}  
	videoTitle=videoTitle.replace(/[#"\?:\*]/g,'').replace(/[&\|\\\/]/g,'_').replace(/'/g,'\'').replace(/^\s+|\s+$/g, '').replace(/\.+$/g, '');
	if (videoTitle=='') 
	{
		videoTitle='video';
	}
	
	
	// подготовим названия
    var ytf = {  37: {  title: 'Full HD',       frm: 'mp4',		size: "1080p"      },
                 22: {  title: 'HD',            frm: 'mp4',		size: "720p"       },
                 35: {  title: 'High',          frm: 'flv',		size: "360p"       },
                 34: {  title: 'Low',           frm: 'flv',		size: "270p"       },
                 18: {  title: 'SD',            frm: 'mp4',		size: "270p"	   },
                 6:  {  title: 'Low',           frm: 'flv',		size: "180p"       },
                 5:  {  title: 'Low',           frm: 'flv',		size: "180p"       },
                 17: {  title: 'Mobile',        frm: '3gp',	    size: "180p"       },
                 13: {  title: 'Mobile',        frm: '3gp',		size: "180p"       },
                 43: {  title: "Low",           frm: 'webm',	size: "270p"       },
                 44: {  title: "High",          frm: 'webm',	size: "360p"       },
                 45: {  title: "HD",            frm: 'webm',	size: "720p"       },
                 46: {  title: "Full HD",       frm: 'webm',    size: "1080p"      },                };

    var items = {};
    var parsedMediaList = [];      

    for (var i in ytf) 
	{
        if (!(i in formats))      continue;
                    
        var u = formats[i];
                    
        if ((i in ytf)) 
	    {
             var ft = ytf[i].title;
        }
		var s_title = 	(i in ytf) ? (ytf[i].title) : 'FLV';
		s_title += '&nbsp;&nbsp;&nbsp;' + ((i in ytf) ? (ytf[i].frm) : '');
		s_title +=  '&nbsp;&nbsp;( ' + ((i in ytf) ? (ytf[i].size) : '') + ' )';
					
        var media = {
                        display_name: u,
                        url: u + '&title='+videoTitle,
                        quality: ((i in ytf) ? (ytf[i].title) : 'FLV'),
						height: ((i in ytf) ? (ytf[i].size) : null),
                        node: null,
                        format: ((i in ytf) ? ytf[i].frm : 'FLV'),
                        file_title: ft,
                        direct: true,
                        yt_format: i,
						title: s_title,
                        name: videoTitle,
                        "headers": {
                            "referer": "",
                            "content_type": "video/x-flv",
                            "cookies": "",
                            "user_agent": ""
                        },
                    };
				
        parsedMediaList.push(media);
		
    }

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

	// Список
	downloadCode ='<ol style="display:none;" class="yt-uix-button-menu">';
	var i=0;
    for (var i = 0; i < parsedMediaList.length; i++) 
	{
        var media = parsedMediaList[i];
		downloadCode+='<li>';
		downloadCode+='   <a style="text-decoration:none;" href="'+media.url+'">';
		downloadCode+='     <span class="yt-uix-button-menu-item" loop="'+i+'" id="'+(DOWNLOAD_YOUTUBE_FMT_ID+media.yt_format)+'">';
		downloadCode+=         media.title;
		downloadCode+='     </span></a></li>';
		downloadCode+='   </a>';
		downloadCode+='</li>';
	}
	downloadCode+='</ol>';
	
	
    // Изображаем кнопку  
	var button = createButton(downloadCode);
		
/*	button.addEventListener("click", function(){
				FVDSINGLEYTButtonInsertor.mediaRequest();
			}, false);*/
			
	var elemFlag = document.getElementById('watch-flag');
	if( elemFlag )
	{
		elemFlag.parentNode.insertBefore(button, elemFlag);
	}
	else
	{
		var actionsDiv = document.getElementById('watch-actions-right');
				
		if( !actionsDiv )	var actionsDiv = document.getElementById('watch7-sentiment-actions');					
				
		if( actionsDiv )    actionsDiv.appendChild(button);				
	}
	
	// события
    for (var i = 0; i < parsedMediaList.length; i++) 
	{
        var media = parsedMediaList[i];
		var downloadFMT=document.getElementById(DOWNLOAD_YOUTUBE_FMT_ID+media.yt_format);    
		if (downloadFMT.attachEvent)  // IE
		{
			downloadFMT.attachEvent('onclick', downloadVideo);
		}
	}
	
	// сообщение аддону о результате
	opera.extension.postMessage( { cmd:'fvd_set_parset_videos', result: parsedMediaList, url:document.location.href } );
	
	
	//-----------------------------------------------
	function createButton( content )
	{
		var buttonContent='<span class="yt-uix-button-content yt-uix-button-icon-wrapper">' + "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoZJREFUeNpsk0trE1EUx899zEyatk6xImotaLUgFXGnIijddS/FhVsxwb1fQFz5GfwIElwX68JFN6JQi0VbU/rQJmmbTmIm874Pz0zoZHwcuDB35v5/95z/OUMuPnsNJyGVOn9j6vTynctnphKp5Ml7Til0o9haWmu86IfJS0ZzCXApVb4JhaJzF+zJx/dnbT9K8vclg8HusQfv1xujThyDydgQAEDyDcVnL5LiR9cHP84TAMug0HRDkBoUIaQoAc4owdR1tkm/RZhRL5TgJwUAKvuRApWdIdlBgmVRRhCQFkQ0CKUyciQUOIGAqAAwOIVeJDOATvV4KTfYSQkAaRapWsrMB+iEAmJRAAgExAKU1kDxZm7wogdI1SkEUyIKTZa6F0gEiCEAs+wjVEodpmlnGhhYgR7Q51gXwRYmJZNPlEcsuxskkBS6w6iCSFGwx0oLwg1QQjgjdFxI+ZZj3J6+NL1gWhYorEFZBmx4KX/YqoHBDKZmZubPCjVP0ZN26zA8ODhc4b4fPNpvtl7N3rz+wBotQ5IkxS79ESZlMMIZNLZ2Oq3WURVLf8PRUafXdp7Uv3xV1+7dWixP2iAT8Y84bR/lHPbXN529b/WKkqpGEZYNJePc+dVqVzdWPtZEHIE1bgErGcBGBouXTTDHTGhubjnbn9aqGsXpHGRa++7DwRRSEgRdd7l35Fw5NWnPGei2iiLQ2A2CM/Jzve5sfVitKCFrFEvJhglXDhhAaBD0vXfu4fHVssnmCM699DxobG47O5+/V7VCMf4HBEgO4H/XyhhzXMet1Fc39PS5iUXXjzv7zU5Fq2HaxeD/c5sy6nh+/HR3ry1ipZawqTWSTav+5+xvAQYADRQ40Hwcd4cAAAAASUVORK5CYII=' align='left'></span><span  style='padding-left:5px;line-height:23px '>"+ DOWNLOAD_LINK_MESSAGE + '</span> &nbsp; <img class="yt-uix-button-arrow yt-uix-button-icon-wrapper" src="" alt="" />'+content;
	
		var button = document.createElement("button");

		button.setAttribute("data-button-listener", "");
		button.setAttribute("data-tooltip-timer", "271");
		button.setAttribute("class", "yt-uix-tooltip-reverse yt-uix-button yt-uix-button-default yt-uix-tooltip");
		button.setAttribute("class", "yt-uix-button yt-uix-button-hh-text yt-uix-tooltip");
		button.setAttribute("data-tooltip", "Click here to view file formats");

		button.setAttribute("type", "button");
		button.setAttribute("id", DOWNLOAD_YOUTUBE_SPAN_ID);
	
		button.innerHTML = buttonContent;
	
		return button;
	}
	
	
  
  function downloadVideo(e) 
  {
    var e=e||window.event; // IE
    var elem=e.target||e.srcElement;
    e.returnValue=false;    
    if (e.preventDefault) 
	{
      e.preventDefault();
    }
    var loop=elem.getAttribute('loop');
    if (typeof GM_download=='function')  // Firefox extension compatibility
	{
      GM_download(parsedMediaList[loop].url, videoTitle+'.'+parsedMediaList[loop].frm);
    } 
	else 
	{
      document.location.href=parsedMediaList[loop].url;
    }
  }
      
}
 
})();