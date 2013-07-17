// class describes downloads for specified window
(function(){

	SP_SINGLE_WEBCACHE = function(  ){

		var self = this;
		
		this.ajax_search = new XMLHttpRequest();
		this.webcacheTimer = null;

		const PERIOD_TIME_503 = 12 * 3600000; // 3 часа
		this.time503 = null;
			
		
		
		// -------------------------------------------------------------------------------------------
		this.GetDate_WebCache = function( url, callback ){

			if (this.time503)
			{
					var current_dt = new Date();
					var current_time = current_dt.getTime();
			
					if (current_time <	this.time503)
					{
						callback('', '');
						return;
					}
					else
					{
						this.time503 = null;
					}
			}	

			if (this.time503 == null)
			{
			
				var href_sig = 'http://webcache.googleusercontent.com/search?q=cache:<QUERY>';
				var surl = href_sig.replace("<QUERY>", sp_single.spLink.encode(url));
				
				this.request_search( url, surl, callback );
			}	

		}
			
		//==================================================================================================
		this.request_search = function( url, surl, callback ){

			sp_single.alert('SEARCH_WEBSTORE: ' + surl);

			this.ajax_search.open('GET', surl, true);
			this.ajax_search.setRequestHeader('Cache-Control', 'no-cache');
			this.ajax_search.responseType = 'document';
	
			this.ajax_search.onreadystatechange = function( data ){

								if  ( (self.ajax_search.readyState == 4) && (self.ajax_search.status == 200))
								{

									clearTimeout(self.webcacheTimer);  self.webcacheTimer=null;
								
									var doc = self.ajax_search.response;
									
									var srch = doc.getElementById( 'ires' );		
									if (srch) 
									{
										callback('', '');
										return;
									}
				
									var body = doc.getElementsByTagName( 'body' )[0];		
								
									div1 = body.firstChild;
									
									var text = "";
									var u = "";
									if (div1)
									{
										var a = div1.getElementsByTagName( 'a' )[0];		
										u = a.getAttribute("href");
									
										text = div1.textContent;
										text = text.substring(0,text.indexOf('GMT')+3);
										text = text.substring(text.lastIndexOf('.')+2);
										var k =	text.lastIndexOf(' ', text.length-20);
										text = text.substring(text.lastIndexOf(' ', k-1));
										if (text)
										{
											sp_single.alert("SUCCESS: webcache: "+text+ ' - ' + u);
										}
									}
									
									callback(text, u);
								}
								else if  ( (self.ajax_search.readyState == 4) && (self.ajax_search.status == 404))
								{
									self.ajax_search.abort();   
									clearTimeout(self.webcacheTimer);  self.webcacheTimer=null;
									callback('', '');
									return null;
								}
								else if  ( (self.ajax_search.readyState == 4) && (self.ajax_search.status == 503))
								{
									self.ajax_search.abort();   
									clearTimeout(self.webcacheTimer);  self.webcacheTimer=null;
									
									if (self.time503 == null)
									{
										var current_dt = new Date();
										var current_time = current_dt.getTime();
										self.time503 = current_time + PERIOD_TIME_503;
										callback('', '');
									}	
									return null;
								}
							}	
							
			this.ajax_search.onerror = function(){
							clearTimeout(self.webcacheTimer);  self.webcacheTimer=null;
							callback('', '');
							return null;
						};
				
			this.webcacheTimer = setTimeout( function() { 
		
							self.ajax_search.abort();   
							callback('', '');
							return null;
							
						}, 10000);

			this.ajax_search.send(null);
							
			return;
		}

			
	
		// =============================================================================================
		this.webcache_abort =  function(  ){
			
			sp_single.alert('Webcache_abort');
			this.ajax_search.abort();   
			
		}
		
		
		// =============================================================================================
	
	}	
})();
