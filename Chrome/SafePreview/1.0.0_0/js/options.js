
function saveShowFormats(options){

    console.log('saveShowFormats');
	
    for (var i in options) 
	{
		console.log(i + "   " + options[i]);
	
	
	}
	
	
}


window.addEventListener( "load", function(){

	try{
		SafePreview.Options.init();		
	}
	catch( ex ){

	}
	
	SafePreview.Locale.localizeCurrentPage();
	
//	SafePreview.Options.init();
	

	document.getElementById("buttonBigGeneral").addEventListener( "click", function(){	
		SafePreview.Options.setType('general');
	}, false );
	
	document.getElementById("buttonBigService").addEventListener( "click", function(){			
		SafePreview.Options.setType('service');			
	}, false );
	
	document.getElementById("buttonBigWebsites").addEventListener( "click", function(){	
		SafePreview.Options.setType('websites');			
	}, false );
	
	document.getElementById("buttonBigAbout").addEventListener( "click", function(){		
		SafePreview.Options.setType('about');
	}, false );
	
	document.getElementById("applyChangesButton").addEventListener( "click", function( event ){			
		SafePreview.Options.applyChanges();
	}, false );
	
	document.getElementById("buttonCloseButton").addEventListener( "click", function( event ){			
		SafePreview.Options.close();
	}, false );
	
	document.getElementById("enableGoogle").addEventListener( "change", function(event){
		SafePreview.Options.service_change(event);	
	}, false );
	document.getElementById("enableMcAfee").addEventListener( "change", function(event){
		SafePreview.Options.service_change(event);	
	}, false );
	document.getElementById("enableNorton").addEventListener( "change", function(event){
		SafePreview.Options.service_change(event);	
	}, false );
	document.getElementById("enableWOT").addEventListener( "change", function(event){
		SafePreview.Options.service_change(event);	
	}, false );
	document.getElementById("enableAvast").addEventListener( "change", function(event){
		SafePreview.Options.service_change(event);	
	}, false );
	document.getElementById("enableTrust").addEventListener( "change", function(event){
		SafePreview.Options.service_change(event);	
	}, false );
	document.getElementById("enableDrWeb").addEventListener( "change", function(event){
		SafePreview.Options.service_change(event);	
	}, false );
	
	
	document.getElementById("addGoodSite").addEventListener( "click", function(){		
		SafePreview.Options.goodsite_add();
	}, false );
	document.getElementById("removeGoodSite").addEventListener( "click", function(){		
		SafePreview.Options.goodsite_remove();
	}, false );
	document.getElementById("editGoodSite").addEventListener( "click", function(){		
		SafePreview.Options.goodsite_edit();
	}, false );

	document.getElementById("mode_Live").addEventListener( "change", function(){
		SafePreview.Options.modeLive_change();	
	}, false );
	
	
}, false );

