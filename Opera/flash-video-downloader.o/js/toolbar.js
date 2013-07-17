var HeightVideo = 400;
var HeightNoVideo = 350;

var FVDMainButton = {

	disabled: false,
	title: "FVD",
	icon: "images/fvd.single.main_18_dis.png",
	popup: {
		href: "popup.html",
		width: 450,
		height:HeightNoVideo
	}
}

var curr_info = { mode:'', url:'', ml:null, ihtml:'' };
var curr_url = '';

var pars_info = { mode:'', url:'', ml:null   };
var pars_url = '';
	
function FVD_Single() {

	const BAD_LOCATIONS_FOR_SUPPORTED_SITES = ['/', '/index.php', '/index.htm', '/index.html', '/index.asp'];

	var self = this;

	this.detector = new FVD_site_detector();
	this.main_button = 0;

	this.UpdateButton = function ( can_download ) {

		self.main_button.icon = 'images/fvd.single.main_18'+ ( can_download ? '' : '_dis' ) +'.png';

	};

	this.CheckURL = function ( url ) {

		if ( Debug ) opera.postError("INFO: CheckUrl url:"+ url +".");

		if ( url.match(/^https?:\/\//i) != null) {

			if ( Debug ) opera.postError("INFO: CheckUrl matched http.");

			curr_info.url = url;
			curr_info.ml = null;
			curr_info.ihtml = '';
			
			if ( self.detector.is_supported( url ) ) {

				if ( Debug ) opera.postError("INFO: CheckUrl matched detector.");

				var m = url.match(/\b(https?|ftp):\/\/([-A-Z0-9.]+)(\/[-A-Z0-9+&@#\/%=~_|!:,.;]*)?(\?[-A-Z0-9+&@#\/%=~_|!:,.;]*)?/i);
				var path = (m != null) ? m[3] : '';
				if (BAD_LOCATIONS_FOR_SUPPORTED_SITES.indexOf(path) != -1) {                 // если заканчивается index.php(html)
			
					if ( Debug ) opera.postError("INFO: CheckUrl bad location.");

					curr_info.mode = 'no_video_in_root';

					self.UpdateButton( false );

				} else {

					if ( Debug ) opera.postError("INFO: CheckUrl OK.");
					
					curr_info.mode = 'download_video';

					self.UpdateButton( true );

				}

			} else {

				if ( Debug ) opera.postError("INFO: CheckUrl start searching.");

				curr_info.mode = 'download_searching';
/*
				var tab = opera.extension.tabs.getFocused();
				if( tab ) {

					tab.postMessage( { cmd: 'fvd_get_videos', 'url': url } );

				}
*/
				opera.extension.broadcastMessage( { cmd: 'fvd_get_videos', 'url': url } );
				curr_url = url;

				self.UpdateButton( false );

			}

		} else {

			curr_info.url = '';
			curr_info.mode = 'no_video';
			curr_info.ml = null;
			curr_info.ihtml = '';

			self.UpdateButton( false );

		}
	}

	// -----------------------------------------------------------------------------
	this.DailyMotionURL = function ( url ) {
	
		opera.postError("INFO: DailyMotionURL :"+pars_url + ' --  '+ pars_info.ml);			
		if ( pars_url && pars_info.ml)
		{
			curr_info.mode = 'download_choose_video';
			curr_info.ml = pars_info.ml;
			self.UpdateButton( true );
		}
		else
		{
			self.CheckURL(url);
		}
	}
	
	
	// Handle messages from popup-menu
	this.HandleMessages = function (event) {

		if ( Debug ) opera.postError("INFO: Background-Process get command '" + event.data.cmd + "'");
		
        var port;
        if (event.ports)
		{
			port = event.ports[0];
			var request = event.data;
			var callback = function(data) 
			{
				port.postMessage(data);
			};
		}
		
		switch( event.data.cmd ) {

			case 'fvd_refresh':
			{

				// Nothing yet.

			} break;

			case 'fvd_set_parset_videos':
			{

				//opera.postError("INFO: fvd_set_parset_videos:"+ event.data.url );

				pars_info.ml = event.data.result;
				pars_info.mode = 'download_choose_video';
				pars_url = event.data.url;

				self.UpdateButton( true );
				event.source.postMessage( { cmd:'popup_refresh', d:pars_info } );

			} break;

			case 'fvd_get_videos_result':
			{
				if ( curr_info.url == event.data.url ) 
				{

					curr_info.ml = event.data.result;
					curr_info.ihtml = event.data.ihtml;

					var length = 0;
					if ( curr_info.ml ) 
						for ( var i in curr_info.ml ) length++;

					if ( length > 0 )
						curr_info.mode = 'download_choose_video';
					else
						curr_info.mode = 'no_video';

					self.UpdateButton( !( curr_info.mode == 'no_video' || curr_info.mode == 'download_searching' || curr_info.mode == 'no_video_in_root' ) );

					event.source.postMessage( { cmd:'popup_refresh', d:curr_info } );

				}

			} break;

			// Page  - VK.COM - loaded
			case 'ev_vk_page_loaded':
			{
				var url = '';
				var tab = opera.extension.tabs.getFocused();

				if ( tab ) 		url = tab.url;
				if (curr_url != url)
				{
					curr_url = url;
					self.CheckURL( url );
				}
				

			} break;

			// Page loaded
			case 'ev_page_loaded':
			{

				var url = '';
				var tab = opera.extension.tabs.getFocused();

				if ( tab ) 		url = tab.url;
				curr_url = url;
				
				if  (  (url.toLowerCase().indexOf("dailymotion.com/video") != -1 )
					|| (url.toLowerCase().indexOf("youtube.com") != -1 ) )
				{
					self.DailyMotionURL( url );
				}
				else
				{
					self.CheckURL( url );
				}	

			} break;

			// Load Help Page
			case 'fvd_goto_help':
			{

				if( opera.extension.tabs.create )
					opera.extension.tabs.create({ url:"http://www.flashvideodownloader.org/opera-toolbar-help.php", focused:true });

			} break;

			// Load Video Converter Page
			case 'fvd_goto_video_converter':
			{

				if( opera.extension.tabs.create )
					opera.extension.tabs.create({ url:"http://www.flashvideodownloader.org/fvd-suite/", focused:true });

			} break;

			// Load Feedback Page
			case 'fvd_goto_feedback':
			{

				if( opera.extension.tabs.create )
					opera.extension.tabs.create({ url:"http://www.flashvideodownloader.org/fvd-suite/contact/index.php", focused:true });

			} break;

			// Load Feedback Page
			case 'fvd_goto_search':
			{

				if( opera.extension.tabs.create && event.data.q )
					opera.extension.tabs.create({ url:"http://start.flashvideodownloader.org/result.php?cx=partner-pub-5087362176467115:h6z8ss-efx2&cof=FORID:10&ie=ISO-8859-1&sa=Search&q=" + encodeURIComponent( event.data.q ), focused:true });


			} break;

			// Load Feedback Page
			case 'fvd_download':
			{
				if( opera.extension.tabs.create && event.data.url )
					opera.extension.tabs.create({ url: event.data.url, focused: true });


			} break;
			
			// Load CSS
			case 'fvd_load_css':
			{
				load_css(callback);
			} break;
			// Load OPTION
			case 'fvd_load_option':
			{
				load_option(request.param, callback);
			} break;
			
			// Do nothing
			default:
				if ( Debug ) opera.postError("ERROR: Unkown Command from Menu -> " + event.data.cmd);
		}
	};
	
	function load_option(param, result)
	{
		if (widget.preferences[param]==null || widget.preferences[param]=="true")
		{
			result(true);
		}
		else
		{
			result(false);
		}
	}
	function load_css(result)
	{
		var path = 'css/styles.css';
		var req = new XMLHttpRequest();
		req.open('GET', path, false);
		req.send();
		result(req.responseText);
	}

	this.TabFocused = function ( event ) {

		if ( Debug ) opera.postError("INFO: TabFocused");

		var url = '';
		var tab = opera.extension.tabs.getFocused();

		if ( tab ) {

			url = tab.url;
			if ( Debug ) opera.postError("INFO: URL:"+ tab.url);

		}
		self.CheckURL( url );

	};

	this.TabCreated = function ( event ) {

		if ( Debug ) opera.postError("INFO: TabCreated");

		var url = '';
		var tab = opera.extension.tabs.getFocused();

		if ( tab ) {

			url = tab.url;
			if ( Debug ) opera.postError("INFO: URL:"+ tab.url);

		}
		self.CheckURL( url );

	};


	// Listen for injected script messages
	opera.extension.onmessage = this.HandleMessages;

	opera.extension.tabs.onfocus = this.TabFocused;
	opera.extension.tabs.oncreate = this.TabCreated;

	this.main_button = opera.contexts.toolbar.createItem( FVDMainButton );
	opera.contexts.toolbar.addItem( this.main_button );

	// Connect to Menu and give all the curr_info
	opera.extension.onconnect = function (event) {

		if ( event.origin.indexOf( "popup.html" ) > -1 ) {

//			if ( pars_info.ml)			event.source.postMessage( { cmd:'popup_refresh', d:pars_info } );
//						else
			event.source.postMessage( { cmd:'popup_refresh', d:curr_info } );

		}
	}

}
