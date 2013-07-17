if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var Link = function(){

			const TWIT = ["t.co", "bit.ly", "tinyurl.com", "is.gd", "ofa.bo", "soa.li"];
			
			var regimTest = true;
			var self = this;
		
			this.resolveTimer = null;
			this.redirectTimer = null;
            this.requestId = null;
            this.lastUrl = null;

			// -------------------------------------------------------------------------------
			this.encode64 = function(inputStr) 			{
				var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
				var outputStr = "";
				var i = 0;
   
				while (i<inputStr.length)
				{
					//all three "& 0xff" added below are there to fix a known bug with bytes returned by xhr.responseText
					var byte1 = inputStr.charCodeAt(i++) & 0xff;
					var byte2 = inputStr.charCodeAt(i++) & 0xff;
					var byte3 = inputStr.charCodeAt(i++) & 0xff;

					var enc1 = byte1 >> 2;
					var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
	  
					var enc3, enc4;
					if (isNaN(byte2))
					{
						enc3 = enc4 = 64;
					}
					else
					{
						enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
						if (isNaN(byte3))
						{
							enc4 = 64;
						}
						else
						{
							enc4 = byte3 & 63;
						}
					}

					outputStr +=  b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
				} 
   
				return outputStr;
			}

			// -------------------------------------------------------------------------------
			this.decode_unicode = function(inputStr)  {
			
				function Escape_win ( s ) {
					var s = s.toUpperCase();
					switch (s) 
					{
						case "U0430":  return "а";		case "U0431":  return "б"; 		case "U0432":  return "в";
						case "U0433":  return "г"; 		case "U0434":  return "д";		case "U0435":  return "е";		case "U0451":  return "ё";		case "U0436":  return "ж";		case "U0437":  return "з";		case "U0438":  return "и";
						case "U0439":  return "й";		case "U043A":  return "к";		case "U043B":  return "л";		case "U043C":  return "м";		case "U043D":  return "н";		case "U043E":  return "о";		case "U043F":  return "п";
						case "U0440":  return "р";		case "U0441":  return "с";		case "U0442":  return "т";		case "U0443":  return "у";		case "U0444":  return "ф";		case "U0445":  return "х";		case "U0446":  return "ц";
						case "U0447":  return "ч";		case "U0448":  return "ш";		case "U0449":  return "щ";		case "U044A":  return "ъ";		case "U044B":  return "ы";		case "U044C":  return "ь";		case "U044D":  return "э";
						case "U044E":  return "ю";		case "U044F":  return "я";		case "U0410":  return "А";		case "U0411":  return "Б";		case "U0412":  return "В";		case "U0413":  return "Г";		case "U0414":  return "Д";
						case "U0415":  return "Е";		case "U0401":  return "Ё";		case "U0416":  return "Ж";		case "U0417":  return "З";		case "U0418":  return "И";		case "U0419":  return "Й";		case "U041A":  return "К";
						case "U041B":  return "Л";		case "U041C":  return "М";		case "U041D":  return "Н";		case "U041E":  return "О";		case "U041F":  return "П";		case "U0420":  return "Р";		case "U0421":  return "С";
						case "U0422":  return "Т";		case "U0423":  return "У";		case "U0424":  return "Ф";		case "U0425":  return "Х";		case "U0426":  return "Ц";		case "U0427":  return "Ч";		case "U0428":  return "Ш";
						case "U0429":  return "Щ";		case "U042A":  return "Ъ";		case "U042B":  return "Ы";		case "U042C":  return "Ь";		case "U042D":  return "Э";		case "U042E":  return "Ю";		case "U042F":  return "Я";
					} 
				}
				function E_win ( s ) {
					console.log(s);
					return s;
				}	

				outputStr = inputStr.replace(/(\s)?([\d\w\u0410-\u044F\u0401\u0451]+)(\s)?/g, function(i) {  
																						return function() {
											console.log(arguments);
																	//							var x = E_win(arguments[2]);
																	//							return x;
																							};
																					}(0));
			
				//return outputStr;
				return inputStr;
			}
			
			// ==========================================================================================================	
			this.encode =  function( str ){

				str = (str + '').toString();
				str = str.replace(/&amp;/g, '&');
				
				return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+').replace(/\+/g, '%2520');

			}	
			this.get_JSON_imgs =  function( val ){

				var x = '"' + name + '"\s*:\s*"([^\"]+?)"';
				var rxe = new RegExp( x, 'i');
				var m  = rxe.exec(val);
				if (m)	return m[1];
				return null;

			}	
	
			// =============================================================================================
			this.Redirect_TWIT = function( url, host, callback ){
		
				var purl = SafePreview.Safe.parseURL(url);
			
				if (TWIT.indexOf(purl.hostname.toLowerCase()) != -1)
				{
					this.RedirectGet( url, function(surl) { 
										
										self.Redirect_TWIT( surl, host, callback );
										
									} );  
				}
				else
				{
					callback( url, host );
				}	
			}
			// --------------------------------------------------------------------------------------
			// Редирект по содержимому страницы
			this.RedirectGet = function( url, callback )  {

				try
				{
					var x = new XMLHttpRequest();
					x.open( "GET", url );
					x.setRequestHeader("AllowAutoRedirect", true);
					

					x.onreadystatechange = function(){

								if  ( (x.readyState == 4) && (x.status == 200) )
								{
									clearTimeout(self.redirectTimer);
									var content = x.responseText;

									var t = content.match(/location.replace\("(.*?)"\)/i);
									
									var surl = url;
									if (t != null)
									{
										surl = t[1].replace( /\\\//ig, "/" );
										
										if (url != surl)	console.log('REDIRECT_GET: ' + url + ' => ' + surl);
												else		console.log('REDIRECT_GET - No');
									
										callback( surl );
									}
									else
									{
										callback(url);
									}
								}
							}
				
					this.redirectTimer = setTimeout( function() { 
								x.abort();   
								callback(url);
							}, 3000);
				
					x.send( null );
				}
				catch (e) 	
				{	
					callback(url);	
				}	
			}
			// --------------------------------------------------------------------------------------
			this.Redirect = function( url, callback )  {

                this.requestId = null;
                this.lastUrl = url;

                function _listener( data ){
				
                    if( self.requestId )
					{
                        if( self.requestId == data.requestId )          self.lastUrl = data.url;
                    }
                    else
					{
						if (url.substring(0,100) == data.url.substring(0,100)) 		self.requestId = data.requestId;
						else if (url.toLowerCase() == data.url.toLowerCase()) 		self.requestId = data.requestId;
                    }
                }

                chrome.webRequest.onHeadersReceived.addListener(    _listener, 
																	{    urls: ["<all_urls>"], 
																		types: ["xmlhttprequest"]
																	}, 
																	["responseHeaders"]);

				try
				{
					var x = new XMLHttpRequest();
					x.open( "GET", url );
					x.setRequestHeader("AllowAutoRedirect", true);
					

					x.onreadystatechange = function(){

							if( x.readyState == 2 )
							{
								clearTimeout(self.resolveTimer);
                                x.abort();
								
                                chrome.webRequest.onHeadersReceived.removeListener(_listener);

								if (url != self.lastUrl)
								{
									console.log('REDIRECT: ' + url + ' => ' + self.lastUrl);
									callback( self.lastUrl );
								}	
								else
								{
									console.log('REDIRECT - No result - '+url);
									callback( url );
								}	
							}
						}
				
					this.resolveTimer = setTimeout( function() { 
								x.abort();   
								callback(url);
							}, 5000);
				
					x.send( null );
				}
				catch (e) 	
				{	
					callback(url);	
				}	
			}
			//================================================================================================== запросить данные
			const DEF = ["index.htm", "index.html", "index.php", "index.asp", "index.aspx", "index.ashx", "default.asp", "default.aspx", "default.ashx"];
			
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
				var p1 = SafePreview.Safe.parseURL(url1);
				var p2 = SafePreview.Safe.parseURL(url2);
				
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
			// =============================================================================================
			
		}
		
		this.Link = new Link();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.Link = chrome.extension.getBackgroundPage().SafePreview.Link;
}
