(function(){
	
	var Popup = function(){
		
		var self = this;
		
		const ALLOWED_EXT_IMAGES = [
			"flv",
			"mp3",
			"mp4",
			"pdf",
			"swf",
			"webm",
			"3gp"
		];
		
		this.ListMedia = null;
		
		this.tabSelectAll_links = "0";
		this.tabSelectAll_images = "0";
		this.tabSelectAll_docs = "0";
		this.tabSelectAll_videos = "0";
		
		this.curHref = null;

		this.MenuCopy = "copy_link"; 
		this.MenuOpen = "open_link"; 

		this.video_YT = false;
		
		// -------------------------------------------------------
		function threadsOfActiveMode( mode, srtn, callback ){

			if ( self.ListMedia == null ) return null;
			var media = null;
//console.log(self.ListMedia);			
			if (mode == "video")  		
			{
				media = self.ListMedia.video;
				if ( GetThemAll.Prefs.get( "gta.filter_video_all" ) == "false" )
				{
					var flag_mp4  = _b(GetThemAll.Prefs.get( "gta.filter_video_mp4" ));
					var flag_flv  = _b(GetThemAll.Prefs.get( "gta.filter_video_flv" ));
					var flag_avi  = _b(GetThemAll.Prefs.get( "gta.filter_video_avi" ));
					var flag_webm = _b(GetThemAll.Prefs.get( "gta.filter_video_webm" ));
					var flag_3gp  = _b(GetThemAll.Prefs.get( "gta.filter_video_3gp" ));
					var flag_mov  = _b(GetThemAll.Prefs.get( "gta.filter_video_mov" ));
					var flag_mp3  = _b(GetThemAll.Prefs.get( "gta.filter_video_mp3" ));
					var flag_wav  = _b(GetThemAll.Prefs.get( "gta.filter_video_wav" ));
					var flag_mid  = _b(GetThemAll.Prefs.get( "gta.filter_video_mid" ));
					
					media = media.filter( function (item, i, arr) {
				
											if ( flag_mp4  && item.ext == "mp4" ) return true;
											if ( flag_flv  && item.ext == "flv" ) return true;
											if ( flag_avi  && item.ext == "avi" ) return true;
											if ( flag_webm && item.ext == "webm" ) return true;
											if ( flag_3gp  && item.ext == "3gp" ) return true;
											if ( flag_mov  && item.ext == "mov" ) return true;
											if ( flag_mp3  && item.ext == "mp3" ) return true;
											if ( flag_wav  && item.ext == "wav" ) return true;
											if ( flag_mid  && (item.ext == "mid" || item.ext == "midi") ) return true;
				
											return false;
										} );			
				}						
			}	
			else if (mode == "file")  	
			{
				media = self.ListMedia.file;
				if ( GetThemAll.Prefs.get( "gta.filter_file_all" ) == "false" )
				{
					var flag_doc  = _b(GetThemAll.Prefs.get( "gta.filter_file_doc" ));
					var flag_xls  = _b(GetThemAll.Prefs.get( "gta.filter_file_xls" ));
					var flag_pdf  = _b(GetThemAll.Prefs.get( "gta.filter_file_pdf" ));
					var flag_zip  = _b(GetThemAll.Prefs.get( "gta.filter_file_zip" ));
					var flag_rar  = _b(GetThemAll.Prefs.get( "gta.filter_file_rar" ));
					var flag_7z   = _b(GetThemAll.Prefs.get( "gta.filter_file_7z" ));
					var flag_jar  = _b(GetThemAll.Prefs.get( "gta.filter_file_jar" ));
					var flag_tar  = _b(GetThemAll.Prefs.get( "gta.filter_file_tar" ));
					var flag_exe  = _b(GetThemAll.Prefs.get( "gta.filter_file_exe" ));
					var flag_addon  = _b(GetThemAll.Prefs.get( "gta.filter_file_addon" ));
					
					media = media.filter( function (item, i, arr) {
				
											if ( flag_doc && ( item.ext == "doc" || item.ext == "docx"  || item.ext == "rtf" ) ) return true;
											if ( flag_xls && ( item.ext == "xls" || item.ext == "xlsx" ) ) return true;
											if ( flag_pdf && (item.ext == "pdf" || item.ext == "odf" || item.ext == "odt")  ) return true;
											if ( flag_zip && item.ext == "zip" ) return true;
											if ( flag_rar && item.ext == "rar" ) return true;
											if ( flag_7z  && item.ext == "7z" ) return true;
											if ( flag_jar && item.ext == "jar" ) return true;
											if ( flag_tar && (item.ext == "tar" || item.ext == "bz2" || item.ext == "qz")  ) return true;
											if ( flag_exe && ( item.ext == "exe" || item.ext == "bin" || item.ext == "msi" || item.ext == "iso" || item.ext == "dmg" ) ) return true;
											if ( flag_addon && ( item.ext == "xpi" || item.ext == "crx"  || item.ext == "nex" || item.ext == "oex" ) ) return true;
				
											return false;
										} );			
				}						
			}	
			else if (mode == "image")  	
			{
				media = self.ListMedia.image;
				if ( GetThemAll.Prefs.get( "gta.filter_image_all" ) == "false" )
				{
					var flag_jpg  = _b(GetThemAll.Prefs.get( "gta.filter_image_jpg" ));
					var flag_giv  = _b(GetThemAll.Prefs.get( "gta.filter_image_giv" ));
					var flag_png  = _b(GetThemAll.Prefs.get( "gta.filter_image_png" ));
					var flag_bmp  = _b(GetThemAll.Prefs.get( "gta.filter_image_bmp" ));
					var flag_ico  = _b(GetThemAll.Prefs.get( "gta.filter_image_ico" ));
					
					media = media.filter( function (item, i, arr) {
				
											if ( flag_jpg && ( item.ext == "jpg" || item.ext == "jpeg" ) ) return true;
											if ( flag_giv && item.ext == "giv" ) return true;
											if ( flag_png && item.ext == "png" ) return true;
											if ( flag_bmp && item.ext == "bmp" ) return true;
											if ( flag_ico && item.ext == "ico" ) return true;

											return false;
										} );			
				}						
				var v = document.getElementById("filter_image_size").value;
				if (!v || v == "") v = 0;
				var min_size = parseFloat(v);
				if ( min_size )
				{
					min_size = min_size * 1024;
					media = media.filter( function (item, i, arr) {
				
											if ( item.size && item.size < min_size ) return false;

											return true;
										} );			
				}
				
				
			}	
			else if (mode == "link")  	
			{
				media = self.ListMedia.link;
				
				if ( GetThemAll.Prefs.get( "gta.filter_link_all" ) == "false" )
				{
					var flag_html = _b(GetThemAll.Prefs.get( "gta.filter_link_html" ));
					var flag_css  = _b(GetThemAll.Prefs.get( "gta.filter_link_css" ));
					var flag_js   = _b(GetThemAll.Prefs.get( "gta.filter_link_js" ));
					
					media = media.filter( function (item, i, arr) {

											if ( flag_html && ( item.ext == "html" || item.ext == "htm" || item.ext == "shtml") ) return true;
											if ( flag_css && item.ext == "css" ) return true;
											if ( flag_js && (item.ext == "js" || item.ext == "jsm") ) return true;
											
											return false;
				
										} );			
				}						
			}	

			// сортировка
			if (srtn == "asc_url")			media.sort( function( item1, item2 ) {	  return item1.url.toLowerCase() > item2.url.toLowerCase() ? 1 : -1;  } );
			else if ( srtn == "desc_url")	media.sort( function( item1, item2 ) {	  return item2.url.toLowerCase() > item1.url.toLowerCase() ? 1 : -1;  } );
			else if ( srtn == "asc_title")	media.sort( function( item1, item2 ) {	  return item1.title.toLowerCase() > item2.title.toLowerCase() ? 1 : -1;  } );
			else if ( srtn == "desc_title")	media.sort( function( item1, item2 ) {	  return item2.title.toLowerCase() > item1.title.toLowerCase() ? 1 : -1;  } );
			else if ( srtn == "asc_size")	media.sort( function( item1, item2 ) {	  return (item1.size ? parseInt(item1.size) : 0) > (item2.size ? parseInt(item2.size) : 0)  ? 1 : -1;  } );
			else if ( srtn == "desc_size")	media.sort( function( item1, item2 ) {	  return (item2.size ? parseInt(item2.size) : 0) > (item1.size ? parseInt(item1.size) : 0)  ? 1 : -1;  } );
			else							media.sort( function( item1, item2 ) {	  return (item1.priority < item2.priority ? 1 : (item1.priority == item2.priority ? (item1.id < item2.id ? 1 : -1) : -1));  } );
			
			// изображаем
			callback( media); 

		}

		// -------------------------------------------------------
		const YOUTUBE_URL_SIGNS = [
				"//youtube.com",
				"//www.youtube.com",
				".youtube.com",
				"//soloset.net",
				"//www.soloset.net",
				"//solosing.com",
				"//www.solosing.com"
			];
			
		function isYoutubeUrl(url){
		
			if ( GetThemAll.noYoutube == false ) return false;
		
			var url = url.toLowerCase();
				
			for( var i = 0; i != YOUTUBE_URL_SIGNS.length; i++ )
			{
				if( url.indexOf( YOUTUBE_URL_SIGNS[i] ) != -1 )		return true;
			}
				
			return false;
		}
			
		// -------------------------------------------------------
		function getExtImage( ext ){
			if( ALLOWED_EXT_IMAGES.indexOf(ext) == -1 ){
				return;
			}
			
			ext = ext.toLowerCase();
		
			return "images/formats/"+ext+".png";
		}
		
		function str_download_size( size ) {
		
			if (size<1073741824)    return GetThemAll.Utils.bytesToMb(size) + "MB";
			        else return GetThemAll.Utils.bytesToGb(size) + "GB";
		
		}

		// ---------------------------------------------------- ширина текста
		function inlineSize( el ){
			// дополнительные стили дл€ клона, что бы мир не заметил чуда, и размеры отображались корректно
			var hiddenStyle = "left:-10000px;top:-10000px;height:auto;width:auto;position:absolute;";
		
		
			// создаем box элемент дл€ клонировани€ содержимого из нашего исходного inline блока
			var clone = document.createElement('div');
  
			// в об€зательном пор€дке копируем стили с исходного элемента, что бы размеры соответствовали исходнику.
			for (var i in el.style) 
			{
				try 
				{
					if ((el.style[i] != '') && (el.style[i].indexOf(":") > 0)) 
					{
						clone.style[i] = el.style[i];
					}
				} 
				catch (e) {}
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

		// ----------------------------------------------------   
		function setCheck_ListMedia( id, t ){
		
			self.ListMedia.v_link = 0;
			self.ListMedia.v_image = 0;
			self.ListMedia.v_file = 0;
			self.ListMedia.v_video = 0;
		
			if (self.ListMedia.k_link>0) 
			{
				self.ListMedia.link.forEach( function( item ){
							if ( item.id == id)
							{
								item.vubor = t;
								GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Status( tab.id, id, t );		});
							}	
							if ( item.vubor == 1)
							{
								self.ListMedia.v_link++;
							}
						} );
			}			
			if (self.ListMedia.k_image>0) 
			{
				self.ListMedia.image.forEach( function( item ){
							if ( item.id == id)
							{
								item.vubor = t;
								GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Status( tab.id, id, t );		});
							}	
							if ( item.vubor == 1)
							{
								self.ListMedia.v_image++;
							}
						} );
			}			
			if (self.ListMedia.k_file>0) 
			{
				self.ListMedia.file.forEach( function( item ){
							if ( item.id == id)
							{
								item.vubor = t;
								GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Status( tab.id, id, t );		});
							}	
							if ( item.vubor == 1)
							{
								self.ListMedia.v_file++;
							}
						} );
			}			
			if (self.ListMedia.k_video>0) 
			{
				self.ListMedia.video.forEach( function( item ){
							if ( item.id == id)
							{
								item.vubor = t;
								GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Status( tab.id, id, t );		});
							}	
							if ( item.vubor == 1)
							{
								self.ListMedia.v_video++;
							}
						} );
			}			

			// количественные данные
			buildThreadCount( { link: self.ListMedia.k_link, vlink: self.ListMedia.v_link,
								image: self.ListMedia.k_image, vimage: self.ListMedia.v_image,
								file: self.ListMedia.k_file, vfile: self.ListMedia.v_file,
								video: self.ListMedia.k_video, vvideo: self.ListMedia.v_video  } );	
		
		}

		// --------------------------------------------------------------------------
		function Copy_contextMenu( event ){
		
			var ee = document.getElementById("content-tooltip");
			ee.style.opacity = 0;
			ee.style.display = "none";
							
			GetThemAll.Utils.copyToClipboard( self.curHref );
							
			event.stopPropagation();
			
		}

		// --------------------------------------------------------
		function Open_contextMenu( event ){
		
			var ee = document.getElementById("content-tooltip");
			ee.style.opacity = 0;
			ee.style.display = "none";
			
			chrome.tabs.create({
								url: self.curHref,
								active: false
							});
							
			event.stopPropagation();
		}
		
		// --------------------------------------------------------
		function Item_contextMenu( url ){

			self.curHref = url;
			
			self.MenuCopy = chrome.contextMenus.create({
													type: "normal",
													"title": "Copy URL", 
													"contexts":["all"], 
													"id": "copy_link", 
													"onclick": genericOnClick_ContextPopup_Copy
												});
			
			self.MenuOpen = chrome.contextMenus.create({
													type: "normal",
													"title": "Open Link", 
													"contexts":["all"], 
													"id": "open_link", 
													"onclick": genericOnClick_ContextPopup_Open
												});

		}
		
		// --------------------------------------------------------
		function Item_contextMenu_Main( url ){

			var ee = document.getElementById("content-tooltip");
							
			var x = event.clientX + 20;
			var y = event.clientY;
			ee.style.left = x;
			ee.style.top = y;
			ee.style.opacity = 1;
			ee.style.display = "block";
							
			event.preventDefault();
			event.stopPropagation();
			event.cancelBubble = true;
			
			self.curHref = url;
			
			var e1_c = document.getElementById("content-copy");
			var e1_o = document.getElementById("content-open");
			
			e1_c.removeEventListener("click",Copy_contextMenu,false);
			e1_o.removeEventListener("click",Open_contextMenu,false);
			
			e1_c.addEventListener( "click", Copy_contextMenu, false);
			e1_o.addEventListener( "click", Open_contextMenu, false);

		}
		
		// ----------------------------------------------------
		function genericOnClick_ContextPopup_Copy( info, tab ) {
		
			chrome.contextMenus.remove( self.MenuCopy );				
			chrome.contextMenus.remove( self.MenuOpen );				
			
			GetThemAll.Utils.copyToClipboard( self.curHref );
		
		}

		// ----------------------------------------------------
		function genericOnClick_ContextPopup_Open( info, tab ) {
		
			chrome.contextMenus.remove( self.MenuCopy );				
			chrome.contextMenus.remove( self.MenuOpen );				
		
			chrome.tabs.create({
								url: self.curHref,
								active: false
							});
		}
		
		// ----------------------------------------------------   заполним строку
		function buildThreadItem( media, mode ){

			function fbc( className ){
				return item.getElementsByClassName(className)[0];
			}
			
			var item = document.getElementById("download_item_template").cloneNode( true );
			
			item.removeAttribute( "id" );
			// --  url
			var e1 =  fbc("item_url");
			if (media.url.length > 55)
			{
				e1.textContent = media.url.substring(0,55) + "...";
			}
			else
			{
				e1.textContent = media.url;			
			}
/*			e1.textContent = media.url;
			var w = inlineSize(e1).width;
			if (w > 450)
			{
				var x = media.url.length;
				var y = 450 * x / w;
				var t = media.url.slice(0,y)+'...';
				e1.textContent = t;
			}*/
			e1.title = media.url;
			var e1u =  fbc("item2");
			e1u.addEventListener( "click", function( event ){

							chrome.tabs.create({
												url: media.url,
												active: false
											});
								
						}, false );

			e1.addEventListener( "contextmenu", function( event ){

							Item_contextMenu( this.title );
			
						}, false );
						
			if (media.type == "image")
			{
				var e1e =  fbc("item_ext");
				e1e.setAttribute("adr", media.url);
				e1e.addEventListener( "mouseover", function( event ){

							var ee = document.getElementById("image-tooltip");
							
							var x = event.clientX + 20;
							var y = event.clientY;
							if (y > 250)   y = event.clientY-100;
							if (y > 340)   y = event.clientY-200;
							if (y > 440)   y = event.clientY-300;
							
							ee.style.left = x;
							ee.style.top = y;
							ee.style.opacity = 1;
							ee.style.display = "block";
							
							var img_url = this.getAttribute("adr");

							var ii = document.getElementById("preview-image");
							ii.src = img_url;
							ii.addEventListener( "load", function( event ){
										
												var ee = document.getElementById("rg3fbpz-title");
												ee.removeAttribute("loading");
							
											});
							
						}, false );
			
				e1e.addEventListener( "mouseout", function( event ){

							var ee = document.getElementById("image-tooltip");
							ee.style.opacity = 0;
							ee.style.display = false;
							var ii = document.getElementById("preview-image");
							ii.src = '';
							var ee = document.getElementById("rg3fbpz-title");
							ee.setAttribute("loading","1");
						
						}, false );
			}			
			
			
			

			// --  descr
			var e2 =  fbc("item_descr");
			if (media.title.length > 20)
			{
				e2.textContent = media.title.substring(0,20) + "...";
			}
			else
			{
				e2.textContent = media.title;			
			}
			e2.title = media.title;

			// --  extension
			var e3 =  fbc("item_ext");
			if (media.type == "image")
			{
				switch ( media.ext )
				{
					case "jpeg":
					case "jpg":   e3.setAttribute("src", "/images/ext_icons/jpg.jpg");   break;
					case "gif":   e3.setAttribute("src", "/images/ext_icons/gif.gif");   break;
					case "png":   e3.setAttribute("src", "/images/ext_icons/png.gif");   break;
					case "bmp":   e3.setAttribute("src", "/images/ext_icons/bmp.png");   break;
					case "ico":   e3.setAttribute("src", "/images/ext_icons/ico.png");  break;
					default: e3.setAttribute("src", "/images/ext_icons/jpg.png");
				}
			}
			else if (media.type == "audio") 
			{
				e3.setAttribute("src", "/images/ext_icons/mp3.png");
			}
			else if (media.type == "http") 
			{
				switch ( media.ext )
				{
					case "shtml":
					case "htm":
					case "html":  e3.setAttribute("src", "/images/ext_icons/html.png");   break;
					case "css":   e3.setAttribute("src", "/images/ext_icons/css.png");   break;
					case "js":   e3.setAttribute("src", "/images/ext_icons/js.png");   break;
					default: e3.setAttribute("src", "/images/ext_icons/htm.png");
				}
			}
			else if (media.type == "file" || media.type == "archiv") 
			{
				switch ( media.ext )
				{
					case "rtf":
					case "docx":
					case "doc":   e3.setAttribute("src", "/images/ext_icons/doc.png");   break;
					case "xlsx":
					case "xls":   e3.setAttribute("src", "/images/ext_icons/xls.png");   break;
					case "odf":
					case "odt":
					case "pdf":   e3.setAttribute("src", "/images/ext_icons/pdf.jpg");   break;
					case "zip":	  e3.setAttribute("src", "/images/ext_icons/zip.png");   break;	
					case "rar":	  e3.setAttribute("src", "/images/ext_icons/rar.png");   break;	
					case "7z":    e3.setAttribute("src", "/images/ext_icons/7z.png");   break;
					case "jar":   e3.setAttribute("src", "/images/ext_icons/jar.png");   break;
					case "qz":
					case "bz2":
					case "tar":   e3.setAttribute("src", "/images/ext_icons/tar.png");   break;
					case "exe":
					case "bin":
					case "iso":
					case "dmg":
					case "msi":   e3.setAttribute("src", "/images/ext_icons/exe.png");   break;
					case "xpi":   e3.setAttribute("src", "/images/ext_icons/xpi.png");   break;
					case "crx":   e3.setAttribute("src", "/images/ext_icons/crx.png");   break;
					case "nex":
					case "oex":   e3.setAttribute("src", "/images/ext_icons/oex.png");   break;
					default: e3.setAttribute("src", "/images/ext_icons/file.png");
				}
			}
			else if (media.type == "video")
			{
				switch ( media.ext )
				{
					case "3gp":   e3.setAttribute("src", "/images/ext_icons/3gp.png");   break;
					case "flv":   e3.setAttribute("src", "/images/ext_icons/flv.png");   break;
					case "mp4":   e3.setAttribute("src", "/images/ext_icons/mp4.png");   break;
					case "swf":   e3.setAttribute("src", "/images/ext_icons/swf.png");   break;
					case "webm":  e3.setAttribute("src", "/images/ext_icons/webm.png");  break;
					default: e3.setAttribute("src", "/images/ext_icons/mpg.png");
				}
			
				
			}
			e3.title = media.ext ? media.ext : media.type;
			
			// -- select
			var e4 =  fbc("item_sel");
			if ( isYoutubeUrl(media.url) && (mode == "video") )
			{
				e4.setAttribute("check", "5");
			}
			else
			{
				if ( media.vubor == 1) e4.setAttribute("check", "1");
								  else e4.setAttribute("check", "0");
								  
				e4.addEventListener( "click", function( event ){

						var x = this.getAttribute("check");
						var id = parseInt( this.getAttribute("item") );
						if (x == "0")
						{
							this.setAttribute("check", "1");
							setCheck_ListMedia( id, 1);
						}	
						else if (x == "1")
						{
							this.setAttribute("check", "0");
							setCheck_ListMedia( id, 0);
							
							clear_Flag_SelectAll(  );  // убрать метку select all
							
						}
								
					}, false );
			}					  
			e4.title = media.source;
			e4.setAttribute("item", media.id.toString());			

			// -- size
			if ( mode != "link" )
			{
				var e5 =  fbc("item_size");
				e5.parentNode.removeAttribute("hidden");
				e5.textContent = "";	
				//e5.title = str_download_size(media.tsize);	
				
				if (media.size)
				{
					e5.textContent = str_download_size(media.size);
				}
				else
				{
					e5.setAttribute( "loading", 1 );
				
					GetThemAll.Utils.getSizeByUrl( media.url, function( size ){
					
														e5.removeAttribute( "loading" );
														if( size )
														{
															GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Attribute( tab.id, media.id, "size", size );		});
														
															e5.textContent = str_download_size( size );
														}
					
													} );				

				}
			}
			
			return item;
			
		}
		// ----------------------------------------------------   заполним строку иконками
		function buildThreadItemAlternative( media, mode ){
	
			function fbc( className ){
				return item.getElementsByClassName(className)[0];
			}
			
			var item = document.getElementById("download_icon_template").cloneNode( true );
			item.removeAttribute( "id" );
			
			var img =  fbc("info_img");
			img.src = media.url;
			img.title = media.title;

			img.addEventListener( "click", function( event ){

							chrome.tabs.create({
												url: media.url,
												active: false
											});
								
					}, false );
					
			img.addEventListener( "contextmenu", function( event ){

							Item_contextMenu( this.src );
			
						}, false );
					
					
			// -- select
			var elem_sel =  fbc("info_sel");
			if ( isYoutubeUrl(media.url) )
			{
				elem_sel.setAttribute("check", "5");
			}
			else
			{
				if ( media.vubor == 1) elem_sel.setAttribute("check", "1");
								  else elem_sel.setAttribute("check", "0");
								  
				elem_sel.addEventListener( "click", function( event ){

							var x = this.getAttribute("check");
							var id = parseInt( this.getAttribute("item") );
							if (x == "0")
							{
								this.setAttribute("check", "1");
								setCheck_ListMedia( id, 1);
							}	
							else if (x == "1")
							{
								this.setAttribute("check", "0");
								setCheck_ListMedia( id, 0);
							}
								
						}, false );
			}					  
			elem_sel.setAttribute("item", media.id.toString());			

			// -- size
			var elem_size =  fbc("info_size");
			elem_size.parentNode.removeAttribute("hidden");
			elem_size.textContent = "";	
				
			if (media.size)
			{
				elem_size.textContent = str_download_size(media.size);
			}
			else
			{
				elem_size.setAttribute( "loading", 1 );
			
				GetThemAll.Utils.getSizeByUrl( media.url, function( size ){
					
								elem_size.removeAttribute( "loading" );
								if( size )
								{
									GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Attribute( tab.id, media.id, "size", size );		});
														
									elem_size.textContent = str_download_size( size );
								}
					
							} );				
			}
					
			
		
			return item;
		}	
		// ----------------------------------------------------   
		function str_download_size( size ) {
		
			if (size<1024)    	 		 return size + "b";
			else if (size<1048576)    	 return GetThemAll.Utils.bytesToKb(size) + "Kb";
			else if (size<1073741824)    return GetThemAll.Utils.bytesToMb(size) + "Mb";
							else 	     return GetThemAll.Utils.bytesToGb(size) + "Gb";
		
		}
		
		// ----------------------------------------------------   заполним строку
		function buildThreadCount( counts ){
		
			document.getElementById("count_links").textContent  = "(" + counts.vlink.toString() + " of " + counts.link.toString() + ")";
			document.getElementById("count_images").textContent = "(" + counts.vimage.toString() + " of " + counts.image.toString()  + ")";
			document.getElementById("count_docs").textContent   = "(" + counts.vfile.toString() + " of " + counts.file.toString()  + ")";
			document.getElementById("count_videos").textContent = "(" + counts.vvideo.toString() + " of " + counts.video.toString()  + ")";
			
			var itog = counts.vlink + counts.vimage + counts.vfile + counts.vvideo;
			document.getElementById("total_count").textContent = "(" + itog.toString() + ")";
		}
		
		// ----------------------------------------------------   установка флага SelectAll
		function set_Flag_SelectAll(  ){

			// флаг SelectAll на страницу	
			var e = document.getElementById("head_all_sel");
			if ( document.getElementById("tab_links").getAttribute("checked") == "true"  && self.tabSelectAll_links == "1" )
			{
				e.setAttribute("check", "1");
			}	
			else if ( document.getElementById("tab_images").getAttribute("checked") == "true"  && self.tabSelectAll_images == "1" ) 
			{
				e.setAttribute("check", "1");
			}	
			else if ( document.getElementById("tab_docs").getAttribute("checked") == "true"    && self.tabSelectAll_docs == "1"  ) 
			{
				e.setAttribute("check", "1");
			}	
			else if ( document.getElementById("tab_videos").getAttribute("checked") == "true"  && self.tabSelectAll_videos == "1" ) 
			{
				e.setAttribute("check", "1");
			}	
			else
			{
				e.setAttribute("check", "0");
			}	
		}

		// ----------------------------------------------------   сброс флага SelectAll
		function clear_Flag_SelectAll(  ){

			// убрать метку select all
			var e = document.getElementById("head_all_sel");
			if (e)
			{
				var x = e.getAttribute("check");
				if ( x == "1")
				{
					e.setAttribute("check", "0");
					// флаг на страницу	
					if (document.getElementById("tab_links").getAttribute("checked") == "true") self.tabSelectAll_links = 0;
					else if (document.getElementById("tab_images").getAttribute("checked") == "true") self.tabSelectAll_images = 0;
					else if (document.getElementById("tab_docs").getAttribute("checked") == "true") self.tabSelectAll_docs = 0;
					else if (document.getElementById("tab_videos").getAttribute("checked") == "true") self.tabSelectAll_videos = 0;
				}
			}
		}
		
		// ---------------------------------------------------- перестроить дерево
		this.repaintThreadsList = function(){
		
			var mode = GetThemAll.Prefs.get( "gta.links_mode" );
			var sorting = GetThemAll.Prefs.get( "gta.links_sorting" );
			var view = _b(GetThemAll.Prefs.get( "gta.flag_image_preview" ));
			//var view = document.getElementById("flag_image_preview").checked;

			set_Flag_SelectAll( );
			
			threadsOfActiveMode( mode, sorting, function( threads ){
						if( threads )
						{
							if (view && mode == "image")
							{
								document.getElementById("download_block").style.display  = "none";
								document.getElementById("download_icon").style.display  = "block";
								
								var container = document.getElementById("download_icon_container");
								while( container.firstChild )
								{
									container.removeChild( container.firstChild );
								}
							}	
							else	
							{
								document.getElementById("download_block").style.display  = "block";
								document.getElementById("download_icon").style.display  = "none";
								
								var container = document.getElementById("download_item_container");
								while( container.firstChild )
								{
									container.removeChild( container.firstChild );
								}
							}	

//console.log(threads);						
							threads.forEach(function( thread ){
										try
										{
										
											var item = null;
											if (view && mode == "image")
											{
												item = buildThreadItemAlternative( thread, mode );	
												
												container.appendChild( item );				
											}	
											else
											{
												item = buildThreadItem( thread, mode );	
												
												container.appendChild( item );				
											}	
								
										}
										catch( ex )
										{
											console.log( ex );				
										}
									});
						}
					});
					
			// количественные данные
			if ( self.ListMedia != null )
			{
				buildThreadCount( { link: self.ListMedia.k_link, vlink: self.ListMedia.v_link,
									image: self.ListMedia.k_image, vimage: self.ListMedia.v_image,
									file: self.ListMedia.k_file, vfile: self.ListMedia.v_file,
									video: self.ListMedia.k_video, vvideo: self.ListMedia.v_video  } );	
			}
		}
		
		// ---------------------------------------------------- перестроить дерево
		this.rebuildThreadsList = function(){

			GetThemAll.Utils.getActiveTab( function( tab ) {
			
							if( !tab )
							{
								self.ListMedia = null;	
							}
							else
							{
								self.ListMedia = GetThemAll.Media.Storage.getLink( tab.id );
							}

							// убрать метку select all
							clear_Flag_SelectAll(  );
							
							// перерисовать
							self.repaintThreadsList();
						});	
						
		}	

		// ----------------------------------------------
		this.box_Youtube = function() {

			var mode = GetThemAll.Prefs.get( "gta.links_mode" );
			var x1 = document.getElementById("masterMain");
			var x2 = document.getElementById("messageBox");
			
			GetThemAll.Utils.getActiveTab(function( tab ){
			
									if ( GetThemAll.noYoutube && mode == "video" )
									{
										if (isYoutubeUrl(tab.url)) 
										{
											if (x1) x1.setAttribute( "hidden" );
											if (x2) x2.removeAttribute( "hidden" );
											return;
										}
									}
									if (x2) x2.setAttribute( "hidden" );
									if (x1) x1.removeAttribute( "hidden" );
								});
									
		}
		
		// ----------------------------------------------
		this.init = function(){		
		
			this.tabSelectAll_links = "0";
			this.tabSelectAll_images = "0";
			this.tabSelectAll_docs = "0";
			this.tabSelectAll_videos = "0";

			self.rebuildThreadsList();

			var now = new Date().getTime();

			chrome.extension.onMessage.addListener( function( request ) {
								if( request.subject == "mediaForTabUpdate" )
								{
									GetThemAll.Utils.getActiveTab( function( tab ){
												if( tab.id == request.data )
												{
													self.rebuildThreadsList();
												}
											});
								}
							} );

			// инициализируем форматы
			self.init_Format();
				
		}
		
		// ---------------------------------------------------- инициализируем форматы
		this.init_Format = function(){
		
			var mode = GetThemAll.Prefs.get( "gta.links_mode" );
		
			// ---- форматы
			var filters = document.getElementById("filter_block");
			var elems = filters.querySelectorAll( "input" );
			for (var i=0; i<elems.length; i++)
			{
				if ( elems[i].type=="checkbox" && elems[i].id.indexOf("filter_") != -1 )
				{
					var id = elems[i].getAttribute("id");
					var x = GetThemAll.Prefs.get( "gta."+id );
				
					if (x && x=="true") elems[i].setAttribute("checked","true");
				
					elems[i].addEventListener( "change", function(event){
								self.change_Format( this );		
							}, false );				
				}			
				if ( elems[i].type=="checkbox" && elems[i].id == "flag_image_preview" )
				{
					document.getElementById("flag_image_preview").checked  = _b(GetThemAll.Prefs.get( "gta.flag_image_preview" ));
				}
				if ( elems[i].type=="text" && elems[i].id == "filter_image_size" )
				{
					document.getElementById("filter_image_size").value  = GetThemAll.Prefs.get( "gta.filter_image_size" );
				}
			}
			
			// ---- фильтр по размеру
			var elem_size = document.getElementById("filter_image_size");
			const arrKey = [48,49,50,51,52,53,54,55,56,57,190,96,97,98,99,100,101,102,103,104,105,110,8,37,39,46];
			if (elem_size)
			{
				elem_size.addEventListener( "keydown", function(event){
				
								if (arrKey.indexOf(event.keyCode) == -1)
								{
									// отменить дальнейшую обработку
									event.returnValue = false;
									event.stopPropagation();
									event.preventDefault();
									return false;								
								}
				
							}, false );
				elem_size.addEventListener( "keyup", function(event){
									GetThemAll.Prefs.set( "gta.filter_image_size", this.value )
									self.repaintThreadsList();			
							}, false );
			}

			// ---- вид отображени€
			var elem_view = document.getElementById("flag_image_preview");
			if (elem_view)
			{
				elem_view.addEventListener( "change", function(event){
				
								var v = document.getElementById("flag_image_preview").checked;
								if (v)	GetThemAll.Prefs.set( "gta.flag_image_preview", "true" );
								else	GetThemAll.Prefs.set( "gta.flag_image_preview", "false" );
				
								self.repaintThreadsList();			
							}, false );
			}
			
			
			// ---- —ортировка
			var srtn = GetThemAll.Prefs.get( "gta.links_sorting" );
			if (mode == "link" && (srtn == "asc_size" || srtn == "desc_size") ) srtn == "none";
			var e1 = document.getElementById("sort_url");
			var e2 = document.getElementById("sort_descr");
			var e3 = document.getElementById("sort_size");
			if (srtn == "asc_url")
			{
				e1.setAttribute("sort", "asc");
				e2.setAttribute("sort", "none");
				e3.setAttribute("sort", "none");
			}
			else if (srtn == "desc_url")
			{
				e1.setAttribute("sort", "desc");
				e2.setAttribute("sort", "none");
				e3.setAttribute("sort", "none");
			}
			else if (srtn == "asc_title")
			{
				e2.setAttribute("sort", "asc");
				e1.setAttribute("sort", "none");
				e3.setAttribute("sort", "none");
			}
			else if (srtn == "desc_title")
			{
				e2.setAttribute("sort", "desc");
				e1.setAttribute("sort", "none");
				e3.setAttribute("sort", "none");
			}
			else if (srtn == "asc_size")
			{
				e3.setAttribute("sort", "asc");
				e2.setAttribute("sort", "none");
				e1.setAttribute("sort", "none");
			}
			else if (srtn == "desc_size")
			{
				e3.setAttribute("sort", "desc");
				e2.setAttribute("sort", "none");
				e1.setAttribute("sort", "none");
			}
			else
			{
				e1.setAttribute("sort", "none");
				e2.setAttribute("sort", "none");
				e3.setAttribute("sort", "none");
			}
		}	

		// ----------------------------------------------------   после выбора all - остальные сбрасываем
		function clear_format( tip ){

			// ---- форматы
			var filters = document.getElementById("filter_block");
			var elems = filters.querySelectorAll( "input" );
		
			for (var i=0; i<elems.length; i++)
			{
				var id = elems[i].getAttribute("id");
				if ( id.indexOf("filter_"+tip+"_all") != -1) continue; 
				if ( id.indexOf("filter_image_preview") != -1) continue; 
				if ( id.indexOf("filter_image_size") != -1) continue; 
				if ( id.indexOf("filter_"+tip) != -1)
				{
					elems[i].checked = false;
					GetThemAll.Prefs.set( "gta."+id , "false" );
				}	
			}
		
		}
		// ----------------------------------------------------   после отключени€ all - хоть один должен быть включен
		function set_one_format( tip ){

			// ---- форматы
			var filters = document.getElementById("filter_block");
			var elems = filters.querySelectorAll( "input" );
		
			for (var i=0; i<elems.length; i++)
			{
				var id = elems[i].getAttribute("id");
				if ( id.indexOf("filter_"+tip+"_all") != -1) continue; 
				if ( id.indexOf("filter_image_size") != -1) continue; 
				if ( id.indexOf("filter_"+tip) != -1) 
				{
					if ( elems[i].checked )   return;   // есть выбранна€ уходим
				}	
			}

			for (var i=0; i<elems.length; i++)
			{
				var id = elems[i].getAttribute("id");
				if ( id.indexOf("filter_"+tip+"_all") != -1) continue; 
				if ( id.indexOf("filter_image_size") != -1) continue; 
				if ( id.indexOf("filter_"+tip) != -1) 
				{
					elems[i].checked = true;
					GetThemAll.Prefs.set( "gta."+id , "true" );
					return;   
				}	
			}
		}
		
		
		// ---------------------------------------------------- инициализируем форматы
		this.change_Format = function( elem ){

			var id = elem.getAttribute("id");
			var x = elem.checked;
			if (x)	GetThemAll.Prefs.set( "gta."+id , "true" );
			else GetThemAll.Prefs.set( "gta."+id , "false" );
			
			// проверка на all
			if ( id == "filter_link_all" )
			{
				if ( x )		clear_format( "link" );
				else			set_one_format( "link" );
			}	
			else if ( id == "filter_image_all" )
			{
				if ( x )		clear_format( "image" );
				else			set_one_format( "image" );
			}	
			else if ( id == "filter_file_all" )
			{
				if ( x )		clear_format( "file" );
				else			set_one_format( "file" );
			}	
			else if ( id == "filter_video_all" )
			{
				if ( x )		clear_format( "video" );
				else			set_one_format( "video" );
			}
			else
			{
				if ( id.indexOf("link") != -1)
				{
					document.getElementById("filter_link_all").checked = false;
					GetThemAll.Prefs.set( "gta.filter_link_all" , "false" );
				}
				else if ( id.indexOf("image") != -1)
				{
					document.getElementById("filter_image_all").checked = false;
					GetThemAll.Prefs.set( "gta.filter_image_all" , "false" );
				}
				else if ( id.indexOf("file") != -1)
				{
					document.getElementById("filter_file_all").checked = false;
					GetThemAll.Prefs.set( "gta.filter_file_all" , "false" );
				}
				else if ( id.indexOf("video") != -1)
				{
					document.getElementById("filter_video_all").checked = false;
					GetThemAll.Prefs.set( "gta.filter_video_all" , "false" );
				}
			}	
			
			this.repaintThreadsList();			
			
		}
		// ---------------------------------------------------- перестроить список загрузок 
		this.DownloadList = function(){
		
			if (self.ListMedia.k_link>0) 
			{
				self.ListMedia.link.forEach( function( item ){
							if ( item.vubor == 1)
							{
								item.vubor == 0;		
								GetThemAll.Media.startDownload( item );							
								GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Status( tab.id, item.id, 0 );		});
							}	
						} );
			}			
			if (self.ListMedia.k_image>0) 
			{
				self.ListMedia.image.forEach( function( item ){
							if ( item.vubor == 1)
							{
								item.vubor == 0;		
								GetThemAll.Media.startDownload( item );							
								GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Status( tab.id, item.id, 0 );		});
							}	
						} );
			}			
			if (self.ListMedia.k_file>0) 
			{
				self.ListMedia.file.forEach( function( item ){
							if ( item.vubor == 1)
							{
								item.vubor == 0;		
								GetThemAll.Media.startDownload( item );							
								GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Status( tab.id, item.id, 0 );		});
							}	
						} );
			}			
			if (self.ListMedia.k_video>0) 
			{
				self.ListMedia.video.forEach( function( item ){
							if ( item.vubor == 1)
							{
								item.vubor == 0;		
								GetThemAll.Media.startDownload( item );		
								GetThemAll.Utils.getActiveTab( function( tab ){		GetThemAll.Media.Storage.setData_Status( tab.id, item.id, 0 );		});
							}	
						} );
			}			
			
			
			
		}
		// ---------------------------------------------------- перестроить список загрузок текущей закладки
		this.DownloadListTab = function(){
		
			var down = [];
		
			var container = document.getElementById("download_item_container");

			var elems = container.querySelectorAll( "div.item_sel" );
			for (var i=0; i<elems.length; i++)
			{
				var x = elems[i].getAttribute("check");
				if ( x == "1" )
				{
					elems[i].setAttribute("check", "0");
					var id = parseInt( elems[i].getAttribute("item") );
				
/*					GetThemAll.Utils.getActiveTab( function( tab ){
											GetThemAll.Media.Storage.setData_Status( tab.id, id, 0 );
										});*/
					down.push(id);						
				}	
			}	
			
			GetThemAll.Utils.getActiveTab( function( tab ){
			
											var media = GetThemAll.Media.Storage.getData_Media( tab.id, down );
											console.log(media);
											media.forEach( function( item ){
																GetThemAll.Media.startDownload( item );
															} );
											
										});
			
			
			
		}
		// ---------------------------------------------------- выделить все
		this.SelectAll = function(){
		
			var container = document.getElementById("download_item_container");
			var e = document.getElementById("head_all_sel");
			if (e)
			{
				var x = e.getAttribute("check");
				if ( x == "1")
				{
					e.setAttribute("check", "0");
					GetThemAll.Utils.getActiveTab( function( tab ){
								var elems = container.querySelectorAll( "div.item_sel" );
								for (var i=0; i<elems.length; i++)
								{
									var x = elems[i].getAttribute("check");
									if (x == "5") continue;
									
									elems[i].setAttribute("check", "0");
						
									var id = parseInt( elems[i].getAttribute("item") );
								    setCheck_ListMedia( id, 0);
								}
							});
					x = "0";
				}
				else
				{
					e.setAttribute("check", "1");
					GetThemAll.Utils.getActiveTab( function( tab ){
								var elems = container.querySelectorAll( "div.item_sel" );
								for (var i=0; i<elems.length; i++)
								{
									var x = elems[i].getAttribute("check");
									if (x == "5") continue;
									
									elems[i].setAttribute("check", "1");
						
									var id = parseInt( elems[i].getAttribute("item") );
								    setCheck_ListMedia( id, 1);
								}
							});
					x = "1";
				}
				
				// флаг на страницу	
				if (document.getElementById("tab_links").getAttribute("checked") == "true") this.tabSelectAll_links = x;
				else if (document.getElementById("tab_images").getAttribute("checked") == "true") this.tabSelectAll_images = x;
				else if (document.getElementById("tab_docs").getAttribute("checked") == "true") this.tabSelectAll_docs = x;
				else if (document.getElementById("tab_videos").getAttribute("checked") == "true") this.tabSelectAll_videos = x;
			}

		}
		// ---------------------------------------------------- выделить все
		this.SortMedia = function( tip ){
		
			if ( tip == "url" )
			{
				var e = document.getElementById("sort_url");
				var x = e.getAttribute("sort");
	
				if ( x == "none")
				{
					e.setAttribute("sort", "asc");
					GetThemAll.Prefs.set( "gta.links_sorting" ,  "asc_url" );
				}
				else if ( x == "asc")
				{
					e.setAttribute("sort", "desc");
					GetThemAll.Prefs.set( "gta.links_sorting" ,  "desc_url" );
				}
				else
				{
					e.setAttribute("sort", "none");
					GetThemAll.Prefs.set( "gta.links_sorting" ,  "none" );
				}
				var e1 = document.getElementById("sort_descr");
				e1.setAttribute("sort", "none");
				var e2 = document.getElementById("sort_size");
				e2.setAttribute("sort", "none");
			}
			else if ( tip == "descr" )
			{
				var e = document.getElementById("sort_descr");
				var x = e.getAttribute("sort");
				if ( x == "none")
				{
					e.setAttribute("sort", "asc");
					GetThemAll.Prefs.set( "gta.links_sorting" ,  "asc_title" );
				}
				else if ( x == "asc")
				{
					e.setAttribute("sort", "desc");
					GetThemAll.Prefs.set( "gta.links_sorting" ,  "desc_title" );
				}
				else
				{
					e.setAttribute("sort", "none");
					GetThemAll.Prefs.set( "gta.links_sorting" ,  "none" );
				}
				var e1 = document.getElementById("sort_url");
				e1.setAttribute("sort", "none");
				var e2 = document.getElementById("sort_size");
				e2.setAttribute("sort", "none");
			}
			else if ( tip == "size" )
			{
				var e = document.getElementById("sort_size");
				var x = e.getAttribute("sort");
				if ( x == "none")
				{
					e.setAttribute("sort", "asc");
					GetThemAll.Prefs.set( "gta.links_sorting" ,  "asc_size" );
				}
				else if ( x == "asc")
				{
					e.setAttribute("sort", "desc");
					GetThemAll.Prefs.set( "gta.links_sorting" ,  "desc_size" );
				}
				else
				{
					e.setAttribute("sort", "none");
					GetThemAll.Prefs.set( "gta.links_sorting" ,  "none" );
				}
				var e1 = document.getElementById("sort_url");
				e1.setAttribute("sort", "none");
				var e2 = document.getElementById("sort_descr");
				e2.setAttribute("sort", "none");
			}
			self.repaintThreadsList();
			
		}
		// ----------------------------------------------
		this.display_setting = function(){
			chrome.tabs.query( 	{
							url: chrome.extension.getURL( "/options.html" )
						}, function( tabs ){

									if( tabs.length > 0 )
									{
										foundTabId = tabs[0].id;
										chrome.tabs.update( foundTabId, {
																		active: true
																		} );
									}
									else
									{
										chrome.tabs.create( {	active: true,
																url: chrome.extension.getURL("/options.html")
															}, function( tab ){ }
														);
									}
					} );
		}
		// ----------------------------------------------
		this.openGetSatisfactionSuggestions = function(){
		
			window.open( "https://getsatisfaction.com/fvd_suite/topics/" );
			
		}
		// -----------------------------------------------	
		
	}
	
	this.Popup = new Popup();
	
}).apply( GetThemAll );
