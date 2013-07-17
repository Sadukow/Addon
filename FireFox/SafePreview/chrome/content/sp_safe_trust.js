// class describes downloads for specified window
(function(){

	const FILE_IMAGES = {
		// loading
		20:  "data:image/gif;base64,R0lGODlhEgASAMQaAHl5d66urMXFw3l5dpSUk5WVlKOjoq+vrsbGw6Sko7u7uaWlpbm5t3h4doiIhtLSz4aGhJaWlsbGxNHRzrCwr5SUkqKiobq6uNHRz4eHhf///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAaACwAAAAAEgASAAAFaqAmjmRplstyrkmbrCNFaUZtaFF0HvyhWRZNYVgwBY4BEmFJOB1NlYpJoYBpHI7RZXtZZb4ZEbd7AodFDIYVAjFJJCYA4ISoI0hyuUnAF2geDxoDgwMnfBoYiRgaDQ1WiIqPJBMTkpYaIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo4aRZEoeaxHOiqKFsyBtizopV9ynfwJ0o43MhgNKAYjZbGQJBLXKBLRIK4IaWFbEHgFUoKYoPFKRZUK6fFIORwojBxDytgzpDkdANDc8SQTExp8fBoQEGcDiwNnJA0NLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOmqKQKHmtVzpKksa2FIUiOKIxjHb8B5JgKCAFjgHUMHUkPR6u0WKhwVgx0YQ2ccW6DGCDZjKJiiwWEgCQikRQ6zWpQC+QBviBxuHQEP4EKA0NGhmGGRoVFWaHiGYjEBAuIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6aJJEoiaxIOj6PJsyCpigopmNyff0X0o43AgZJk0mKwSABAK4RhaJ5PqOH7GHAHUQD4ICm0YiKwCSHI7VYoDLwDClBT5Di8khEY+gbUBAQGgWEBRoWFmYEiwRmJBUVLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaO2vOQKImtWDoCgMa2koTCsDZNGuIjpIFwQBIYBahGI2UkORyukUKhyVgz0Yv2csW6thcNBBIVMRikSCRFoaAK8ALpQD+QCHiCZrHQBP4BKBUVGgmGCX6BUQaMBmUkFhYuIQAAIfkEBQoAGgAsAQABABAAEAAABWagJo4aAJAoaZrp6DjaIA/a86BZnmlNo2FADEm3GwWFJAgkNZmQIpHWSCLRFK4FKWKLIHgJUoFYoKlUpCIxabFIKRSohDxButgvJIPeoKFQNHd4JBYWGgeHBxoMDGgBjgFoJI4tIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6a45Aoma1ZOkaRxrYAgBZ4oUGQVtckgpBAGhgHqEol1WiQFgvX6PHQJK4JKWaLMXgNWq7GYpGKJhMShZKSSFCH+IGEqCNIgXxAo1BoBIACKHkaF4YXf4JSh4hmIwwMLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOWhSRKFmsRToui0bMhOY4aKInWlVpmWCGZCgaSMIhyWJJQSAkCsU1AgA0h+yBarUGvgHqYDzQfKmiRoOkUKQeD9RlfiFh7hgSvS6RaPB5JAwMGgiGCBoTE2gCjQJoJI0uIQAAOw==",
		// Trust
		5:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAWCAYAAAAisWU6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzRTk5NDVGQkJCRTExRTJBNTA3RjBEQjE4ODBGQTk4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzRTk5NDYwQkJCRTExRTJBNTA3RjBEQjE4ODBGQTk4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNFOTk0NURCQkJFMTFFMkE1MDdGMERCMTg4MEZBOTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNFOTk0NUVCQkJFMTFFMkE1MDdGMERCMTg4MEZBOTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz68R3m+AAALLElEQVR42uxaCXBV5RU+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",
		// undefine
		80:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATxJREFUKM91kT1uE2EURW9J6SV4CVmCu5QpKZ2OinFJeWtEQfOGGTJWMuOfmQwOGDOKE1f0CIkVoCzBSzgpvgghRN4t33nSuXpCKCMjA/0vQhlpMt79rl25mMYkRpIkIWXAgY4DkHHjjWuXxDHO/wAdHQAHMj76zp+4pCCIk7+AH1zTkdF5yZ6WioUXb2KEhF7TPd1Hu2PBwBcqD+6dnyKhtz9Ti/dtsY1xTBbfb137zmuXD0goXLrxV7fH5B7jxntvXVOAhHLP3fuW4iFVixet791RkSegcOMdNTtStfL04BuuKIhjAmZrPjPnGyv30920d09PzzUXL5PDeUfDnN73bjx4z56BLWvHGAlJF7+CJLrxJUuWNFw5P5OegBjFq9yVVx5oKCn/+Vdyn+SzihUbPhCzOElLJJ6NQOgROBktk7FXYdYAAAAASUVORK5CYII=",
		// trust
		// - empty
		40:  "data:image/gif;base64,R0lGODlhEAAQAIABAGaLsf///yH5BAEAAAEALAAAAAAQABAAAAIOjI+py+0Po5y02ouzPgUAOw==",	
		// - spinner
		41:  "data:image/gif;base64,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",	
		// - safe
		42:  "data:image/gif;base64,R0lGODlhEAAQAPewAJO0ckeBD2WVOGOHUSVXDJO0c2WJVPz9/Pr7+U2YAFKgAIfKAG6PXWuNWuTq4XawOG2kODl5AMbnAEyLDE6JDEKDAICoXCdZD3aVZkhyM4CecpW4cypbEnLGAFugD4KpXL3pAK7mAG+pADd5ADBuADyBAI/UADx8AEaIAKLOczh7AKHMcnm5AGSmAB9TBqPNc5feADd3AJi+c8XkANTtAOHo3pbUAJauiobXAInaAFSQAEN9DHnKAGOrAG+eAFKVAFWYAJvEckSGAHjBAHzGAKfgAILMALznAIXHAJW1c7HDqDp5AM7rAMrsALzjAJa6ci1qAJS1c67eAJvIAM/ayZjPANLuAKjdAHu5OFGeAEmNAD9+AEaOAGKrD2SrADV0AESHAJLFXKfhAE2WAIaxXHW8DFGcADZtAHCRYKXgANzxAD9/AHOTY9nwAESLAHC6DLHfAJ7OAFioAKXeAFaXAFWcAHexOGe1AGq8ALnlAIumfoaieIPJALniAEWHAEiQAH7DAMHPusvsADh5ANPrAGWWOKnYAJraAFelAEp0NtbvAEOBAD6CAI/RAFOYDIXDAHTEAIvJAFyuAJDTAIfQAMjqAF2XAPL18NTvAOzx6kqGDEGBAEePAFemAIXAAEyNDE+XAF2nD3K9AMfmAEySAIK7AKDWAJTbADt7AD1qJ2m3AJ7HclWZD0eIADR0AP///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAALAALAAAAAAQABAAAAj7AGEJFLgCS5dQD4IMXAgrRRkkC4bckWPGkQyGYSL1cQLHFB9VnRiNIDPwxQImVirludJIVIwBDL5sEPhmVBtMTY4UMbFIwys0gzTBWkWEkBpFgkCI0WHg1Ss2JcAAsGNEAo0ZU0KISHXJ6Q0Vfwp5gDTHB4FEls5QeXVgjwtJCQKwwtNigINMBBqwbSCER4csASAg4hDIqR4HrzCgyHGKkgIBTxJwgcIAgVMlqHDASGMDFABYn8YocDUAQY0LXiYdkvJogsAom9xwImEgQytAVQzFAZJk4IcTaypE0NKDhadSdCwwLLBjyRY/pOr8oFCA4UAAAgIEEPB5YUAAOw==",	
		// - unsafe
		43:  "data:image/gif;base64,R0lGODlhEAAQAPeaAGcAANnAwPbw8H8bD7OAgIAMALR5cnogILR6c+PQ0HYEAIwOAK4nHJVCOIoNAJokIZZDOaYcD3YHApwNAJQOAJEPAKUSBnwPAHgMAL9IPqhkXJgZDIQwMIANAc56c4YnGsx5crR7dKREOIUXDIURCJwRBJoNALV6c8d6c40QAoYpHYQlGcR6cqgcEJZEOnADAMRkXMt7dJczJ68XC8I2LblCONyAeosKAKUPAZ8VCHgEAI8XE6RjX30LALp6cpAdEL9qZqdZULByar57c79FOuCZlMBAN3oYFdd0buCUj4QcD6tnYNNjW3IFAHIEAH8NAJZDOH8MAJA4N6EQCZMOAJA3NokOALkuJHQEAHwEAKFDOrkpHpgWB6lkXMWDgLh6c9mLhIAQBI02Mn0YDLFkXKAOAIgNBI0kG34kI6BgYMleVrV2bnoPA3wWCnsdG58tIKJUSrBCOKUaDctVTXEQEK5DOME+NIcKAHgOAIUkGIMGALR6cogqH6wmGqpwcI1AQMcxKJccD3gDAJdQUNFwaYoZDLMbEL09MpcOAIQHA30jIY43LIQIANqMhpUlInIIBqsiFoYqHpQ3K4YYDZocD6UOAIsOAO3g4NCwsP///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAJoALAAAAAAQABAAAAjvADUJFAiiRosIcVgMXKjJwyEjdrbMqDRhwxCGMNQUSWKDCQ1DOExUIDMwBhEvVQAAcLRDpY47Vr4I7ANGCqZMmf5wwIlJgaURmlAwaATkgIBMlxJkEnDgxoICe+pAIoTkQRqcOAfpQZSiABRKcjLMAZToZqYAgspw+RFmQKASDK5MoXN06QEzb2QoGSCCQg4LWcziTPBIS5APEHwsoMLID04CBB6LWcMHgaZCDrBgCtBTwuYAaAzkEXgiSg8nL5qQOHPEjSIei0IM7HLhSYEOkyTBWSLEhQaGCMbgwcCmzQoVkSwzFGigwYABDQwwDAgAOw==",	
		// - unknown	
		44:  "data:image/gif;base64,R0lGODlhEAAQAPeSAHJHEIVgMKGFYLSic8e2oJR6OOHZAIBgD2k7ALOhcufXAPbz8JBnAMekAIpsDHxUIM2yc9PIAMWdANHCsJlyD35ZAJhuAJZrAKyBAJVpAHdWAG5AAOPb0HdMALuZALmRDJx4AKZ5D4ZgAMOscr2SDLWjc8miALabAIVjDKJ4ANzLALiLANOzALupAL+wAOjZAIVfALqmcsWfAM+wANzKAHRGAI1iAIBcANu/AKeSXNK+AJ91AKt/AIljAL6qc8qrAJl8ANe3ANvQAOPNAIldAJ2AAJVrAKp8D5JpAOzgAH9TAJ90ALOIAJluAIFhD76qkIplAMKfANjNAKiIAMOdAMatcpl0AJV7OLuRAKOFOJx5AKJ6AMegAKuRcOzdAMywcqZ8AN/LAMWmXMunAIZYAJV1ANS4AJ5+AMKbAN7NAIFiD7iROLWidLCOOL2TAJRqAItnAHtZALShcptsAHxdDK+DAJhrALejc6uAAJBsAH5aAI9nAKiSXIBaALCXXLKIAL6TAMyrAIxoDKB5D5dvDNrQANa8AJZsAMm8AOXRAKBxAJt7AK+MOKN0AH9SAI9sQLSdgP///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAJIALAAAAAAQABAAAAjtACUJFPhlzZEQjEYMXCgJAgkuVHgoajSHkA+GYsYMAQHg0SMANcgw8DMQwg8vUwREWhmJAwAbPe4I/KDgBYAFLFcScIQEhaQqDZKc6LJyQgCWD5qIkNMmkAIaDx5BCkBg5YINdRhcGSQjTCIzUYxUXSkggxs7TihgmWEoCJqjZN+waLDkQBYMgCSY+PNo5ZMLOFTo2FIghgU8TFaAkQrpkYc0BqRYGSBJ0KEdKYhAWgnpjBADiBwILHEDyh4lmyNBKlIowiI2A/nE0dOnAwIEcFq4AJKD4QA6GirAyKOljAPKDAUmKHBATYEEDAMCADs=",	
		// - question
		45:  "data:image/gif;base64,R0lGODlhEAAQAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgICAgMDAwP8AAAD/AP//AAAA//8A/wD//////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMwAAZgAAmQAAzAAA/wAzAAAzMwAzZgAzmQAzzAAz/wBmAABmMwBmZgBmmQBmzABm/wCZAACZMwCZZgCZmQCZzACZ/wDMAADMMwDMZgDMmQDMzADM/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMzADMzMzMzZjMzmTMzzDMz/zNmADNmMzNmZjNmmTNmzDNm/zOZADOZMzOZZjOZmTOZzDOZ/zPMADPMMzPMZjPMmTPMzDPM/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YzAGYzM2YzZmYzmWYzzGYz/2ZmAGZmM2ZmZmZmmWZmzGZm/2aZAGaZM2aZZmaZmWaZzGaZ/2bMAGbMM2bMZmbMmWbMzGbM/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5kzAJkzM5kzZpkzmZkzzJkz/5lmAJlmM5lmZplmmZlmzJlm/5mZAJmZM5mZZpmZmZmZzJmZ/5nMAJnMM5nMZpnMmZnMzJnM/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wzAMwzM8wzZswzmcwzzMwz/8xmAMxmM8xmZsxmmcxmzMxm/8yZAMyZM8yZZsyZmcyZzMyZ/8zMAMzMM8zMZszMmczMzMzM/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8zAP8zM/8zZv8zmf8zzP8z//9mAP9mM/9mZv9mmf9mzP9m//+ZAP+ZM/+ZZv+Zmf+ZzP+Z///MAP/MM//MZv/Mmf/MzP/M////AP//M///Zv//mf//zP///yH5BAEAABAALAAAAAAQABAAAAjSANOJS+crnjp1v8bh4oZLIEFf6AoaQ6iQIS6IENOpM6huYkJf43wRE+nLV8eTCamppCYSFLqDJ9Wl+/cPHbp/1IgpI5bwF0J1vv4RS0cMHTV0xEyN64lwZjp074zqFLQQV0ii1FIRxUlMkCCG3Hylm0kNJ81lp05RxYUrotli74ihbTVo0EW3NNO9WybNlatBfymVpCl0r6tTf10RUkSQGLGa7kwd9vvK1auSxDQ5VgbqFGDAil4psilWJx9TghKBvizQlziIfAR5GeQl0WLXEAMCADs=",	
		
		};
		
	const TRUST_VERSION	= "3.603";
	const API_HREF_SERVICE_TRUST = "https://securebrowsing.m86security.com/advice/advise";
	const TIMEOUT_TRUST = 5000;
		

	SP_SINGLE_SAFE_TRUST = function(  ){

		var self = this;
		this.trust = [];
		this.remoteAdviseCounter = 0;
		
		// --------------  Trust  -----------------------------------------------------------------------------
		this.set_PreviewDimensions_Trust = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("style","position:relative; height:22px; display:block; margin-left:20px;");

			var img = document.createElement("img");
			img.setAttribute("src", FILE_IMAGES[5]);
			img.setAttribute("style","position:absolute; ");
			img.setAttribute("id", "sp_icon_trust");
			img.style.left="0px";
			img.style.top="0px";
			divb.appendChild( img );
			//img.addEventListener("click", function( event ){	sp_single.navigate_url('http://safebrowsing.clients.google.com/safebrowsing/diagnostic?site='+self.urlGoogle, event);					}, true);

			var imgR = document.createElement("img");
			imgR.setAttribute("id", "sp_fullDivTip_trust");
			imgR.setAttribute("style","position:absolute; cursor:pointer");
			imgR.style.top="3px";
			imgR.style.left="170px";
			imgR.setAttribute("src", FILE_IMAGES[20]);
			divb.appendChild( imgR );
			imgR.addEventListener("click", function( event ){   self.refresh_trust( );			}, true);
	
			div.appendChild( divb );
		}	
	
		// ===========================================================================================
		this.Proverka_Trust = function( url, host )  {      
			if (  sp_single.branch.getBoolPref('service_google') )
			{
			
				var postParams = { 'version': TRUST_VERSION, 'CATEGORIZE': 1, 'url0': url };			
				
				var postData = this.buildPostData(postParams);
				
				postData = postData.replace(/%0D%0A/gi, "");

				this.step = 1;
				
				this.read_Trust( url, postData , function( status ){  
	
															self.show_Div_Trust( url, status );		
																						
														} ); 	 
			}					
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
			
		
		// ===========================================================================================
		this.read_Trust =  function( url, postData, callback ){

/*			if ( this.trust[url] != null )
			{
				callback(this.trust[url]);
				return this.trust[url];
			}*/
			sp_single.alert('read_Trust: '+url);	
				
			var current_dt = new Date();
			var current_time = current_dt.getTime();				
			var urlData = "rnd=" + current_time + "&n=0&m=18&t=18&ref=Google";
			var surl =  API_HREF_SERVICE_TRUST + "?" + urlData;
				
			var xhr = new XMLHttpRequest();
			xhr.open("POST", surl, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				
			xhr.onload = function(e) {
//sp_single.alert(xhr.status + ' - ' + xhr.response);									
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
													self.trust[url]	= sta + "|" + cat + "|" + rea;
						
													sp_single.alert('read_Trust:::: '+self.trust[url]);	

													var current_dt = new Date();
													var current_time = current_dt.getTime();
													sp_single.storage.writeHost( { host: url,	srv:  'Trust',	rez:  self.trust[url], dat: current_time 	} )
							
													callback(self.trust[url]);
													return self.trust[url];
												}	
												else
												{
													if (self.step == 1)
													{
														self.step ++;
														self.read_Trust( url, postData, callback );
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
											sp_single.alert("Invalid advice results received: " + e);
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
		
							sp_single.alert("Trust Time over: "+url) 
							xhr.abort();   
							callback( null );
							return null;
							
						}, TIMEOUT_TRUST);

				xhr.send(postData);

			}
		
		// ===========================================================================================
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
		

		// ===========================================================================================
		this.show_Div_Trust = function( url, s )  {  
			var status = this.get_Status_Trust( s );
			var document = gBrowser.selectedBrowser.contentDocument;
			var img_trust = document.getElementById("sp_fullDivTip_trust");
			if ( img_trust )
			{
				var imageUrl = FILE_IMAGES[status.r];
				img_trust.setAttribute("src", imageUrl);
				img_trust.setAttribute("title", status.m);
			}	
		}
	
		// ================================================================================================
		this.refresh_trust = function(  )  {  
			this.trust[this.curHref] = null;

			var document = gBrowser.selectedBrowser.contentDocument;
			var img_trust = document.getElementById("sp_fullDivTip_trust");
			if ( img_trust )  img_trust.setAttribute("src", FILE_IMAGES[20]);
	
			this.Proverka_Trust(this.curHref, this.curHost);
		}
		
		
		// ================================================================================================
	}	
})();
