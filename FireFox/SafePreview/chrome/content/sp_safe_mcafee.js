// class describes downloads for specified window
(function(){

	const FILE_IMAGES = {
		0:	 "data:image/gif;base64,R0lGODlhEgASAMZ2AP39/fX19ePj4+7u7urq6uzs7HNycvr6+v7+/vj4+NbW1rGxseno6GdnZ/z8/Ovr62tqauTk5JOSkmBfX6ampunp6b69vYiIiMLCwuXl5djY2LCwsKCgoPPz856dnWJhYYSDg3d3d+Hh4fj395iXl+/v7/b29lRUVHZ1dXp6et/f35WVlVhYWOjo6IuKi319fZ+ensfHx8nJyXx8fKioqLSzs4KBgbu6unV1dXp5eaalpXRzc8TExHV0dN3d3bi4uIWFhWVlZYaFhbGwsJaWlsbFxaqqqmppaYiHh7W1tYGBgYWEhNDQ0Pf3+G9vb1FRUXZ2dvTz82hnZ9zc3GZmZvHx8b29vWRkZHJxccfGxmloaM3NzdjX16Ghoff4+IaGhqOjo35+frm5ufv7+25ubry8vHh4eI+Pj1dXV7e3t/v6+qWkpIyMjJybm9rZ2aGgoPDw8Ofn5/Ly8vT09Pn5+ff39////////////////////////////////////////yH5BAEAAH8ALAAAAAASABIAAAf+gH+Cg4IMhIeHFkgTKBBSEm6IgnFmbwoAmCZFSySIAkc/DgkdCXQBdA46IIdYNwcHdRk8C2UqUQdrHoMbFHR0dQthK2dXFxG/HwKCBhl1dVUhTy5JaFQYzmlgfy09Ad51RiFWHCxkGt5TKX8KX3PuJnIdMUE4WWruD1rrQnL9TXQA2MwQAWBOvwcN/jDYAadhAgd1XjCxM6chHA05lvkYMMALgggXMCCAw3FAjS6CNnAoUECOHQonnNApwZJAMkEjDCwgQGDOFiA0EJTg6aENIQENhlSI8yCOnDhxKsCwQeeQACgkZECNI0KMEiIjJI2xAGKCAQgNJHCRhIiBHLYCgQAAOw==",
		1:   "data:image/gif;base64,R0lGODlhEgASAMQfAMUpAuM2DcpXMP349/jp5MM5C+Ook+m6qfLVy9c6Ct2TevRFFdstCu7IussdAscWBtElBcAyA/fj3eo/EM0cCeCdhs9lQsEQA9Z+YNiDZ9BrSfrw7M4gA7QBAf///////yH5BAEAAB8ALAAAAAASABIAAAWZ4CeOZGmOW2McxEkiWgTMkdC4huzs+6yYBwBnSCQCKqRNAQK5dC7NJzMiGSkAUc+zo4UCMiMBg8H1aM3acWFUGD/K6M5jHNmIIoH8O/7IByItHwJ6cGZyeREDIhgJE3CPEwEaIwgRExRcHZhaFBMJBySMC5gUo5oLCRYlAxYJC6+wqAJ2qwoFjROeERiKLgQGGQIYFVUuxiYhADs=",
		2:	 "data:image/gif;base64,R0lGODlhEgASAMZCAPTWUPrtlLdoAvnpiPHNNvPTR/LQPuvSh+LDm/rul9y0ZPPVTPrvm/fpn/z589OjZfrvo8uTSrdqBLtxELdpBP/+/vXu5vnpiefFW+/gwLpwEPLYZ/TWUvDLL/PXWPPTTOPEm/vxo+LEm9mqQPntnebASrZpAvHNNd6zK/DPSvrulv79+vLRQOPLnvbfb/PUS7dzAPLQPfrwpdOjZPz68/PSR7pxEPfw19KiZPDKK9mrQ+zYb+zYdsiMPsyYFfbs3/rtk8GEAv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAH8ALAAAAAASABIAAAfwgH+Cg4SFhoIiPRomJho9Iod/Pw8SBw0yMg0HEg8/hT8RChAMPEFBOwwQChGegzgKIQkBPjc3PgEJIQo4gyASELJAQSsrQUC4EBIggj0HDAFAwjQ0xscMBz2CNg0q0cIODtVAKg02ggIkFwPrQeBB6wMXJALnLhwA+D4ZGT74ABwu6P2ZsOFFgYMoTKE4WODFhgnMMCxgYcBAkBYtglRksQBDtj8IKHiIQeAEDAsWYJwgEMMDBQSDZuhYQKCDD1M+OhBYoGMGIVAjPhDI4cNHDgIfRrD69IBCiRQ1aqQoQaFTJAQ9JggQMKEHzEhgCwUCADs=",
		3:   "data:image/gif;base64,R0lGODlhEgASAPeCALTttfLy8mHSYNTm1FfPVt3r3CmEJ6jqqRd7FmvWa/T484Pdg93733fad/b69k7MTfPz88DbwDSLMlmgWI/hkEKTQZvGmju0OpzmnIe6hg92DQx0Cvz8/Bp8GPf398jgyCeYJj+RPv///z+4PsXjxWeoZkW3RKnaqmrVak26TITOhGOxYWGuYaDfodjm1z2UPEvISsPdwk+pTszhzO717i6ILZzbnTGJL1+tXnCtb1W4VPn8+YvYi/Dy8KThpHPJc+rz6R2DG2KsYhyKG+v064ncisrgysHewF+jXi6QLUiWRzuxOs3izdP11W/Mb0uwSiqHKRF7Dy6eLWKlYNbl1nO7ch2TG+Xs5TihN3OvcsbexcDcv226bdnn2cPxxfDx8Nrq2pfNlxSAEki2R5PLlFW6VTGSMD+1Pj6rPWWvZTKeMJTfk32/fbLWsjeuNnzAfPz9/DiqN0K1Qo7Xj7/fvxt+GmrOaiKFIE63TdPk02qqaWrGadnp2X7NfsDxwcr1zNT41hmQF////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAIIALAAAAAASABIAAAj/AAUJHCiwAA2CCAfCsaBkA5Q6CCZoSSgQzA0hJxhobELmxRQHCAd0YAOopMmSaSqAFKjAwJs/MGP+sRHICws9AzPg8MOzpx8VgaoE8qFhgEADLQAoXdonEAkRYQJxySKowJ0DWAPxOPAjEB0OHIBYmSNBUAQzGDAEkhFoT6AjHjzwCaRjTQezSSgEWtFjS6A2ECC4CFSGQhEEVYMsCGQkQIArXwJQCYRnwQInZQUZsJMi0AzHAfIEGtOg9JMcAjNgSWAiEBMIXQLJSUAbRVGWBtAIOBPoQ6AlAoILUFOC4AAEcQhcCHSBgHMCUkKsHDigBogRD7LDcDMEiQKKOyxUDdggJkrEGBQTFiCSPiAAOw==",
		// loading
		20:  "data:image/gif;base64,R0lGODlhEgASAMQaAHl5d66urMXFw3l5dpSUk5WVlKOjoq+vrsbGw6Sko7u7uaWlpbm5t3h4doiIhtLSz4aGhJaWlsbGxNHRzrCwr5SUkqKiobq6uNHRz4eHhf///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAaACwAAAAAEgASAAAFaqAmjmRplstyrkmbrCNFaUZtaFF0HvyhWRZNYVgwBY4BEmFJOB1NlYpJoYBpHI7RZXtZZb4ZEbd7AodFDIYVAjFJJCYA4ISoI0hyuUnAF2geDxoDgwMnfBoYiRgaDQ1WiIqPJBMTkpYaIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo4aRZEoeaxHOiqKFsyBtizopV9ynfwJ0o43MhgNKAYjZbGQJBLXKBLRIK4IaWFbEHgFUoKYoPFKRZUK6fFIORwojBxDytgzpDkdANDc8SQTExp8fBoQEGcDiwNnJA0NLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOmqKQKHmtVzpKksa2FIUiOKIxjHb8B5JgKCAFjgHUMHUkPR6u0WKhwVgx0YQ2ccW6DGCDZjKJiiwWEgCQikRQ6zWpQC+QBviBxuHQEP4EKA0NGhmGGRoVFWaHiGYjEBAuIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6aJJEoiaxIOj6PJsyCpigopmNyff0X0o43AgZJk0mKwSABAK4RhaJ5PqOH7GHAHUQD4ICm0YiKwCSHI7VYoDLwDClBT5Di8khEY+gbUBAQGgWEBRoWFmYEiwRmJBUVLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaO2vOQKImtWDoCgMa2koTCsDZNGuIjpIFwQBIYBahGI2UkORyukUKhyVgz0Yv2csW6thcNBBIVMRikSCRFoaAK8ALpQD+QCHiCZrHQBP4BKBUVGgmGCX6BUQaMBmUkFhYuIQAAIfkEBQoAGgAsAQABABAAEAAABWagJo4aAJAoaZrp6DjaIA/a86BZnmlNo2FADEm3GwWFJAgkNZmQIpHWSCLRFK4FKWKLIHgJUoFYoKlUpCIxabFIKRSohDxButgvJIPeoKFQNHd4JBYWGgeHBxoMDGgBjgFoJI4tIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6a45Aoma1ZOkaRxrYAgBZ4oUGQVtckgpBAGhgHqEol1WiQFgvX6PHQJK4JKWaLMXgNWq7GYpGKJhMShZKSSFCH+IGEqCNIgXxAo1BoBIACKHkaF4YXf4JSh4hmIwwMLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOWhSRKFmsRToui0bMhOY4aKInWlVpmWCGZCgaSMIhyWJJQSAkCsU1AgA0h+yBarUGvgHqYDzQfKmiRoOkUKQeD9RlfiFh7hgSvS6RaPB5JAwMGgiGCBoTE2gCjQJoJI0uIQAAOw==",
		// spacer
		24:  "data:image/gif;base64,R0lGODlhAQABAPAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==",
		// McAfee
		30:  "data:image/gif;base64,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",		
		// undefine
		80:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATxJREFUKM91kT1uE2EURW9J6SV4CVmCu5QpKZ2OinFJeWtEQfOGGTJWMuOfmQwOGDOKE1f0CIkVoCzBSzgpvgghRN4t33nSuXpCKCMjA/0vQhlpMt79rl25mMYkRpIkIWXAgY4DkHHjjWuXxDHO/wAdHQAHMj76zp+4pCCIk7+AH1zTkdF5yZ6WioUXb2KEhF7TPd1Hu2PBwBcqD+6dnyKhtz9Ti/dtsY1xTBbfb137zmuXD0goXLrxV7fH5B7jxntvXVOAhHLP3fuW4iFVixet791RkSegcOMdNTtStfL04BuuKIhjAmZrPjPnGyv30920d09PzzUXL5PDeUfDnN73bjx4z56BLWvHGAlJF7+CJLrxJUuWNFw5P5OegBjFq9yVVx5oKCn/+Vdyn+SzihUbPhCzOElLJJ6NQOgROBktk7FXYdYAAAAASUVORK5CYII=",
		};
		
	const API_HREF_SERVICE_MCAFEE = "http://www.siteadvisor.com/sites/";
	const TIMEOUT_MCAFEE = 10000;

	SP_SINGLE_SAFE_MCAFEE = function(  ){

		var self = this;
	
		this.mcafee = [];
	

		// --------------  McAfee  -----------------------------------------------------------------------------
		this.set_PreviewDimensions_McAfee = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("style","position:relative; height:24px; display:block; margin-left:20px;");

			var img = document.createElement("img");
			img.setAttribute("src", FILE_IMAGES[30]);
			img.setAttribute("title", "Check out this URL at McAfee");
			img.setAttribute("style","position:absolute; cursor:pointer");
			img.setAttribute("id", "sp_icon_mcafee");
			img.style.left="0px";
			img.style.top="0px";
			divb.appendChild( img );
			img.addEventListener("click", function( event ){	sp_single.navigate_url('http://www.siteadvisor.com/sites/'+self.curHost, event);					}, true);
		
			var imgR = document.createElement("img");
			imgR.setAttribute("id", "sp_fullDivTip_mcafee");
			imgR.setAttribute("style","position:absolute; cursor:pointer");
			imgR.style.top="3px";
			imgR.style.left="190px";
			imgR.setAttribute("title", "Refresh");
			imgR.setAttribute("src", FILE_IMAGES[20]);
			divb.appendChild( imgR );
			imgR.addEventListener("click", function( event ){   self.refresh_mcafee( );			}, true);

			div.appendChild( divb );
		}	
	
		// ===========================================================================================
		//  ----  запрос на McAfee
		this.Proverka_McAfee = function( host )  {      
			if (  sp_single.branch.getBoolPref('service_mcafee') )
			{
				setTimeout(function() {   
								self.read_McAfee( host, function(  ){  

																	self.show_Div_McAfee( host );		
																
																} ); 	 
							},  300 );
			}					
		}
	
		// ===========================================================================================
		this.read_McAfee =  function( host, callback ){

			if (this.mcafee[host] != null) 
			{ 
				callback( );  
				return; 
			}

			var surl = API_HREF_SERVICE_MCAFEE + host;
sp_single.alert('read_McAfee: '+surl);	
//			var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
			var request = new XMLHttpRequest();

			request.open('GET', surl, true);
			request.send(null);  
		
			request.onreadystatechange = function()			{
					if (request.readyState==4 && request.status==200)
					{
						clearTimeout(self.McAfeeTimer);
						var e = request.responseText;
						var t = '';
						t = self.get_mezhdu_mcafee(e, '-xbg2', '/images/', 20, 10000 );
sp_single.alert('read_McAfee:::: '+t);	
						if ( t != '' )
						{
							self.mcafee[host] = t;
							var current_dt = new Date();
							var current_time = current_dt.getTime();
//							var text = current_time + '; McAfee; ' + host + '; ' + sp_single.mcafee[host] + '\n';
//							sp_single.storage._write_file(AD_SIGNS_FILE, text, 0);
							sp_single.storage.writeHost( { host: host,	srv:  'McAfee',	rez:  self.mcafee[host], dat: current_time 	} )
						}
						
						callback();
					}
				}
			request.onerror = function(){
					sp_single.alert("McAfee - Error: "+host) 
					callback( null );
				}
				
			this.McAfeeTimer = setTimeout( function() { 
		
							sp_single.alert("McAfee Time over: "+host) 
							request.abort();   
							
							callback();
							
						}, TIMEOUT_MCAFEE);
		}					
						
		// ---  с парсить результат
		this.get_mezhdu_mcafee = function( str, str1, str2, len = 20, h = 0 )  {    
		
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
	
		// ===========================================================================================
		this.get_Status_McAfee = function( v )  {    
			if ( v == null) return 80;
			var status = 80;
			if ( v == 'green' ) status = 3;
			else if ( v == 'yellow' ) status = 2;
			else if ( v == 'red' ) status = 1;
			else if ( v == 'grey' ) status = 0;
			return status;
		}
	
		// ===========================================================================================
		this.show_Div_McAfee = function( host )  {    
			var status = this.get_Status_McAfee( this.mcafee[host] );
			var document = gBrowser.selectedBrowser.contentDocument;
			var img_mcafee = document.getElementById("sp_fullDivTip_mcafee");
			if ( img_mcafee )
			{
				var imageUrl = FILE_IMAGES[status];
				img_mcafee.setAttribute("src", imageUrl);
			}
			if (this.regimTest)
			{
				var div_info = document.getElementById('sp_fullDivTip_info');
				var text = div_info.getAttribute("title");
				text = text + " McAfee = " + this.mcafee[host];
				div_info.setAttribute("title",text);
			}	
		}
	
		// ================================================================================================
		this.refresh_mcafee = function(  )  {  
			this.mcafee[this.curHost] = null;

			var document = gBrowser.selectedBrowser.contentDocument;
			var img_mcafee = document.getElementById("sp_fullDivTip_mcafee");
			if ( img_mcafee )  img_mcafee.setAttribute("src", FILE_IMAGES[20]);
	
			this.Proverka_McAfee(this.curHost);
		}
		
// ================================================================================================
	}	
})();
