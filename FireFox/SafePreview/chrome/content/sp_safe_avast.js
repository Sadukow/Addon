// class describes downloads for specified window
(function(){

	const FILE_IMAGES = {
		0:	 "data:image/gif;base64,R0lGODlhEgASAMZ2AP39/fX19ePj4+7u7urq6uzs7HNycvr6+v7+/vj4+NbW1rGxseno6GdnZ/z8/Ovr62tqauTk5JOSkmBfX6ampunp6b69vYiIiMLCwuXl5djY2LCwsKCgoPPz856dnWJhYYSDg3d3d+Hh4fj395iXl+/v7/b29lRUVHZ1dXp6et/f35WVlVhYWOjo6IuKi319fZ+ensfHx8nJyXx8fKioqLSzs4KBgbu6unV1dXp5eaalpXRzc8TExHV0dN3d3bi4uIWFhWVlZYaFhbGwsJaWlsbFxaqqqmppaYiHh7W1tYGBgYWEhNDQ0Pf3+G9vb1FRUXZ2dvTz82hnZ9zc3GZmZvHx8b29vWRkZHJxccfGxmloaM3NzdjX16Ghoff4+IaGhqOjo35+frm5ufv7+25ubry8vHh4eI+Pj1dXV7e3t/v6+qWkpIyMjJybm9rZ2aGgoPDw8Ofn5/Ly8vT09Pn5+ff39////////////////////////////////////////yH5BAEAAH8ALAAAAAASABIAAAf+gH+Cg4IMhIeHFkgTKBBSEm6IgnFmbwoAmCZFSySIAkc/DgkdCXQBdA46IIdYNwcHdRk8C2UqUQdrHoMbFHR0dQthK2dXFxG/HwKCBhl1dVUhTy5JaFQYzmlgfy09Ad51RiFWHCxkGt5TKX8KX3PuJnIdMUE4WWruD1rrQnL9TXQA2MwQAWBOvwcN/jDYAadhAgd1XjCxM6chHA05lvkYMMALgggXMCCAw3FAjS6CNnAoUECOHQonnNApwZJAMkEjDCwgQGDOFiA0EJTg6aENIQENhlSI8yCOnDhxKsCwQeeQACgkZECNI0KMEiIjJI2xAGKCAQgNJHCRhIiBHLYCgQAAOw==",
		1:   "data:image/gif;base64,R0lGODlhEgASAMQfAMUpAuM2DcpXMP349/jp5MM5C+Ook+m6qfLVy9c6Ct2TevRFFdstCu7IussdAscWBtElBcAyA/fj3eo/EM0cCeCdhs9lQsEQA9Z+YNiDZ9BrSfrw7M4gA7QBAf///////yH5BAEAAB8ALAAAAAASABIAAAWZ4CeOZGmOW2McxEkiWgTMkdC4huzs+6yYBwBnSCQCKqRNAQK5dC7NJzMiGSkAUc+zo4UCMiMBg8H1aM3acWFUGD/K6M5jHNmIIoH8O/7IByItHwJ6cGZyeREDIhgJE3CPEwEaIwgRExRcHZhaFBMJBySMC5gUo5oLCRYlAxYJC6+wqAJ2qwoFjROeERiKLgQGGQIYFVUuxiYhADs=",
		2:	 "data:image/gif;base64,R0lGODlhEgASAMZCAPTWUPrtlLdoAvnpiPHNNvPTR/LQPuvSh+LDm/rul9y0ZPPVTPrvm/fpn/z589OjZfrvo8uTSrdqBLtxELdpBP/+/vXu5vnpiefFW+/gwLpwEPLYZ/TWUvDLL/PXWPPTTOPEm/vxo+LEm9mqQPntnebASrZpAvHNNd6zK/DPSvrulv79+vLRQOPLnvbfb/PUS7dzAPLQPfrwpdOjZPz68/PSR7pxEPfw19KiZPDKK9mrQ+zYb+zYdsiMPsyYFfbs3/rtk8GEAv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAH8ALAAAAAASABIAAAfwgH+Cg4SFhoIiPRomJho9Iod/Pw8SBw0yMg0HEg8/hT8RChAMPEFBOwwQChGegzgKIQkBPjc3PgEJIQo4gyASELJAQSsrQUC4EBIggj0HDAFAwjQ0xscMBz2CNg0q0cIODtVAKg02ggIkFwPrQeBB6wMXJALnLhwA+D4ZGT74ABwu6P2ZsOFFgYMoTKE4WODFhgnMMCxgYcBAkBYtglRksQBDtj8IKHiIQeAEDAsWYJwgEMMDBQSDZuhYQKCDD1M+OhBYoGMGIVAjPhDI4cNHDgIfRrD69IBCiRQ1aqQoQaFTJAQ9JggQMKEHzEhgCwUCADs=",
		3:   "data:image/gif;base64,R0lGODlhEgASAPeCALTttfLy8mHSYNTm1FfPVt3r3CmEJ6jqqRd7FmvWa/T484Pdg93733fad/b69k7MTfPz88DbwDSLMlmgWI/hkEKTQZvGmju0OpzmnIe6hg92DQx0Cvz8/Bp8GPf398jgyCeYJj+RPv///z+4PsXjxWeoZkW3RKnaqmrVak26TITOhGOxYWGuYaDfodjm1z2UPEvISsPdwk+pTszhzO717i6ILZzbnTGJL1+tXnCtb1W4VPn8+YvYi/Dy8KThpHPJc+rz6R2DG2KsYhyKG+v064ncisrgysHewF+jXi6QLUiWRzuxOs3izdP11W/Mb0uwSiqHKRF7Dy6eLWKlYNbl1nO7ch2TG+Xs5TihN3OvcsbexcDcv226bdnn2cPxxfDx8Nrq2pfNlxSAEki2R5PLlFW6VTGSMD+1Pj6rPWWvZTKeMJTfk32/fbLWsjeuNnzAfPz9/DiqN0K1Qo7Xj7/fvxt+GmrOaiKFIE63TdPk02qqaWrGadnp2X7NfsDxwcr1zNT41hmQF////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAIIALAAAAAASABIAAAj/AAUJHCiwAA2CCAfCsaBkA5Q6CCZoSSgQzA0hJxhobELmxRQHCAd0YAOopMmSaSqAFKjAwJs/MGP+sRHICws9AzPg8MOzpx8VgaoE8qFhgEADLQAoXdonEAkRYQJxySKowJ0DWAPxOPAjEB0OHIBYmSNBUAQzGDAEkhFoT6AjHjzwCaRjTQezSSgEWtFjS6A2ECC4CFSGQhEEVYMsCGQkQIArXwJQCYRnwQInZQUZsJMi0AzHAfIEGtOg9JMcAjNgSWAiEBMIXQLJSUAbRVGWBtAIOBPoQ6AlAoILUFOC4AAEcQhcCHSBgHMCUkKsHDigBogRD7LDcDMEiQKKOyxUDdggJkrEGBQTFiCSPiAAOw==",
		// loading
		20:  "data:image/gif;base64,R0lGODlhEgASAMQaAHl5d66urMXFw3l5dpSUk5WVlKOjoq+vrsbGw6Sko7u7uaWlpbm5t3h4doiIhtLSz4aGhJaWlsbGxNHRzrCwr5SUkqKiobq6uNHRz4eHhf///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAaACwAAAAAEgASAAAFaqAmjmRplstyrkmbrCNFaUZtaFF0HvyhWRZNYVgwBY4BEmFJOB1NlYpJoYBpHI7RZXtZZb4ZEbd7AodFDIYVAjFJJCYA4ISoI0hyuUnAF2geDxoDgwMnfBoYiRgaDQ1WiIqPJBMTkpYaIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo4aRZEoeaxHOiqKFsyBtizopV9ynfwJ0o43MhgNKAYjZbGQJBLXKBLRIK4IaWFbEHgFUoKYoPFKRZUK6fFIORwojBxDytgzpDkdANDc8SQTExp8fBoQEGcDiwNnJA0NLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOmqKQKHmtVzpKksa2FIUiOKIxjHb8B5JgKCAFjgHUMHUkPR6u0WKhwVgx0YQ2ccW6DGCDZjKJiiwWEgCQikRQ6zWpQC+QBviBxuHQEP4EKA0NGhmGGRoVFWaHiGYjEBAuIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6aJJEoiaxIOj6PJsyCpigopmNyff0X0o43AgZJk0mKwSABAK4RhaJ5PqOH7GHAHUQD4ICm0YiKwCSHI7VYoDLwDClBT5Di8khEY+gbUBAQGgWEBRoWFmYEiwRmJBUVLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaO2vOQKImtWDoCgMa2koTCsDZNGuIjpIFwQBIYBahGI2UkORyukUKhyVgz0Yv2csW6thcNBBIVMRikSCRFoaAK8ALpQD+QCHiCZrHQBP4BKBUVGgmGCX6BUQaMBmUkFhYuIQAAIfkEBQoAGgAsAQABABAAEAAABWagJo4aAJAoaZrp6DjaIA/a86BZnmlNo2FADEm3GwWFJAgkNZmQIpHWSCLRFK4FKWKLIHgJUoFYoKlUpCIxabFIKRSohDxButgvJIPeoKFQNHd4JBYWGgeHBxoMDGgBjgFoJI4tIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6a45Aoma1ZOkaRxrYAgBZ4oUGQVtckgpBAGhgHqEol1WiQFgvX6PHQJK4JKWaLMXgNWq7GYpGKJhMShZKSSFCH+IGEqCNIgXxAo1BoBIACKHkaF4YXf4JSh4hmIwwMLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOWhSRKFmsRToui0bMhOY4aKInWlVpmWCGZCgaSMIhyWJJQSAkCsU1AgA0h+yBarUGvgHqYDzQfKmiRoOkUKQeD9RlfiFh7hgSvS6RaPB5JAwMGgiGCBoTE2gCjQJoJI0uIQAAOw==",
		// Avast
		43:  "data:image/gif;base64,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",		
		// undefine
		80:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATxJREFUKM91kT1uE2EURW9J6SV4CVmCu5QpKZ2OinFJeWtEQfOGGTJWMuOfmQwOGDOKE1f0CIkVoCzBSzgpvgghRN4t33nSuXpCKCMjA/0vQhlpMt79rl25mMYkRpIkIWXAgY4DkHHjjWuXxDHO/wAdHQAHMj76zp+4pCCIk7+AH1zTkdF5yZ6WioUXb2KEhF7TPd1Hu2PBwBcqD+6dnyKhtz9Ti/dtsY1xTBbfb137zmuXD0goXLrxV7fH5B7jxntvXVOAhHLP3fuW4iFVixet791RkSegcOMdNTtStfL04BuuKIhjAmZrPjPnGyv30920d09PzzUXL5PDeUfDnN73bjx4z56BLWvHGAlJF7+CJLrxJUuWNFw5P5OegBjFq9yVVx5oKCn/+Vdyn+SzihUbPhCzOElLJJ6NQOgROBktk7FXYdYAAAAASUVORK5CYII=",
		};
		
	const TIMEOUT_AVAST = 10000;
		
	const API_AVAST_SERVICE_SERVER = "http://ui.ff.avast.com";
	const API_AVAST_SERVICE_PORT = "80";
	const API_AVAST_SERVICE_URLINFO = "urlinfo";

	const CONFIG_CALLERID = 4;
   	const CONFIG_GUID = null;
   	const CONFIG_USERID = null;

	const DEFAULTS_URLINFO_MASK_webrep = 1;
    const DEFAULTS_URLINFO_MASK_phishing = 2;
			
	SP_SINGLE_SAFE_AVAST = function(  ){

		var self = this;
		
		this.avast = [];
		
		// --------------  Google  -----------------------------------------------------------------------------
		this.set_PreviewDimensions_Avast = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("style","position:relative; height:40px; display:block; margin-left:15px;");

			var img = document.createElement("img");
			img.setAttribute("src", FILE_IMAGES[43]);
			img.setAttribute("style","position:absolute; cursor:pointer");
			img.setAttribute("id", "sp_icon_avast");
			img.style.left="0px";
			img.style.top="0px";
			divb.appendChild( img );
			img.addEventListener("click", function( event ){	sp_single.navigate_url('http://safebrowsing.clients.google.com/safebrowsing/diagnostic?site='+self.urlGoogle, event);					}, true);

			var imgR = document.createElement("img");
			imgR.setAttribute("id", "sp_fullDivTip_avast");
			imgR.setAttribute("style","position:absolute; cursor:pointer");
			imgR.style.top="7px";
			imgR.style.left="125px";
			imgR.setAttribute("src", FILE_IMAGES[20]);
			divb.appendChild( imgR );
			imgR.addEventListener("click", function( event ){	sp_single.navigate_url('http://safebrowsing.clients.google.com/safebrowsing/diagnostic?site='+self.urlGoogle, event);					}, true);
	
			div.appendChild( divb );
		}	
	
		// ===========================================================================================
		this.get_Status_Avast = function( v )  {    
			return { r: 80, m: div }
		}

		// ===========================================================================================
		this.show_Div_Avast = function( url, s, m )  {  
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
		this.refresh_avast = function(  )  {  
		
			this.avast[this.curHref] = null;

			var document = gBrowser.selectedBrowser.contentDocument;
			var img_avast = document.getElementById("sp_fullDivTip_avast");
			if ( img_avast )  img_avast.setAttribute("src", FILE_IMAGES[20]);
	
			this.Proverka_Avast(this.curHref, this.curHost);
		}
		
		// ===========================================================================================
		this.Proverka_Avast = function( url, host )  { 
		
		}
		
		// ==================================================================================

		
		
		
		// ================================================================================================
	}	
})();
