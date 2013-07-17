var curHref = null;

function init( win, elem )
{
//Log('----init--- '+document.location.href);
//Log('window.parent.location= ' + window.parent.location);
//Log('win.location = '+win.location);

	getPage_url();
	
	window.setInterval(function(){  getPage_url()  }, 1000);

}

// ----------------------------------
function getPage_url()
{
	var url = document.location.href;
	
	if (url == "about:blank") return;
	
	if (curHref != url) 
	{
		curHref = url;
		
		FVD_SINGLE_Page_Insertor.Send_URL( url );
		
	}								
}


// ============================================================================================================================
FVD_SINGLE_Page_Insertor = {
	
	insert: function(  ){
		var that = this;
		
		document.addEventListener("DOMContentLoaded",function( e ) {

						init( this, e )
						
					},false);
					
	},
	
	
	// ---------------------------------  передать сообщение Расширению
	sendEvent: function( el, data ){
		var evento = document.createEvent('CustomEvent');  
		evento.initCustomEvent('FVDSingleApiEvent',true, false, data);  	
		el.dispatchEvent(evento);  	
	},
	
	sendAnonimouseEvent: function( data ){
		var t = document.createElement("div");
		document.documentElement.appendChild(t);  
		this.sendEvent( t, data );
		document.documentElement.removeChild(t);  
	},

	// ----------------------------- получить
	Send_URL: function( url ){
		this.sendAnonimouseEvent({
			"a": "Send_URL",
			"u": url,
			"callback": function( f ){		}
		});
	},
	
	
};

(function(){
	FVD_SINGLE_Page_Insertor.insert();	
})();