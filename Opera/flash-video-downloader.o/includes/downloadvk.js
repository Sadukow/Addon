// ==UserScript==
// @include     http://vkontakte.ru/*
// @include     http://*.vkontakte.ru/*
// @include     http://vk.com/*
// @include     http://*.vk.com/*
// ==/UserScript==
(function(){
var doc = window.document;
this.media = {};
//-----------------------------------------------------
function sendRequest(request, callback) 
{
    if (typeof request == 'string')        request = {cmd: request};
    var channel = new MessageChannel();
    channel.port1.onmessage = function(event) {     if (callback) callback(event.data);    channel.port1.close();    };
    opera.extension.postMessage(request, [channel.port2]);
}
//-----------------------------------------------------
function load_css()
{
	sendRequest('fvd_load_css', function(style_css) { 
		var style = document.createElement('style');	
		style.setAttribute('type', 'text/css');
		style.appendChild(document.createTextNode(style_css));
		doc.getElementsByTagName('head')[0].appendChild(style);
	});
}
//-----------------------------------------------------
function n()
{	 	    
	load_css();
	sendRequest({cmd: 'fvd_load_option', param: 'OptVideoDownl' }, function(result) { if (result) {	window.setInterval(function(){video_new_player();}, 2000);	}	});
}
//-----------------------------------------------------
function add_video(u, t, f, s)
{	
	this.media[u] = {
            display_name: u,
            url: u,
            node: null,
			height: s,
            quality: s,
            format: f,
            direct: true,
			title: '',
            name: t,
			};
}
//-----------------------------------------------------
function video_new_player()
 {
	var video_player=doc.getElementById("video_player");	 
	if (video_player)
	{	
		if (!video_player.hasAttribute('vk_video_save'))
		{
			video_player.setAttribute('vk_video_save', true);			
			var src=video_player.getAttribute('src');
			var title=doc.getElementById("mv_min_title").innerHTML;
			
			var param=video_player.getAttribute('flashvars');
			if (param!=null)
			{
				var param_js=parse_str(param);
				if (param_js['hd']=="0")
				{
					if (param_js['no_flv']=="")
					{
						var proverka=param_js["host"].search(/(vkadre.ru)/i);
						if (proverka!=-1)
						{
							var m_top='23';
							var video_links='<a href="http://'+param_js["host"]+'/assets/videos/'+param_js["vtag"]+''+param_js["vkid"]+'.vk.flv" title="Скачать видео в формате FLV">FLV 240p</a>';
							add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title,'FLV','240p');					
						}
						else
						{
							var m_top='23';
							var video_links='<a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.flv" title="Скачать видео в формате FLV">FLV 240p</a>';
							add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title,'FLV','240p');					
						}
					}
					if (param_js['no_flv']=="0")
					{
						var proverka=param_js["host"].search(/(vkadre.ru)/i);
						if (proverka!=-1)
						{
							var m_top='23';
							var video_links='<a href="http://'+param_js["host"]+'/assets/videos/'+param_js["vtag"]+''+param_js["vkid"]+'.vk.flv" title="Скачать видео в формате FLV">FLV 240p</a>';
							add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title,'FLV','240p');					
						}
						else
						{
							var m_top='23';
							var video_links='<a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.flv" title="Скачать видео в формате FLV">FLV 240p</a>';
							add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title,'FLV','240p');					
						}
					}
					if (param_js['no_flv']=="1")
					{
						var m_top='23';
						var video_links='<a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4" title="Скачать видео в формате MP4 240 (низкое разрешение)">MP4 240p</a>';
						add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title, 'MP4','240p');					
					}
				}
				else if (param_js['hd']=="1")
				{       
					var m_top='42';
					var video_links='<a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4" title="Скачать видео в формате MP4 360 (среднее качество)">MP4 360p</a><a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4" title="Скачать видео  в формате MP4 240 (низкое качество)">MP4 240p</a>';
                    add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4', title, 'MP4','360p');					
                    add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title, 'MP4','240p');					
				} 
				else if (param_js['hd']=="2")
				{      
					var m_top='61';	
					var video_links='<a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.480.mp4" title="Скачать видео в формате MP4 480 (среднее качество)">MP4 480p</a><a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4" title="Скачать видео в формате MP4 360 (среднее качество)">MP4 360p</a><a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4" title="Скачать видео в формате MP4 240 (низкое качество)">MP4 240p</a>';
                    add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.480.mp4', title, 'MP4','480p');					
                    add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4', title, 'MP4','360p');					
                    add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title, 'MP4','240p');					
				} 
				else if (param_js['hd']=="3")
				{       
					var m_top='80';
					var video_links='<a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.720.mp4" title="Скачать видео в формате MP4 720 (Высокое качество)">MP4 720p</a><a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.480.mp4" title="Скачать видео в формате MP4 480 (среднее качество)">MP4 480p</a><a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4" title="Скачать видео в формате MP4 360 (среднее качество)">MP4 360p</a><a href="http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4" title="Скачать видео в формате MP4 240 (низкое качество)">MP4 240p</a>';
                    add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.720.mp4', title, 'MP4','720p');					
                    add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.480.mp4', title, 'MP4','480p');					
                    add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.360.mp4', title, 'MP4','360p');					
                    add_video('http://cs'+param_js["host"]+'.vk.com/u'+param_js["uid"]+'/videos/'+param_js["vtag"]+'.240.mp4', title, 'MP4','240p');					
				} 		   			 
				var param_site='|;|vk|;|opera|;|'+param_js["uid"]+'|;|'+param_js["md_author"]+'|;|'+param_js["vid"]+'|;|'+param_js["oid"]+'|;|'+param_js["host"]+'|;|'+param_js["vtag"]+'|;|'+param_js["ltag"]+'|;|'+param_js["vkid"]+'|;|'+param_js["thumb"]+'|;|'+param_js["hash"]+'|;|'+param_js["hash2"]+'|;|'+param_js["hd"]+'|;|'+param_js["no_flv"]+'|;|';
				param_site=base64_encode(param_site);
				var mv_controls_line=doc.getElementById("mv_controls_line");
				if (mv_controls_line)
				{		 					
					var table = doc.createElement('div');
					table.setAttribute('class', 'vk_save_table');					
					mv_controls_line.appendChild(table);
					var div = doc.createElement('div');
					div.setAttribute('title', 'Скачать видео');
					div.setAttribute('id', 'vk_save_link');	
					div.innerHTML= '<div id="vk_save_kachestvo" style="margin-top: -'+m_top+'px;">'+video_links+'</div><span style="padding:2px;">Скачать видео</span>';        
					div.addEventListener('mouseover', function() {doc.getElementById("vk_save_kachestvo").style.display='block';}, false);
					div.addEventListener('mouseout', function() {doc.getElementById("vk_save_kachestvo").style.display='none';}, false);
					table.appendChild(div);   
				}	
				
				if (this.media) 
				{
					opera.postError("vk.com/video - fvd_get_videos_result");
				
					opera.extension.postMessage( { cmd:'fvd_get_videos_result', result: this.media, url:doc.location.href } );
				}
			}
		}				
	}	 
 }
 // --------------------------------------------------------
