if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var Safe = function(){

			const DISPLAY_FVDSD_HINT_EVERY = 3600 * 24 * 1 * 1000; // one day
		
			const EXTENSIONS = ["htm", "html", "zhtml", "zhtm", "shtml", "php", "asp", "aspx", "ashx"];
			const DEF = ["index.htm", "index.html", "index.php", "index.asp", "index.aspx", "index.ashx", "default.asp", "default.aspx", "default.ashx"];

			const DWNLD_EXT = ["flv", "ram", "mpg", "mpeg", "avi", "rm", "wmv", "mov", "asf", "mp3", "rbs", "movie", "divx", "mp4", "ogg", "mpeg4", "m4v", "webm", 
								"swf", "jpg", "jpeg", "gif", "png", "bmp", "tiff", "3gp", "ra", "rm", "mid", "wav", "aif",  "pdf", "exe", "apk", "dmg"
								];
			

			this.curr_url = null;
			this.curr_host = null;
			
			var self = this;

			// -----------------
			this.getPref = function( name ) {
				var val = localStorage[name];
				if ( val=="false" ) return false;
							   else return val;
			}
	
			// -----------------
			this.setPref = function(name, val) {
				localStorage[name] = val;
			}
			
			this.write_Rez_Service = function(host, srv, rez, dat) {
			    SafePreview.Storage.writeHost( {
										host: host,
										srv: srv,
										rez: rez,
										dat: dat
									}, function(result){	}
								 );
			}
			
			// -----------------
			this.init = function(){

				// Подключаемся к базе данных
				SafePreview.Storage.connect(  );

				// удаляем старые данные
				var current_dt = new Date();
				var current_time = current_dt.getTime();
				
				var t = SafePreview.Prefs.get("sp.scale_daily_history");
				var predel_time = current_time - DISPLAY_FVDSD_HINT_EVERY * t;
				SafePreview.Storage.deleteOldHost( predel_time, function(  ){  } );

				
				// Считываем данные по хостам				 
				if (SafePreview.SafeWOT.wot && SafePreview.SafeWOT.wot.length > 0) SafePreview.SafeWOT.wot.length = 0;
				if (SafePreview.SafeMcAfee.mcafee && SafePreview.SafeMcAfee.mcafee.length > 0) SafePreview.SafeMcAfee.mcafee.length = 0;
				if (SafePreview.SafeNorton.norton && SafePreview.SafeNorton.norton.length > 0) SafePreview.SafeNorton.norton.length = 0;
				if (SafePreview.SafeGoogle.google && SafePreview.SafeGoogle.google.length > 0) SafePreview.SafeGoogle.google.length = 0;
				if (SafePreview.SafeAvast.avast && SafePreview.SafeAvast.avast.length > 0) SafePreview.SafeAvast.avast.length = 0;
				if (SafePreview.SafeTrust.trust && SafePreview.SafeTrust.trust.length > 0) SafePreview.SafeTrust.trust.length = 0;
				if (SafePreview.SafeDrWeb.drweb && SafePreview.SafeDrWeb.drweb.length > 0) SafePreview.SafeDrWeb.drweb.length = 0;

				SafePreview.Storage.readHosts( function( h ){

									for( var k in h )
									{
										var host = h[k].host;	
										var srv = h[k].srv;	
										var rez = h[k].rez;
										var dat = h[k].dat;
										
										if (srv == 'WOT')				SafePreview.SafeWOT.wot[host] = rez;			
										else if (srv == 'McAfee')		SafePreview.SafeMcAfee.mcafee[host] = rez;			
										else if (srv == 'Norton')		SafePreview.SafeNorton.norton[host] = rez;			
										else if (srv == 'Google')		SafePreview.SafeGoogle.google[host] = rez;			
										else if (srv == 'Avast')		SafePreview.SafeAvast.avast[host] = rez;			
										else if (srv == 'Trust')		SafePreview.SafeTrust.trust[host] = rez;			
										else if (srv == 'DrWeb')		SafePreview.SafeDrWeb.drweb[host] = rez;			
										
									}
								} );
				
			
				chrome.tabs.onRemoved.addListener( function( tabId ){
				
							} );
				
				chrome.tabs.onUpdated.addListener( function( tabId, changeInfo ){
					
					
							} );
				
			}
			
			//==================================================================================================
			this.currentTab = function( url ){
				chrome.tabs.getSelected( null,  function(tab) { 
								chrome.tabs.update( tab.id, {		url: url	} );
							}); 			
			}
			
			this.newTab = function( url ){
				chrome.tabs.create({
					url: url,
					active: true
				});
			}
			
			this.backgroundTab = function( url ){
				chrome.tabs.create({
					url: url,
					active: false
				});				
			}
			//==================================================================================================
			//
			//		Проверка на выдвод иконок      
			//
			//================================================================================================== 
			this.isLink = function( url, loc ){
				// Проверить адрес на наличие javascript
				var url = this.get_JS_URL( url );
				if (url == "") return false;
				// Получить адрес  ссылки
				var url = this.getLinkURL( url, loc );
				if (url == "") return false;
				this.check_search( url,  function( new_url )  {
				
								var purl = self.parseURL(new_url);
								self.curr_url = new_url;
								self.curr_host = purl.hostname;
								// проверка на необходимость проверки, на исключаемые субдомены
								var flag_Safe = self.checkLinkTrusted( self.curr_url, self.curr_host );
								
								if (self.curr_url == url) 
													console.log('----isLink:('+flag_Safe +') <' + self.curr_host + '>    url= ' + self.curr_url);
								else 
													console.log('----isLink:('+flag_Safe +') <' + self.curr_host + '>    url= ' + self.curr_url  + '   old_url= '+url);	

								SafePreview.Utils.getActiveTab( function( tab ){
												SafePreview.ContentScriptController.processMessage( tab.id, {
																action: "show_Div",
																url: self.curr_url,
																host: self.curr_host,
																safe: flag_Safe,
																live: true
															} );
											});

							} );
				
			}
			// --------------------------------------------------------------------------------------------------------- Проверить на наличие конструкции javascrip:pp("...");
			this.get_JS_URL = function( url ){
				surl = url;
				if ( (url.toLowerCase().indexOf('javascript:') != -1) || (url.toLowerCase().indexOf('javascript :') != -1) )
				{
					var t = url.match(/\("(.*?)"\)/i);
					if (t)
					{
						surl = decodeURIComponent(t[1]);
					}
					else
					{
						var t = url.match(/\('(.*?)'\)/i);
						if (t)
						{
							surl = decodeURIComponent(t[1]);
						}
					}
					if (surl.indexOf("http") != -1)  return surl;
					
					return "";
				}
				return surl;
			}
			// --------------------------------------------------------------------------------------------------------- Получить адрес ссылки (ссылка, адрес страницы)	
			this.getLinkURL = function( url, loc ){

				if (url.indexOf("http") == -1)
				{  
					if ((url.charAt(0) == '/' && url.charAt(1) == '/') )	surl = "http:" + url;
					else if ((url.charAt(0) == ':' && url.charAt(1) == '/' && url.charAt(2) == '/') )	surl = "http" + url;
					else surl = "http://" + url;
					var purl = this.parseURL(surl);
					var ploc = this.parseURL(loc);
					purl.protocol = "";	
				}	
				else
				{
					var purl = this.parseURL(url);
					var ploc = this.parseURL(loc);
				}	

				var protocol = purl.protocol || ploc.protocol;			// http
				var hostname = purl.hostname || ploc.hostname;			// example.com

				// разбор путей
				var new_path = "";
				var pathname = purl.pathname;
				if (pathname != "")
				{
					if (pathname.charAt(0) == '/')
					{
						new_path = pathname;
					}	
					else if (pathname.charAt(0) == '.' && pathname.charAt(1) == '.')      // ../
					{
						// локалный путь
						if (ploc.pathname != "")
						{
							var arr_path = ploc.pathname.split('/');
							var k_path = arr_path.length;
						}
						else
						{
							var k_path = 0;
						}	
						k_path--;
						
						// посчитаем сколько таких
						var arr = purl.path.split('/');
	
						for (var i = 0;  i < arr.length; i++)
						{
							if (arr[i]=="..")
							{
								if (k_path>0) k_path--;
							}	
							else
							{
								arr_path[k_path] = arr[i];
								k_path++;
							}
						}	
						
						// соберем путь
						new_path = "";
						for (var i = 0;  i < k_path; i++)
						{
							new_path += (i==0 ? "" : "/" ) + arr_path[i];
						}
						if (purl.file)	new_path += "/" + purl.file;
						if (new_path.charAt(0) != '/')		new_path = "/" + new_path;
					}
					else if (pathname.charAt(0) == '.' && pathname.charAt(1) == '/')      // ./
					{
						// локалный путь - разложим
						if (ploc.pathname != "")
						{
							var arr_path = ploc.pathname.split('/');
							var k_path = arr_path.length;
						}
						else
						{
							var k_path = 0;
						}	
						// соберем путь - по новой кроме последнего
						new_path = "";
						for (var i = 0;  i < k_path-1; i++)
						{
							new_path += (i==0 ? "" : "/" ) + arr_path[i];
						}
						if (ploc.pathname.substring(ploc.pathname.length-1,ploc.pathname.length) == '/')		ploc.pathname = ploc.pathname.substring(0,ploc.pathname.length-1);
						new_path += pathname.substring(1);
					}
					else
					{
						// локалный путь - разложим
						if (ploc.pathname != "")
						{
							var arr_path = ploc.pathname.split('/');
							var k_path = arr_path.length;
						}
						else
						{
							var k_path = 0;
						}	
						// соберем путь - по новой кроме последнего
						new_path = "";
						for (var i = 0;  i < k_path-1; i++)
						{
							new_path += (i==0 ? "" : "/" ) + arr_path[i];
						}
						new_path += "/" + pathname;
					}
					pathname = new_path;
				}
				
				// параметры
				
				// hash	
				if (url.charAt(0) == '#')
				{
					pathname = ploc.pathname;			// example.com
				}
				
				url = protocol + "//" + hostname + pathname + purl.search + purl.hash;
				return url;
			}
			// --------------------------------------------------------------------------------------------------------- Парсер URL
			this.parseURL = function(url)	{
			
				var pattern =
					// Match #0. URL целиком (#0 - это HREF, в терминах window.location).
					// Например, #0 == "https://example.com:8080/some/path/index.html?p=1&q=2&r=3#some-hash"
					"^" +
					// Match #1 & #2. SCHEME (#1 - это PROTOCOL, в терминах window.location).
					// Например, #1 == "https:", #2 == "https"
					"(([^:/\\?#]+):)?" +
					// Match #3-#6. AUTHORITY (#4 = HOST, #5 = HOSTNAME и #6 = PORT, в терминах window.location)
					// Например, #3 == "//example.com:8080", #4 == "example.com:8080", #5 == "example.com", #6 == "8080"
					"(" +
							"//(([^:/\\?#]*)(?::([^/\\?#]*))?)" +
					")?" +
					// Match #7. PATH (#7 = PATHNAME, в терминах window.location).
					// Например, #7 == "/some/path/index.html"    
					"([^\\?#]*)" +
					// Match #8 & #9. QUERY (#8 = SEARCH, в терминах window.location).
					// Например, #8 == "?p=1&q=2&r=3", #9 == "p=1&q=2&r=3"    
					"(\\?([^#]*))?" +
					// Match #10 & #11. FRAGMENT (#10 = HASH, в терминах window.location).
					// Например, #10 == "#some-hash", #11 == "some-hash"
					"(#(.*))?" + "$";			
					
					
					//var pattern = "^(([^:/\\?#]+):)?(//(([^:/\\?#]*)(?::([^/\\?#]*))?))?([^\\?#]*)(\\?([^#]*))?(#(.*))?$";
				var rx = new RegExp(pattern);
				var parts = rx.exec(url);					
					
				var href = parts[0] || "";
				var protocol = parts[1] || "";			// http
				var host = parts[4] || "";				
				var hostname = parts[5] || "";			// example.com
				var port = parts[6] || "";
				var pathname = parts[7] || "/";			// /some/path/index.html
				var search = parts[8] || "";			// ?gst=2&
				var hash = parts[10] || "";				// #12
					
				// проверим не путь ли вместо хоста		
				if (hostname == "." || hostname == "..")
				{
					pathname = hostname + pathname;
					hostname = "";
				}
				if (hostname != "")
				{
					var arr = hostname.split('.');
					if (arr == null || arr.length == 1)
					{
						pathname = hostname + parts[7];
						hostname = "";
					}
					else if (arr.length == 2)
					{
						if (EXTENSIONS.indexOf(arr[1]) != -1)
						{
							pathname = hostname + parts[7];
							hostname = "";
						}	
					}
				}
				
				if (pathname != "")
				{
					var arr = pathname.split('/');
					var k = arr.length-1;
					var file = arr[k];
					if (file.indexOf('.') == -1)
					{
						k++;
						file = '';	
					}	
					var path = "";
					for (var i = 0;  i < k; i++)
					{
						path += (i==0 ? "" : "/" ) + arr[i];
					}	
				}
				return { protocol: protocol,  hostname: hostname,  pathname: pathname,  search: search,  hash: hash, path: path, file: file };
			}
			// --------------------------------------------------------------------------------------------------------- Собрать URL
			this.complitURL = function( arr )	{
				var x = arr.protocol + "//" + arr.hostname + arr.path + (arr.file != "" ? "/" : "") + arr.file;
				x += arr.search;
				if (arr.hash != "")
				{	
					x += (arr.search == "" ? "/" : "") + arr.hash;
				}	
				return x;
			}
			// -----------------------------------------------------------------------------------   проверка не является ли поисковым запросом
			this.check_search = function( url, callback )  {
				var purl = this.parseURL(url);

				// в параметрах	
				var par = purl.search;
				var arr = par.split('&');
				for (var i = 0;  i < arr.length; i++)
				{
					var x = arr[i] + '&';
					var t = x.match(/http(.*?)\&/i);
					if (t)
					{
						url = 'http'+t[1];
						url = decodeURIComponent(url);
						callback( url );
						return;
					}
				}

				// в hash
				var par = purl.hash;
				var arr = par.split('&');
				for (var i = 0;  i < arr.length; i++)
				{
					var x = arr[i] + '&';
					var t = x.match(/http(.*?)\&/i);
					if (t)
					{
						url = 'http'+t[1];
						url = decodeURIComponent(url);
						callback( url );
						return;
					}
				}

				// вызов	
				url = decodeURIComponent(url);
				callback( url );
			}	
			// -------------------------------------------------------------------------------- исключаем внутренние и проверенные адреса
			this.checkLinkTrusted = function( url, host )  {
	
				// если внутряння адресация
				if( (url.indexOf("http") == -1)  ||
					(url.indexOf("#")  == url.length-1)  ||
					(url.toLowerCase().indexOf("logout") != -1) ||
					(url.toLowerCase().indexOf("signin") !=-1) ||
					(url.toLowerCase().indexOf("login") !=-1) ||
					(url.toLowerCase().indexOf("signout") !=-1) )
				{
					return false;
				}

				// исключаемые домены
				var ignore = false;
				var domain = this.domain_chech_sub(host);
				var sdomain = false;
				if (domain != host) sdomain = true;    // есть субдомены
				var str_gems = SafePreview.Prefs.get("sp.goodsite")
				var gems = str_gems.split(';');
				
				gems.forEach(function( sign ){
				
						// разделим
						var arr = sign.split('.');

						var k = arr.length;
						if (arr[k-1] == '') return false;
						if (!arr[k-2] || arr[k-2] == '') return false;
						var gems_domain = arr[k-2] + '.' + arr[k-1];
						
						var gems_subd = false;
						if (arr[k-3] && arr[k-3] == '*') gems_subd = true;
				
						if( domain == gems_domain )       // исключаемый домен
						{
							if ( gems_subd )	// subdomain - тоже исключается	
							{
								ignore = true;
								return false;
							}
					
							if ( !sdomain)             // subdomain - на исходном хосте нет
							{
								ignore = true;
								return false;
							}
						}
					});
				
				if( ignore )			return false;
		
				return true;
			}
			// ----------------------------------------------------------------------------------- проверяем Preview
			this.checkLinkUrl = function( url )  {

				ext = SafePreview.Utils.extractExtension( url );

				if (DWNLD_EXT.indexOf(ext) != -1) 
				{
					return false;
				}	
		
				return true;
			}
			// ----------------------------------- выдление домена
			this.domain_chech_sub = function( str ){

				if (str == null) return '';				
				var arr = str.split('.');
		
				var k = arr.length;
				if (k < 3) return '';
		
				if (arr[k-1] == '') return '';
				if (!arr[k-2] || arr[k-2] == '') return '';
		
				var s = arr[k-2] + '.' + arr[k-1];
				return s;
			}
			//==================================================================================================
			//
			//		Проверка на на вирусы  (после нажатия иконки Safe - вызывается   (для того чтобы выполнить редирект)
			//
			//================================================================================================== 
			this.GetHostSafe = function( url, loc, x, y ){

				// проверка на редирект  http://reviews.cnet.com/software/kitcam-ios/4505-3513_7-35557026.html
				this.resolve( url,  function( url_redirect ) {

												var host = self.parseURL(url_redirect).hostname;
												
												SafePreview.Utils.getActiveTab( function( tab ){
																SafePreview.ContentScriptController.processMessage( tab.id, {
																			action: "show_Div_Safe",
																			url: url_redirect,
																			host: host,
																			x: x,
																			y: y
																		} );
																});
											} );
										
										
				
			}
			// ---------------------------------------------------------------------------------------------------
			this.resolve = function( url, callback )  {

				callback(url);
				
			}
			//==================================================================================================
			//
			//		Проверка на на вирусы  (после нажатия иконки Safe - вызывается   (для того чтобы выполнить редирект)
			//
			//================================================================================================== 
			this.uprstitLink = function( url )  {

				var purl = this.parseURL(url);

				if (purl.search != "")
				{
					purl.hash = "";
				}	

				if (purl.hash != "")
				{
					if ( (purl.hash.indexOf("=") == -1) && (purl.hash.indexOf("&") == -1) )  purl.hash = "";
				}	
				
				var s = this.complitURL( purl );
				
				return s;	
			}
			// ---------------------------------------------------------------------------------------------------
		}
		
		this.Safe = new Safe();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.Safe = chrome.extension.getBackgroundPage().SafePreview.Safe;
}
