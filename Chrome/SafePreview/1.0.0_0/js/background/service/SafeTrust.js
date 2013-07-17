if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var SafeTrust = function(){

			const TRUST_VERSION	= "3.603";
		
		
			const API_HREF_SERVICE_TRUST = "https://securebrowsing.m86security.com/advice/advise";
			const TIMEOUT_TRUST = 5000;
		
			this.trust = [];
			this.remoteAdviseCounter = 0;

			var self = this;

			// ==================================================================================
			this.advisory_Trust =  function( url, host, refresh ){

				console.log('advisory_Trust: '+url+' - ' + host);	
				// проверяем url
				if (refresh)
				{
					this.trust[url] = null;
				}	

				var postParams = { 'version': TRUST_VERSION, 'CATEGORIZE': 1, 'url0': url };			
				
				var postData = this.buildPostData(postParams);
				
				postData = postData.replace(/%0D%0A/gi, "");
				
				this.step = 1;
				this.read_Trust( url, postData, function( status ){  
				
													self.set_Trust( status, url );		
				
												} ); 	 
				
			}
			
			// ----------------------------------------
			this.buildPostData = function(paramMap) {
				var params = [];
				for (var paramName in paramMap) 
				{
					params[params.length] = paramName + '=' + encodeURIComponent(paramMap[paramName]);
				}
				return params.join('&');
			};

			this.step = 0;
			
			// ----------------------------------------
			this.read_Trust =  function( url, postData, callback ){

				if ( this.trust[url] != null )
				{
					callback(this.trust[url]);
					return this.trust[url];
				}
				
				var current_dt = new Date();
				var current_time = current_dt.getTime();				
				var urlData = "rnd=" + current_time + "&n=0&m=18&t=18&ref=Google";
				var surl =  API_HREF_SERVICE_TRUST + "?" + urlData;
				
				var xhr = new XMLHttpRequest();
				xhr.open("POST", surl, true);
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				
				xhr.onload = function(e) {
				
//console.log(xhr.status, xhr.response, xhr.getAllResponseHeaders ( ));									
									if ((xhr.status == 200) || (xhr.status == 0)) 
									{
										clearTimeout(self.TrustTimer);
										try 
										{
											var content = xhr.response;
									
											if (content)
											{
												var obj = JSON.parse(content);
												
												if (obj && obj.url0)
												{
													var cat = obj.url0.category;	
													var rea = obj.url0.reason;	
													var sta = obj.url0.state;	
						
													if (sta == 'URLCAT_Only' && self.step < 7)
													{
														self.step ++;
														setTimeout(function() {   
																	self.read_Trust( url, postData, callback ); 	 
																},  500 );
													}
													else
													{
														self.trust[url]	= sta + "|" + cat + "|" + rea;
														SafePreview.Safe.write_Rez_Service(url, 'Trust', self.trust[url], new Date().getTime() );
									
														callback(self.trust[url]);
														return self.trust[url];
													}	
												}	
												else
												{
												
													if (self.step < 7)
													{
														self.step ++;
														setTimeout(function() {   
																	self.read_Trust( url, postData, callback ); 	 
																},  500 );
													}
													else
													{		
														callback( null );
														return null;
													}
												}
											}
											else
											{
												callback( null );
												return null;
											}
										} 
										catch (e) 
										{
											console.log("Invalid advice results received: " + e);
											callback( null );
											return null;
										}
									}
								}
				xhr.onerror = function() {
									clearTimeout(self.TrustTimer);
									callback( null );
								}
				xhr.ontimeout = function() {
									callback( null );
								}
				this.TrustTimer = setTimeout( function() { 
		
							console.log("Trust Time over: "+url) 
							xhr.abort();   
							callback( null );
							return null;
							
						}, TIMEOUT_TRUST);

				xhr.send(postData);

			}
			// ---------------------------------------------------------------
			this.get_Status_Trust = function( v )  {    
				if ( v == null) return { r: 80, m: null };
				var tmp = v.split("|");
				var rr = 80, mm = "";
			
				if ( tmp[0] == 'empty' ) rr = 40;
				else if ( tmp[0] == 'URLCAT_Only' ) rr = 41;
				else if ( tmp[0] == 'spinner' )  rr = 41;
				else if ( tmp[0] == 'safe' ) rr = 42;
				else if ( tmp[0] == 'unsafe' ) rr = 43;
				else if ( tmp[0] == 'unknown' )  rr = 44;
				else if ( tmp[0] == 'question' )  rr = 45;
				
				return { r: rr, m: tmp[1] };
			}
			// ------------------------------------------------------------------  
			this.set_Trust =  function( v, m, u ){
				console.log('=rezult_Trust = ' + v);	
				
				var status = self.get_Status_Trust( v );
						
				SafePreview.Utils.getActiveTab( function( tab ){
												SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "setTrust",
															status: status.r,
															msg: status.m,
															u: u
														} );
											});
			}
		}
		
		this.SafeTrust = new SafeTrust();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.SafeTrust = chrome.extension.getBackgroundPage().SafePreview.SafeTrust;
}
