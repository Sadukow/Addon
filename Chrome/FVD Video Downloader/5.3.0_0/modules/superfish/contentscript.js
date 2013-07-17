function parse_url(str, component){

    if (str.indexOf("http") !== 0) {
        str = "http:" + str;
    }
    
    var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], ini = (this.php_js && this.php_js.ini) ||
    {}, mode = (ini['phpjs.parse_url.mode'] &&
    ini['phpjs.parse_url.mode'].local_value) ||
    'php', parser = {
        php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
    };
    
    var m = parser[mode].exec(str), uri = {}, i = 14;
    while (i--) {
        if (m[i]) {
            uri[key[i]] = m[i];
        }
    }
    
    if (component) {
        return uri[component.replace('PHP_URL_', '').toLowerCase()];
    }
    if (mode !== 'php') {
        var name = (ini['phpjs.parse_url.queryKey'] &&
        ini['phpjs.parse_url.queryKey'].local_value) ||
        'queryKey';
        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
        uri[name] = {};
        uri[key[12]].replace(parser, function($0, $1, $2){
            if ($1) {
                uri[name][$1] = $2;
            }
        });
    }
    delete uri.source;
    return uri;
}

function addButtonsToSuperFish(frame, insertTo, closeElem){
	
	closeElem = closeElem || document;

    if (frame.hasAttribute("fvd_prepared")) {
        return;
    }
    
    frame.setAttribute("fvd_prepared", 1);
    
    var container = document.createElement("div");
    
	container.className = "__fvd_sd_superfishContainer";
	
    var button = document.createElement("a");
    button.textContent = "Turn off Super Fish suggestions";
	
	var closeButton = document.createElement("a");
    closeButton.textContent = "x";
	closeButton.setAttribute("href", "#");
	
	container.appendChild(closeButton);
	
    container.appendChild(button);
   
	
    container.style.position = "absolute";
    
    var framePos = frame.getBoundingClientRect();
    
    container.style.right = "3px";
    container.style.bottom = "-14px";
	container.style.zIndex = 999999999999999;
	
	button.setAttribute( "href", "#" );		
	
	var messageContainer = document.createElement("span");
	
	messageContainer.className = ".message";
	
	var span = document.createElement( "span" );
	span.textContent = "Disable: ";
	
	var buttonWholeSite = document.createElement("a");
	var buttonComplete = document.createElement("a");	
	
	buttonWholeSite.textContent = "Current Website";
	buttonComplete.textContent = "Completely";
	
	buttonWholeSite.setAttribute( "href", "#" );
	buttonComplete.setAttribute( "href", "#" );	
		
	container.appendChild( messageContainer );
	
	
	
	messageContainer.className = "__msg";
	messageContainer.style.display = "none";
	
	closeButton.addEventListener( "click", function( event ){
		
		var elems = document.getElementsByClassName("__fvd_sd_superfishContainer");
		
		for( var i = 0; i != elems.length; i++ ){
			var elem = elems[i];
			elem.style.display = "none";
		}
		
		chrome.extension.sendMessage( {
			action: "removeSuperFish",
			onlyWebSite: document.location.hostname.toLowerCase().replace("www.", "")
		} );
		
		event.preventDefault();
		
	} );
	
	function _docClick(e){
		button.style.display = "";		
		messageContainer.style.display = "none"
		container.style.bottom = "-14px";
		
		closeElem.removeEventListener( "mousedown", _docClick );
		
		e.stopPropagation();
		e.preventDefault();
	}
	
	button.addEventListener( "click", function( event ){
		
		container.style.bottom = "-22px";
		
		button.style.display = "none";
		//closeButton.style.display = "none";
		messageContainer.style.display = ""
		
		closeElem.addEventListener( "mousedown", _docClick, true );
		
		event.stopPropagation();
		event.preventDefault();
		
	} );
	
	buttonWholeSite.addEventListener( "click", function( event ){
		
		chrome.extension.sendMessage( {
			action: "setSuperFishState",
			onlyWebSite: document.location.hostname.toLowerCase().replace("www.", "")
		} );
		
		document.location.reload(false);
		
		event.preventDefault();
		
	} );
	
	buttonComplete.addEventListener( "click", function( event ){
		
		chrome.extension.sendMessage( {
			action: "setSuperFishState",
			value: false
		} );
		
		document.location.reload(false);
		
		event.preventDefault();
		
	} );
	
	messageContainer.appendChild( span );
	messageContainer.appendChild( buttonWholeSite );
	messageContainer.appendChild( buttonComplete );		
	
    insertTo.appendChild(container);
    
}

chrome.extension.onMessage.addListener(function(message){

    switch (message.action) {
        case "injectSuperfish":
            
            if (!window.superfish) {
            
                var script = document.createElement("script");
                script.setAttribute("src", message.url);
                document.head.appendChild(script);
                
            }
            
			if( message.allowButtons ){
				
	            setInterval(function(){
					
					var frame = document.getElementById("SF_BG3");
					if( frame ){
						addButtonsToSuperFish(frame, frame, document.getElementById("SF_ScreenLayout"));
					}
					
					for( var i = 0; i != 100; i++ ){
						
						var item = document.getElementById("SF_IIAD_" + i);
						if( !item ){
							break;
						}
						
						addButtonsToSuperFish(item, item);
						
					}
					
					var searchTarget = document.getElementById( "SF_SEARCHGET" );
					if( searchTarget ){
						//addButtonsToSuperFish(searchTarget, searchTarget);
					}
	                
	                
	            }, 1000);
				
			}	
            
            break;
    }
    
    
});
