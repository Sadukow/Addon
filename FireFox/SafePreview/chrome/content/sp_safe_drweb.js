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
		// DrWeb
		47:  "data:image/jpg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAEQgAHAApAwERAAIRAQMRAf/EAJMAAAEFAQEAAAAAAAAAAAAAAAYBAwQHCAIFAQACAwEBAAAAAAAAAAAAAAABAwAEBgIFEAABAwQBAwIFAgcBAAAAAAACAQMEERIFBhQAIRMVFjFBIgcXMkJhcZGipCVmJxEAAQMBBAYGCwEAAAAAAAAAAQARAgMxEhMEIUGRsSIyUWHRchQF8HGBocFCYoKiM2Mk/9oADAMBAAIRAxEAPwAfiMa7I1LEQnNXAZCtYhHZJ4vDAKIpa+TjpTG3zmOIYzFJat3Ocu00TxFRGaJFKRFt07kDYpOyYLSZ7U7Da6OHxu0QiRRYdhQ6mSAheNQfaKoGhp9YfBfn8U6zeXq1okTqX5Uz9UtugpYJXg4fJaTi8ZCgZzXFye1yUIn8W3iofJBQ7EgtstND46ApjWpKPf4U6s1aVacjKE7tMa78m3n1IkFMZNjB7S9jHNFhxIkZ0iHKvvYyAUaKDfdSdV1kjR0rktG+0kTtTuvXVO/REsYkn5WlJz77FLLURZfHfbeRquxR8VFxs3I4nGPE/LYix7xc8LiA4rjLYti4pNqtApRfknbqpTnmBVgZGQjKQ0OenrL7UA7rN3WrTVoDDsZeTousZU81mVgDPwsUIgTpZYN1G5At8dIuTCGXmbJi9eE5LbE2z+lluy2vm/0z7p3IGxOS4rub3J5zM63AxkZZESK9NzJK4clKGoNQaWNE4dKLaZfKqLSnXhRmKdICE5SLEtHV3tbJepN6jsmP2ZMzsmPwOTm5WDLQ52uYlicp5SLIabYio5loSOOwjjE068Q2iDqIgoircvXrUPL4xiBLjbps2drrsRSSshruP3CdpD7fqcmXAQsxn8xAdxSOzIwPzWnJEF0gMWW45topkgGSopVUVFUrZzKmAE4GXCbB1sOH0KEguIDmRia7t8D24xCiv4x2S5l8ca+nPXQVsWMhiNwqifsUqKq1/jTmIynTlfJIkBdPNza0FQfWkTFa2u6snF0/cHpTkgpz8GC56ixlLhlR8n4WggShjjBMQgxQGxyQVoo4iChCCDXzf6Z907kDYjz7u6bkZ4RNow7jhZXBqjwxakQGDZI5VsEXsaKP7f1f06zvlmajF6c+WetLidSdwX221rI7Rj9siOtsYLMME7lYpQ4U0kR5rygcVufHlsgavIF9Qqg3UVK06tZfzQ0np1QTd0OiJNahvLaC9rWsSka8UzcdqeSApRmkZYbSQSuPtx2mhbFtpAErlQBFB+Qp26MM/j1XPDShxdj/AACl5yisNTb1b7TZnEi+chwcbNcfcIlUfIbBKSNiv6Ar8ET+a91XrzzmcbNRkzcUd65dysw9a9OV6RPXeKHB9r+5PSdb5tvrnP4HnxXp/l8n+urdw/N4u9Lre9ek5hsOV6y6X2IGxF//ALV/zf8An9ZT/J/T8UrQo+P/AC5xR4Ptji1Ozx86yt63W07Uur8OmVPDPxYr/ajoSO/lznR/L7Y5ljnGu511v0+S3+2vUHhrpbFu6H5fYpoUTavy77XzHP8Ab/B4Mnl+Dm+XxeIr/Hf9N9tba9q9dZfwuJG7iPeDcvSoGdZw61aav//Z",		
		// undefine
		80:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATxJREFUKM91kT1uE2EURW9J6SV4CVmCu5QpKZ2OinFJeWtEQfOGGTJWMuOfmQwOGDOKE1f0CIkVoCzBSzgpvgghRN4t33nSuXpCKCMjA/0vQhlpMt79rl25mMYkRpIkIWXAgY4DkHHjjWuXxDHO/wAdHQAHMj76zp+4pCCIk7+AH1zTkdF5yZ6WioUXb2KEhF7TPd1Hu2PBwBcqD+6dnyKhtz9Ti/dtsY1xTBbfb137zmuXD0goXLrxV7fH5B7jxntvXVOAhHLP3fuW4iFVixet791RkSegcOMdNTtStfL04BuuKIhjAmZrPjPnGyv30920d09PzzUXL5PDeUfDnN73bjx4z56BLWvHGAlJF7+CJLrxJUuWNFw5P5OegBjFq9yVVx5oKCn/+Vdyn+SzihUbPhCzOElLJJ6NQOgROBktk7FXYdYAAAAASUVORK5CYII=",
		};
		
	const API_HREF_SERVICE_DRWEB = "http://online.us.drweb.com/result/?lng=en&chromeplugin=1&url=";
	const TIMEOUT_DRWEB = 10000;

	SP_SINGLE_SAFE_DRWEB = function(  ){

		var self = this;
	
		this.drweb = [];
	
		this.serviseLink = null;

		// --------------  DrWeb  -----------------------------------------------------------------------------
		this.set_PreviewDimensions_DrWeb = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("style","position:relative; height:24px; display:block; margin-left:20px;");

			var img = document.createElement("img");
			img.setAttribute("src", FILE_IMAGES[47]);
			img.setAttribute("title", "Check out this URL at DrWeb");
			img.setAttribute("style","position:absolute; cursor:pointer");
			img.setAttribute("id", "sp_icon_drweb");
			img.style.left="0px";
			img.style.top="0px";
			divb.appendChild( img );
			img.addEventListener("click", function( event ){	sp_single.navigate_url(self.serviseLink, 1);	}, true);
		
			var imgR = document.createElement("img");
			imgR.setAttribute("id", "sp_fullDivTip_drweb");
			imgR.setAttribute("style","position:absolute; cursor:pointer");
			imgR.style.top="5px";
			imgR.style.left="80px";
			imgR.setAttribute("title", "Refresh");
			imgR.setAttribute("src", FILE_IMAGES[20]);
			divb.appendChild( imgR );
			imgR.addEventListener("click", function( event ){   self.refresh_drweb( );			}, true);

			div.appendChild( divb );
		}	
	
		// ===========================================================================================
		//  ----  запрос на DrWeb
		this.Proverka_DrWeb = function(  url, host  )  {      
			if (  sp_single.branch.getBoolPref('service_drweb') )
			{
				setTimeout(function() {   
								self.read_DrWeb( url, function(  ){  

																	self.show_Div_DrWeb( url );		
																
																} ); 	 
							},  300 );
			}					
		}
	
		// ===========================================================================================
		this.read_DrWeb =  function( url, callback ){

			var surl = API_HREF_SERVICE_DRWEB + sp_single.spLink.encode(url);
			this.serviseLink = surl;
			
			if (this.drweb[url] != null) 
			{ 
				callback( );  
				return; 
			}

sp_single.alert('read_DrWeb: '+surl);	
			var request = new XMLHttpRequest();

			request.open('GET', surl, true);
			request.send(null);  
		
			request.onreadystatechange = function()			{
								if (request.readyState==4 && request.status==200)
								{
									clearTimeout(self.DrWebTimer);
									var e = request.responseText;
									var rr = '';
									rr = self.get_mezhdu_drweb(e, '<img align="right"', '.gif', 75, 2000 );
//sp_single.alert(rr);						
									if ( rr != '' )
									{
										var p = rr.lastIndexOf('/');
										rr = rr.substr(p+1);
									}	

									if ( rr == '' )
									{
										callback( null );
										return null;
									}	
									
									self.drweb[url]	= rr;
									sp_single.alert('read_DrWeb:::: '+self.drweb[url]);	
									sp_single.storage.writeHost( { host: url,	srv:  'DrWeb',	rez:  self.drweb[url], dat: new Date().getTime() 	} )
									
									callback(self.drweb[url]);
									return rr;
						
								}
							}
			request.onerror = function(){
					sp_single.alert("DrWeb - Error: "+url) 
					callback( null );
				}
				
			this.DrWebTimer = setTimeout( function() { 
		
							sp_single.alert("DrWeb Time over: "+url) 
							request.abort();   
							
							callback( null );
							
						}, TIMEOUT_DRWEB);
		}					
						
		// ---  с парсить результат
		this.get_mezhdu_drweb = function( str, str1, str2, len = 20, h = 0 )  {    
		
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
	
		// ===========================================================================================
		this.get_Status_DrWeb = function( v )  {    
			if ( v == null) return 80;
			var status = 80;
			if ( v == 'clean_en' ) status = 3;
			else if ( v == 'icoNSecured' ) status = 3;
			else if ( v == 'icoWarning' ) status = 2;
			else if ( v == 'icoCaution' ) status = 1;
			else if ( v == 'icoUntested' ) status = 0;
			return status;
		}
	
		// ===========================================================================================
		this.show_Div_DrWeb = function( url )  {    
			var status = this.get_Status_DrWeb( this.drweb[url] );
			var document = gBrowser.selectedBrowser.contentDocument;
			var img_drweb = document.getElementById("sp_fullDivTip_drweb");
			if ( img_drweb )
			{
				var imageUrl = FILE_IMAGES[status];
				img_drweb.setAttribute("src", imageUrl);
			}
		}
	
		// ================================================================================================
		this.refresh_drweb = function(  )  {  
			this.drweb[this.curHref] = null;

			var document = gBrowser.selectedBrowser.contentDocument;
			var img_drweb = document.getElementById("sp_fullDivTip_drweb");
			if ( img_drweb )  img_drweb.setAttribute("src", FILE_IMAGES[20]);
	
			this.Proverka_DrWeb(this.curHref, this.curHost);
		}
		
// ================================================================================================
	}	
})();
