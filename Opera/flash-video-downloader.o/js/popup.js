var popup = 0;

function MenuSearchVideo( doc ) {

	this.doc = doc;

	var self = this;

	this.clear_field = true;
	this.search_string = doc.getElementById('menu_search_video_input');
	this.submit_btn = doc.getElementById('menu_search_video_submit');

	this.menu_search_video_input_f = function() {

		if ( self.search_string && self.clear_field ) {

			self.search_string.value = "";
			self.search_string.style.color = "black";
			self.clear_field = false;

		}
	}

	this.menu_search_video_input_b = function() {

		if ( self.search_string ) {

			if ( self.clear_field == false && self.search_string.value == "" ) {

				self.search_string.value = "Type your search here...";
				self.search_string.style.color = "#999";
				self.clear_field = true;

			}
		}
	}

	this.menu_search_video_input_keyup = function( event ) {

        	if (event.keyCode == 13) {

			self.menu_search_video_click.call( self );

		}
	}

	this.menu_search_video_click = function( event ) {

		if ( !self.clear_field && self.search_string ) {

			var query = self.search_string.value;
			if ( query ) {

				// Send command to background-process
				opera.extension.postMessage({cmd:"fvd_goto_search", q:query});
  
				// Close Popup-Menu
				window.close();

			}
		}
	}

	// yourtube search variants
	function O(g){var c=this;var A=null;var o='';c.d=null;var f= -1;var j=0;var C=false;c.G=function(){g.addEventListener('keydown',c.L,false);g.addEventListener('keyup',c.K,false);g.addEventListener('blur',c.H,false);},c.getData=function(m){var URL='http://suggestqueries.google.com/complete/search?%20hl=en&ds=yt&json=t&jsonp=callbackfunction&q='+m;var l;l=new XMLHttpRequest();l.open('GET',URL,true);l.onreadystatechange=function(){if(l.readyState==4){if(l.status==200){var response;if(o==m){if(c.d==null){c.d=document.createElement('div');document.body.appendChild(c.d);c.d.style.display='none';}c.d.setAttribute('class','fd');c.d.style.width=(g.clientWidth)+'px';c.F();c.d.innerHTML='';var D=l.responseText;var v=D.substring(new String('callbackfunction').length+1);var v=v.substring(0,v.length-1);var M=JSON.parse(v);c.d.style.display='block';var list=M[1];j=list.length;if(j>10)j=10;for(var i=0;i<j;i++){var r=list[i];var row=document.createElement('div');var pos=r.indexOf(m);if(pos!= -1){row.innerHTML=r.substr(0,pos+m.length)+'<b>'+r.substr(pos+m.length)+'</b>';}else{row.textContent=r;}row.setAttribute('id','gffg'+i);row.setAttribute('class','gffg');row.index=i;row.J=true;row.addEventListener('mouseover',function(e){var row=e.currentTarget;if(f!= -1)document.getElementById('gffg'+f).setAttribute('class','gffg');row.setAttribute('class','gffg selected');f=row.index;},false);row.addEventListener('mousedown',function(e){var row=e.currentTarget;g.value=row.textContent;c.B(row.textContent);},false);c.d.appendChild(row);}f= -1;if(j==0){c.d.style.display='none';C=false;}else{c.d.style.display='block';C=true;}I=27+j*17;var sb=document.getElementById('search_block');if (sb)sb.style.height=I+'px';}}}};l.send('');};c.K=function(e){var keyCode=e.keyCode;if(keyCode!=13){if((keyCode!=38)&&(keyCode!=40)&&(keyCode!=116)){if(A!=null){window.clearInterval(A);A=null;}o=g.value;A=setTimeout(c.getData,10,g.value)}else{/**/}}else{}},c.L=function(e){var keyCode=e.keyCode;if(keyCode==13){if(f!= -1){g.value=document.getElementById('gffg'+f).textContent}c.B(g.value);return;}if((keyCode!=38)&&(keyCode!=40)){}else{if(keyCode==38){if(f!= -1)document.getElementById('gffg'+f).setAttribute('class','gffg');f--;if(f<0)f=j-1;}else{if(f!= -1)document.getElementById('gffg'+f).setAttribute('class','gffg');f++;if(f>=j)f=0;}var row=document.getElementById('gffg'+f);row.setAttribute('class','gffg selected');g.value=row.textContent;}};c.H=function(e){if(e.explicitOriginalTarget!=c.d){o='--';if(c.d!=null){c.d.style.display='none';var sb=document.getElementById('search_block');if (sb)sb.style.height='3px';}}},c.F=function(){var k=g;var x=0;var y=g.offsetHeight-1;while((k.offsetParent)&&(k.tagName.toLowerCase()!='body')){x+=k.offsetLeft;y+=k.offsetTop;k=k.offsetParent;}x+=k.offsetLeft;y+=k.offsetTop;if(c.d!=null){c.d.style.left=x+'px';c.d.style.top=y+'px';}},c.B=function(m){o='--';if(c.d!=null){c.d.style.display='none';var sb=document.getElementById('search_block');if (sb)sb.style.height='29px';}};c.G();}
	this.accel = new O(this.search_string);

	this.search_string.addEventListener( 'focus', this.menu_search_video_input_f, false );
	this.search_string.addEventListener( 'blur', this.menu_search_video_input_b, false );
	this.search_string.addEventListener( 'keyup', this.menu_search_video_input_keyup, false );

	this.submit_btn.addEventListener( 'focus', this.menu_search_video_click, false );

	this.search_string.focus();

}

