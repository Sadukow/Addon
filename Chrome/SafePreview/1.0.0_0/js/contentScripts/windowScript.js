(function(){
	
const FILE_IMAGES = {
		// close
		21:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHlJREFUKFN9yLEKQjEQRNH7UwELwcbCxsbCxsJGsBAe+YP99JFlCEkevNzTzC6VGlUHosIWmxaCn9b4KmVe+5uPkvOeL94yN6/ES81Y//JU1xp/PNS1xh93NWP9y03m5pW4Kjnv+eKilHntb85a4xQnLQSFEkUHovAHCSFtTmUA7vgAAAAASUVORK5CYII=",
		// setting
		23:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAMAAAC3SZ14AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJEREM3N0RBNzRGNjExRTJBOUFBRkQ1RkI5NDhDQ0ZCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJEREM3N0RCNzRGNjExRTJBOUFBRkQ1RkI5NDhDQ0ZCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkREQzc3RDg3NEY2MTFFMkE5QUFGRDVGQjk0OENDRkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkREQzc3RDk3NEY2MTFFMkE5QUFGRDVGQjk0OENDRkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4EQG1iAAACB1BMVEWnp6cJCQkfHx/MzMxxcXHd3d36+vrb29uUlJTR0dGLi4shISHt7O329vahoaGqqqr08vNiYmLg4OD8/PwkJCSJiYkzMzPi4uLj4uP39/e5ubnu7u66uro4ODiTk5O9u7zq6uptbW35+fnNy8mura7s7Oyvr6+jo6PX1tXv7u/29PV9fX3W1dXU0tSamplwcHC5trnv7+/4+Ph1dXXOzs3j4+Px7/LPzc7p6erCwL/MzM0mJibPz9Dc3Nx4eHiurq67ubnQ0M5HR0crKyt/f3/Pz8+BgYEKCgra2tplZWVUVFSurqyIiIjS0tPv7+/IxsiRkZGpqaqdnZ17e3vZ2Nfz8/SEhIQYGBgaGhopKSkoKChSUFF0dHQuLi5TU1PKysiDg4PLycpzc3PAvr0/Pz/W1dSZmZmPj5Dn5+etra3w8PAwMDD///+vrq/U1NTS0tH09PT19fXPzc3q6eqpqKnS0M+MjIyYmJg5OTnOzs/t7e3RztDl5eXt7e6FhYXQ0NBLS0vY19i0tLNgYGBjY2S4uLhJSUmSkpJBQUFAQEDY1dYsLCzX1ta+vLvx8fHy8vLNzc3Rz9DZ2drd2tucmptQUFARERF8fHzExMTu7u+hoaMcHBwtLS2ampo9PT2Ghoarq6m1tbTQzs8bGxsUFBQXFxe/v75ycnL39fbMysjDwMLj4OP///9M6tViAAAArXRSTlP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AP1FBPAAAAEwSURBVHjaTM5TcwNQEAXgG9ts0LDm1LaR2rZt27btdn9k722SafZld74zs3MQaK8i5j4BD+dByCIbQdNoL1M7gs/Zj5QcLzMmGbQ/M7vjbSTfmNSbpIBiwuF6yMjIItT8UlmR6ok0napjvmpKjSUklPpKlW8hWoFhadgaycc07V7feMabR4KJtUtRXpwPMDXFtR5gZO8j6NKJMqzqKAhS3v91wCUUaezCPsN2x221BBwk07knSB5Lv2vOaU4iI6UneQefgisxekqik3fdXGhwMTM2sCHsxPefFHLK2+qTZexI7KTE1h2KkEV//xqYEdtpYV1JpeProsXin19GiLGi520e4NSPu3e3/EOIW1d1009+2LIRrS2AkLmcYm8CHFMuu8j+Pt1RCA7HkQDgV4ABAKFRmwrByb+HAAAAAElFTkSuQmCC",
	};
	
	// ----------------------------------------------------
	chrome.extension.onConnect.addListener(function( port ){				
		
		var pendingRequestLastId = 0;
		var pendingRequests = {};
		
		function addRequest( message, callback ){
			var requestId = pendingRequestLastId;
			pendingRequestLastId++;
			
			message.requestId = requestId;
			
			pendingRequests[ requestId ] = callback;
						
			port.postMessage( message );
		}
		
		
		
		port.onMessage.addListener( function( message ){

			function loadItemRequest( media ){
			
				port.postMessage( {
					action: "download",
					media: media
				} );
			
			}
		
			switch( message.action ){
								
				case "init_windowScript":
				
				
					function navigate_url( tip ){
					
						var url = document.location.href;
						chrome.extension.sendRequest({akce:"live_window_navigation",
														url: url,
														tip: tip
													} );
					
					}
				
					function run_close(  ){
						chrome.extension.sendRequest({akce:"live_window_close"	} );
					}
				
					function run_setting( tip ){
						chrome.extension.sendRequest({akce:"SettingOptions"  } 	);
						chrome.extension.sendRequest({akce:"live_window_close"	} );
					}
				
					var url = document.location.href;

					
					var divf = document.getElementById('sp_LiveWindowNavigationFon');
					if( divf != null)	document.body.removeChild( divf );
					
					divf = document.createElement("div");
					divf.setAttribute("id","sp_LiveWindowNavigationFon");
					divf.setAttribute("style","z-index:21474; 	position: fixed;	top: 5px;	left: 0;	width: 100%;	text-align: center;	height: 1px; display:block");
					document.body.appendChild( divf );
					

					var div = document.createElement("div");
					div.setAttribute("id","sp_LiveWindowNavigation");
					divf.appendChild( div );

					var stls = document.createElement("style");
					text  = '.SafePreview_button     	{	color:#333333; 		text-align: center; 		cursor:pointer; 		}';
					text  += '.SafePreview_button:hover 	{		color: #22048e; 	text-decoration:underline 		}';
					text  += '#sp_LiveWindowNavigation   { border: 1px solid #fad42e; background: #fea;	border-radius: 5px;	color: #000; display: inline-block;	padding: 5px 10px 5px 5px;	-webkit-box-shadow: rgba(0,0,0,0.3) 0 1px 1px;	height: 40px;	width: 400px;	position: relative; opacity:0.5 }';					
					text  += '#sp_LiveWindowNavigation:hover   { border: 1px solid #fad42e; background: #fea;	border-radius: 5px;	color: #000; display: inline-block;	padding: 5px 10px 5px 5px;	-webkit-box-shadow: rgba(0,0,0,0.3) 0 1px 1px;	height: 40px;	width: 400px;	position: relative;  opacity:1}';					
					stls.textContent = text;
					div.appendChild( stls );
					
					var divb = document.createElement("div");
					divb.setAttribute("style","position:relative;	width:390px; height:24px; display:block;  font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; 	font-size: 11px;  margin-left:5px; margin-top:10px;");
 		
					var div1 = document.createElement("div");
					div1.setAttribute("class","SafePreview_button");
					div1.setAttribute("style","position:absolute;  	left:50px;  	width:80px; 	height:24px;  ");
					div1.textContent="Current Page";
					divb.appendChild( div1 );
					div1.addEventListener("click", function( event ){
										navigate_url( 0 );
									}, true);
		
					var div2 = document.createElement("div");
					div2.setAttribute("class","SafePreview_button");
					div2.setAttribute("style","position:absolute;  	left:150px;  	width:80px; 	height:24px;  ");
					div2.textContent="New Page";
					divb.appendChild( div2 );
					div2.addEventListener("click", function( event ){
										navigate_url( 1 );
									}, true);
		
					var div3 = document.createElement("div");
					div3.setAttribute("class","SafePreview_button");
					div3.setAttribute("style","position:absolute;  	left:250px;  	width:80px; 	height:24px;    ");
					div3.setAttribute("title",url);
					div3.textContent="Background";
					divb.appendChild( div3 );
					div3.addEventListener("click", function( event ){
										navigate_url( 2 );
									}, true);
		
					div.appendChild( divb );

					var img_close = document.createElement("img");
					img_close.setAttribute("title","Close");
					img_close.setAttribute("src",FILE_IMAGES[21]);
					img_close.setAttribute("style","position:absolute;  left:2px; 	top:0px; cursor:pointer;");
					divb.appendChild( img_close );
					img_close.addEventListener("click", function( event ){
										run_close( );
									}, true);
		
					var img_set = document.createElement("img");
					img_set.setAttribute("title","Setting");
					img_set.setAttribute("src",FILE_IMAGES[23]);
					img_set.setAttribute("style","position:absolute;   right:3px;   top:0px; 	cursor:pointer;");
					divb.appendChild( img_set );
					img_set.addEventListener("click", function( event ){	
										run_setting( );
									}, true);
						
				break;
				
				
				
				
			}
			
		} );

		
	});
	
})();

