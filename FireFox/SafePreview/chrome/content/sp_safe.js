// class describes downloads for specified window
(function(){

	const FILE_IMAGES = {
		// loading
		20:  "data:image/gif;base64,R0lGODlhEgASAMQaAHl5d66urMXFw3l5dpSUk5WVlKOjoq+vrsbGw6Sko7u7uaWlpbm5t3h4doiIhtLSz4aGhJaWlsbGxNHRzrCwr5SUkqKiobq6uNHRz4eHhf///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAaACwAAAAAEgASAAAFaqAmjmRplstyrkmbrCNFaUZtaFF0HvyhWRZNYVgwBY4BEmFJOB1NlYpJoYBpHI7RZXtZZb4ZEbd7AodFDIYVAjFJJCYA4ISoI0hyuUnAF2geDxoDgwMnfBoYiRgaDQ1WiIqPJBMTkpYaIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo4aRZEoeaxHOiqKFsyBtizopV9ynfwJ0o43MhgNKAYjZbGQJBLXKBLRIK4IaWFbEHgFUoKYoPFKRZUK6fFIORwojBxDytgzpDkdANDc8SQTExp8fBoQEGcDiwNnJA0NLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOmqKQKHmtVzpKksa2FIUiOKIxjHb8B5JgKCAFjgHUMHUkPR6u0WKhwVgx0YQ2ccW6DGCDZjKJiiwWEgCQikRQ6zWpQC+QBviBxuHQEP4EKA0NGhmGGRoVFWaHiGYjEBAuIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6aJJEoiaxIOj6PJsyCpigopmNyff0X0o43AgZJk0mKwSABAK4RhaJ5PqOH7GHAHUQD4ICm0YiKwCSHI7VYoDLwDClBT5Di8khEY+gbUBAQGgWEBRoWFmYEiwRmJBUVLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaO2vOQKImtWDoCgMa2koTCsDZNGuIjpIFwQBIYBahGI2UkORyukUKhyVgz0Yv2csW6thcNBBIVMRikSCRFoaAK8ALpQD+QCHiCZrHQBP4BKBUVGgmGCX6BUQaMBmUkFhYuIQAAIfkEBQoAGgAsAQABABAAEAAABWagJo4aAJAoaZrp6DjaIA/a86BZnmlNo2FADEm3GwWFJAgkNZmQIpHWSCLRFK4FKWKLIHgJUoFYoKlUpCIxabFIKRSohDxButgvJIPeoKFQNHd4JBYWGgeHBxoMDGgBjgFoJI4tIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6a45Aoma1ZOkaRxrYAgBZ4oUGQVtckgpBAGhgHqEol1WiQFgvX6PHQJK4JKWaLMXgNWq7GYpGKJhMShZKSSFCH+IGEqCNIgXxAo1BoBIACKHkaF4YXf4JSh4hmIwwMLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOWhSRKFmsRToui0bMhOY4aKInWlVpmWCGZCgaSMIhyWJJQSAkCsU1AgA0h+yBarUGvgHqYDzQfKmiRoOkUKQeD9RlfiFh7hgSvS6RaPB5JAwMGgiGCBoTE2gCjQJoJI0uIQAAOw==",
		// close
		21:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHlJREFUKFN9yLEKQjEQRNH7UwELwcbCxsbCxsJGsBAe+YP99JFlCEkevNzTzC6VGlUHosIWmxaCn9b4KmVe+5uPkvOeL94yN6/ES81Y//JU1xp/PNS1xh93NWP9y03m5pW4Kjnv+eKilHntb85a4xQnLQSFEkUHovAHCSFtTmUA7vgAAAAASUVORK5CYII=",
		// setting
		23:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAMAAAC3SZ14AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJEREM3N0RBNzRGNjExRTJBOUFBRkQ1RkI5NDhDQ0ZCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJEREM3N0RCNzRGNjExRTJBOUFBRkQ1RkI5NDhDQ0ZCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkREQzc3RDg3NEY2MTFFMkE5QUFGRDVGQjk0OENDRkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkREQzc3RDk3NEY2MTFFMkE5QUFGRDVGQjk0OENDRkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4EQG1iAAACB1BMVEWnp6cJCQkfHx/MzMxxcXHd3d36+vrb29uUlJTR0dGLi4shISHt7O329vahoaGqqqr08vNiYmLg4OD8/PwkJCSJiYkzMzPi4uLj4uP39/e5ubnu7u66uro4ODiTk5O9u7zq6uptbW35+fnNy8mura7s7Oyvr6+jo6PX1tXv7u/29PV9fX3W1dXU0tSamplwcHC5trnv7+/4+Ph1dXXOzs3j4+Px7/LPzc7p6erCwL/MzM0mJibPz9Dc3Nx4eHiurq67ubnQ0M5HR0crKyt/f3/Pz8+BgYEKCgra2tplZWVUVFSurqyIiIjS0tPv7+/IxsiRkZGpqaqdnZ17e3vZ2Nfz8/SEhIQYGBgaGhopKSkoKChSUFF0dHQuLi5TU1PKysiDg4PLycpzc3PAvr0/Pz/W1dSZmZmPj5Dn5+etra3w8PAwMDD///+vrq/U1NTS0tH09PT19fXPzc3q6eqpqKnS0M+MjIyYmJg5OTnOzs/t7e3RztDl5eXt7e6FhYXQ0NBLS0vY19i0tLNgYGBjY2S4uLhJSUmSkpJBQUFAQEDY1dYsLCzX1ta+vLvx8fHy8vLNzc3Rz9DZ2drd2tucmptQUFARERF8fHzExMTu7u+hoaMcHBwtLS2ampo9PT2Ghoarq6m1tbTQzs8bGxsUFBQXFxe/v75ycnL39fbMysjDwMLj4OP///9M6tViAAAArXRSTlP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AP1FBPAAAAEwSURBVHjaTM5TcwNQEAXgG9ts0LDm1LaR2rZt27btdn9k722SafZld74zs3MQaK8i5j4BD+dByCIbQdNoL1M7gs/Zj5QcLzMmGbQ/M7vjbSTfmNSbpIBiwuF6yMjIItT8UlmR6ok0napjvmpKjSUklPpKlW8hWoFhadgaycc07V7feMabR4KJtUtRXpwPMDXFtR5gZO8j6NKJMqzqKAhS3v91wCUUaezCPsN2x221BBwk07knSB5Lv2vOaU4iI6UneQefgisxekqik3fdXGhwMTM2sCHsxPefFHLK2+qTZexI7KTE1h2KkEV//xqYEdtpYV1JpeProsXin19GiLGi520e4NSPu3e3/EOIW1d1009+2LIRrS2AkLmcYm8CHFMuu8j+Pt1RCA7HkQDgV4ABAKFRmwrByb+HAAAAAElFTkSuQmCC",
		// spacer
		24:  "data:image/gif;base64,R0lGODlhAQABAPAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==",
		};
		
	SP_SINGLE_SAFE = function(  ){

		var self = this;
		this.curLink = null;
		this.curHost = null;
		this.curHref = null;
		this.isShowingPreview=false;

		this.showPreviewDivTimer = null;	
		this.hidePreviewDivTimer = null;	

		this.click_fullDivTip = false;
		
		this.regimTest = false;

		this.small_height = 0;
		
		// -------------------------------------------------------------------------------------------
		this.setup = function()
		{	
			sp_single.alert('init');
			this.winPreview();
		}


		// -------------------------------------------------------------------------------------------
		this.Proverka = function( url, px, py, loc )  {   

			if (this.isShowingPreview)
			{
				this.initPreviewHide();
				return;
			}

			var doc = gBrowser.selectedBrowser.contentDocument;
			// scrolling
			var top = self.pageYOffset || (doc.documentElement && doc.documentElement.scrollTop) || (doc.body && doc.body.scrollTop);
			var left = self.pageXOffset || (doc.documentElement && doc.documentElement.scrollLeft) || (doc.body && doc.body.scrollLeft);

			// размер окна
			//размер всего окна var width = window.innerWidth;  var height = window.innerHeight;
			//весь документ var width = doc.body.clientWidth;		var height = doc.body.clientHeight;
			var width = doc.documentElement.clientWidth;
			var height = doc.documentElement.clientHeight;
			
			if (sp_single.ListFrames[sp_single.md5( loc )] != null)
			{
				var m = sp_single.ListFrames[sp_single.md5( loc )];
//				sp_single.alert('IFRAME: '+m.left + ' - ' + m.top+' -> '+loc);
				px += m.left;
				py += m.top;	
			}
			
			var pxs = px - left;
			var pys = py - top;
			
			if ( pys < 0)			{		py = py - pys + 100;				var pys = py - top;			}
			if ( pys > height)		{		py = py - pys + height - 300;		var pys = py - top;			}
			if ( pxs < 0)			{		px = px - pxs + 100;			var pxs = px - left;		}
			if ( pxs > width)		{		px = px - pxs + width - 300;	var pxs = px - left;		}
			
			var napr = 0;
			if ( (pxs + 300) > width )				
			{			
				napr = 1;			
				if (pys < this.small_height) napr = 2;		
			}	
			if ( (   (pys + this.small_height) > height )	
				&& ( (pys - this.small_height) > 10 ) )
			{			
				napr = 1;			
				if (pxs < 300) napr = 3;				
			}	
			if ( pys < 10 )							{			napr = 0;													}	
			
			if (napr == 1)		{			var ppx = px - 240;			var ppy = py - this.small_height;		}
			else if (napr == 2)	{			var ppx = px - 240;			var ppy = py + 20;		}
			else if (napr == 3)	{			var ppx = px + 20;			var ppy = py - this.small_height;		}
			else 				{			var ppx = px + 20;			var ppy = py;			}

			var host = sp_single.gethostname(url);
			if (!host)
			{
				var loc = gBrowser.selectedBrowser.contentDocument.location.href;
				host = sp_single.gethostname(loc);
				this.curHref = host+'/'+url;
				if (!host) return;
			}	
			else
			{
				this.curHref = url;
			}
			this.curLink = url;
			this.curHost = host;
//			sp_single.alert('Proverka:: host= '+host);		
			
			// показать окно
			this.showPreview( ppx, ppy );
			this.isShowingPreview=true;
			sp_single.sendEvent({	"a": "setShowingSafe", "f": true  });
			sp_single.sendEvent({	"a": "hideSmallDivTimer"	});

			// запрос на проверку
			sp_single.spSafeGoogle.Proverka_Google(url, host);
			sp_single.spSafeMcAfee.Proverka_McAfee(host);
			sp_single.spSafeNorton.Proverka_Norton(host);
			sp_single.spSafeWOT.Proverka_WOT(host);
			sp_single.spSafeAvast.Proverka_Avast(url, host);
			sp_single.spSafeTrust.Proverka_Trust(url, host);
			sp_single.spSafeDrWeb.Proverka_DrWeb(url, host);
			
			var document = gBrowser.selectedBrowser.contentDocument;
			var div1 = document.getElementById('sp_fullDivTip_current');
			div1.setAttribute("title",this.curLink);
			var div2 = document.getElementById('sp_fullDivTip_new');
			div2.setAttribute("title",this.curLink);
			var div3 = document.getElementById('sp_fullDivTip_background');
			div3.setAttribute("title",this.curLink);
		}	
		this.closeProverka = function( url, loc )  {   

//			if (!this.isShowingPreview) return;
			
//			this.hidePreview( );
			
		}	
		
		// -----  закрываем окно  --------------------------------------------------------------------------------------
		this.initPreviewHide = function(  )  {   
		
			this.hidePreviewDivTimer = window.setTimeout(function(){ 	self.hidePreview( );  },  100 );
		
		}
		
		this.Run_initPreviewHide = function( t )  {   
		
			this.hidePreviewDivTimer = window.setTimeout(function(){
													self.isShowingPreview=false;	
													sp_single.sendEvent({	"a": "setShowingSafe", "f": false  });
													
													self.initPreviewHide();
													
													self.removeSmallDiv();
												},  t);
		
		}
		
		// -------------------------------------------------------------------------------------------
		this.hidePreview = function(  )  {   
		
			try
			{
				var document = gBrowser.selectedBrowser.contentDocument;
				var div = document.getElementById('sp_fullDivTip');
			
				if( div != null)
				{
					document.body.removeChild( div );
					window.clearTimeout( this.hidePreviewDivTimer );   this.hidePreviewDivTimer=null;
				}
				this.isShowingPreview=false;		sp_single.sendEvent({	"a": "setShowingSafe", "f": false  });
				this.linkUrl=null;
			}
			catch(ex){	}
		}
		// ---  сообщение на закрытие иконки
		this.removeSmallDiv = function( fl )  {  
			sp_single.sendEvent({	"a": "removeSmallDiv"	});
		}
	
		// -------------------------------------------------------------------------------------------
		this.showPreview = function( px, py )  {      

			var document = gBrowser.selectedBrowser.contentDocument;

			var div = document.getElementById('sp_fullDivTip');
			if( div != null)	document.body.removeChild( div );
			var div = document.createElement("div");
			div.setAttribute("id","sp_fullDivTip");
			div.setAttribute("style","z-index:2147483647; border:2px solid blue; position:absolute; width:250px;height:200px; display:block; background-color: white;  overflow:visible; ");
			div.style.left=px+"px";
			div.style.top=py+"px";
			document.body.appendChild( div );
		
			this.set_PreviewDimensions_Style( div );
			this.set_PreviewDimensions_Pag( div );   
			this.set_PreviewDimensions_Spacer( div, 7 );
			this.small_height = 44;
	
			if (  sp_single.branch.getBoolPref('service_google') )
			{
				sp_single.spSafeGoogle.set_PreviewDimensions_Google( div );
				this.set_PreviewDimensions_Spacer( div, 7 );
				this.small_height += 38;
			}
			if (  sp_single.branch.getBoolPref('service_mcafee') )
			{
				sp_single.spSafeMcAfee.set_PreviewDimensions_McAfee( div );
				this.set_PreviewDimensions_Spacer( div, 7 );
				this.small_height += 31;
			}
			if (  sp_single.branch.getBoolPref('service_norton') )
			{
				sp_single.spSafeNorton.set_PreviewDimensions_Norton( div );
				this.set_PreviewDimensions_Spacer( div, 7 );
				this.small_height += 43;
			}	
			if (  sp_single.branch.getBoolPref('service_wot') )
			{
				sp_single.spSafeWOT.set_PreviewDimensions_WOT( div );
				this.set_PreviewDimensions_Spacer( div, 7 );
				this.small_height += 37;
			}
		
			if (  sp_single.branch.getBoolPref('service_avast') )
			{
				sp_single.spSafeAvast.set_PreviewDimensions_Avast( div );
				this.set_PreviewDimensions_Spacer( div, 7 );
				this.small_height += 47;
			}
		
			if (  sp_single.branch.getBoolPref('service_trust') )
			{
				sp_single.spSafeTrust.set_PreviewDimensions_Trust( div );
				this.set_PreviewDimensions_Spacer( div, 7 );
				this.small_height += 29;
			}
		
			if (  sp_single.branch.getBoolPref('service_drweb') )
			{
				sp_single.spSafeDrWeb.set_PreviewDimensions_DrWeb( div );
				this.set_PreviewDimensions_Spacer( div, 7 );
				this.small_height += 40;
			}
		
			this.set_PreviewDimensions_Nav( div );   
			this.small_height += 45;
		
			div.style.height = this.small_height+"px";
		
			var t = sp_single.branch.getIntPref("single.scale_close_preview");
		
			div.addEventListener("mouseout",function(evt){
									self.Run_initPreviewHide( t );
								},true);
		
			div.addEventListener("mouseover",function(evt){
									window.clearTimeout(self.hidePreviewDivTimer);   self.hidePreviewDivTimer = null;
									sp_single.sendEvent({	"a": "hideSmallDivTimer"	});
								},true);
			div.addEventListener("click",function(event){  	
										self.click_fullDivTip = true;
									}, false);

							
		}
		
		// -------------------------------------------------------------------------------------------
		this.set_PreviewDimensions_Nav = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;

			var divb = document.createElement("div");
			divb.setAttribute("class","SafePreview_button_bar");
			divb.setAttribute("style","margin-left:7px; margin-top:5px;");

			var div_refresh = document.createElement("div");
			div_refresh.setAttribute("class","SafePreview_button");
			div_refresh.setAttribute("id","sp_fullDivTip_refresh");
			div_refresh.textContent="Refresh results";
			divb.appendChild( div_refresh );
	
			div_refresh.addEventListener("click", function( event ){				self.refresh_all( );					}, true);

			var img_close = document.createElement("img");
			img_close.setAttribute("title","Close");
			img_close.setAttribute("src",FILE_IMAGES[21]);
			img_close.setAttribute("id","sp_fullDivTip_close");
			divb.appendChild( img_close );
			img_close.addEventListener("click", function( event ){
									self.Run_initPreviewHide( 100 );
									}, true);
		
			var img_set = document.createElement("img");
			img_set.setAttribute("title","Setting");
			img_set.setAttribute("src",FILE_IMAGES[23]);
			img_set.setAttribute("id","sp_fullDivTip_setting");
			divb.appendChild( img_set );
			img_set.addEventListener("click", function( event ){	sp_single.display_settings( event );			}, true);
		
			if (this.regimTest)
			{
				var div_info = document.createElement("div");
				div_info.setAttribute("title",this.curHost);
				div_info.textContent = '';
				div_info.setAttribute("id","sp_fullDivTip_info");
				divb.appendChild( div_info );
			}	
		
			div.appendChild( divb );
		}

		// -------------------------------------------------------------------------------------------
		this.set_PreviewDimensions_Pag = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("class","SafePreview_button_bar");
			divb.setAttribute("style","margin-left:7px; margin-top:15px;");
 		
			var div1 = document.createElement("div");
			div1.setAttribute("class","SafePreview_button");
			div1.setAttribute("id","sp_fullDivTip_current");
			div1.textContent="Current Page";
			divb.appendChild( div1 );
			div1.addEventListener("click", function( event ){
										self.Run_initPreviewHide( 100 );
										sp_single.navigate_url( self.curHref, event, false );
									}, true);
		
			var div2 = document.createElement("div");
			div2.setAttribute("class","SafePreview_button");
			div2.setAttribute("id","sp_fullDivTip_new");
			div2.textContent="New Page";
			divb.appendChild( div2 );
			div2.addEventListener("click", function( event ){
										self.Run_initPreviewHide( 1 );
										sp_single.navigate_url( self.curHref, event, true );
									}, true);
		
			var div3 = document.createElement("div");
			div3.setAttribute("class","SafePreview_button");
			div3.setAttribute("id","sp_fullDivTip_background");
			div3.textContent="Background";
			divb.appendChild( div3 );
			div3.addEventListener("click", function( event ){
										sp_single.navigate_url( self.curHref, event, true, true );
									}, true);
		
			div.appendChild( divb );
		}
	
		// -------------------------------------------------------------------------------------------
		this.set_PreviewDimensions_Style = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			text =  '.SafePreview_button_bar 	{	position:relative;	height:30px; width:236px;	display:block;  font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; font-size: 11px;  }';
			text += '.SafePreview_button     	{	color:#333333; 	text-align: center; 	cursor:pointer; 	}';
			text += '.SafePreview_button:hover 	{	color: #22048e; text-decoration:underline 	}';
			text += '#sp_fullDivTip_current 	{  	position:absolute;  	left:0px;  	width:80px; height:24px;   }';
			text += '#sp_fullDivTip_new 		{   position:absolute;   	left:86px; 	width:70px; height:24px;   	}';
			text += '#sp_fullDivTip_background 	{ 	position:absolute;   	left:160px; width:75px; height:24px;   	}';
			text += '#sp_fullDivTip_refresh 	{ 	position:absolute;   	left:10px; bottom:7px; 	width:100px; height:18px;   }';
			text += '#sp_fullDivTip_close	 	{ 	position:absolute;   	right:2px; bottom:7px; 	cursor:pointer;   }';
			text += '#sp_fullDivTip_setting	 	{ 	position:absolute;   	right:32px; bottom:7px; cursor:pointer;	   }';
			text += '#sp_fullDivTip_info	 	{ 	position:absolute;   	right:75px; bottom:3px;  width:30px; height:20px; cursor:help;	   }';
			var stls = document.createElement("style");
			stls.textContent = text;
			div.appendChild( stls );
		}
	
		// ------------------  title  -------------------------------------------------------------------------
		this.set_Message_Title = function( div, x, y, id_msg, id_txt )  {      
			var divb = document.createElement("div");
			divb.setAttribute("id", id_msg);
			divb.setAttribute("style","background-color: #fea; border: 1px solid #fad42e; box-shadow: rgba(0, 0, 0, 0.2) 1px 2px 4px; box-sizing: border-box; color: #000; display: none; font-size: 11px; padding: 5px 10px; position: absolute; text-align: center; transition: opacity 0.13s; -webkit-transition: opacity 0.13s; white-space: nowrap; visibility: visible; z-index: 2000; left: "+x+"px; top: "+y+"px; background-position: initial initial; background-repeat: initial initial;");
			div.appendChild( divb );

			var divt = document.createElement("div");
			divt.setAttribute("id", id_txt);
			divt.setAttribute("style","padding:5");
//			divt.textContent = t;
			divb.appendChild( divt );

			var div2 = document.createElement("div");
			div2.setAttribute("style","border-width: 0px 6px 6px; border-style: solid; border-color: #fea transparent; content: ''; display: block; font-size: 0px; height: 0px; line-height: 0; position: absolute; top: -6px; width: 0px; left: 6px;");
			divb.appendChild( div2 );
		}
		
	
		// -------------------------------------------------------------------------------------------
		this.set_PreviewDimensions_Spacer = function( div, h )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divs = document.createElement("div");
			divs.setAttribute("style","height: "+h+"px;");
			divs.textContent = " ";
			div.appendChild( divs );
		}	

		// ===========================================================================================
		this.refresh_all = function(  )  {    
			sp_single.spSafeGoogle.google[this.curHref] = null;
			sp_single.spSafeMcAfee.mcafee[this.curHost] = null;
			sp_single.spSafeNorton.norton[this.curHost] = null;
			sp_single.spSafeWOT.wot[this.curHost] = null;
			sp_single.spSafeAvast.avast[this.curHref] = null;
			sp_single.spSafeTrust.trust[this.curHref] = null;
			sp_single.spSafeDrWeb.drweb[this.curHref] = null;

			var document = gBrowser.selectedBrowser.contentDocument;
			var img_google = document.getElementById("sp_fullDivTip_google");
			if ( img_google )  img_google.setAttribute("src", FILE_IMAGES[20]);
			
			var img_mcafee = document.getElementById("sp_fullDivTip_mcafee");
			if ( img_mcafee )  img_mcafee.setAttribute("src", FILE_IMAGES[20]);
			
			var img_norton = document.getElementById("sp_fullDivTip_norton");
			if ( img_norton )	img_norton.setAttribute("src", FILE_IMAGES[20]);
			
			var img_wot_r = document.getElementById("sp_fullDivTip_wot_r");
			if ( img_wot_r )  img_wot_r.setAttribute("src", FILE_IMAGES[20]);
			var img_wot_c = document.getElementById("sp_fullDivTip_wot_c");
			if ( img_wot_c )  img_wot_c.setAttribute("hidden", true);
	
			var img_avast = document.getElementById("sp_fullDivTip_avast");
			if ( img_avast )	img_avast.setAttribute("src", FILE_IMAGES[20]);
			
			var img_trust = document.getElementById("sp_fullDivTip_trust");
			if ( img_trust )	img_trust.setAttribute("src", FILE_IMAGES[20]);
			
			var img_drweb = document.getElementById("sp_fullDivTip_drweb");
			if ( img_drweb )	img_drweb.setAttribute("src", FILE_IMAGES[20]);
			
			sp_single.spSafeGoogle.Proverka_Google(this.curHref, this.curHost);
			sp_single.spSafeMcAfee.Proverka_McAfee(this.curHost);
			sp_single.spSafeNorton.Proverka_Norton(this.curHost);
			sp_single.spSafeWOT.Proverka_WOT(this.curHost);
			sp_single.spSafeAvast.Proverka_Avast(this.curHref, this.curHost);
			sp_single.spSafeTrust.Proverka_Trust(this.curHref, this.curHost);
			sp_single.spSafeDrWeb.Proverka_DrWeb(this.curHref, this.curHost);
		}
	
	
		// ------------------------------------------------------
		this.ClickDocument = function(  )  {    
			if (this.click_fullDivTip)
			{
				this.click_fullDivTip = false;
				return;
			}	
			if ( this.isShowingPreview )	this.Run_initPreviewHide( 100 );

			return;
		}
		
		
// ================================================================================================
	}	
})();
