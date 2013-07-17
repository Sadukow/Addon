if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var SafeAvast = function(){

			const TIMEOUT_AVAST = 10000;
		
			const API_AVAST_SERVICE_SERVER = "http://ui.ff.avast.com";
			const API_AVAST_SERVICE_PORT = "80";
			const API_AVAST_SERVICE_URLINFO = "urlinfo";

			const API_AVAST_SERVICE_HEADERS = {
									//"Accept": "binary",
									//dataType: 'binary',
									"Content-Type": "application/octet-stream",
								};

			const CONFIG_CALLERID = 4;
        	const CONFIG_GUID = null;
        	const CONFIG_USERID = null;

			
			const DEFAULTS_URLINFO_MASK_webrep = 1;
            const DEFAULTS_URLINFO_MASK_phishing = 2;
			
								
			this.avast = [];

			var self = this;

			this.options = {
					url : null,
					visited : true,
					server : null,
					method : "post",
					webrep : true,
					phishing : true,
					blocker : false,
					typo : false,
					callback : null,
					format : "object",	  
					go : true			   
				}

			this.completed = false;
			
			this.headers = {};
			
			
			
			// ==================================================================================
			this.UrlInfo =  function( download, callback ){

				this.options.url = download;
				this.options.server = API_AVAST_SERVICE_SERVER+":"+API_AVAST_SERVICE_PORT+"/"+API_AVAST_SERVICE_URLINFO;
				this.options.method = "post";
				this.options.callback = function(r){  
								callback(r);
							}
		
				this.request = new AvastWRC.gpb.All.UrlInfoRequest.Request;
				this.response = new AvastWRC.gpb.All.UrlInfoRequest.Response;
				this.init();
			}	
			
			// ==================================================================================
			this.init =  function(  ){
				this.headers = API_AVAST_SERVICE_HEADERS;
				// Populate proto message
				this.message();
				// Send it to server
				if(this.options.go) this.post();  
			}
			
			// ==================================================================================
			this.message =  function(  ){

				//this.request.uri.push(PROTO.encodeUTF8(this.options.url));
				if(typeof this.options.url == "string")  this.request.uri.push(PROTO.encodeUTF8(this.options.url));
													else this.request.uri = this.options.url;
													
				this.request.callerid = PROTO.I64.fromNumber(CONFIG_CALLERID);
	  
				//this.request.identity = this.identity(); 
				//this.request.visited = this.options.visited; // bool

				// Requested service bitmask  (webrep 1, phishing 2) - webrep always, phishing not in multiple requested
				var requestedServices = new AvastWRC.Utils.BitWriter(0);
				requestedServices.addBitmask(DEFAULTS_URLINFO_MASK_webrep);
				if(this.options.visited) requestedServices.addBitmask(DEFAULTS_URLINFO_MASK_phishing);
				this.request.requestedServices = requestedServices.getValue();

				return this;		
			}
			
			// ==================================================================================
			this.identity =  function(  ){
				var msg = new AvastWRC.gpb.All.Identity;
				if (CONFIG_GUID !== null) 
				{
					msg.guid = PROTO.encodeUTF8(CONFIG_GUID);
				}
				
				if (CONFIG_USERID !== null) 
				{
					msg.userid = PROTO.encodeUTF8(CONFIG_SERID);
				}
				
				msg.browserType = AvastWRC.gpb.All.BrowserType[AvastWRC.Utils.Browser.get("browser")];
	
				return msg;
			}
			
			// ==================================================================================
			this.post =  function(  ){

				var buffer = this.getBuffer(this.request);

				var self = this;
				var xhr = new XMLHttpRequest();
				xhr.open(this.options.method.toUpperCase(), this.options.server, true);
				xhr.responseType = "arraybuffer";
				xhr.withCredentials = true;
        
				for(var prop in this.headers) 
				{
					xhr.setRequestHeader(prop, this.headers[prop]);
				}
		
				xhr.onload = function(e) {
//console.log('----------------xhr.response------', xhr.response );
									clearTimeout(self.AvastTimer);
									self.callback(xhr.response);
								}
				xhr.onerror = function() {
									clearTimeout(self.AvastTimer);
									self.error(xhr);
								}
				xhr.ontimeout = function() {
									self.error(xhr);
								}
				this.AvastTimer = setTimeout( function() { 
		
							console.log("Avast Time over: ") 
							xhr.abort();   
							self.error(xhr);
							return null;
							
						}, TIMEOUT_AVAST);
								
//console.log(' buffer =', buffer );
				xhr.send(buffer);
		
				return this;
			}

			// ==================================================================================
			this.getBuffer =  function( message ){
	
				var stream = new PROTO.ByteArrayStream;
				message.SerializeToStream(stream);
				return this.baToab(stream.getArray())
			}

			// ==================================================================================
			this.baToab =  function( data ){

				var buf = new ArrayBuffer(data.length);

				var bytes = new Uint8Array(buf);
				for(var i = 0; i < bytes.length; i++) 
				{
					bytes[i] = data[i] % 256;
				}
				return buf;
			}
			this.abToba =  function( arrayBuffer ){
			
				if(arrayBuffer == null) return new Array();
				var bytes = new Uint8Array(arrayBuffer);
				var arr = new Array();
				
				for(var i = 0; i < bytes.length; i++)			arr[i] = bytes[i] % 256;
        
				return arr;
			}

			// ==================================================================================
			this.callback =  function( arrayBuffer ){
				this.parser(arrayBuffer);
				
				this.options.callback(this.response);
  
				this.completed = true;
			}

			// ==================================================================================
			this.error =  function( xhr ){
				//if(this.options.error) this.options.error(xhr)
				this.options.callback(null);
			}

			// ==================================================================================
			this.parser =  function( arrayBuffer ){
				this.response.ParseFromStream(new PROTO.ByteArrayStream(this.abToba(arrayBuffer)));
			}

			// ==================================================================================
			this.format =  function(  ){
				return { error : "This call has now formatting message.", message: this.response };
			}


			
			// ==================================================================================
			this.advisory_Avast =  function( url, host, refresh ){

				console.log('read_Avast: '+url+' - ' + host);	
				// проверяем url
				if (refresh)
				{
					this.avast[url] = null;
				}	
				
				if ( this.avast[url] != null )
				{
					this.set_Avast( this.avast[url], host );		
					return;
				}
				
				
				
				
				var download = [];

                download.push(url);

				this.UrlInfo( download, function( info ){     
				
//									console.log(info);
									if (info)
									{
										var url_info = info.values_.urlInfo[0];
										var phishing = url_info.values_.phishing.values_;
										var webrep = url_info.values_.webrep.values_;
				
										self.avast[url]	= webrep.rating + "|" + webrep.weight;
										SafePreview.Safe.write_Rez_Service(url, 'Avast', self.avast[url], new Date().getTime() );
									
										self.set_Avast( self.avast[url], host );		
									}
									else
									{
										self.set_Avast( null, host );		
									}	
				
								} );
				
			}
			// ---------------------------------------------------------------
			this.get_Status_Avast = function( v )  {    
				if ( v == null) return 70;
				var tmp = v.split("|");
				var rr = 70;
				
				var rating = tmp[0];
				var weight = tmp[1];
				
				if ( (rating > 0) && (rating <= 33) )
				{
					rr = 77;
				}	
				else if ( (rating > 33) && (rating <= 66) )
				{
					rr = 74;
				}	
				else if ( rating > 66 )
				{
					rr = 71;
				}	
				
				if (rating > 0)
				{
					if (weight > 33)  rr++;
					if (weight > 66)  rr++;
				}
				
				return rr;
			}
			
			
			
			// ------------------------------------------------------------------  
			this.set_Avast =  function( v, m, u ){
				console.log('=rezult_Avast = ' + v);	
				
				var status = this.get_Status_Avast( v );
						
				SafePreview.Utils.getActiveTab( function( tab ){
												SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "setAvast",
															status: status,
															u: u
														} );
											});
			}
			
			
			
			
		}
		
		this.SafeAvast = new SafeAvast();
		
	}).apply( SafePreview );
	
}
else
{
	SafePreview.SafeAvast = chrome.extension.getBackgroundPage().SafePreview.SafeAvast;
}
