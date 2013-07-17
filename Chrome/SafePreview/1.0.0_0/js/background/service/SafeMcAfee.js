if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var SafeMcAfee = function(){

			const API_HREF_SERVICE_MCAFEE = "http://www.siteadvisor.com/sites/";
			const TIMEOUT_MCAFEE = 10000;
			
			this.mcafee = [];
			var self = this;

			// ==================================================================================
			this.read_McAfee =  function( host, refresh ){

				if (refresh) this.mcafee[host] = null;
			
				if (this.mcafee[host] != null)
				{
					this.set_McAfee(this.mcafee[host]);
					return null; 
				}	
				console.log('read_McAfee: '+host);	
				
				var ajax = new XMLHttpRequest();
				var surl = API_HREF_SERVICE_MCAFEE + host;
				
				ajax.open('GET', surl);
				ajax.onreadystatechange = function()  {
							try
							{
								if  ( (this.readyState == 4) && (this.status == 200))
								{
									clearTimeout(self.McAfeeTimer);
									var e = ajax.responseText;
									var rr = '';
									rr = self.get_mezhdu_mcafee(e, '-xbg2', '/images/', 20, 10000 );

									if ( rr == '' )
									{
										self.set_McAfee( null );
										return null;
									}	
									self.mcafee[host]	= rr;
									SafePreview.Safe.write_Rez_Service(host, 'McAfee', rr, new Date().getTime() );
									
									self.set_McAfee(self.mcafee[host]);
									return status;
								}
							}
							catch (e) {}
						};
				ajax.onerror = function(){
							console.log("McAfee - Error: "+host) 
							self.set_McAfee( null );
							return null;
						};
				
				this.McAfeeTimer = setTimeout( function() { 
		
							console.log("McAfee Time over: "+host) 
							ajax.abort();   
							self.set_McAfee( null );
							return null;
							
						}, TIMEOUT_MCAFEE);
				ajax.send(null);
			}
			// ------------------------------------------------------------------  с парсить результат
			this.get_mezhdu_mcafee = function( str, str1, str2, len, h )  {    
		
				var text;
				var p = str.indexOf( str1, h );
				if ( p == -1 ) p = str.indexOf( str1 );
		
				if (  p != -1)  
				{
					if (len == 0)
					{
						text = str.substr(0, p);
						p = text.lastindexOf( str2 );
						if (  p != -1)  
						{
							text = text.substr(p + str2.length);
							return text.trim();
						}
					}	
					else
					{
						text = str.substr(p - len, len);
						p = text.indexOf( str2 );
						if (  p != -1)  
						{
							text = text.substr(p + str2.length);
							return text.trim();
						}
					}	
				}	
				return '';
			}	
			// ---------------------------------------------------------------
			this.get_Status_McAfee = function( v )  {    
				if ( v == null) return 80;
				var status = 80;
				if ( v == 'green' ) status = 3;
				else if ( v == 'yellow' ) status = 2;
				else if ( v == 'red' ) status = 1;
				else if ( v == 'grey' ) status = 0;
				return status;
			}
			// ------------------------------------------------------------------  
			this.set_McAfee =  function( v ){
				console.log('=rezult_McAfee = ' + v);	
				
				var status = this.get_Status_McAfee( v );
						
				SafePreview.Utils.getActiveTab( function( tab ){
												SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "setMcAfee",
															status: status
														} );
											});
			}
			
			// ---------------------------------------------------------------------------------------------------
		}
		
		this.SafeMcAfee = new SafeMcAfee();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.SafeMcAfee = chrome.extension.getBackgroundPage().SafePreview.SafeMcAfee;
}
