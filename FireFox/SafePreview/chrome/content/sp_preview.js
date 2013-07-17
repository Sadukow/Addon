// class describes downloads for specified window
(function(){

	SP_SINGLE_PREVIEW = function(  ){

		const API_HREF_PREVIEW = "http://5.9.39.41:5000/";
		
		const TWIT = ["t.co", "bit.ly", "tinyurl.com", "is.gd", "ofa.bo", "soa.li"];
	
		const TIMEOUT_GOOGLE = 10000;
		const TITLE_MAX_LENGTH  = 40;
		const URL_MAX_LENGTH  = 40;
		const FILE_IMAGES = {
				// loading
				19:  "data:image/gif;base64,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",
				// close
				21:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHlJREFUKFN9yLEKQjEQRNH7UwELwcbCxsbCxsJGsBAe+YP99JFlCEkevNzTzC6VGlUHosIWmxaCn9b4KmVe+5uPkvOeL94yN6/ES81Y//JU1xp/PNS1xh93NWP9y03m5pW4Kjnv+eKilHntb85a4xQnLQSFEkUHovAHCSFtTmUA7vgAAAAASUVORK5CYII=",
				// setting
				23:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAMAAAC3SZ14AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJEREM3N0RBNzRGNjExRTJBOUFBRkQ1RkI5NDhDQ0ZCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJEREM3N0RCNzRGNjExRTJBOUFBRkQ1RkI5NDhDQ0ZCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkREQzc3RDg3NEY2MTFFMkE5QUFGRDVGQjk0OENDRkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkREQzc3RDk3NEY2MTFFMkE5QUFGRDVGQjk0OENDRkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4EQG1iAAACB1BMVEWnp6cJCQkfHx/MzMxxcXHd3d36+vrb29uUlJTR0dGLi4shISHt7O329vahoaGqqqr08vNiYmLg4OD8/PwkJCSJiYkzMzPi4uLj4uP39/e5ubnu7u66uro4ODiTk5O9u7zq6uptbW35+fnNy8mura7s7Oyvr6+jo6PX1tXv7u/29PV9fX3W1dXU0tSamplwcHC5trnv7+/4+Ph1dXXOzs3j4+Px7/LPzc7p6erCwL/MzM0mJibPz9Dc3Nx4eHiurq67ubnQ0M5HR0crKyt/f3/Pz8+BgYEKCgra2tplZWVUVFSurqyIiIjS0tPv7+/IxsiRkZGpqaqdnZ17e3vZ2Nfz8/SEhIQYGBgaGhopKSkoKChSUFF0dHQuLi5TU1PKysiDg4PLycpzc3PAvr0/Pz/W1dSZmZmPj5Dn5+etra3w8PAwMDD///+vrq/U1NTS0tH09PT19fXPzc3q6eqpqKnS0M+MjIyYmJg5OTnOzs/t7e3RztDl5eXt7e6FhYXQ0NBLS0vY19i0tLNgYGBjY2S4uLhJSUmSkpJBQUFAQEDY1dYsLCzX1ta+vLvx8fHy8vLNzc3Rz9DZ2drd2tucmptQUFARERF8fHzExMTu7u+hoaMcHBwtLS2ampo9PT2Ghoarq6m1tbTQzs8bGxsUFBQXFxe/v75ycnL39fbMysjDwMLj4OP///9M6tViAAAArXRSTlP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AP1FBPAAAAEwSURBVHjaTM5TcwNQEAXgG9ts0LDm1LaR2rZt27btdn9k722SafZld74zs3MQaK8i5j4BD+dByCIbQdNoL1M7gs/Zj5QcLzMmGbQ/M7vjbSTfmNSbpIBiwuF6yMjIItT8UlmR6ok0napjvmpKjSUklPpKlW8hWoFhadgaycc07V7feMabR4KJtUtRXpwPMDXFtR5gZO8j6NKJMqzqKAhS3v91wCUUaezCPsN2x221BBwk07knSB5Lv2vOaU4iI6UneQefgisxekqik3fdXGhwMTM2sCHsxPefFHLK2+qTZexI7KTE1h2KkEV//xqYEdtpYV1JpeProsXin19GiLGi520e4NSPu3e3/EOIW1d1009+2LIRrS2AkLmcYm8CHFMuu8j+Pt1RCA7HkQDgV4ABAKFRmwrByb+HAAAAAElFTkSuQmCC",
				// внимание
				81:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE4NzJDRkJEOTk2MTExRTI5QkIzOEZGRkZCMDA1NEEyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE4NzJDRkJFOTk2MTExRTI5QkIzOEZGRkZCMDA1NEEyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTg3MkNGQkI5OTYxMTFFMjlCQjM4RkZGRkIwMDU0QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTg3MkNGQkM5OTYxMTFFMjlCQjM4RkZGRkIwMDU0QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5+C9RlAAAAtUlEQVR42mL8//8/AzmABZlz+A7D/51XGRg2X0ZV5KvLwOCuzcBgq8LACBNjhNm4/DTD/46d+G2pcGdgiDSFaGaC2YSu6WINBCMDkBqQWrjGPdeJ9xtMLdip+i0MJIUQ0CWMTHgkMZyKDJgYyASUaQwzJl4DTC04ATirMzCsOouqABhgWAFILdxGCyUGxgYfwraB1IDUoqQcEDj7kOH/3psMDEtPoWqINoPYZCyPJcmRCgACDABHnzuD0KeUZwAAAABJRU5ErkJggg==",
				// close	
				82:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJCNkM5NjE3OTk2MTExRTJCNTgyOTdENEIxRTEyNEQyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJCNkM5NjE4OTk2MTExRTJCNTgyOTdENEIxRTEyNEQyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkI2Qzk2MTU5OTYxMTFFMkI1ODI5N0Q0QjFFMTI0RDIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkI2Qzk2MTY5OTYxMTFFMkI1ODI5N0Q0QjFFMTI0RDIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4gbz/9AAAA30lEQVR42mI8Y2zMAAVsQJwGxCFAbAkVOw7Ea4B4FhD/AgkwQjVIA/EWIDZgwA4uALEPED9lgpq8HY9iBqgcSA0bE9QZuiBR5e5uBm5tbbgqThUVBtVJk2BckJo0kIZwmMizmTMZFFtawJpAikEGgMSQQDjIDz+hzoKbClIIAvdrahi+Xr2KrOEXEwNpAKzhLLrpIJPvlpbCnYcELoM0rITxpNLT4c74fucOWBNIDAmsBPkB5P4zsJDCAy4DsQkTNAY9oQL4FHsie/opSDcQFwDxQSSFR6BiJlA1DAABBgCXDkIfNxmW5wAAAABJRU5ErkJggg==",
			};
		const DEF = ["index.htm", "index.html", "index.php", "index.asp", "index.aspx", "index.ashx", "default.asp", "default.aspx", "default.ashx"];
	
	
		var regimTest = true;
		var self = this;
		
		this.thumbtoolTimer = null;
		this.thumbtoolShowNull = null;
			
		this.ajax_thumbtool = new XMLHttpRequest();
		this.Thumbnail_abort = false;
			
		this.curHref = null;
		this.curWebCache = null;
		
		this.resolveTimer = null;
		this.redirectTimer = null;
		this.isShowingThumbnailPreview = false;
		this.isShowingThumbnailPreviewNo = false;

		this.hideThumbnailPreviewTimer = null;
		this.hideThumbnailPreviewNoTimer = null;

		this.click_fullDivTipThumbnail = false;

		
		// -------------------------------------------------------------------------------------------
		this.ShowThumbnail = function( url, host ){
			
			sp_single.alert('ShowThumbnail: ' + url);
			this.Thumbnail_abort	= false;
			
			// Открываем окно в режиме Loading
			this.Loading_Thumbnail( url, host );
			// Через 12 сек показываем не удачу
			this.thumbtoolShowNull = setTimeout( function() { 
							sp_single.alert('thumbtool - TIMEOUT');
							self.show_Thumbnail( url, host, null );
							self.thumbtool_abort();
						}, 12000);

			// Облегчить запрос
			url = sp_single.spLink.uprstitLink( url );
											
			// проверка на редирект  
			//this.request_head( url );
//			this.resolve( url, function(u) {  
//						} );

			// запрос
			this.Search_Thumbnail( url, host );


			// адреса типа twitter
/*			this.Redirect_TWIT( url, host, function(surl, hhost) {  

											if (url != surl) self.Loading_Thumbnail( surl, hhost );
			
											self.Search_Thumbnail( surl, hhost );
			
										} );*/

		}
		// --------------------------------------------------------------------------------------
		this.Search_Thumbnail = function( url, host ){
			sp_single.alert('Search_Thumbnail: '+url+ ' -- '+host);				

			this.Search_Task(url, function( obj ) {  

							if (obj)
							{

								self.Search_Task_Thumbnail( obj, url, host );	
											
							}
							else
							{
								self.show_Thumbnail( url, host, null );
							}	
				
						} );
			
		}	
		// -----------------
		this.Search_Task_Thumbnail = function( obj, url, host ){
			
			self.Thumbnail(obj.id, function( rez ) {  
								
								clearTimeout(self.thumbtoolShowNull);  self.thumbtoolShowNull=null;
								if (rez)
								{
									rez.title = obj.title;
									
									// покажем картинку
									self.show_Thumbnail( obj.url, host, rez );
													
									// повторение
									if (!rez.done)
									{
										var i = 0;
										var intervalID = setInterval(function(){

															i++;
															if (i>10) clearInterval(intervalID);
										
															self.Thumbnail(obj.id, function( rez ) {  
													
																				if (rez)
																				{
																					if (rez.done) clearInterval(intervalID);
																					
																					rez.title = obj.title;
																					self.show_Thumbnail( obj.url, host, rez );
																				}
													
																			});
								
														}, 1000 * obj.repeat);
									}
								}
								else
								{
									self.show_Thumbnail( url, host, null );
								}
							});
		}
		// -------------------------------------------------------------------------------
		this.Search_Task = function( url, callback ){

			sp_single.alert('Search_Task: '+url);

			var href_sig = API_HREF_PREVIEW + '?url=<QUERY>';
			var surl = href_sig.replace("<QUERY>", url);
				
			this.ajax_thumbtool.open('GET', surl, true);
			this.ajax_thumbtool.overrideMimeType('text/plain; charset=x-user-defined'); 
			this.ajax_thumbtool.setRequestHeader('Cache-Control', 'no-cache');
	
			this.ajax_thumbtool.onreadystatechange = function()  {
							try
							{
								if  ( (self.ajax_thumbtool.readyState == 4) && (self.ajax_thumbtool.status == 200))
								{
									clearTimeout(self.thumbtoolTimer);  self.thumbtoolTimer=null;
									var content = self.ajax_thumbtool.responseText;
									
									if (content)
									{
										var obj = JSON.parse(content);		
										callback({ url: obj.last_url, id: parseInt(obj.task_id), captcha: 0, title: obj.title, repeat: obj.repeat_time });
										return;
									}
								}
							}
							catch (e) 
							{
								sp_single.alert(e);									
								callback( null );
							}	
						}		
			this.ajax_thumbtool.onerror = function( data ){
							clearTimeout(self.thumbtoolTimer);  self.thumbtoolTimer=null;
							sp_single.alert('ajax_thumbtool - ERROR');
							callback( null );
							return null;
						};

			this.thumbtoolTimer = setTimeout( function() { 
		
							sp_single.alert('ajax_thumbtool - TIMEOUT');
							self.ajax_thumbtool.abort();   
							callback( null );
							return null;
							
						}, 10000);
				
				
			this.ajax_thumbtool.send(null);
				
			return;
		}
			
		// -----------------------------------------------------------------------------------
		this.Thumbnail = function( id, callback ){

			var current_dt = new Date();
			var current_time = current_dt.getTime();
			var href_sig = API_HREF_PREVIEW + 'image?task_id=<QUERY>&t='+current_time;
			var surl = href_sig.replace("<QUERY>", id);
				
			this.ajax_thumbtool.open('GET', surl, true);
			this.ajax_thumbtool.overrideMimeType('text/plain; charset=x-user-defined'); 
			this.ajax_thumbtool.setRequestHeader('Cache-Control', 'no-cache');
	
			this.ajax_thumbtool.onreadystatechange = function( e )  {
							try
							{
								if  ( (self.ajax_thumbtool.readyState == 4) && (self.ajax_thumbtool.status == 200))
								{
									clearTimeout(self.thumbtoolTimer);  self.thumbtoolTimer=null;
									var binResp     = self.encode64 (self.ajax_thumbtool.response );									

									if (binResp)
									{	
										var h = [];
										h.push( 600 );

										var img = [];
										img.push( 'data:image/jpeg;base64,' + binResp );

//sp_single.alert(self.ajax_thumbtool.getAllResponseHeaders());	
										var x = self.ajax_thumbtool.getResponseHeader('done');									
										
										var d = false;
										if (x != null) d = true;
										
										sp_single.alert('SUCCESS: thumbnail: ' , d, img);	
										
										var r = { count: 1, height: h, images: img, title: "", done: d, captcha: 0 };
										callback ( r );
										return r;   
									
									}
									callback(null);	
								}
							}
							catch (e) 
							{
								sp_single.alert(e);
								callback( null );
				  			}	
						}		

			this.ajax_thumbtool.onerror = function( data ){
							clearTimeout(self.thumbtoolTimer);  self.thumbtoolTimer=null;
							sp_single.alert('ajax_thumbtool - ERROR');
							callback( {captcha: 1, url: surl } );
							return null;
						};
				
			this.thumbtoolTimer = setTimeout( function() { 
		
							sp_single.alert('ajax_thumbtool - TIMEOUT');
							self.ajax_thumbtool.abort();   
							callback( null );
							return null;
							
						}, 10000);
				
				
			this.ajax_thumbtool.send(null);
				
			return;
		}
		// -------------------------------------------------------------------------------
		this.encode64 = function(inputStr) 
		{
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
		
		// --------------------------------------------------------------------------------------
		this.Redirect_TWIT = function( url, host, callback ){
		
			var purl = sp_single.spLink.parseURL(url);
			
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
		this.Loading_Thumbnail = function( url, host ){
			this.showThumbnailPreviewLoading(url);
		}
		// --------------------------------------------------------------------------------------
		this.Search_Thumbnail_google = function( url, host ){

			// запрос к Webcache
			sp_single.spWebcache.GetDate_WebCache( url, function( str, url_webcache ) {  

							// кеш дает ответ - значит есть результат
							if (str)
							{
								self.show_Webcache( str );
								
								// запрос за картинкой  (по адресу редиректа)
								self.Thumbnail(url_webcache, function( rez ) {  
								
											if (rez)
											{
												clearTimeout(self.thumbtoolShowNull);  self.thumbtoolShowNull=null;
												if (rez.captcha == 1) self.show_Webcache( rez.url );
												else
												{
													rez.wd = str;   
													self.show_Thumbnail( url_webcache, host, rez );
												}	
											}
											else
											{		
												// проверка на редирект  
												self.Redirect( url,  function( url_redirect ) {
							
															// запрос за картинкой  (по адресу редиректа)
															self.Thumbnail(url_redirect, function( rez ) {  

																		clearTimeout(self.thumbtoolShowNull);  self.thumbtoolShowNull=null;
																		if (rez)
																		{
																			if (rez.captcha == 1) self.show_Webcache( rez.url );
																			else
																			{
																				rez.wd = str;   
																				self.show_Thumbnail( url_redirect, host, rez );
																			}	
																		}
																		else
																		{
																			self.show_Thumbnail( url, host, null );
																		}
																	});
														});
											}
										});	
							}
							else
							{
								// webcache - не дал результат - редирект
								self.Redirect( url,  function( url_redirect ) {
							
											// запрос за картинкой  (по адресу редиректа)
											self.Thumbnail(url_redirect, function( rez ) {  

														clearTimeout(self.thumbtoolShowNull);  self.thumbtoolShowNull=null;
														if (rez)
														{
															if (rez.captcha == 1) self.show_Webcache( rez.url );
															else
															{
																self.show_Thumbnail( url_redirect, host, rez );
															
																SafePreview.Webcache.GetDate_WebCache( rez.u, function( str, uw ) {  	
																			if (str)  self.show_Webcache( str );		
																		});	
															}			
														}
														else
														{
															self.show_Thumbnail( url, host, null );
														}
													});
										});
							}
						});

		}	

		// =============================================================================================   
		//
		//				ПОИСК КАРТИНКИ
		//
		// =============================================================================================   
		this.Thumbnail_google = function( url, callback ){

			sp_single.alert('PreviewURL: ' + url );
			var flag = false;
			var href_sig = 'https://www.google.com/search?q=<QUERY>';
			
			// 1-ый запрос
			var query = 'info:'+url;
			var surl = href_sig.replace("<QUERY>", sp_single.spLink.encode(query));
				
			this.request_thumbtool( surl, url, true, function( r ) {
						if (r != null)
						{
							if (r.captcha == 1) callback(r);
							else self.zapros_thumbtool( r, query, callback );
						}
						else
						{
							// 2-ой запрос
							var query = 'site:'+url;
							var surl = href_sig.replace("<QUERY>", sp_single.spLink.encode(query));
							self.request_thumbtool( surl, url, false, function( r ) {
										if (r != null)
										{
											if (r.captcha == 1) callback(r);
											else self.zapros_thumbtool( r, query, callback );
										}
										else
										{
											// 3-ий запрос
											var query = '"'+url+'"';
											var surl = href_sig.replace("<QUERY>", sp_single.spLink.encode(query));
											self.request_thumbtool( surl, url, false, function( r ) {
														if (r != null)
														{
															if (r.captcha == 1) callback(r);
															else self.zapros_thumbtool( r, query, callback );
														}
														else
														{
															// 4-ий запрос
															var query = url;
															var surl = href_sig.replace("<QUERY>", sp_single.spLink.encode(query));
															self.request_thumbtool( surl, url, true, function( r ) {
																		if (r != null)
																		{
																			if (r.captcha == 1) callback(r);
																			else 	self.zapros_thumbtool( r, query, callback );
																		}
																		else
																		{
																			sp_single.alert('GOOGLE URL - NO FIND');
																			callback(null);
																		}
																	} );
														}				
													} );
										}
									} );
						}
					} );
			return;
		}
		// -------------------------------------------------------------------------------
		this.zapros_thumbtool = function( r, query, callback ){
			
			if (r.sig) 
			{
				var half_encoded_query = sp_single.spLink.encode(query);
				half_encoded_query = half_encoded_query.replace( /\%3A/ig, ":" );
				half_encoded_query = half_encoded_query.replace( /\%2F/ig, "/" );
				half_encoded_query = half_encoded_query.replace( /\%2C/ig, "," );

				var url_query = sp_single.spLink.encode(r.url);
				var thumb_url = 'https://' + r.host + r.pref + '&c=' + r.c + '&d=' + url_query + '&b=1&a=' + r.sig;
					
				this.get_thumbtool(thumb_url, callback );
			}
		}
			
		//==================================================================================================
		this.request_thumbtool = function( surl, url, flag_one, callback ){
			
			if (typeof flag_one == "undefined") flag_one = false;
			if (this.Thumbnail_abort)
			{
				sp_single.alert('SEARCH (abort): ' + surl);
				callback( null );
				return null;
			}
				
			sp_single.alert(' SEARCH: ' + surl + ' URL: ' + url );
	
			this.ajax_thumbtool.open('GET', surl, true);
			this.ajax_thumbtool.setRequestHeader('Cache-Control', 'no-cache');
			this.ajax_thumbtool.setRequestHeader("Content-type", "text/xml");
			this.ajax_thumbtool.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	
			this.ajax_thumbtool.onreadystatechange = function()  {
						try
						{
							if  ( (self.ajax_thumbtool.readyState == 4) && (self.ajax_thumbtool.status == 200))
							{
								clearTimeout(self.thumbtoolTimer);  
								var content = self.ajax_thumbtool.responseText;
								tt = content.match(/"kfe":{(.*?)}/i);
								if (tt == null)
								{
									sp_single.alert('ajax_thumbtool - not found <kfe>');
									callback( null );
									return;
								}
								var kfe = tt[1];
								
								tt = kfe.match(/"kfeHost":"(.*?)"/i);
								if (tt == null)
								{
									sp_single.alert('ajax_thumbtool - not found <kfeHost>');
									callback( null );
									return;
								}
								var kfeHost = tt[1];

								tt = kfe.match(/"kfeUrlPrefix":"(.*?)"/i);
								if (tt == null)
								{
									sp_single.alert('ajax_thumbtool - not found <kfeUrlPrefix>');
									callback( null );
									return;
								}
								var kfeUrlPrefix = tt[1].replace( /\\u0026/ig, "&" );

								tt = kfe.match(/"clientId":(.*?),/i);
								if (tt == null)
								{
									sp_single.alert('ajax_thumbtool - not found <clientId>');
									callback( null );
									return;
								}
								var clientId = tt[1];
						
								var elems = content.match(/<li[^>]+class="g">(.*?)<\/li>/ig);
						
								if ( (elems != null) && (elems.length > 0) )
								{
									var error_text = "";
								
									for( var i = 0; i != elems.length; i++ )
									{
										elem = elems[i];
//sp_single.alert(elem);					
										
										var t = elem.match(/<div[^>]+class="vsc"(.*?)>/i);
										if (t == null) continue;
										var sig = t[1].substring(6,9);
								
										t = elem.match(/<h3[^>]+class="r">(.*?)<\/h3>/i);
										if (t == null) continue;
										var tt = t[1];
										t = tt.match(/<a[^>]+href="(.*?)"/i);
										if (t == null) continue;
										var u = t[1];
								
										if (sig.length<3)
										{
											sp_single.alert(' URL: ' + u + '  SIG: no'  );
											continue;
										}	
								
										error_text += "\n-- "+u;
//sp_single.alert('g: ' + u + '\nu: ' + url );
										if (  sp_single.spLink.compare_url(u, url) )
										{
											callback({ sig: sig, url: u, host: kfeHost, pref: kfeUrlPrefix, c: clientId, captcha: 0 });
											return;
										}
											
										if (flag_one && (elems.length == 1) && (i==0) )
										{
//sp_single.alert(' URL: ' + url + ' u: ' + u + '  ONE: yes'  );
											callback({ sig: sig, url: u, host: kfeHost, pref: kfeUrlPrefix, c: clientId, captcha: 0 });
											return;
										}
											
									}	
							
									sp_single.alert( ' ERROR: GOOGLE find not matches url' + error_text  );
								}
								else
								{
									sp_single.alert( ' ERROR: GOOGLE not find elements: '  );
								}	
								
								callback( null );
							}
						}
						catch (e) 
						{
							sp_single.alert(' ERROR: catch ' + e  );
						}	
					}	

			this.ajax_thumbtool.onerror = function(){
							clearTimeout(self.thumbtoolTimer);  
							sp_single.alert('ajax_thumbtool - ERROR');
							callback( {captcha: 1, url: surl } );
							return null;
				}
				
			this.thumbtoolTimer = setTimeout( function() { 
		
							sp_single.alert('ajax_thumbtool - TIMEOUT');
							ajax_thumbtool.abort();   
							callback( null );
							return null;
							
						}, TIMEOUT_GOOGLE);
				
				
			this.ajax_thumbtool.send(null);
		}

		// =============================================================================================
		this.get_thumbtool =  function( surl, callback ){
			
			if (this.Thumbnail_abort)
			{
				sp_single.alert('thumbnail (abort): ' + surl);
				callback( null );
				return null;
			}
			sp_single.alert('thumbnail: ' + surl);

			this.ajax_thumbtool.open('GET', surl, false);

			this.ajax_thumbtool.onreadystatechange = function()  {
							try
							{
								if  ( (self.ajax_thumbtool.readyState == 4) && (self.ajax_thumbtool.status == 200))
								{
									var content = self.ajax_thumbtool.responseText;
//sp_single.alert(content);	
									var t = content.match(/"heights":\[(.*?)\]/i);
					
									if (t != null)
									{
										heights = t[1].split(',');	
					
										var h = [];
										for( var i = 0; i != heights.length; i++ )
										{
											h.push(parseInt(heights[i]));
										}

										t = content.match(/"imgs":\["(.*?)"\]/i);
										imgs = t[1].split('","');			

										var img = [];
										for( var i = 0; i != imgs.length; i++ )
										{
											img.push(imgs[i]);
										}
					
										t = content.match(/"title":"(.*?)"/i);
										var title = t[1];			
										title = title.replace(/\\n/g, '').replace(/\\t/g, '');
					
										t = content.match(/"url":"(.*?)"/i);
										var url = t[1];	
										sp_single.alert('SUCCESS: thumbnail: ' + url);		
									
										return   callback ( { count: heights.length, height: h, images: img, title: title, u: url } );
									}
									callback(null);	
								}
							}
							catch (e) 		{		}	
			}			
									
			this.ajax_thumbtool.send(null);
				
		}
		// =============================================================================================
		this.thumbtool_abort =  function(  ){
			
			sp_single.alert('Preview_abort');
			this.ajax_thumbtool.abort();   
			clearTimeout(self.thumbtoolShowNull);  self.thumbtoolShowNull=null;
			self.Thumbnail_abort	= true;
		}
		// =============================================================================================   
		//
		//				РЕДИРЕКТ
		//
		// =============================================================================================   
		this.Redirect = function( url, callback )  {

//			url = 'http://cs.infospace.com/ClickHandler.ashx?du=http%3a%2f%2fwww.mirkvartir.ru%2f&ru=http%3a%2f%2fwww.mirkvartir.ru%2f&ld=20130326&ap=1&app=1&c=insp&s=ispace&coi=239138&cop=main-title&euip=78.138.176.12&npp=1&p=0&pp=0&pvaid=7c26a654124e4733bf638afc34b7b40c&sid=782563570.606724888264.1364317499&vid=782563570.606724888264.1364317499.1&fcoi=417&fcop=topnav&fct.uid=5e6224ebc0ec41c0a3d19a3903128c3f&fpid=2&ep=1&mid=9&hash=882D77683BDF62F447ADEB125BA4EA98';
			sp_single.alert('RESOLVE: ' + url);
		
            this.rootUrl = null;
            this.lastUrl = url;
			
			var rsv = this;

			this.parent_window = function( http_channel ){
				var wnd = null;
		
				try
				{
					ir = http_channel.loadGroup.notificationCallbacks.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
					wnd = ir.getInterface(Components.interfaces.nsIDOMWindow);  
				}
				catch(ex)
				{			
					ir = http_channel.notificationCallbacks.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
					wnd = ir.getInterface(Components.interfaces.nsIDOMWindow);
				}
		
				return wnd;
			}
			
			this._requester_url = function( http_channel ){		
				var wnd = this.parent_window( http_channel );

				return wnd.top.document.location.toString();	
			}
				
			this.root_document_url = function(http_channel)		{
				try
				{
					try
					{
						return this._requester_url( http_channel );
					}
					catch( ex )
					{				
						http_channel = http_channel.QueryInterface(Components.interfaces.nsIHttpChannel);
						return this._requester_url( http_channel );
					}
				} 
				catch (e) 
				{			
					// get from referer
					try
					{
						var ref = http_channel.getRequestHeader('Referer');	
						if(ref)		return ref;
					}
					catch(ex){		}
				}
				return '';
			};
				
				
			this.observer_struct = {observe : function(aSubject, aTopic, aData)
				{
					switch (aTopic)
					{
						case 'http-on-examine-cached-response':
						case 'http-on-examine-response':
						{
							try
							{						
								var u = aSubject.QueryInterface(Components.interfaces.nsIChannel).URI.spec;
								root_url = rsv.root_document_url(aSubject);		
								//sp_single.alert('+++++++++++: ' + root_url );
								//sp_single.alert('-----------: ' + u);
								
								if( rsv.rootUrl )
								{
									if( rsv.rootUrl == root_url )      rsv.lastUrl = u;
								}
								else
								{
									if ( url == u ) 		rsv.rootUrl = root_url;
								}
								
							}
							catch (ex) {  alert(ex); }
							break;
						}
					}
				}};
				
			var observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
			observer.addObserver(this.observer_struct, 'http-on-examine-response', false);
			observer.addObserver(this.observer_struct, 'http-on-examine-cached-response', false);
				

			try
			{
				var x = new XMLHttpRequest();
				x.open( "GET", url );

				x.onreadystatechange = function(){

							if( x.readyState == 2 )
							{
								clearTimeout(self.resolveTimer);
                                x.abort();

								observer.removeObserver(rsv.observer_struct,"http-on-examine-response");
								observer.removeObserver(rsv.observer_struct,"http-on-examine-cached-response");

								
								if (url != rsv.lastUrl)		sp_single.alert('RESOLVE: ' + url + ' => ' + rsv.lastUrl);
											else		sp_single.alert('RESOLVE - No result');
								callback( self.lastUrl );
							}
						}
				
				this.resolveTimer = setTimeout( function() { 
								x.abort();   
								callback(url);
							}, 2000);
				
				x.send( null );
			}
			catch (e) 	
			{	
				callback(url);	
			}	
		}
		// =============================================================================================
		this.RedirectGET =  function( url, callback ){
			
			sp_single.alert('request_head: ' + url);

			var xmlhttp = new XMLHttpRequest();
				
			xmlhttp.open("GET", url, true); 
			xmlhttp.setRequestHeader("Content-type", "text/xml");
			xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
			xmlhttp.responseType = 'document';//xhr.responseType = 'text';				//xhr.responseType = 'arraybuffer';				xmlhttp.responseType = 'blob';


			xmlhttp.onreadystatechange = function( data ){

								if  ( (xmlhttp.readyState == 4) && (xmlhttp.status == 200))
								{
									sp_single.alert(xmlhttp.responseXML.documentElement.baseURI + ' - ' + xmlhttp.readyState + ' - ' + xmlhttp.status);
									callback(xmlhttp.responseXML.documentElement.baseURI);
								}
							}
							
			xmlhttp.send(null); 
				
			return;	
		}
		// =============================================================================================   
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
										
										if (url != surl)	sp_single.alert('REDIRECT_GET: ' + url + ' => ' + surl);
												else		sp_single.alert('REDIRECT_GET - No');
									
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
		// =============================================================================================   
		//
		//				ПОКАЗАТЬ PREVIEW LOADING
		//
		// =============================================================================================   
		this.showThumbnailPreviewLoading = function( url )  {      

			if (this.isShowingThumbnailPreview)   this.hideThumbnailPreviewContext( );
			if (this.isShowingThumbnailPreviewNo) this.hideThumbnailPreviewNoContext( );
			
			this.curHref = url;
		
			var div = this.showThumbnailPreview_create();					
						
			// стили	
			this.showThumbnailPreview_Style( div );
			
			// кнопки
			this.showThumbnailPreview_Pag( div, null, false, false, null );   

			// заголовок	
			this.showThumbnailPreview_Head( div, null, url, null );      
		
			// картинка
			this.showThumbnailPreview_Image_Loading( div );
		
			// кнопки
			this.showThumbnailPreview_Pag( div, null, true, true );   
		
			this.isShowingThumbnailPreview = true;
			sp_single.sendEvent({	"a": "setShowingPreview", "f": true  });
			sp_single.sendEvent({	"a": "hideSmallDivTimer"	});
		}
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreview_create = function(  )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			// ------- создадим окно
			var div = document.getElementById('sp_fullDivPreview');
			if( div != null)	document.body.removeChild( div );

			var div = document.createElement("div");
			div.setAttribute("id","sp_fullDivPreview");
			div.style.display="block";
			document.body.appendChild( div );
	
			div.addEventListener("mouseout",function(event){
									self.hideThumbnailPreviewTimer = window.setTimeout(function(){	self.hideThumbnailPreviewContext();  }, 500);
								},true);
		
			div.addEventListener("mouseover",function(event){
									window.clearTimeout( self.hideThumbnailPreviewTimer );   self.hideThumbnailPreviewTimer = null;
								},true);
			div.addEventListener("click",function(event){  	
									self.click_fullDivTipThumbnail = true;
									}, false);
		
			return div;
		}
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreview_Style = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;

			text =  ' #sp_fullDivPreview {	z-index:2147483674; 	border:1px solid #c9c9c9; 	position:fixed; 	right:2px; 	top:2px;  	width:810px;	height:auto; 	display:block; 	background-color: #fafafa;  	overflow:visible; 	}\n';
			text += ' #sp_fullDivPreview .SafePreview_button_bar 	{		position:relative;		width:800px;		display:block;  	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px;  	}\n';
			text += ' #sp_fullDivPreview .SafePreview_button     	{		color:#333333; 		text-align: center; 		cursor:pointer; 		}\n';
			text += ' #sp_fullDivPreview .SafePreview_button:hover 	{		color: #22048e; 	text-decoration:underline 		}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_current 	{  		position:absolute;  		left:50px;  		width:80px; 	height:24px;  font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px;			}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_new 		{   	position:absolute;   		left:160px; 		width:70px; 	height:24px;  font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px; 		}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_background 	{ 		position:absolute;   		left:250px; 	width:75px; 	height:24px;   	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px;	}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_webcache 	{ 		position:absolute;   		left:20px; 	top:20px; 	width:350px; 	height:24px;  	color: blue;	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px;	font-weight: bold;	text-align: center;	}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_close 	{ 		position:absolute;   		left:2px; 	bottom:4px; 		cursor:pointer;   	}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_close_top	{ 		position:absolute;   		left:2px; 	top:0px; 		cursor:pointer;   	}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_setting 	{ 		position:absolute;   		right:6px; 	top:0px; 		cursor:pointer;   	}\n';
			text += ' #sp_fullDivPreview  .sp_head{	height:auto; 	background-color: #ececec;  	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_title{	height:24px; 	width: 780px;	padding-top: 5px;	padding-left: 10px;	margin-left: 20px;	text-align:left;	overflow:hidden;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_title>span{	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11pt;  	color:#12c; 		text-align: left; 		word-wrap: break-word;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url{	height:24px; 	width: 780px;	cursor:pointer; 		overflow:hidden;	position: relative;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url .sp_favicon{	position: absolute;	left: 5px;	top: 3px;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url .sp_favicon>img{	width: 16px;	height: 16px;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url .sp_str{	position: absolute;	left: 25px;	top: 3px;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url .sp_str>span{	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 10pt;  	color:#093; 		text-align: left; 		word-wrap: break-word;	margin-left: 10px;	}\n';
			text += ' #sp_fullDivPreview .vssrd {	display: block;	overflow: hidden;	position: relative;	}\n';
			text += ' #sp_fullDivPreview .vssrdi {	border-color: #bbb;	border-style: solid;	border-width: 0 1px 0 1px;	margin-top: 2px;	margin-left: 8px;	width:790px;	}\n';
			text += ' #sp_fullDivPreview  .vsi {	border: none;	width: 790px;	}\n';	
			text += ' #sp_fullDivPreview  .vstd {	bottom: 0;	line-height: 0;	overflow: hidden;	position: absolute;	white-space: nowrap;	width: 832px;	margin-left: 8px;	}\n';
			text += ' #sp_fullDivPreview  .vsti {	background: url(http://google.com/images/nav_logo117.png);	background-position: -2px -290px;	display: inline-block;	height: 9px;	width: 144px;	}\n';	
			text += ' #sp_fullDivPreview_Loading {	border: none;	height: 100px;	width: 800px;	position: relative;	}\n';	
			text += ' #sp_fullDivPreview_Loading >img{	position: absolute;	left: 380px;	top: 40px; background-color: white;	}\n';	
			text += ' #sp_fullDivPreview_Loading  .title{	position: absolute;	left: 250px;	width: 290px;	top: 10px;	text-align:center; font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif;	font-size: 11px;  	background: #9fd1f5;	}\n';	
			
			text += ' #sp_fullDivPreview_Captcha {	border: none;	height: 100px;	width: 800px;	position: relative;	}				\n';
			text += ' #sp_fullDivPreview_Captcha  .title{	position: absolute;	left: 10px;	width: 750px;	top: 30px;	text-align:center;	font-size: 12px;  	cursor:pointer;   	}	\n';
			
			var stls = document.createElement("style");
			stls.textContent = text;
			div.appendChild( stls );
		}
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreview_Style_google = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;

			text =  ' #sp_fullDivPreview {	z-index:2147483674; 	border:1px solid #c9c9c9; 	position:fixed; 	right:2px; 	top:2px;  	width:410px;	height:auto; 	display:block; 	background-color: #fafafa;  	overflow:visible; 	}\n';
			text += ' #sp_fullDivPreview .SafePreview_button_bar 	{		position:relative;		width:400px;		display:block;  	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px;  	}\n';
			text += ' #sp_fullDivPreview .SafePreview_button     	{		color:#333333; 		text-align: center; 		cursor:pointer; 		}\n';
			text += ' #sp_fullDivPreview .SafePreview_button:hover 	{		color: #22048e; 	text-decoration:underline 		}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_current 	{  		position:absolute;  		left:50px;  		width:80px; 	height:24px;  font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px;			}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_new 		{   	position:absolute;   		left:160px; 		width:70px; 	height:24px;  font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px; 		}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_background 	{ 		position:absolute;   		left:250px; 	width:75px; 	height:24px;   	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px;	}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_webcache 	{ 		position:absolute;   		left:20px; 	top:20px; 	width:350px; 	height:24px;  	color: blue;	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px;	font-weight: bold;	text-align: center;	}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_close 	{ 		position:absolute;   		left:2px; 	bottom:4px; 		cursor:pointer;   	}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_close_top	{ 		position:absolute;   		left:2px; 	top:0px; 		cursor:pointer;   	}\n';
			text += ' #sp_fullDivPreview .sp_fullDivPreview_setting 	{ 		position:absolute;   		right:6px; 	top:0px; 		cursor:pointer;   	}\n';
			text += ' #sp_fullDivPreview  .sp_head{	height:auto; 	background-color: #ececec;  	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_title{	height:24px; 	width: 380px;	padding-top: 5px;	padding-left: 10px;	margin-left: 20px;	text-align:left;	overflow:hidden;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_title>span{	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11pt;  	color:#12c; 		text-align: left; 		word-wrap: break-word;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url{	height:24px; 	width: 380px;	cursor:pointer; 		overflow:hidden;	position: relative;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url .sp_favicon{	position: absolute;	left: 5px;	top: 3px;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url .sp_favicon>img{	width: 16px;	height: 16px;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url .sp_str{	position: absolute;	left: 25px;	top: 3px;	}\n';
			text += ' #sp_fullDivPreview  .sp_head .sp_url .sp_str>span{	font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 10pt;  	color:#093; 		text-align: left; 		word-wrap: break-word;	margin-left: 10px;	}\n';
			text += ' #sp_fullDivPreview .vssrd {	display: block;	overflow: hidden;	position: relative;	}\n';
			text += ' #sp_fullDivPreview .vssrdi {	border-color: #bbb;	border-style: solid;	border-width: 0 1px 0 1px;	margin-top: 2px;	margin-left: 8px;	width:390px;	}\n';
			text += ' #sp_fullDivPreview  .vsi {	border: none;	width: 390px;	}\n';	
			text += ' #sp_fullDivPreview  .vstd {	bottom: 0;	line-height: 0;	overflow: hidden;	position: absolute;	white-space: nowrap;	width: 432px;	margin-left: 8px;	}\n';
			text += ' #sp_fullDivPreview  .vsti {	background: url(http://google.com/images/nav_logo117.png);	background-position: -2px -290px;	display: inline-block;	height: 9px;	width: 144px;	}\n';	
			text += ' #sp_fullDivPreview_Loading {	border: none;	height: 100px;	width: 400px;	position: relative;	}\n';	
			text += ' #sp_fullDivPreview_Loading >img{	position: absolute;	left: 180px;	top: 40px; background-color: white;	}\n';	
			text += ' #sp_fullDivPreview_Loading  .title{	position: absolute;	left: 50px;	width: 290px;	top: 10px;	text-align:center; font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif;	font-size: 11px;  	background: #9fd1f5;	}\n';	
			
			text += ' #sp_fullDivPreview_Captcha {	border: none;	height: 100px;	width: 400px;	position: relative;	}				\n';
			text += ' #sp_fullDivPreview_Captcha  .title{	position: absolute;	left: 10px;	width: 350px;	top: 30px;	text-align:center;	font-size: 12px;  	cursor:pointer;   	}	\n';
			
			var stls = document.createElement("style");
			stls.textContent = text;
			div.appendChild( stls );
		}
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreview_Pag = function( div, wc, mesto, cmd, wd )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("class","SafePreview_button_bar");
			divb.setAttribute("style","margin-left:7px; margin-top:10px; height:45px;");
			var div1 = document.createElement("div");
			div1.setAttribute("class","SafePreview_button sp_fullDivPreview_current");
		//	div1.setAttribute("id","");
			div1.textContent="Current Page";
			divb.appendChild( div1 );
			div1.addEventListener("click", function( event ){
										//self.Run_initPreviewHide( 100 );
										sp_single.navigate_url( self.curHref, event, false );
									}, true);
		
			var div2 = document.createElement("div");
			div2.setAttribute("class","SafePreview_button sp_fullDivPreview_new");
			div2.textContent="New Page";
			divb.appendChild( div2 );
			div2.addEventListener("click", function( event ){
										//self.Run_initPreviewHide( 1 );
										sp_single.navigate_url( self.curHref, event, true );
									}, true);
		
			var div3 = document.createElement("div");
			div3.setAttribute("class","SafePreview_button sp_fullDivPreview_background");
			//div3.setAttribute("title", this.curHref);
			div3.textContent="Background";
			divb.appendChild( div3 );
			div3.addEventListener("click", function( event ){
										sp_single.navigate_url( self.curHref, event, true, true );
									}, true);
		
			if (wc)
			{	
				var div4 = document.createElement("div");
				div4.setAttribute("class","SafePreview_button sp_fullDivPreview_webcache");
				div4.setAttribute("title", wc);
				div4.setAttribute("id","sp_fullDivPreview_webcache");
				div4.textContent="Google Cached Version"+( (wd) ? (" ("+wd+")") : ("") );
				divb.appendChild( div4 );
				div4.addEventListener("click", function( event ){
										sp_single.navigate_url( wc, event, true );
									}, true);
			}
			if (mesto)  //bottom
			{
				var img_close = document.createElement("img");
				img_close.setAttribute("title","Close");
				img_close.setAttribute("src",FILE_IMAGES[21]);
				img_close.setAttribute("class","sp_fullDivPreview_close");
				divb.appendChild( img_close );
				img_close.addEventListener("click", function( event ){
										self.hideThumbnailPreviewContext( );
										if (cmd)
										{
											self.ajax_thumbtool.abort();
										}						
									}, true);
									
			}
			else
			{
				var img_close = document.createElement("img");
				img_close.setAttribute("title","Close");
				img_close.setAttribute("src",FILE_IMAGES[21]);
				img_close.setAttribute("class","sp_fullDivPreview_close_top");
				divb.appendChild( img_close );
				img_close.addEventListener("click", function( event ){
										self.hideThumbnailPreviewContext( );
										if (cmd)
										{
											self.ajax_thumbtool.abort();
										}						
									}, true);
									
				var img_set = document.createElement("img");
				img_set.setAttribute("title","Setting");
				img_set.setAttribute("src",FILE_IMAGES[23]);
				img_set.setAttribute("class","sp_fullDivPreview_setting");
				divb.appendChild( img_set );
				img_set.addEventListener("click", function( event ){	
										self.hideThumbnailPreviewContext( );
										sp_single.display_settings( event );			
									}, true);
			}						
		
			div.appendChild( divb );
		}
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreview_Head = function(  div, title, url, host )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("class","sp_head");

			if (title)
			{
				var stitle = title;
				if (title.length > TITLE_MAX_LENGTH)  stitle = title.substr(0, TITLE_MAX_LENGTH) + '...';
		
				var dt = document.createElement("div");
				dt.setAttribute("class", "sp_title");
				dt.setAttribute("title", title);
					var sp = document.createElement("span");
					sp.textContent = stitle;
					dt.appendChild( sp );
				divb.appendChild( dt );
			}
			if (url)
			{
				var surl = url;
				if (url.length > URL_MAX_LENGTH)  surl = url.substr(0, URL_MAX_LENGTH) + '...';

				var du = document.createElement("div");
				du.setAttribute("class", "sp_url");
				du.setAttribute("title", url);
				divb.appendChild( du );
		
				if (host)
				{
					var d1 = document.createElement("div");
					d1.setAttribute("class", "sp_favicon");
					du.appendChild( d1 );
			
					var img = document.createElement( "img" );
					img.setAttribute("src", "http://www.google.com/s2/favicons?domain="+host);
					d1.appendChild( img );
				}	

				var d2 = document.createElement("div");
				d2.setAttribute("class", "sp_str");
				du.appendChild( d2 );
			
				var spn = document.createElement( "span" );
				spn.textContent = surl;
				d2.appendChild( spn );
			
				du.addEventListener("click", function( event ){		sp_single.navigate_url( url, 1 );			}, true);
			}	
	
			div.appendChild( divb );
		}
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreview_Image = function( div, heights, images )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			
			var h = -10;	
			for( var i = 0; i != heights.length; i++ ) 	 h = h + heights[i];
			var hh = document.documentElement.clientHeight-200;
			if (h>hh) h=hh;

			var divb = document.createElement("div");
			divb.setAttribute("class", "vssrd");
			divb.setAttribute("style","max-width: 802px; display: block; height: " + h +"px;");
			div.appendChild( divb );

			var divv = document.createElement("div");
			divv.setAttribute("class", "vssrdi");
			divv.setAttribute("style","border-top-width: 1px; border-bottom-width: 0px;");
			divb.appendChild( divv );
		
			for( var i = 0; i != heights.length; i++ )
			{
				var img = document.createElement("img");
				img.setAttribute("src", images[i]);
				img.setAttribute("class", "vsi");
				img.setAttribute("style", "display: block; height: auto;");
				divv.appendChild( img );
			}
			
			// ломанная
			var dl = document.createElement("div");
			dl.setAttribute("class", "vstd");
				var dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
				 dd = document.createElement("div");
				 dd.setAttribute("class", "vsti");
				 dl.appendChild( dd );
				dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
				 dd = document.createElement("div");
				 dd.setAttribute("class", "vsti");
				 dl.appendChild( dd );
				dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
				 dd = document.createElement("div");
				 dd.setAttribute("class", "vsti");
				 dl.appendChild( dd );
			divb.appendChild( dl );
		}  
		this.showThumbnailPreview_Image_google = function( div, heights, images )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			
			var h = -10;	
			for( var i = 0; i != heights.length; i++ ) 	 h = h + heights[i];
			var hh = document.documentElement.clientHeight-200;
			if (h>hh) h=hh;

			var divb = document.createElement("div");
			divb.setAttribute("class", "vssrd");
			divb.setAttribute("style","max-width: 402px; display: block; height: " + h +"px;");
			div.appendChild( divb );

			var divv = document.createElement("div");
			divv.setAttribute("class", "vssrdi");
			divv.setAttribute("style","border-top-width: 1px; border-bottom-width: 0px;");
			divb.appendChild( divv );
		
			for( var i = 0; i != heights.length; i++ )
			{
				var img = document.createElement("img");
				img.setAttribute("src", images[i]);
				img.setAttribute("class", "vsi");
				img.setAttribute("style", "display: block; height: auto;");
				divv.appendChild( img );
			}
			
			// ломанная
			var dl = document.createElement("div");
			dl.setAttribute("class", "vstd");
				var dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
				 dd = document.createElement("div");
				 dd.setAttribute("class", "vsti");
				 dl.appendChild( dd );
				dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
			divb.appendChild( dl );
		}  
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreview_Image_Loading = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("class", "vssrd");
			divb.setAttribute("style","width: 802px; display: block; height: 100px;");
			div.appendChild( divb );

			var divv = document.createElement("div");
			divv.setAttribute("class", "vssrdi");
			divv.setAttribute("style","border-top-width: 1px; border-bottom-width: 0px;");
			divb.appendChild( divv );

			var di = document.createElement("div");
			di.setAttribute("id","sp_fullDivPreview_Loading");
			divv.appendChild( di );
		
			var dt = document.createElement("div");
			dt.setAttribute("class", "title");
			dt.textContent='searching for the preview...';
			setTimeout(    function(){	if (dt) dt.textContent='still searching for the preview...';		},  3000);
			di.appendChild( dt );
			
			var img = document.createElement("img");
			img.setAttribute("src", FILE_IMAGES[19]);
			di.appendChild( img );
			
			// ломанная
			var dl = document.createElement("div");
			dl.setAttribute("class", "vstd");
				var dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
				 dd = document.createElement("div");
				 dd.setAttribute("class", "vsti");
				 dl.appendChild( dd );
				dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
				 dd = document.createElement("div");
				 dd.setAttribute("class", "vsti");
				 dl.appendChild( dd );
				dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
				 dd = document.createElement("div");
				 dd.setAttribute("class", "vsti");
				 dl.appendChild( dd );
			divb.appendChild( dl );
		}  
		this.showThumbnailPreview_Image_Loading_google = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("class", "vssrd");
			divb.setAttribute("style","width: 402px; display: block; height: 100px;");
			div.appendChild( divb );

			var divv = document.createElement("div");
			divv.setAttribute("class", "vssrdi");
			divv.setAttribute("style","border-top-width: 1px; border-bottom-width: 0px;");
			divb.appendChild( divv );

			var di = document.createElement("div");
			di.setAttribute("id","sp_fullDivPreview_Loading");
			divv.appendChild( di );
		
			var dt = document.createElement("div");
			dt.setAttribute("class", "title");
			dt.textContent='searching for the preview...';
			setTimeout(    function(){	if (dt) dt.textContent='still searching for the preview...';		},  3000);
			di.appendChild( dt );
			
			var img = document.createElement("img");
			img.setAttribute("src", FILE_IMAGES[19]);
			di.appendChild( img );
			
			// ломанная
			var dl = document.createElement("div");
			dl.setAttribute("class", "vstd");
				var dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
				 dd = document.createElement("div");
				 dd.setAttribute("class", "vsti");
				 dl.appendChild( dd );
				dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
			divb.appendChild( dl );
		}  
		// ---------------------------------------------------------------------------------------------------------------
		this.hideThumbnailPreviewContext = function( div )  {      

			try
			{
				var document = gBrowser.selectedBrowser.contentDocument;
				var div = document.getElementById('sp_fullDivPreview');
			
				if( div != null)
				{
					document.body.removeChild( div );
					window.clearTimeout( this.hideThumbnailPreviewTimer );   this.hideThumbnailPreviewTimer=null;
				}
				this.isShowingThumbnailPreview=false;		sp_single.sendEvent({	"a": "setShowingPreview", "f": false  });
				this.linkUrl=null;
			}
			catch(ex){	}
		}
		// ---------------------------------------------------------------------------------------------------------------
		this.ClickDocument = function(  )  {    
			if (this.click_fullDivTipThumbnail)
			{
				this.click_fullDivTipThumbnail = false;
				return;
			}	
			if ( this.isShowingThumbnailPreview )	this.Run_initPreviewHide( 10 );

			return;
		}
		// ---------------------------------------------------------------------------------------------------------------
		this.Run_initPreviewHide = function( t )  {   
		
			this.hidePreviewDivTimer = window.setTimeout(function(){
													self.isShowingThumbnailPreview=false;	
													sp_single.sendEvent({	"a": "setShowingPreview", "f": false  });
													
													self.hideThumbnailPreviewContext();
													
													self.removeSmallDiv();
												},  t);
		}
		// -----------------------------------------------------------  сообщение на закрытие иконки
		this.removeSmallDiv = function( fl )  {  
			sp_single.sendEvent({	"a": "removeSmallDiv"	});
		}
		// =============================================================================================   
		//
		//				ПОКАЗАТЬ NO PREVIEW
		//
		// =============================================================================================   
		this.showThumbnailPreviewNoContext = function(  )  {      
			if (this.isShowingThumbnailPreview)   this.hideThumbnailPreviewContext( );
			if (this.isShowingThumbnailPreviewNo) this.hideThumbnailPreviewNoContext( );
			
			var document = gBrowser.selectedBrowser.contentDocument;
			var div = document.createElement("div");
			div.setAttribute("id","sp_fullDivPreviewNo");
			div.style.display="block";
			document.body.appendChild( div );
			
			// стили	
			this.showThumbnailPreviewNo_Style( div );
			
			var di = document.createElement("div");
			di.setAttribute("class","sp_info");
			div.appendChild( di );

			var img1 = document.createElement("img");
			img1.setAttribute("src",FILE_IMAGES[81]);
			img1.setAttribute("class","info_img1");
			di.appendChild( img1 );
	
			var span = document.createElement("span");
			span.setAttribute("class","info_spn");
			
				span.textContent = "Sorry, no results in Google for this page. ";
				
				var sa = document.createElement("a");
				sa.setAttribute("href", "#");
				sa.setAttribute("title", "");
				sa.setAttribute("id", "sp_signIn");
				sa.textContent = "(Read More.)";
				span.appendChild( sa );
			
			di.appendChild( span );

			var img2 = document.createElement("img");
			img2.setAttribute("src",FILE_IMAGES[82]);
			img2.setAttribute("class","info_close");
			di.appendChild( img2 );
			img2.addEventListener("click", function( event ){		self.hideThumbnailPreviewNoContext( );		}, true);
	
			div.addEventListener("mouseout",function(event){
									self.hideThumbnailPreviewNoTimer = window.setTimeout(function(){	self.hideThumbnailPreviewNoContext();  }, 500);
								},true);
		
			div.addEventListener("mouseover",function(event){
									window.clearTimeout( self.hideThumbnailPreviewNoTimer );   self.hideThumbnailPreviewNoTimer = null;
								},true);
			div.addEventListener("click",function(event){  	
										self.hideThumbnailPreviewNoTimer = window.setTimeout(function(){	self.hideThumbnailPreviewNoContext();  }, 500);
									}, false);
			
			this.isShowingThumbnailPreviewNo = true;
	
			this.hideThumbnailPreviewNoTimer = window.setTimeout(function(){	self.hideThumbnailPreviewNoContext();  }, 3000);

		}	
		// ---------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreviewNo_Style = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;

			text  = '#sp_fullDivPreviewNo{	z-index:2147483674; 		font: bold 13px/1.5 Helvetica,Arial,sans-serif;	position: fixed;	top: 5px;	left: 0;	width: 100%;	text-align: center;	height: 1px;	}';
			text += '#sp_fullDivPreviewNo .sp_info{	border: 1px solid #fad42e;	background: #fea;	border-radius: 5px;	color: #000;	display: inline-block;	padding: 5px 10px 5px 5px;	-webkit-box-shadow: rgba(0,0,0,0.3) 0 1px 1px;	height: 40px;	width: 420px;	position: relative;	}';
			text += '#sp_fullDivPreviewNo .sp_info  .info_img1 {	height: 14px;	width: 14px;	position: absolute;	left: 5px;	top: 14px;}';	
			text += '#sp_fullDivPreviewNo .sp_info  .info_spn {	max-width: 400px;	height: 20px;	position: absolute;	left: 30px;	top: 12px;	}';
			text += '#sp_signIn    {	font-size: 10pt; 	}';	
			text += '#sp_fullDivPreviewNo .sp_info  .info_close { height: 12px;	width: 12px;	position: absolute;	left: 410px;	top: 16px;	cursor:pointer;   	}';	
			var stls = document.createElement("style");
			stls.textContent = text;
			div.appendChild( stls );
		}
		// ------------------------------------------------------------------------------------------------------------
		this.hideThumbnailPreviewNoContext = function(  )  {   

			var document = gBrowser.selectedBrowser.contentDocument;
			var div = document.getElementById('sp_fullDivPreviewNo');
			
			if( div != null)
			{
				document.body.removeChild( div );
				window.clearTimeout( this.hideThumbnailPreviewTimer );   this.hideThumbnailPreviewTimer=null;
			}
			this.isShowingThumbnailPreviewNo=false;		
		}
		// =============================================================================================   
		//
		//				ПОКАЗАТЬ PREVIEW Результат
		//
		// =============================================================================================   
		this.show_Thumbnail = function( url, host, rez ){
			
			if (rez != null)
			{
				// вывести артинку	
				this.showThumbnailPreviewContext( url, host, rez.height, rez.images, rez.title, rez.u );      
			}
			else 
			{
				// Сообщение об отсутствие 
				this.showThumbnailPreviewNoContext(  );
			}
			
		}
		// -----------------------------------------------------------
		this.showThumbnailPreviewContext = function( url, host, heights, src_images, title, u)  {      

			if (this.isShowingThumbnailPreview)   this.hideThumbnailPreviewContext( );
			if (this.isShowingThumbnailPreviewNo) this.hideThumbnailPreviewNoContext( );
			
			this.curHref = url;
			this.curWebCache = '';
		
			var div = this.showThumbnailPreview_create();					
						
			// стили	
			this.showThumbnailPreview_Style( div );
			
			// кнопки
			this.showThumbnailPreview_Pag( div, null, false, false, null );   

			// заголовок	
			this.showThumbnailPreview_Head( div, title, url, host );      
		
			// картинка
			this.showThumbnailPreview_Image( div, heights, src_images );
		
			// кнопки
			this.showThumbnailPreview_Pag( div, null, true, false );   
		
			this.isShowingThumbnailPreview = true;
			sp_single.sendEvent({	"a": "setShowingPreview", "f": true  });
			sp_single.sendEvent({	"a": "hideSmallDivTimer"	});
		}
		this.showThumbnailPreviewContext_google = function( url, host, heights, src_images, title, u, wc, wd)  {      

			if (this.isShowingThumbnailPreview)   this.hideThumbnailPreviewContext( );
			if (this.isShowingThumbnailPreviewNo) this.hideThumbnailPreviewNoContext( );
			
			this.curHref = url;
			this.curWebCache = wc;
		
			var div = this.showThumbnailPreview_create();					
						
			// стили	
			this.showThumbnailPreview_Style_google( div );
			
			// кнопки
			this.showThumbnailPreview_Pag( div, wc, false, false, wd );   

			// заголовок	
			this.showThumbnailPreview_Head( div, title, u, host );      
		
			// картинка
			this.showThumbnailPreview_Image_google( div, heights, src_images );
		
			// кнопки
			this.showThumbnailPreview_Pag( div, null, true, false );   
		
			this.isShowingThumbnailPreview = true;
			sp_single.sendEvent({	"a": "setShowingPreview", "f": true  });
			sp_single.sendEvent({	"a": "hideSmallDivTimer"	});
		}
		
		
		
		// =============================================================================================   
		this.show_Thumbnail_google = function( url, host, rez ){
			
			if (rez != null)
			{
				var href_webcache = 'http://webcache.googleusercontent.com/search?q=cache:<QUERY>';
				href_webcache = href_webcache.replace("<QUERY>", sp_single.spLink.encode(rez.u));

				// вывести артинку	
				this.showThumbnailPreviewContext_google( url, host, rez.height, rez.images, rez.title, rez.u, href_webcache, rez.wd  );      
			}
			else 
			{
				// Сообщение об отсутствие 
				this.showThumbnailPreviewNoContext(  );
			}
			
		}
		this.showThumbnailPreviewContext_google = function( url, host, heights, src_images, title, u, wc, wd)  {      

			if (this.isShowingThumbnailPreview)   this.hideThumbnailPreviewContext( );
			if (this.isShowingThumbnailPreviewNo) this.hideThumbnailPreviewNoContext( );
			
			this.curHref = url;
			this.curWebCache = wc;
		
			var div = this.showThumbnailPreview_create();					
						
			// стили	
			this.showThumbnailPreview_Style_google( div );
			
			// кнопки
			this.showThumbnailPreview_Pag( div, wc, false, false, wd );   

			// заголовок	
			this.showThumbnailPreview_Head( div, title, u, host );      
		
			// картинка
			this.showThumbnailPreview_Image( div, heights, src_images );
		
			// кнопки
			this.showThumbnailPreview_Pag( div, null, true, false );   
		
			this.isShowingThumbnailPreview = true;
			sp_single.sendEvent({	"a": "setShowingPreview", "f": true  });
			sp_single.sendEvent({	"a": "hideSmallDivTimer"	});
		}
		// =============================================================================================   
		//
		//				ПОКАЗАТЬ PREVIEW Результат
		//
		// =============================================================================================   
		this.show_Webcache = function( str ){

			if (str)
			{
				this.showThumbnailPreviewWebcache( str );
			}
		}
		// -----------------
		this.show_Captcha = function( url ){
				if (url)
				{
					var surl = "http://www.google.com/sorry/?continue="+url;
					console.log("google Captcha: " + surl);
					SafePreview.Utils.getActiveTab( function( tab ){
											SafePreview.ContentScriptController.processMessage( tab.id, {
															action: "thumbnailPreview_captcha",
															date: surl
														} );
										});
				}
		}
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreviewWebcache = function( str )		{
			var container = document.getElementById("sp_fullDivPreview_webcache");
			if( container != null)
			{
				container.textContent="Google Cached Version ("+str+")";
			}	
		}
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreviewCaptcha = function( url )		{

			if (this.isShowingThumbnailPreview)   this.hideThumbnailPreviewContext( );
			if (this.isShowingThumbnailPreviewNo) this.hideThumbnailPreviewNoContext( );
			
			this.curHref = url;
		
			var div = this.showThumbnailPreview_create();					
						
			// стили	
			this.showThumbnailPreview_Style( div );
			
			// кнопки
			this.showThumbnailPreview_Pag( div, null, false, false, null );   

			// заголовок	
			this.showThumbnailPreview_Head( div, null, url, null );      
		
			// картинка
			this.showThumbnailPreview_Link_Captcha( div, url );
		
			// кнопки
			this.showThumbnailPreview_Pag( div, null, true, true );   
		
			this.isShowingThumbnailPreview = true;
			sp_single.sendEvent({	"a": "setShowingPreview", "f": true  });
			sp_single.sendEvent({	"a": "hideSmallDivTimer"	});
		}
		// ------------------------------------------------------------------------------------------------------------
		this.showThumbnailPreview_Link_Captcha = function( div, url )		{

			var divb = document.createElement("div");
			divb.setAttribute("class", "vssrd");
			divb.setAttribute("style","width: 402px; display: block; height: 100px;");
			div.appendChild( divb );

				var divv = document.createElement("div");
				divv.setAttribute("class", "vssrdi");
				divv.setAttribute("style","border-top-width: 1px; border-bottom-width: 0px;");
				divb.appendChild( divv );

			var di = document.createElement("div");
			di.setAttribute("id","sp_fullDivPreview_Captcha");
			divv.appendChild( di );
		
				var dt = document.createElement("div");
				dt.setAttribute("class", "title");
				dt.textContent='Please enter Google Security Image and Try again.';
				di.appendChild( dt );
				dt.addEventListener("click", function( event ){
										sp_single.navigate_url( url, event, false );
									}, true);
			
			// ломанная
			var dl = document.createElement("div");
			dl.setAttribute("class", "vstd");
				var dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
				 dd = document.createElement("div");
				 dd.setAttribute("class", "vsti");
				 dl.appendChild( dd );
				dd = document.createElement("div");
				dd.setAttribute("class", "vsti");
				dl.appendChild( dd );
			divb.appendChild( dl );
		}  
		
		// =============================================================================================



		
	}	
})();