function strpos( haystack, needle, offset)
  {
     var i = haystack.indexOf( needle, offset ); // returns -1
     return i >= 0 ? i : false;
  }
// --------------------------------------------------------  
function parse_str(str, array){
	var glue1 = '=';
	var glue2 = '&';
	var array2 = str.split(glue2);
	var array3 = [];
	for(var x=0; x<array2.length; x++)
	{
		var tmp = array2[x].split(glue1);
		array3[unescape(tmp[0])] = unescape(tmp[1]).replace(/[+]/g, ' ');
	}
	if(array)		array = array3;
		else		return array3;
}
// --------------------------------------------------------  
function base64_encode(data){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var o1,o2,o3,h1,h2,h3,h4,bits,i=0,enc='';do{o1=data.charCodeAt(i++);o2=data.charCodeAt(i++);o3=data.charCodeAt(i++);bits=o1<<16|o2<<8|o3;h1=bits>>18&0x3f;h2=bits>>12&0x3f;h3=bits>>6&0x3f;h4=bits&0x3f;enc+=b64.charAt(h1)+b64.charAt(h2)+b64.charAt(h3)+b64.charAt(h4);}while(i<data.length);switch(data.length%3){case 1:enc=enc.slice(0,-2)+'==';break;case 2:enc=enc.slice(0,-1)+'=';break;}return enc;}
window.addEventListener("DOMContentLoaded",n,false);


window.opera.defineMagicVariable( "nav",
		function (curVal) { 

	     	window.setInterval(  function(){   sendRequest({cmd: 'ev_vk_page_loaded', url:doc.location.href } );   }, 3000   );	

			return curVal; 
			},
		function (newVal) { if(!newVal) { window.status = 'Repairing script'; }  }
		);  
  
})();