// class describes downloads for specified window
(function(){

	const FILE_IMAGES = {
		0:	 "data:image/gif;base64,R0lGODlhEgASAMZ2AP39/fX19ePj4+7u7urq6uzs7HNycvr6+v7+/vj4+NbW1rGxseno6GdnZ/z8/Ovr62tqauTk5JOSkmBfX6ampunp6b69vYiIiMLCwuXl5djY2LCwsKCgoPPz856dnWJhYYSDg3d3d+Hh4fj395iXl+/v7/b29lRUVHZ1dXp6et/f35WVlVhYWOjo6IuKi319fZ+ensfHx8nJyXx8fKioqLSzs4KBgbu6unV1dXp5eaalpXRzc8TExHV0dN3d3bi4uIWFhWVlZYaFhbGwsJaWlsbFxaqqqmppaYiHh7W1tYGBgYWEhNDQ0Pf3+G9vb1FRUXZ2dvTz82hnZ9zc3GZmZvHx8b29vWRkZHJxccfGxmloaM3NzdjX16Ghoff4+IaGhqOjo35+frm5ufv7+25ubry8vHh4eI+Pj1dXV7e3t/v6+qWkpIyMjJybm9rZ2aGgoPDw8Ofn5/Ly8vT09Pn5+ff39////////////////////////////////////////yH5BAEAAH8ALAAAAAASABIAAAf+gH+Cg4IMhIeHFkgTKBBSEm6IgnFmbwoAmCZFSySIAkc/DgkdCXQBdA46IIdYNwcHdRk8C2UqUQdrHoMbFHR0dQthK2dXFxG/HwKCBhl1dVUhTy5JaFQYzmlgfy09Ad51RiFWHCxkGt5TKX8KX3PuJnIdMUE4WWruD1rrQnL9TXQA2MwQAWBOvwcN/jDYAadhAgd1XjCxM6chHA05lvkYMMALgggXMCCAw3FAjS6CNnAoUECOHQonnNApwZJAMkEjDCwgQGDOFiA0EJTg6aENIQENhlSI8yCOnDhxKsCwQeeQACgkZECNI0KMEiIjJI2xAGKCAQgNJHCRhIiBHLYCgQAAOw==",
		1:   "data:image/gif;base64,R0lGODlhEgASAMQfAMUpAuM2DcpXMP349/jp5MM5C+Ook+m6qfLVy9c6Ct2TevRFFdstCu7IussdAscWBtElBcAyA/fj3eo/EM0cCeCdhs9lQsEQA9Z+YNiDZ9BrSfrw7M4gA7QBAf///////yH5BAEAAB8ALAAAAAASABIAAAWZ4CeOZGmOW2McxEkiWgTMkdC4huzs+6yYBwBnSCQCKqRNAQK5dC7NJzMiGSkAUc+zo4UCMiMBg8H1aM3acWFUGD/K6M5jHNmIIoH8O/7IByItHwJ6cGZyeREDIhgJE3CPEwEaIwgRExRcHZhaFBMJBySMC5gUo5oLCRYlAxYJC6+wqAJ2qwoFjROeERiKLgQGGQIYFVUuxiYhADs=",
		2:	 "data:image/gif;base64,R0lGODlhEgASAMZCAPTWUPrtlLdoAvnpiPHNNvPTR/LQPuvSh+LDm/rul9y0ZPPVTPrvm/fpn/z589OjZfrvo8uTSrdqBLtxELdpBP/+/vXu5vnpiefFW+/gwLpwEPLYZ/TWUvDLL/PXWPPTTOPEm/vxo+LEm9mqQPntnebASrZpAvHNNd6zK/DPSvrulv79+vLRQOPLnvbfb/PUS7dzAPLQPfrwpdOjZPz68/PSR7pxEPfw19KiZPDKK9mrQ+zYb+zYdsiMPsyYFfbs3/rtk8GEAv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAH8ALAAAAAASABIAAAfwgH+Cg4SFhoIiPRomJho9Iod/Pw8SBw0yMg0HEg8/hT8RChAMPEFBOwwQChGegzgKIQkBPjc3PgEJIQo4gyASELJAQSsrQUC4EBIggj0HDAFAwjQ0xscMBz2CNg0q0cIODtVAKg02ggIkFwPrQeBB6wMXJALnLhwA+D4ZGT74ABwu6P2ZsOFFgYMoTKE4WODFhgnMMCxgYcBAkBYtglRksQBDtj8IKHiIQeAEDAsWYJwgEMMDBQSDZuhYQKCDD1M+OhBYoGMGIVAjPhDI4cNHDgIfRrD69IBCiRQ1aqQoQaFTJAQ9JggQMKEHzEhgCwUCADs=",
		3:   "data:image/gif;base64,R0lGODlhEgASAPeCALTttfLy8mHSYNTm1FfPVt3r3CmEJ6jqqRd7FmvWa/T484Pdg93733fad/b69k7MTfPz88DbwDSLMlmgWI/hkEKTQZvGmju0OpzmnIe6hg92DQx0Cvz8/Bp8GPf398jgyCeYJj+RPv///z+4PsXjxWeoZkW3RKnaqmrVak26TITOhGOxYWGuYaDfodjm1z2UPEvISsPdwk+pTszhzO717i6ILZzbnTGJL1+tXnCtb1W4VPn8+YvYi/Dy8KThpHPJc+rz6R2DG2KsYhyKG+v064ncisrgysHewF+jXi6QLUiWRzuxOs3izdP11W/Mb0uwSiqHKRF7Dy6eLWKlYNbl1nO7ch2TG+Xs5TihN3OvcsbexcDcv226bdnn2cPxxfDx8Nrq2pfNlxSAEki2R5PLlFW6VTGSMD+1Pj6rPWWvZTKeMJTfk32/fbLWsjeuNnzAfPz9/DiqN0K1Qo7Xj7/fvxt+GmrOaiKFIE63TdPk02qqaWrGadnp2X7NfsDxwcr1zNT41hmQF////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAIIALAAAAAASABIAAAj/AAUJHCiwAA2CCAfCsaBkA5Q6CCZoSSgQzA0hJxhobELmxRQHCAd0YAOopMmSaSqAFKjAwJs/MGP+sRHICws9AzPg8MOzpx8VgaoE8qFhgEADLQAoXdonEAkRYQJxySKowJ0DWAPxOPAjEB0OHIBYmSNBUAQzGDAEkhFoT6AjHjzwCaRjTQezSSgEWtFjS6A2ECC4CFSGQhEEVYMsCGQkQIArXwJQCYRnwQInZQUZsJMi0AzHAfIEGtOg9JMcAjNgSWAiEBMIXQLJSUAbRVGWBtAIOBPoQ6AlAoILUFOC4AAEcQhcCHSBgHMCUkKsHDigBogRD7LDcDMEiQKKOyxUDdggJkrEGBQTFiCSPiAAOw==",
		// loading
		20:  "data:image/gif;base64,R0lGODlhEgASAMQaAHl5d66urMXFw3l5dpSUk5WVlKOjoq+vrsbGw6Sko7u7uaWlpbm5t3h4doiIhtLSz4aGhJaWlsbGxNHRzrCwr5SUkqKiobq6uNHRz4eHhf///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAaACwAAAAAEgASAAAFaqAmjmRplstyrkmbrCNFaUZtaFF0HvyhWRZNYVgwBY4BEmFJOB1NlYpJoYBpHI7RZXtZZb4ZEbd7AodFDIYVAjFJJCYA4ISoI0hyuUnAF2geDxoDgwMnfBoYiRgaDQ1WiIqPJBMTkpYaIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo4aRZEoeaxHOiqKFsyBtizopV9ynfwJ0o43MhgNKAYjZbGQJBLXKBLRIK4IaWFbEHgFUoKYoPFKRZUK6fFIORwojBxDytgzpDkdANDc8SQTExp8fBoQEGcDiwNnJA0NLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOmqKQKHmtVzpKksa2FIUiOKIxjHb8B5JgKCAFjgHUMHUkPR6u0WKhwVgx0YQ2ccW6DGCDZjKJiiwWEgCQikRQ6zWpQC+QBviBxuHQEP4EKA0NGhmGGRoVFWaHiGYjEBAuIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6aJJEoiaxIOj6PJsyCpigopmNyff0X0o43AgZJk0mKwSABAK4RhaJ5PqOH7GHAHUQD4ICm0YiKwCSHI7VYoDLwDClBT5Di8khEY+gbUBAQGgWEBRoWFmYEiwRmJBUVLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaO2vOQKImtWDoCgMa2koTCsDZNGuIjpIFwQBIYBahGI2UkORyukUKhyVgz0Yv2csW6thcNBBIVMRikSCRFoaAK8ALpQD+QCHiCZrHQBP4BKBUVGgmGCX6BUQaMBmUkFhYuIQAAIfkEBQoAGgAsAQABABAAEAAABWagJo4aAJAoaZrp6DjaIA/a86BZnmlNo2FADEm3GwWFJAgkNZmQIpHWSCLRFK4FKWKLIHgJUoFYoKlUpCIxabFIKRSohDxButgvJIPeoKFQNHd4JBYWGgeHBxoMDGgBjgFoJI4tIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6a45Aoma1ZOkaRxrYAgBZ4oUGQVtckgpBAGhgHqEol1WiQFgvX6PHQJK4JKWaLMXgNWq7GYpGKJhMShZKSSFCH+IGEqCNIgXxAo1BoBIACKHkaF4YXf4JSh4hmIwwMLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOWhSRKFmsRToui0bMhOY4aKInWlVpmWCGZCgaSMIhyWJJQSAkCsU1AgA0h+yBarUGvgHqYDzQfKmiRoOkUKQeD9RlfiFh7hgSvS6RaPB5JAwMGgiGCBoTE2gCjQJoJI0uIQAAOw==",
		// Google
		35:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAAAgCAYAAADAHpCrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDNTg1MUJDRkE4QjVFMjExQkU4RUMxQzAxMzc5MTg4OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNDQyNDJEMUI1QTgxMUUyODBGNEFBRUEwREY0QjkzQiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNDQyNDJEMEI1QTgxMUUyODBGNEFBRUEwREY0QjkzQiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNTg1MUJDRkE4QjVFMjExQkU4RUMxQzAxMzc5MTg4OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNTg1MUJDRkE4QjVFMjExQkU4RUMxQzAxMzc5MTg4OSIvPiA8L3JkZjpEZXNjcmlwdGlv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",
		// undefine
		80:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATxJREFUKM91kT1uE2EURW9J6SV4CVmCu5QpKZ2OinFJeWtEQfOGGTJWMuOfmQwOGDOKE1f0CIkVoCzBSzgpvgghRN4t33nSuXpCKCMjA/0vQhlpMt79rl25mMYkRpIkIWXAgY4DkHHjjWuXxDHO/wAdHQAHMj76zp+4pCCIk7+AH1zTkdF5yZ6WioUXb2KEhF7TPd1Hu2PBwBcqD+6dnyKhtz9Ti/dtsY1xTBbfb137zmuXD0goXLrxV7fH5B7jxntvXVOAhHLP3fuW4iFVixet791RkSegcOMdNTtStfL04BuuKIhjAmZrPjPnGyv30920d09PzzUXL5PDeUfDnN73bjx4z56BLWvHGAlJF7+CJLrxJUuWNFw5P5OegBjFq9yVVx5oKCn/+Vdyn+SzihUbPhCzOElLJJ6NQOgROBktk7FXYdYAAAAASUVORK5CYII=",
		};
		
	const API_HREF_SERVICE_GOOGLE = "http://safebrowsing.clients.google.com/safebrowsing/diagnostic?site=";
	const TIMEOUT_GOOGLE = 10000;

	SP_SINGLE_SAFE_GOOGLE = function(  ){

		var self = this;
		this.google = [];
		this.urlGoogle = null;
		
		// --------------  Google  -----------------------------------------------------------------------------
		this.set_PreviewDimensions_Google = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("style","position:relative; height:32px; display:block; margin-left:20px;");

			var img = document.createElement("img");
			img.setAttribute("src", FILE_IMAGES[35]);
			img.setAttribute("style","position:absolute; cursor:pointer");
			img.setAttribute("id", "sp_icon_google");
			img.style.left="0px";
			img.style.top="0px";
			divb.appendChild( img );
			img.addEventListener("click", function( event ){	sp_single.navigate_url('http://safebrowsing.clients.google.com/safebrowsing/diagnostic?site='+self.urlGoogle, event);					}, true);
			img.addEventListener("mouseout",function(event){
									var msg_google = document.getElementById("sp_fullDivTip_google_message");
									if (msg_google)  msg_google.style.display = "none";
								},true);
		
			img.addEventListener("mouseover",function(event){
									var msg_google = document.getElementById("sp_fullDivTip_google_message");
									if (msg_google)
									{
										msg_google.style.left = "45px";
										msg_google.style.top = "28px";
										msg_google.style.display = "block";
									}	
								},true);
	

			var imgR = document.createElement("img");
			imgR.setAttribute("id", "sp_fullDivTip_google");
			imgR.setAttribute("style","position:absolute; cursor:pointer");
			imgR.style.top="5px";
			imgR.style.left="150px";
			imgR.setAttribute("src", FILE_IMAGES[20]);
			divb.appendChild( imgR );
			imgR.addEventListener("click", function( event ){	sp_single.navigate_url('http://safebrowsing.clients.google.com/safebrowsing/diagnostic?site='+self.urlGoogle, event);					}, true);
			imgR.addEventListener("mouseout",function(event){
									var msg_google = document.getElementById("sp_fullDivTip_google_message");
									if (msg_google)  msg_google.style.display = "none";
								},true);
		
			imgR.addEventListener("mouseover",function(event){
									var msg_google = document.getElementById("sp_fullDivTip_google_message");
									if (msg_google)
									{
										msg_google.style.left = "145px";
										msg_google.style.top = "28px";
										msg_google.style.display = "block";
									}	
								},true);
	
			sp_single.spSafe.set_Message_Title( divb, 145, 28, "sp_fullDivTip_google_message", "sp_fullDivTip_google_text" );		
			div.appendChild( divb );
		}	
	
		// ===========================================================================================
		this.Proverka_Google = function( url, host )  {      
			if (  sp_single.branch.getBoolPref('service_google') )
			{
				setTimeout(function() {   
								self.read_Google( url, function( status, message ){  

															if (status == "green")
															{
															
																self.read_Google( host, function( s, m ){  
								
																						self.urlGoogle = host;
																						self.show_Div_Google( host, s, m );		
																						
																					} ); 	 
															}
															else
															{
																self.urlGoogle = url;
																self.show_Div_Google( url, status, message );		
															}	
																
														} ); 	 
							},  300 );
			}					
		}
		
		// ===========================================================================================
		this.read_Google =  function( url, callback ){

			if ( this.google[url] && this.google[url].trim() == "") this.google[url] = null;
		
			if ( this.google[url] != null )
			{
				callback(this.google[url]);
				return; 
			}	
			sp_single.alert('read_Google: '+url);	
			
				
			var request = new XMLHttpRequest();
			var surl = API_HREF_SERVICE_GOOGLE + sp_single.spLink.encode(url) + "&hl=en";
				
			request.open('GET', surl, true);
			request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			request.setRequestHeader('Cache-Control', 'no-cache');
			request.responseType = 'document';
		
			request.send(null);  
		
			request.onreadystatechange = function()			{
						if (request.readyState==4 && request.status==200)
						{
							clearTimeout(self.GoogleTimer);
						
							var doc = request.response;
									
							var blocks = doc.getElementsByTagName( 'blockquote' );		
							var block = blocks[0];
									
							var p = block.getElementsByTagName( 'p' );		
									
							var status = "";
							var msg = "";
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
						
							if ( status == "" )
							{
								callback( null );
								return;
							}	
sp_single.alert('read_Google:::: '+status+' - '+msg);	

							self.google[url] = status + "|" + msg;
							var current_dt = new Date();
							var current_time = current_dt.getTime();
							sp_single.storage.writeHost( { host: url,	srv:  'Google',	rez:  self.google[url], dat: current_time 	} )
							
							callback(self.google[url]);
							return status;
						}
					}
			request.onerror = function(){
					sp_single.alert("Google - Error: "+url) 
					callback( null );
				}
				
			this.GoogleTimer = setTimeout( function() { 
		
							sp_single.alert("Google Time over: "+url) 
							request.abort();   
							
							callback(null);
							
						}, TIMEOUT_GOOGLE);
		}					
	
		// ===========================================================================================
		this.get_Status_Google = function( v )  {    
			if ( v == null) return { r: 80, m: null };
			var tmp = v.split("|");
			var rr = 80, mm = "";
			
			var document = gBrowser.selectedBrowser.contentDocument;
			var div = document.createElement("div");
			if (tmp[0] == "green")
			{
				var span1 = document.createElement("span");
				span1.setAttribute("style","color:#000; font-weight: bold;");
				span1.textContent = "This site ";
				div.appendChild( span1 );
				
				var span2 = document.createElement("span");
				span2.setAttribute("style","color:#093; font-weight: bold;");
				span2.textContent = "is not";
				div.appendChild( span2 );

				var span3 = document.createElement("span");
				span3.setAttribute("style","color:#000; font-weight: bold;");
				span3.textContent = " currently listed as suspicious.";
				div.appendChild( span3 );
				
				return { r: 3, m: div }
			}		
			else if (tmp[0] == "yellow")
			{
				var span1 = document.createElement("span");
				span1.setAttribute("style","color:#000; font-weight: bold;");
				span1.textContent = "This site ";
				div.appendChild( span1 );
				
				var span2 = document.createElement("span");
				span2.setAttribute("style","color:red; font-weight: bold;");
				span2.textContent = "is not";
				div.appendChild( span2 );

				var span3 = document.createElement("span");
				span3.setAttribute("style","color:#000; font-weight: bold;");
				span3.textContent = " currently listed as suspicious.";
				div.appendChild( span3 );

				var br1 = document.createElement("br");
				div.appendChild( br1 );

				var br2	 = document.createElement("br");
				div.appendChild( br2 );

				var span4 = document.createElement("span");
				span4.setAttribute("style","color:#000; font-weight: bold;");
				span4.textContent = "Part";
				div.appendChild( span4 );
				
				var span5 = document.createElement("span");
				span5.setAttribute("style","color:#000; ");
				span5.textContent = " of this site ";
				div.appendChild( span5 );
				
				var span6 = document.createElement("span");
				span6.setAttribute("style","color:#000; font-weight: bold;");
				span6.textContent = "was listed";
				div.appendChild( span6 );
				
				var span7 = document.createElement("span");
				span7.setAttribute("style","color:#000; ");
				span7.textContent = " for suspicious activity ";
				div.appendChild( span7 );
				
				var t = tmp[2].match(/activity(.*?)time/i);
				var span8 = document.createElement("span");
				span8.setAttribute("style","color:red; font-weight: bold;");
				span8.textContent = t[1]+" time(s)";
				div.appendChild( span8 );
				
				var span9 = document.createElement("span");
				span9.setAttribute("style","color:#000; ");
				span9.textContent = " over the past 90 days.";
				div.appendChild( span9 );

				return { r: 2, m: div }
			}		
			else if (tmp[0] == "red")
			{
				var span1 = document.createElement("span");
				span1.setAttribute("style","color:#000; font-weight: bold;");
				span1.textContent = "Site ";
				div.appendChild( span1 );
				
				var span2 = document.createElement("span");
				span2.setAttribute("style","color:red; font-weight: bold;");
				span2.textContent = "is";
				div.appendChild( span2 );

				var span3 = document.createElement("span");
				span3.setAttribute("style","color:#000; font-weight: bold;");
				span3.textContent = " listed as suspicious - visiting this web site ";
				div.appendChild( span3 );
			
				var span4 = document.createElement("span");
				span4.setAttribute("style","color:red; font-weight: bold;");
				span4.textContent = "may harm";
				div.appendChild( span4 );

				var span5 = document.createElement("span");
				span5.setAttribute("style","color:#000; font-weight: bold;");
				span5.textContent = " your computer";
				div.appendChild( span5 );
				
				return { r: 1, m: div }
			}		
			return { r: 80, m: div }
		}

		// ===========================================================================================
		this.show_Div_Google = function( url, s, m )  {  
			var status = this.get_Status_Google( s );
			var document = gBrowser.selectedBrowser.contentDocument;
			var img_google = document.getElementById("sp_fullDivTip_google");
			if ( img_google )
			{
				var imageUrl = FILE_IMAGES[status.r];
				img_google.setAttribute("src", imageUrl);
			}	
		
			var msg_google = document.getElementById("sp_fullDivTip_google_text");
			if ( msg_google )
			{
				while( msg_google.firstChild )
				{
					msg_google.removeChild( msg_google.firstChild );
				}
				msg_google.appendChild( status.m );
			}
		}
	
		// ================================================================================================
		this.refresh_google = function(  )  {  
			this.google[sp_single.spSafe.curHref] = null;

			var document = gBrowser.selectedBrowser.contentDocument;
			var img_google = document.getElementById("sp_fullDivTip_google");
			if ( img_google )  img_google.setAttribute("src", FILE_IMAGES[20]);
	
			this.Proverka_Google(sp_single.spSafe.curHref, sp_single.spSafe.curHost);
		}
		
		
		// ================================================================================================
	}	
})();
