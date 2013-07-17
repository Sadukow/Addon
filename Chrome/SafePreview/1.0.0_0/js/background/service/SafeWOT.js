if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var SafeWOT = function(){

			const API_HREF_SERVICE_WOT = "http://api.mywot.com/0.4/public_query2?url=http://";
			const TIMEOUT_WOT = 10000;
			
			this.wot = [];
		
			var self = this;

			//==================================================================================================
			//
			//		Запрос к сервисам  WOT, McAfee, Norton
			//
			//================================================================================================== 
			this.read_WOT =  function( host, refresh ){
			
				if (refresh) this.wot[host] = null;
			
				if (this.wot[host] != null)
				{
					this.set_WOT(this.wot[host]);
					return null; 
				}	
				console.log('read_WOT: '+host);	
				
				var ajax = new XMLHttpRequest();
				var surl = API_HREF_SERVICE_WOT + host + '/';
				
				ajax.open('GET', surl);
				ajax.onreadystatechange = function()  {
							try
							{
								if  ( (this.readyState == 4) && (this.status == 200))
								{
									clearTimeout(self.WOTTimer);
									elems = ajax.responseXML.getElementsByTagName( 'application' );		

									var rr = '';
		
									for( var i = 0; i != elems.length; i++ )
									{
										var name = elems[i].getAttribute("name") ;
										var r = elems[i].getAttribute("r") ;
										var c = elems[i].getAttribute("c") ;
										
										if ( name == 0) 
										{			
											rr = r + '-' + c;
											break;
										}
									}
									if ( rr == '')
									{
										self.set_WOT( null );
										return null;
									}	
									
									self.wot[host]	= rr;
									SafePreview.Safe.write_Rez_Service(host, 'WOT', rr, new Date().getTime() );
									
									self.set_WOT(self.wot[host]);
									return { r: status.r, c: status.c, v: status.v };
								}
							}
							catch (e) {}
						};
				ajax.onerror = function(){
							console.log("WOT - Error: "+host) 
							self.set_WOT( null );
							return null;
						};
				
				this.WOTTimer = setTimeout( function() { 
		
							console.log("WOT Time over: "+host) 
							ajax.abort();   
							self.set_WOT( null );
							return null;
							
						}, TIMEOUT_WOT);
				ajax.send(null);
			}	
			// ---------------------------------------------------------------
			this.get_Status_WOT = function( v )  {    
				if ( v == null) return { r: 80, c: 24, v: 0 };
				var tmp = v.split("-");
				var rr = 80, cc = 60;
				if (tmp[0] >= 0) rr = 51;
				if (tmp[0] > 20) rr = 52;
				if (tmp[0] > 40) rr = 53;
				if (tmp[0] > 60) rr = 54;
				if (tmp[0] > 80) rr = 55;
			
				if (tmp[1] >=  6) cc = 61;
				if (tmp[1] >= 12) cc = 62;
				if (tmp[1] >= 23) cc = 63;
				if (tmp[1] >= 34) cc = 64;
				if (tmp[1] >= 45) cc = 65;
			
				return { r: rr, c: cc, v: tmp[1] };
			}
			// ------------------------------------------------------------------  
			this.set_WOT =  function( v ){
				console.log('=rezult_WOT = ' + v);	
				
				var status = this.get_Status_WOT( v );
						
				SafePreview.Utils.getActiveTab( function( tab ){
												SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "setWOT",
															status: status
														} );
											});
			}
			
		}
		
		this.SafeWOT = new SafeWOT();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.SafeWOT = chrome.extension.getBackgroundPage().SafePreview.SafeWOT;
}
