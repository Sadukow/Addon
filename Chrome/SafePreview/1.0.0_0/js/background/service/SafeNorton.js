if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var SafeNorton = function(){

			const API_HREF_SERVICE_NORTON = "http://safeweb.norton.com/report/show?url=";
			const TIMEOUT_NORTON = 10000;
			this.norton = [];
		
			var self = this;

			// ====================================================
			this.read_Norton =  function( host, refresh ){
			
				if (refresh) this.norton[host] = null;
				
				if (this.norton[host] != null)
				{
					this.set_Norton(this.norton[host]);
					return null; 
				}	
				console.log('read_Norton: '+host);	
				
				var ajax = new XMLHttpRequest();
				var surl = API_HREF_SERVICE_NORTON + host;
				
				ajax.open('GET', surl);
				ajax.onreadystatechange = function()  {
							try
							{
								if  ( (this.readyState == 4) && (this.status == 200))
								{
									clearTimeout(self.NortonTimer);
									var e = ajax.responseText;
									var rr = '';
									rr = self.get_mezhdu_norton(e, 'class="ratingIcon ', '"', 20, 15000 );

									if ( rr == '' )
									{
										self.set_Norton( null );
										return null;
									}	
									
									self.norton[host]	= rr;
									SafePreview.Safe.write_Rez_Service(host, 'Norton', rr, new Date().getTime() );
									
									self.set_Norton(self.norton[host]);
									return status;
								}
							}
							catch (e) {}
						};
				ajax.onerror = function(){
							console.log("Norton - Error: "+host) 
							self.set_Norton( null );
							return null;
						};
				
				this.NortonTimer = setTimeout( function() { 
		
							console.log("Norton Time over: "+host) 
							ajax.abort();   
							self.set_Norton( null );
							return null;
							
						}, TIMEOUT_NORTON);
				ajax.send(null);
			}
			// --------------------------------------------------------------------------------------  с парсить результат
			this.get_mezhdu_norton = function( str, str1, str2, len, h )  {    

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
			this.get_Status_Norton = function( v )  {    
				if ( v == null) return 80;
				var status = 80;
				if ( v == 'icoSafe' ) status = 3;
				else if ( v == 'icoNSecured' ) status = 3;
				else if ( v == 'icoWarning' ) status = 2;
				else if ( v == 'icoCaution' ) status = 1;
				else if ( v == 'icoUntested' ) status = 0;
				else if ( v == 'captcha' ) status = 22;
				return status;
			}
			// ------------------------------------------------------------------  
			this.set_Norton =  function( v ){
				console.log('=rezult_Norton = ' + v);	
				
				var status = this.get_Status_Norton( v );
						
				SafePreview.Utils.getActiveTab( function( tab ){
												SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "setNorton",
															status: status
														} );
											});
			}
		}
		
		this.SafeNorton = new SafeNorton();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.SafeNorton = chrome.extension.getBackgroundPage().SafePreview.SafeNorton;
}
