
var searchBox = null;
var clickTimer = null;
var clickElement = false;

window.addEventListener( "load", function(){

	try
	{
		GetThemAll.Popup.init();		
	}
	catch( ex ){

	}
	
	GetThemAll.Locale.localizeCurrentPage();

	document.getElementById("downloadBox").setAttribute("hidden", true);
	document.getElementById("masterHead").removeAttribute("hidden");
	document.getElementById("masterMain").removeAttribute("hidden");
	document.getElementById("messageBox").setAttribute("hidden", true);
	
	var x = GetThemAll.Prefs.get( "gta.links_mode" );
	document.getElementById("tab_links").setAttribute("checked", "false");
	document.getElementById("tab_docs").setAttribute("checked", "false");
	document.getElementById("tab_images").setAttribute("checked", "false");
	document.getElementById("tab_videos").setAttribute("checked", "false");
	document.getElementById("filter_links").style.display="none";
	document.getElementById("filter_docs").style.display="none";
	document.getElementById("filter_images").style.display="none";
	document.getElementById("filter_videos").style.display="none";
	
	GetThemAll.Popup.box_Youtube();
	
	
	if ( x == "file")  		
	{
		document.getElementById("tab_docs").setAttribute("checked", "true");
		document.getElementById("filter_docs").style.display="block";
		document.getElementById("head_size").style.display="block";
	}	
	else if ( x == "image")	
	{
		document.getElementById("tab_images").setAttribute("checked", "true");
		document.getElementById("filter_images").style.display="block";
		document.getElementById("head_size").style.display="block";
	}	
	else if ( x == "video") 
	{
		document.getElementById("tab_videos").setAttribute("checked", "true");
		document.getElementById("filter_videos").style.display="block";
		document.getElementById("head_size").style.display="block";
	}	
	else					
	{
		document.getElementById("tab_links").setAttribute("checked", "true");
		document.getElementById("filter_links").style.display="block";
		document.getElementById("head_size").style.display="none";
	}	
	

	document.getElementById("tab_links").addEventListener( "click", function(event){
							document.getElementById("tab_links").setAttribute("checked", "true");
							document.getElementById("tab_docs").setAttribute("checked", "false");
							document.getElementById("tab_images").setAttribute("checked", "false");
							document.getElementById("tab_videos").setAttribute("checked", "false");
							GetThemAll.Prefs.set( "gta.links_mode", "link" );
							document.getElementById("filter_docs").style.display="none";
							document.getElementById("filter_images").style.display="none";
							document.getElementById("filter_videos").style.display="none";
							document.getElementById("filter_links").style.display="block";
							document.getElementById("head_size").style.display="none";
							GetThemAll.Popup.box_Youtube();
							GetThemAll.Popup.repaintThreadsList();		
						}, false );

	document.getElementById("tab_images").addEventListener( "click", function(event){
							document.getElementById("tab_links").setAttribute("checked", "false");
							document.getElementById("tab_docs").setAttribute("checked", "false");
							document.getElementById("tab_images").setAttribute("checked", "true");
							document.getElementById("tab_videos").setAttribute("checked", "false");
							GetThemAll.Prefs.set( "gta.links_mode", "image" );
							document.getElementById("filter_links").style.display="none";
							document.getElementById("filter_docs").style.display="none";
							document.getElementById("filter_videos").style.display="none";
							document.getElementById("filter_images").style.display="block";
							document.getElementById("head_size").style.display="block";
							GetThemAll.Popup.box_Youtube();
							GetThemAll.Popup.repaintThreadsList();		
						}, false );

	document.getElementById("tab_docs").addEventListener( "click", function(event){
							document.getElementById("tab_links").setAttribute("checked", "false");
							document.getElementById("tab_docs").setAttribute("checked", "true");
							document.getElementById("tab_images").setAttribute("checked", "false");
							document.getElementById("tab_videos").setAttribute("checked", "false");
							GetThemAll.Prefs.set( "gta.links_mode", "file" );
							document.getElementById("filter_links").style.display="none";
							document.getElementById("filter_images").style.display="none";
							document.getElementById("filter_videos").style.display="none";
							document.getElementById("filter_docs").style.display="block";
							document.getElementById("head_size").style.display="block";
							GetThemAll.Popup.box_Youtube();
							GetThemAll.Popup.repaintThreadsList();		
						}, false );

	document.getElementById("tab_videos").addEventListener( "click", function(event){
							document.getElementById("tab_links").setAttribute("checked", "false");
							document.getElementById("tab_docs").setAttribute("checked", "false");
							document.getElementById("tab_images").setAttribute("checked", "false");
							document.getElementById("tab_videos").setAttribute("checked", "true");
							GetThemAll.Prefs.set( "gta.links_mode", "video" );
							document.getElementById("head_size").style.display="block";
							document.getElementById("filter_links").style.display="none";
							document.getElementById("filter_docs").style.display="none";
							document.getElementById("filter_images").style.display="none";
							document.getElementById("filter_videos").style.display="block";
							GetThemAll.Popup.box_Youtube();
							GetThemAll.Popup.repaintThreadsList();		
						}, false );

	document.getElementById("head_all_sel").addEventListener( "click", function(){		
							GetThemAll.Popup.SelectAll();		
						}, false );

	document.getElementById("head_url").addEventListener( "click", function(){		
							GetThemAll.Popup.SortMedia( "url" );		
						}, false );
	document.getElementById("head_descr").addEventListener( "click", function(){		
							GetThemAll.Popup.SortMedia( "descr" );		
						}, false );
	document.getElementById("head_size").addEventListener( "click", function(){		
							GetThemAll.Popup.SortMedia( "size" );		
						}, false );
						
	document.getElementById("mainMail").addEventListener( "click", function(){		
							GetThemAll.Popup.openGetSatisfactionSuggestions();
						}, false );
						
	// сообщения
							//GetThemAll.Prefs.set( "gta.download_warning", true );
	document.getElementById("downButton").addEventListener( "click", function(){
	
							window.clearTimeout(clickTimer);
							clickElement = true;
							
							var m = _b(GetThemAll.Prefs.get( "gta.download_warning" ));
							
							if (m)
							{
								var e1 = document.getElementById("masterHead");
								e1.setAttribute("hidden", true);
								var e2 = document.getElementById("masterMain");
								e2.setAttribute("hidden", true);
								var e = document.getElementById("downloadBox");
								e.removeAttribute("hidden");
							}
							else
							{
								GetThemAll.Popup.DownloadList();		
							}	
						}, false );

	document.getElementById("download_warning").addEventListener( "click", function(event){
	
							var x = this.checked;
							GetThemAll.Prefs.set( "gta.download_warning", !x );

						}, false );
						
	document.getElementById("downloadBox_label").addEventListener( "click", function(event){
	
							clickElement = true;
							var e = document.getElementById("download_warning");
							e.checked = !e.checked;

						}, false );

	document.getElementById("downloadBox_Button").addEventListener( "click", function(event){

							GetThemAll.Popup.DownloadList();		
	
						}, false );

						
	document.addEventListener( "click", function(){		
	
							chrome.contextMenus.remove( GetThemAll.Popup.MenuCopy );				
							chrome.contextMenus.remove( GetThemAll.Popup.MenuOpen );				
	
							var ee = document.getElementById("content-tooltip");
							ee.style.opacity = 0;
							ee.style.display = "none";
							
							GetThemAll.Popup.curHref = null;
	
						}, false );
			
	
						
						
	
}, false );

	

