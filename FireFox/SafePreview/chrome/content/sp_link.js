// class describes downloads for specified window
(function(){

	SP_SINGLE_LINK = function(  ){

		const EXTENSIONS = ["htm", "html", "zhtml", "zhtm", "shtml", "php", "asp", "aspx", "ashx"];
		const DEF = ["index.htm", "index.html", "index.php", "index.asp", "index.aspx", "index.ashx", "default.asp", "default.aspx", "default.ashx"];

		const DWNLD_EXT = ["flv", "ram", "mpg", "mpeg", "avi", "rm", "wmv", "mov", "asf", "mp3", "rbs", "movie", "divx", "mp4", "ogg", "mpeg4", "m4v", "webm", 
								"swf", "jpg", "jpeg", "gif", "png", "bmp", "tiff", "3gp", "ra", "rm", "mid", "wav", "aif",  "pdf", "exe", "apk", "dmg"
								];

		
		var self = this;
		this.curr_url = null;
		this.curr_host = null;
		this.branch = null;
		
		this.init = function( b )
		{
			this.branch = b;
		}
		
		//===============================================================================================================
		//
		//		                             ПРОВЕРКА ПЕРЕД ПОКАЗОМ ИКОНКИ
		//
		//===============================================================================================================
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
								var flag_Preview = self.checkLinkUrl( self.curr_url );
								
								if (self.curr_url == url) 
													sp_single.alert('----isLink:('+flag_Safe + '/' + flag_Preview +') <' + self.curr_host + '>    url= ' + self.curr_url);
								else 
													sp_single.alert('----isLink:('+flag_Safe + '/' + flag_Preview +') <' + self.curr_host + '>    url= ' + self.curr_url  + '   old_url= '+url);	

								sp_single.sendEvent({	"a": "show_Div", 
															"url": self.curr_url,
															"host": self.curr_host,
															"safe": flag_Safe,
															"preview": flag_Preview,
															"live": true
														});
							} );
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
		
			var str_gems = this.branch.getCharPref("single.text_goodsite");
			var gems = str_gems.split('|');
			gems.forEach(function( sign ){
		
					var items = sign.split('-');
				
					if( domain == items[0] )       // исключаемый домен
					{
						if (items[1] == '*')	// subdomain - тоже исключается	
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
		
			var x = this.extractFileNameFromUrl( url );
				
			if (x == null) return true;	
				
			if (DWNLD_EXT.indexOf(x.extension) != -1) 
			{
				return false;
			}	
		
			return true;
		}
		// ----------------------------------------------------------------------------------- 
		this.extractFileNameFromUrl = function( url ){
			try
			{
				url = decodeURIComponent(url);
				url = url.split( "?" )[0];
				var tmp = url.split( /[\/\s]+/ );
				var filename = tmp[tmp.length - 1];
				
				if( !filename )		return null;
				
				tmp = filename.split(".");
				
				var ext = null;
				
				if( tmp.length > 1 )	ext = tmp[tmp.length - 1];	
				
				if( !ext )	return null;
				
				return  {	"filename": filename,	"extension": ext	};	
			}
			catch( ex )
			{
				return null;
			}
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
		// -------------------------------------------------------------------------------------------


		// -------------------------------------------------------------------------------------------
		
		// -----  закрываем окно  --------------------------------------------------------------------------------------
		this.initPreviewHide = function(  )  {   
		
			this.hidePreviewDivTimer = window.setTimeout(function(){ 	self.hidePreview( );  },  100 );
		
		}
		
		this.Run_initPreviewHide = function( t )  {   
		
		
		}
		
		// -------------------------------------------------------------------------------------------
		this.hidePreview = function(  )  {   
		
							
		}
		//===============================================================================================================
		//
		//		                             ФУНКЦИИ ДЛЯ РАБОТЫ СО ССЫЛКАМИ
		//
		//===============================================================================================================
		// --------------------------------------------------------------------------------------------------------- Проверить на наличие конструкции javascrip:pp("...");
		this.get_JS_URL = function( url ){
			
			surl = url;
			if ( (url.indexOf('javascript:') != -1) || (url.indexOf('javascript :') != -1) )
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
		// --------------------------------------------------------------------------------------------------------- Получить хост
		this.gethostname = function(url)	{
			try 
			{
				if (!url || !url.length) 	return null;
				var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

				var parsed = ios.newURI(url, null, null);
			
				if (!parsed || !parsed.host ||	!this.issupportedscheme(parsed.scheme))   return null;

				var host = parsed.host.toLowerCase();

				if (!host) 	return null;

				while (this.isequivalent(host)) 
				{
					host = host.replace(/^[^\.]*\./, "");
				}
				return host;
			} 
			catch (e) {		}

			return null;
		}
		// --------------------------------------------------------------------------------------------------------- Парсер URL
		this.parseURL = function(url)	{
			
			var pattern = "^(([^:/\\?#]+):)?(//(([^:/\\?#]*)(?::([^/\\?#]*))?))?([^\\?#]*)(\\?([^#]*))?(#(.*))?$";
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
		// --------------------------------------------------------------------------------------------------------- Собрать URL
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
		//================================================================================================== запросить данные
		this.compare_url =  function( url1, url2 ){
		
			if (url1 == url2)  return true;
				
			// в нижний регистр	
			url1 = url1.toLowerCase();
			url2 = url2.toLowerCase();
			if (url1 == url2)  return true;

			// основные символы	
			url1 = url1.replace( /\&amp;/ig, "&" );
			url2 = url2.replace( /\&amp;/ig, "&" );
			if (url1 == url2)  return true;

			url1 = decodeURIComponent(url1);
			url2 = decodeURIComponent(url2);
			if (url1 == url2)  return true;

			// распарсим адреса
			var p1 = sp_single.spLink.parseURL(url1);
			var p2 = sp_single.spLink.parseURL(url2);
				
			// проверка хостов
			p1.hostname = p1.hostname.replace("www.","");
			p2.hostname = p2.hostname.replace("www.","");
			if (p1.hostname != p2.hostname) return false;
				
			// проверка пути
			// уберем с обоих концов /
			if (p1.path.substring(p1.path.length-1,p1.path.length) == '/')   p1.path = p1.path.substring(0,p1.path.length-1);
			if (p2.path.substring(p2.path.length-1,p2.path.length) == '/')   p2.path = p2.path.substring(0,p2.path.length-1);
			if (p1.path != p2.path) return false;
				
			if (DEF.indexOf(p1.file) != -1)  p1.file = '';
			if (DEF.indexOf(p2.file) != -1)  p2.file = '';
			if (p1.file != p2.file) return false;

			// сверка параметров
			if (p1.search != p2.search) return false;
				
			// hash
			if (p1.search != "")	p1.hash = "";
			if (p1.search != "")	p1.hash = "";
			if (p1.hash != "")		{			if ( (p1.hash.indexOf("=") == -1) && (p1.hash.indexOf("&") == -1) )  p1.hash = "";				}	
			if (p2.hash != "")		{			if ( (p2.hash.indexOf("=") == -1) && (p2.hash.indexOf("&") == -1) )  p2.hash = "";				}	
			if (p1.hash != p2.hash) return false;
				
			return true;	
		}
		//================================================================================================== 
		this.encode =  function( str ){

			str = (str + '').toString();
			str = str.replace(/&amp;/g, '&');
				
			return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+').replace(/\+/g, '%2520');

		}	
		// =============================================================================================
		this.get_JSON_imgs =  function( val ){

			var x = '"' + name + '"\s*:\s*"([^\"]+?)"';
			var rxe = new RegExp( x, 'i');
			var m  = rxe.exec(val);
			if (m)	return m[1];
			return null;

		}	
			
		
		// ================================================================================================
		this.Pokazat = function( url )  {   

			sp_single.alert('Preview-Pokazat');
	
		}
	
	}	
})();