function Popup( doc ) {

	this.doc = doc;
	this.last_info = 0;

	var self = this;

	this.video_search = new MenuSearchVideo( doc );


	// Open Help page
	this.FVDOpenHelp = function( event ) {

		// Send command to background-process
		opera.extension.postMessage({cmd:"fvd_goto_help"});
  
		// Close Popup-Menu
		window.close();

		return false;

	};

	this.youtube_prepeare = function(url, obj) {

		var b = self.last_info.ihtml;

//		var jsr = b.match(/<param\sname=\\"flashvars\\"\s+value=\\"([^\"]+?)\\">/i);
		var jsr = b.match(/\\u003cembed[^>]+flashvars=\\"([^\"]+?)\\"/i);
		if (jsr != null) {

			var flashvars = jsr[1].replace(/\\u0026amp;/g, '&');

			var info = flashvars.split('&');
			for (var i = 0, j = info.length; i < j; i++) {

				if (info[i].indexOf('url_encoded_fmt_stream_map') == 0) {

					var formats = {};
					var map = (decodeURIComponent(info[i].substr(info[i].indexOf('url_encoded_fmt_stream_map') + 27))).split(',');
					map.forEach(function(el, i, a) {

						var tdata = el.match(/url=([^$]+)&type=([^&]+)&itag=([\d]+)/);
						if ( tdata ) {

							formats[ tdata[3] ] = decodeURIComponent( tdata[1] );

						}
//						var mk = el.split('|');
//						if (mk.length == 2) formats[mk[0]] = mk[1];
					});
                			var ytf = {
						37: {title:'Full HD', frm:'mp4'},
						22: {title:'HD', frm:'mp4'},
						35: {title:'High', frm:'flv'},
						34: {title:'Low', frm: 'flv'},
						18: {title:'SD', frm: 'mp4'},
						6: {title:'Low', frm: 'flv'},
						5: {title:'Low', frm: 'flv'},
						17: {title:'Mobile', frm: '3gp'},
						13: {title:'Mobile', frm: '3gp'}
					};

					var items = {};
					for (var i in formats) {

						var u = formats[i];
						items[u] = {'url':u, 'xpath': obj['xpath'], 'direct':true, 'quality' : ((i in ytf) ? ytf[i].title : 'Low'), 'format' : ((i in ytf) ? ytf[i].frm : 'FLV')};
					}
						
					self.setup_downloads_buttons.call(self, items);
					self.switch_video_mode.call(self, 'download_choose_video');

					break;
				}
			}
		}
	};

	this.inlineSize = function(el)  {
		// дополнительные стили дл€ клона, что бы мир не заметил чуда, и размеры отображались корректно
		var hiddenStyle = "left:-10000px;top:-10000px;height:auto;width:auto;position:absolute;";
		
		
		// создаем box элемент дл€ клонировани€ содержимого из нашего исходного inline блока
		var clone = document.createElement('div');
  
		// в об€зательном пор€дке копируем стили с исходного элемента, что бы размеры соответствовали исходнику.
		for (var i in el.style) 
		{
			try {
				if ((el.style[i] != '') && (el.style[i].indexOf(":") > 0)) 
					{
					clone.style[i] = el.style[i];
					}
			} catch (e) {}
		}
  
		// устанавливаем стили у клона, дабы он не мозолил глаз.
		// ”читываем, что IE не позвол€ет напр€мую устанавливать значение аттрибута style
		document.all ? clone.style.setAttribute('cssText', hiddenStyle) : clone.setAttribute('style', hiddenStyle);

		// ѕереносим содержимое. јккуратно.
		clone.innerHTML = el.innerHTML
  
		// ƒобавл€ем клон в корневой документ. “ак, на вс€кий пожарный в parent, а то вдруг элемент внутри iframe?
		parent.document.body.appendChild(clone);
  
		// «абиваем заветное.
//		var rect = {width:clone.clientWidth,height:clone.clientHeight};
		var rect = {width:clone.offsetWidth,height:clone.offsetHeight};
  
		// ...и тут же удал€ем
		parent.document.body.removeChild(clone);

		// ¬от собственно говор€ и все.
		return rect;
	}	
	
	this.setup_downloads_buttons = function(items)
	{
		//opera.postError("INFO: setup_downloads_buttons :" );
		var res = {added:0, youtube: 0};
		var ct = self.doc.getElementById('download_item_container');
		var tpl = self.doc.getElementById('download_item_template');
		for (var i in items)
		{
			if (items[i]['direct'])
			{
				var it = tpl.cloneNode(true);
				var ttt = (items[i]['title']) ? items[i]['title'] : '';
				var nnn = (items[i]['name']) ? items[i]['name'] : i;
				var tit = ttt;
				var nin = nnn;
				var url = (items[i]['url'] ? items[i]['url'] : i);
				
				it.removeAttribute('id');

				it.setAttribute('url', url);
				var tiit = (items[i]['title']) ? items[i]['title'] : '';
				it.setAttribute('title', tiit);
				it.setAttribute('xpath', items[i]['xpath']);
				it.setAttribute('direct', items[i]['direct']);
				

				var label = (self.doc.evaluate('./div[@class="download_url"]', it, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)).singleNodeValue;
				if (label != null)
				{
					label.innerHTML = tit;
					var w = this.inlineSize(label).width;
					if (w>250)
					{
						var x = tit.length;
						var y = 250 * x / w;
						tit = ttt.slice(0,y)+'...';
						nin = nnn.slice(0,y)+'...';
					}
					if ('format' in items[i])
					{
						tit = tit + '.' + items[i]['format'];
					}
					if ('size' in items[i])
					{
						if (items[i]['size'] != '')				tit = tit + '&nbsp;&nbsp;&nbsp;(' + items[i]['size'] + ')';
					}
					label.innerHTML = nin;
				}
				

				var qlabel = (self.doc.evaluate('./div[@class="download_quality"]', it, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)).singleNodeValue;
				if (qlabel != null)
				{
					if (('quality' in items[i]) || ('format' in items[i]))
					{
						if ('quality' in items[i])
						{
							it.setAttribute('quality', items[i]['quality']);
							var mql = (self.doc.evaluate('./div[@id="media_quality"]', qlabel, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)).singleNodeValue;
							if (mql != null) mql.innerHTML = items[i]['quality'];
						}

						if ('format' in items[i])
						{
							it.setAttribute('format', items[i]['format']);
							var mfl = (self.doc.evaluate('./div[@id="media_format"]', qlabel, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)).singleNodeValue;
							if (mfl != null) mfl.innerHTML = items[i]['format'];
						}
					} else
					{
						qlabel.setAttribute('empty', 'true');
					}
				}
				
				ct.appendChild(it);

				res['added']++;

			} else {

				if (i.indexOf('youtube.com') != -1) {

					this.youtube_prepeare(i, items[i]);
					res['youtube']++;
				}
			}
		}

		return res;
	};


	this.switch_video_mode = function( mode ) {

		var no_video = self.doc.getElementById( 'no_video' );
		if ( no_video ) no_video.style.display = (mode== 'no_video' )?'block':'none';

		var no_video_in_root = self.doc.getElementById( 'no_video_in_root' );
		if ( no_video_in_root ) no_video_in_root.style.display = (mode== 'no_video_in_root' )?'block':'none';

		var download_searching = self.doc.getElementById( 'download_searching' );
		if ( download_searching ) download_searching.style.display = (mode== 'download_searching' )?'block':'none';

		var download_video = self.doc.getElementById( 'download_video' );
		if ( download_video ) download_video.style.display = (mode== 'download_video' )?'block':'none';

		var download_choose_video = self.doc.getElementById( 'download_choose_video' );
		if ( download_choose_video ) download_choose_video.style.display = (mode== 'download_choose_video' )?'block':'none';

	};

	// Open Video Converter page
	this.FVDOpenVideoConverter = function( event ) {

		// Send command to background-process
		opera.extension.postMessage({cmd:"fvd_goto_video_converter"});
  
		// Close Popup-Menu
		window.close();

		return false;

	};

	// Open Feedback page
	this.FVDOpenFeedback = function( event ) {

		// Send command to background-process
		opera.extension.postMessage({cmd:"fvd_goto_feedback"});
  
		// Close Popup-Menu
		window.close();

		return false;

	};

	this.Download = function( event ) {

		if ( self.last_info && self.last_info.url ) {

			// Send command to background-process
			opera.extension.postMessage({ cmd:"fvd_download", url:'http://www.flashvideodownloader.org/download2.php?u='+ self.last_info.url });

			// Close Popup-Menu
			window.close();

		}

		return false;
	};

	// Handle messages from background-process
	this.HandleMessages = function(event) {

		// whats the status
		switch( event.data.cmd ) {

			case "popup_refresh":
			{

				self.last_info = event.data.d;
				//opera.postError("INFO: HandleMessages  :"+ self.last_info.mode + " - " + self.last_info.ml);
				
				self.switch_video_mode( self.last_info.mode );
				self.setup_downloads_buttons.call( self, self.last_info.ml );
				
		
			} break;
		}
	};

	this.HandleClicksOnDownloadSelect = function(e) {

		if (e.target.hasAttribute('type') && (e.target.getAttribute('type') == 'image')) {
		
			var it = (document.evaluate('./ancestor::div[@class="download_item"]', event.target, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)).singleNodeValue;

			if (e.target.getAttribute('value') == 'copy') 
			{
				if (window.clipboardData)
				{
					var clipboardholder = it.getAttribute('url');			
					window.clipboardData.setData("Text", clipboardholder);
				}
				else 
				{
//					var DummyVariable = prompt('Ѕуфер обмена заблокирован браузером, нажмите Ctrl+C дл€ копировани€ этой строки:',text);
				}			
			
				window.close();
				return;
			}
		
			if (it.getAttribute('direct')) {

				if (it.hasAttribute('format')) {

					// Send command to background-process
					var tiit = it.getAttribute('title');
					if ( tiit.length > 0)  tiit = '&title=' + tiit;
					                 else  tiit = '';
					var url = it.getAttribute('url') + tiit;
					opera.extension.postMessage({ cmd:"fvd_download", url: url });

					// Close Popup-Menu
					window.close();

				} else {

					// Send command to background-process
					opera.extension.postMessage({ cmd:"fvd_download", url:'http://www.flashvideodownloader.org/download4.php?u='+ encodeURIComponent( it.getAttribute('url') ) });

					// Close Popup-Menu
					window.close();

				}
			} else {

				// Send command to background-process
				opera.extension.postMessage({ cmd:"fvd_download", url:'http://www.flashvideodownloader.org/download2.php?u='+ encodeURIComponent( it.getAttribute('url') ) });

				// Close Popup-Menu
				window.close();

			}
		}
	};



	// Listen for script messages from background-process
	opera.extension.onmessage = this.HandleMessages;

	this.menu_help = doc.getElementById('menu_help');
	if ( this.menu_help )
		menu_help.addEventListener( 'click', this.FVDOpenHelp, false );

	this.menu_converter = doc.getElementById('menu_converter');
	if ( this.menu_converter )
		menu_converter.addEventListener( 'click', this.FVDOpenVideoConverter, false );

	this.menu_feedback = doc.getElementById('menu_feedback');
	if ( this.menu_feedback )
		menu_feedback.addEventListener( 'click', this.FVDOpenFeedback, false );

	this.download_button = doc.getElementById('download_button');
	if ( this.download_button )
		download_button.addEventListener( 'click', this.Download, false );

	this.download_item_container = doc.getElementById('download_item_container');
	if ( this.download_item_container )
		download_item_container.addEventListener( 'click', this.HandleClicksOnDownloadSelect, false );
		
		
		

	// Refresh menu
	opera.extension.postMessage( {cmd:"fvd_refresh"} );
  
}

window.addEventListener('load', function() {

	popup = new Popup( document );

}, false);




