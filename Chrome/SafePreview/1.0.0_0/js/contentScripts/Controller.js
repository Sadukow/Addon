(function(){
	
	var ContentScriptController = function(){
		
		this.processMessage = function( tabId, message ){
			
			var file = "/js/contentScripts/contentScript.js";
			
			chrome.tabs.executeScript( tabId, {
				file: file
			}, function(){

				var port = chrome.tabs.connect( tabId );
				
				port.postMessage( message );
				
				port.onMessage.addListener(function( message ){
					
					switch( message.action ){
						
						case "download":
						
						
						break;
						
						case "incrementAdCounter":
						
//							SafePreview.AD.incrementRotateCounter();
						
						break;
					}
					
				});
				
			});
		}
		
	}
	
	this.ContentScriptController = new ContentScriptController();
	
}).apply( SafePreview );
