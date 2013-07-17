// This script is only executed once the page has loaded.
window.addEventListener('load', function(event) {

//	opera.postError("Page Loaded!");
	opera.extension.postMessage({cmd:"ev_page_loaded"});

	// Execute this when a message is received from the background script.
	opera.extension.onmessage = function(event) {

//		opera.postError("INFO: Injected script get command '" + event.data.cmd + "'");

		switch ( event.data.cmd ) {

			case 'fvd_get_videos': fvd_get_videos( event.data.url ); break;

		}

	};

}, false);

function fvd_get_media() {

	const MEDIA_EXTENSIONS_PPT = 'mpg|mpeg|mp3|mp4|avi|rm|wmv|mov|flv|swf';
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

	var self = this;
	this.media = {};

	//---------------------------------------------- 
	this.build_vk = function() 
	{
		var links = {};

		var img = document.querySelectorAll('input');

		for(var i = 0; i < img.length; i++)
		{
			var t = img[i].getAttribute('type', false);
			if (t == 'hidden')
			{
				var a = img[i].getAttribute('value', false);
				if( a.indexOf(",") > 0 )
				{
					var url = a.substr(0, a.indexOf(","));
					var tag = a.substr(a.indexOf(",")+1);
					var tt = '';
					
					var t = img[i].parentNode.parentNode.parentNode;
					if (t)
					{
						tt = t.getElementsByTagName('b')[0].innerText + ' ' + t.getElementsByTagName('span')[0].innerText;
					}
					
					this.media[url] = {
                        display_name: url,
                        url: url,
                        quality: '',
                        format: 'MP3',
                        file_title: '',
                        direct: true,
						title: '',
                        name: tt,
                        xpath: tag,
						};
				}
			}
		}
		return this.media;
	}

	//-------------------------------------------------------
	this.build_list = function() {
	
		if( document.location.host.toLowerCase().indexOf("vk.com") != -1 )
		{
			if( document.location.href.toLowerCase().indexOf("audio") != -1 )		return this.build_vk();
		}

		var emb_res = document.evaluate('//embed[@src]', document.documentElement, null, window.XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		var i = emb_res.iterateNext();

		while (i != null) {

			var url = this.embed_to_url(i);
			var xpath = this.get_xpath(i);
			var direct = true;

			if ((i.src.indexOf('.ytimg.com/yt/swf/') != -1) || (i.src.indexOf('ytimg.com/yt/swfbin/') != -1)) {

				url = document.location.href;
				direct = false;
        
			} else if ((i.src.indexOf('www.youtube.com/v/') != -1) || (i.src.indexOf('www.youtube-nocookie.com/v/') != -1)) {

				direct = false;
			}

			this.media[url] = {xpath: xpath, url: url, direct:direct};
			i = emb_res.iterateNext();
		}

		var m_rx = new RegExp('^.*\\.(?:'+ MEDIA_EXTENSIONS_PPT + ')$', 'i');
		var a_res = document.evaluate('//a[@href]', document.documentElement, null, window.XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		i = a_res.iterateNext();

		while(i != null) {

			var url = i.href;
			var xpath = this.get_xpath(i);

			if (m_rx.test(url)) this.media[url] = {xpath: xpath, url: url, direct:true};
			i = a_res.iterateNext();
		}
		return this.media;
	}

	this.embed_to_url = function(embed) {

		var src = embed.src;
		for (var i = 0, j = EMBED_URLS_RX.length; i < j; i++) {

			var rx = new RegExp(EMBED_URLS_RX[i].tst, 'i');
			if (rx.test(src)) {

				var txt = src;
				if ('attr' in EMBED_URLS_RX[i]) txt = embed.getAttribute(EMBED_URLS_RX[i].attr);
				var rxe = new RegExp(EMBED_URLS_RX[i].rx, 'i');
				var matches = rxe.exec(txt);
				if (matches != null) {

					var url = EMBED_URLS_RX[i].rep;
					for (k = 1, l = matches.length; k < l; k++) {

						url = url.replace('$' + k, matches[k]);
					}       
					return url;
				}
			}
		}
		return src;
	};

	this.get_xpath = function(node) {

		var result = '';
		if (node.parentNode != null) result += this.get_xpath(node.parentNode);

		switch (node.nodeType) {

			case window.Node.ELEMENT_NODE: {

				result+= '/' + node.nodeName.toLowerCase();
				break;
			}

			case window.Node.TEXT_NODE: {

				result+= '/text()';
				break;
			}
		}
	
		if (node.parentNode != null) {

			var ni = this.node_index(node);
			if (ni) result+= '[' + ni + ']';
		}
		return result;
	};

	this.node_index = function(node) {

		if (node.parentNode != null) 
		{
			var ct = 0;
			for (var i = node.parentNode.firstChild; i != null; i = i.nextSibling) {

				if ((node.nodeType == i.nodeType) && ((i.nodeType == window.Node.TEXT_NODE) || (i.nodeName == node.nodeName))) 
				{
					ct++;
					if (node == i) 
					{
						if (((i.nextSibling != null) && (ct == 1)) || (ct > 1)) return ct;
					}
				}
			}
		}
		return '';
	}
}

function fvd_get_videos( url ) {

	if ( url == document.location.href ) 
	{
opera.postError("INJECTOR ======"+document.location.href);
		if (document.location.href.toLowerCase().indexOf("vk.com/video") == -1 )
		{
			var ml = (new fvd_get_media()).build_list();
			opera.extension.postMessage( { cmd:'fvd_get_videos_result', result:ml, url:document.location.href, ihtml:document.body.innerHTML } );
		}	
	}
}
