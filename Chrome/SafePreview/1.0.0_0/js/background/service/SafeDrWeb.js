if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var SafeDrWeb = function(){

			const API_HREF_SERVICE_DRWEB = "http://online.us.drweb.com/result/?lng=en&chromeplugin=1&url=";
			const TIMEOUT_DRWEB = 10000;
			this.drweb = [];
		
			var self = this;

			// ====================================================
			this.read_DrWeb =  function( url, host, refresh ){
			
				if (refresh) this.drweb[url] = null;
				
				if (this.drweb[url] != null)
				{
					this.set_DrWeb(this.drweb[url], url);
					return null; 
				}	
				console.log('read_DrWeb: '+url);	
				
				var ajax = new XMLHttpRequest();
				var surl = API_HREF_SERVICE_DRWEB + SafePreview.Link.encode(url);
				
				ajax.open('GET', surl);
				ajax.onreadystatechange = function()  {
							try
							{
								if  ( (this.readyState == 4) && (this.status == 200))
								{
									clearTimeout(self.DrWebTimer);
									var e = ajax.responseText;
									
									var rr = '';
									rr = self.get_mezhdu_drweb(e, '<img align="right"', '.gif', 75, 2000 );
									if ( rr != '' )
									{
										var p = rr.lastIndexOf('/');
										rr = rr.substr(p+1);
									}	

									if ( rr == '' )
									{
										self.set_DrWeb( null, url );
										return null;
									}	
									
									self.drweb[url]	= rr;
									SafePreview.Safe.write_Rez_Service(url, 'DrWeb', rr, new Date().getTime() );
									
									self.set_DrWeb(self.drweb[url], url);
									return status;
								}
							}
							catch (e) {}
						};
				ajax.onerror = function(){
							console.log("DrWeb - Error: "+url) 
							self.set_DrWeb( null, url );
							return null;
						};
				
				this.DrWebTimer = setTimeout( function() { 
		
							console.log("DrWeb Time over: "+url) 
							ajax.abort();   
							self.set_DrWeb( null, url );
							return null;
							
						}, TIMEOUT_DRWEB);
				ajax.send(null);
			}
			// --------------------------------------------------------------------------------------  с парсить результат
			this.get_mezhdu_drweb = function( str, str1, str2, len, h )  {    

				var text;
				var p = str.indexOf( str1, h );
				if ( p == -1 ) p = str.indexOf( str1 );
		
				if (  p != -1)  
				{
					if (len == 0)  text = str.substr(p + str1.length);
						else text = str.substr(p + str1.length, len);
			
					p = text.indexOf( str2 );
					if (  p != -1)  
					{
						text = text.substr(0, p);
						return text.trim();
					}
				}
				else
				{
					p = str.indexOf("<div class='simple_captcha_image'>");
					return 'captcha';
				}
				return '';
			}	
			// -----------------------------------------------------------------------------------
			this.get_Status_DrWeb = function( v )  {    
				if ( v == null) return 80;
				var status = 80;
				if ( v == 'clean_en' ) status = 3;
				else if ( v == 'icoNSecured' ) status = 3;
				else if ( v == 'icoWarning' ) status = 2;
				else if ( v == 'icoCaution' ) status = 1;
				else if ( v == 'icoUntested' ) status = 0;
				return status;
			}
			// ------------------------------------------------------------------  
			this.set_DrWeb =  function( v, url ){
				console.log('=rezult_DrWeb = ' + v);	
				
				var status = this.get_Status_DrWeb( v );
						
				SafePreview.Utils.getActiveTab( function( tab ){
												SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "setDrWeb",
															status: status,
															url: API_HREF_SERVICE_DRWEB + SafePreview.Link.encode(url)
														} );
											});
			}
		}
		
		this.SafeDrWeb = new SafeDrWeb();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.SafeDrWeb = chrome.extension.getBackgroundPage().SafePreview.SafeDrWeb;
}
