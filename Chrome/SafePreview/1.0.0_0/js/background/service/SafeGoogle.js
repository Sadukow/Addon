if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var SafeGoogle = function(){

			const API_HREF_SERVICE_GOOGLE = "http://safebrowsing.clients.google.com/safebrowsing/diagnostic?site=";
			const TIMEOUT_GOOGLE = 10000;
		
			this.google = [];

			var self = this;

			// ==================================================================================
			this.advisory_Google =  function( url, host, refresh ){

				//console.log('advisory_Google: '+url+' - ' + host);	
				// проверяем url
				if (refresh)
				{
					this.google[url] = null;
					this.google[host] = null;
				}	

				this.read_Google( url, function( status ){  
					
													if (self.google[url] == "green")
													{
				
														self.read_Google( host, function( sts ){  
																						self.set_Google( sts, host );		
																					} ); 	 
													}
													else
													{
														self.set_Google( status, url );		
													}					
												} ); 	 
			}
			// ----------------------------------------
			this.read_Google =  function( url, callback ){

				console.log('read_Google: '+url);	
				
				if ( this.google[url] != null )
				{
					callback(this.google[url]);
				}
				
				var ajax = new XMLHttpRequest();
				var surl = API_HREF_SERVICE_GOOGLE + SafePreview.Link.encode(url) + "&hl=en";
				
				ajax.open('GET', surl);
				ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				ajax.setRequestHeader('Cache-Control', 'no-cache');
				ajax.responseType = 'document';
				
				ajax.onreadystatechange = function()  {
							try
							{
								if  ( (this.readyState == 4) && (this.status == 200))
								{
									clearTimeout(self.GoogleTimer);
									var doc = ajax.response;
									
									var blocks = doc.getElementsByTagName( 'blockquote' );		
									var block = blocks[0];
									
									var p = block.getElementsByTagName( 'p' );		
									
									var status = 0;
									if (p.length > 0)
									{
										if (p[0].textContent.indexOf( '-' ) != -1)
										{
											status = "red";
											msg = p[0].textContent;
											if (p.length > 1)
											{
												msg += "|"+p[1].textContent; 
											}	
										}
										else if (p.length > 1)
										{
											status = "yellow";
											msg = p[0].textContent;
											msg += "|"+p[1].textContent; 
										}	
										else
										{
											status = "green";
											msg = p[0].textContent;
										}
										if (msg == "") msg = p[0].textContent;
									}
									
									if ( status == 0 )
									{
										callback( null );
										return null;
									}	
									self.google[url]	= status + "|" + msg;
									SafePreview.Safe.write_Rez_Service(url, 'Google', self.google[url], new Date().getTime() );
									
									callback(self.google[url]);
									return self.google[url];
								}
							}
							catch (e) {}
						};
				ajax.onerror = function(){
							console.log("Google - Error: "+url) 
							callback( null );
							return null;
						};
				
				this.GoogleTimer = setTimeout( function() { 
		
							console.log("Google Time over: "+url) 
							ajax.abort();   
							callback( null );
							return null;
							
						}, TIMEOUT_GOOGLE);
				ajax.send(null);
			}
			// ---------------------------------------------------------------
			this.get_Status_Google = function( v )  {    
				if ( v == null) return { r: 80, m: null };
				var tmp = v.split("|");
				var rr = 80, mm = "";
			
				if ( tmp[0] == 'green' )
				{
					var div = "<b>"+tmp[1].replace(/is not/g, '<span style="color:#093;">is not</span>')+"</b>";
					return { r: 3, m: div }
				}	
				else if ( tmp[0] == 'yellow' )
				{
					var div = "<b>"+tmp[1].replace(/is not/g, '<span style="color:red; font-weight: bold;">is not</span>') 
					div += "</b><br><br>" + tmp[2].replace(/Part/g, '<b>Part</b>').replace(/was listed/g, '<b>was listed</b>').replace(/activity/g, 'activity<span style="color:red; font-weight: bold;">').replace(/over/g, '</span>over');
					return { r: 2, m: div }
				}	
				else if ( tmp[0] == 'red' ) 
				{
					var div = "<b>"+tmp[1].replace(/ is /g, '<span style="color:red;"> is </span>').replace(/may harm/g, '<span style="color:red;">may harm</span>')+"</b>";
					return { r: 1, m: div }
				}	
				
				return { r: 80, m: null };
			}
			// ------------------------------------------------------------------  
			this.set_Google =  function( v, u ){
				console.log('=rezult_Google = ' + v);	
				
				var status = this.get_Status_Google( v );
						
				SafePreview.Utils.getActiveTab( function( tab ){
												SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "setGoogle",
															status: status.r,
															msg: status.m,
															u: u
														} );
											});
			}
		}
		
		this.SafeGoogle = new SafeGoogle();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.SafeGoogle = chrome.extension.getBackgroundPage().SafePreview.SafeGoogle;
}
