// class describes downloads for specified window
(function(){

	SP_SINGLE_LIVE = function(  ){

		const iframeAttr = {	small:		{width:800,		height:600},
								medium:		{width:1000,	height:700},
								big:		{width:1200,	height:800}};

		var self = this;
	
		var currLink = null;
		this.branch = null;
		
		this.resizeActive = false;
	
		this.current_MouseLocX = 0;
		this.current_MouseLocY = 0;
		
		this.dimPreview_left = null;
		this.dimPreview_top  = null;
		this.dimPreview_width = null;
		this.dimPreview_height = null;
		

		this.isShowingPreview = false;
		

		// ---------------------------------------------------------------------------------------------------------------
		this.init = function( b )
		{
			this.branch = b;
		}

		// ---------------------------------------------------------------------------------------------------------------
		this.ShowLiveRegular = function( url )  {    

			if (this.isShowingPreview)
			{
				var preview = document.getElementById("safepreview_preview_overlay");
				preview.hideURL();
				preview.hideTITLE();
				var frm = preview.getPreviewFrame();
				frm.loadURI( url );
				return;
			}	
			if ( url == null) return;
		
			this.currLink = url;
			
			var top, left, width, height;

			if (this.dimPreview_width == null)
			{
				var x = this.branch.getIntPref('live_width');
				if (x<0)
				{
					width = 800;
				}
				else
				{	
					width = x;
				}	
				this.dimPreview_width = width;
			}
			else
			{
				width = this.dimPreview_width;
			}

			if (this.dimPreview_height == null)
			{
				var x = this.branch.getIntPref('live_height');
				if (x<0)
				{
					height = 600;
				}
				else
				{	
					height = x;
				}	
				this.dimPreview_height = height;
			}
			else
			{
				height = this.dimPreview_height;
			}
			
			var ap = document.getElementById("appcontent");
			var doc = gBrowser.selectedBrowser.contentDocument;
			
			
			if (this.dimPreview_top == null)
			{
				var x = this.branch.getIntPref('live_top');
				if (x<0)
				{
					top = ap.boxObject.y + 3;
				}
				else
				{	
					top = x;
				}	
				this.dimPreview_top = top;
			}	
			else
			{
				top = this.dimPreview_top;
			}	

			if (this.dimPreview_left == null)
			{
				var x = this.branch.getIntPref('live_left');
				if (x<0)
				{
					left = ap.boxObject.x + doc.documentElement.clientWidth - width - 3;
				}
				else
				{	
					left = x;
				}	
				this.dimPreview_left = left;
			}	
			else
			{
				left = this.dimPreview_left;
			}	
			if (height<300) 
			{ 
				height=300;  
				this.dimPreview_height = height; 
			}
			if (width<500)  
			{ 
				width=500;   
				this.dimPreview_width = width; 
			}
			this.branch.setIntPref('live_width',  width);
			this.branch.setIntPref('live_height', height);
			this.branch.setIntPref('live_top', top);
			this.branch.setIntPref('live_left', left);
			
			var mode = this.branch.getCharPref('mode_live');
			var zoom = 1;
			if (mode == "small") zoom=0.7;
			else if(mode == "big") zoom=1.2;
			
			var preview = document.getElementById("safepreview_preview_overlay");
			preview.hidden=false;
			preview.hideURL();
			preview.hideTITLE();
			preview.showLoading();
			
			var frm = preview.getPreviewFrame();
			frm.loadURI( url );
			frm.hidden=false;
			
			this.observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);

			
			function document_title(http_channel)
			{
				return '';
			}

			function parent_window( http_channel ){
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
			
			
			
			function _requester_url( http_channel ){		
				var wnd = parent_window( http_channel );

				return wnd.top.document.location.toString();	
			}
				
			
			function root_document_url(http_channel)		{
				try
				{
					try
					{
						return _requester_url( http_channel );
					}
					catch( ex )
					{				
						http_channel = http_channel.QueryInterface(Components.interfaces.nsIHttpChannel);
						return _requester_url( http_channel );
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
				return null;
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
								root_url = root_document_url(aSubject);	
								var title = document_title(aSubject);

								preview.hideLoading();
								if (root_url) preview.showURL(root_url);
								if (title) preview.showTITLE(title);
							}
							catch (ex) {  alert(ex); }
							break;
						}
					}
				}};
			
			this.observer.addObserver(this.observer_struct, 'http-on-examine-response', false);
			this.observer.addObserver(this.observer_struct, 'http-on-examine-cached-response', false);
			
			frm.addEventListener("DOMContentLoaded",function( e ) {
											var doc = this.contentDocument;
											var title = doc.title;
											preview.showTITLE(title);
										},false,true);
			
			preview.showPopup(left, top, width, height);
			var frm = preview.getPreviewFrame();
			
			this.changeDimensions(  this.dimPreview_left, 
									this.dimPreview_top, 
									this.dimPreview_width, 
									this.dimPreview_height,   true);
			
			preview.setModeLive(mode);
			frm.markupDocumentViewer.fullZoom = zoom;			
			
			this.isShowingPreview=true;
			sp_single.sendEvent({	"a": "setShowingLivePreview", "f": true  });			
			
			return;
		}
		this.hidePreview = function( )  {    

			if (!this.isShowingPreview) return;

			this.observer.removeObserver(this.observer_struct,"http-on-examine-response");
			this.observer.removeObserver(this.observer_struct,"http-on-examine-cached-response");
			
			var preview = document.getElementById("safepreview_preview_overlay");
			preview.hidePopup();
			preview.hidden=false;
			this.currLink = null;
			preview.hideURL();
			preview.hideTITLE();

			this.isShowingPreview=false;
			sp_single.sendEvent({	"a": "setShowingLivePreview", "f": false  });			
			sp_single.sendEvent({	"a": "removeSmallDiv"	});
			
			return;
		}

		
		this.ShowLiveIncognito = function( url )  {    

			sp_single.alert('ShowLiveIncognito');
			
			
			var doc = gBrowser.contentDocument;
			var referrerURI = doc.documentURIObject;
			
			openLinkIn(url, "window", { charset: doc.characterSet,
										referrerURI: referrerURI,
										private: true });
			
		
			return;
		}
		
		this.openLink = function( evt, tip )  {    

			var frm = document.getElementById("safepreview_preview_overlay").getPreviewFrame();
			var doc = frm.contentDocument;
			var url = doc.URL;
		
			if(url=="about:blank")
			{
				url = this.currLink;
			}

			if(url=="") 	return;

			switch (tip)
			{
				case 0:  	
						sp_single.navigate_url( url, evt, false );   	
						this.hidePreview(true);
						evt.stopPropagation();
						
						break; 
				case 1:		
						sp_single.navigate_url( url, evt, true );		
						this.hidePreview(true);
						evt.stopPropagation();
						break;
				case 2:		
						sp_single.navigate_url( url, evt, true, true );	
						break;
			}	
			
		}
		
		this.modeChanged = function(  )  {    

			var preview = document.getElementById("safepreview_preview_overlay");
			var mode = preview.getModeLive();

			var zoom = 1;
			if (mode == "small") zoom=0.7;
			else if(mode == "big") zoom=1.2;
			
			var frm = preview.getPreviewFrame();
			frm.markupDocumentViewer.fullZoom = zoom;			
			
			this.branch.setCharPref('mode_live', mode);
			
		}
		
		// ------------------------------------------------------
		this.EscDocument = function(  )  {    
			if ( this.isShowingPreview ) 
			{
				this.hidePreview(true);
			}	
			return;
		}
		// ------------------------------------------------------
		this.ClickDocument = function(  )  {    
			if ( this.isShowingPreview ) 
			{
				this.hidePreview(true);
			}	
			return;
		}
		// ------------------------------------------------------
		this.changeDimensions = function( left, top, width, height, fl  )  {    
	
			var ap = document.getElementById("appcontent");
			if(top < 0)	top=2;
			if(left < 10)  left=10;
			
			if( top >  (ap.boxObject.y+ap.boxObject.height)-60 )
			{
				top= (ap.boxObject.y+ap.boxObject.height) - 60;
			}
			
			if( top+height > ap.boxObject.y+ap.boxObject.height)
			{
				height=(ap.boxObject.y+ap.boxObject.height)-top-5;
			}
			
			if(left+width>ap.boxObject.x+ap.boxObject.width)
			{
				width=(ap.boxObject.x+ap.boxObject.width)-left-15;
			}
			
			if(left>ap.boxObject.x+ap.boxObject.width-100)
			{
				left=ap.boxObject.x+ap.boxObject.width-100;
			}

			this.branch.setIntPref('live_top', top);
			this.branch.setIntPref('live_left', left);
			
			var preview = document.getElementById("safepreview_preview_overlay");
			preview.showPopup(left,top,width,height);
			
			return;
		}
		// ------------------------------------------------------
		this.startResizeRight = function( evt )  {   
			if(this.resizeActive)	return;
		
			this.current_MouseLocX = evt.screenX;
			this.current_MouseLocY = evt.screenY;
			document.getElementById("main-window").addEventListener("mouseup",   self.stopResize, true);
			document.getElementById("main-window").addEventListener("mousemove", self.doResize,   true);
			this.resizeActive=true;
		}

		// ------------------------------------------------------
		this.stopResize = function( evt )  {    
			if(!self.resizeActive)	return;
			self.dimPreview_width  += evt.screenX - self.current_MouseLocX;
			self.dimPreview_height += evt.screenY - self.current_MouseLocY;
		
			if( self.dimPreview_width<500)
			{
				self.dimPreview_width=500;
			}
			else
			{
				if(	self.dimPreview_width > window.outerWidth-40 )
				{
					self.dimPreview_width = window.outerWidth-40;
				}
			}
			
			if( self.dimPreview_height<100 )
			{
				self.dimPreview_height=100;
			}
			else
			{
				if( self.dimPreview_height > window.outerHeight-20 )
				{
					self.dimPreview_height = window.outerHeight-20;
				}
			}
			document.getElementById("main-window").removeEventListener("mouseup",   self.stopResize, true);
			document.getElementById("main-window").removeEventListener("mousemove", self.doResize,   true);
			
			self.changeDimensions(  self.dimPreview_left, 
									self.dimPreview_top, 
									self.dimPreview_width, 
									self.dimPreview_height,   true);
			
			self.saveTipSize();
			self.resizeActive=false;
		}

		// ------------------------------------------------------
		this.doResize = function( evt )  { 
			if(!self.resizeActive)	return;
			
		
			var width  = self.dimPreview_width  + evt.screenX - self.current_MouseLocX;
			var height = self.dimPreview_height + evt.screenY - self.current_MouseLocY;
			if(width<500||width>window.outerWidth-20||height<100||height>window.outerHeight-10)
			{
				return;
			}
			self.changeDimensions(self.dimPreview_left, self.dimPreview_top, width, height, true);
		}

		// ------------------------------------------------------
		this.startResizeLeft = function( evt )  {    
			if(this.resizeActive)	return;
			this.current_MouseLocX = evt.screenX;
			this.current_MouseLocY = evt.screenY;
		    document.getElementById("main-window").addEventListener("mouseup",	 self.stopResizeLeft, true);
		    document.getElementById("main-window").addEventListener("mousemove", self.doResizeLeft,   true);
			this.resizeActive=true;
		}

		// ------------------------------------------------------
		this.stopResizeLeft = function( evt )  {    
			if(!self.resizeActive)	return;
			self.dimPreview_width = self.dimPreview_width - (evt.screenX - self.current_MouseLocX);
			self.dimPreview_height += evt.screenY - self.current_MouseLocY;
			self.dimPreview_left   += (evt.screenX - self.current_MouseLocX);
		
			if(self.dimPreview_width<500)
			{
				self.dimPreview_width=500;
			}
			else
			{
				if(self.dimPreview_width>window.outerWidth-40)
				{
					self.dimPreview_width=window.outerWidth-40;
				}
			}
			if(self.dimPreview_height<100)
			{
				self.dimPreview_height=100;
			}
			else
			{
				if(self.dimPreview_height>window.outerHeight-20)
				{
					self.dimPreview_height=window.outerHeight-20;
				}
			}
			document.getElementById("main-window").removeEventListener("mouseup",   self.stopResizeLeft, true);
			document.getElementById("main-window").removeEventListener("mousemove", self.doResizeLeft,   true);
		
			self.changeDimensions(self.dimPreview_left, self.dimPreview_top, self.dimPreview_width, self.dimPreview_height, true);
		
			self.saveTipSize();
			self.resizeActive=false;
		}

		// ------------------------------------------------------
		this.doResizeLeft = function( evt )  {    
			if(!self.resizeActive)	return;

			var height = self.dimPreview_height + evt.screenY - self.current_MouseLocY;
			var left   = self.dimPreview_left + (evt.screenX - self.current_MouseLocX);
			var width  = self.dimPreview_width - (left-self.dimPreview_left);
			
			if(width<500||width>window.outerWidth-20||height<100||height>window.outerHeight-10)
			{
				return;
			}
			
			self.changeDimensions(left,self.dimPreview_top,width,height,true);
		}
		// ------------------------------------------------------
		this.saveTipSize = function( evt )  {    
			self.branch.setIntPref('live_width',  self.dimPreview_width);
			self.branch.setIntPref('live_height', self.dimPreview_height);
		}
		// ------------------------------------------------------


		// =============================================================================================



		
	}	
})();
