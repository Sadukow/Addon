document.addEventListener( "SP_SingleApiEvent", function(event){
	var data = event.detail;
	
	switch( data.a ){
		
		case "DisplaySetting": 
			try
			{
				sp_single.display_settings();
			}
			catch( ex ){			}
		break;		
		
		case "Single_LOG": 
			try
			{
				sp_single.alert( '*SCRIPT: ' + data.text );
			}
			catch( ex ){			}
		break;		
		
		case "Navigate_URL": 
			try
			{
				sp_single.navigate_url( data.url, null, data.fl1, data.fl2 );
			}
			catch( ex ){			}
		break;		
		
		case "reloadPrefs":
			try
			{
				var media = sp_single.reloadPrefs(  );
				data.callback( JSON.stringify( media ) );
			}
			catch( ex )
			{
				dump( "Cannot process ext api request " + ex + "\r\n" );
			}
		break;	

		case "isLink":
			try
			{
				sp_single.spLink.isLink( data.u, data.l );
			}
			catch( ex )
			{
				dump( "Cannot process ext api request " + ex + "\r\n" );
			}
		break;	
		
		case "Proverka":
			try
			{
				var media = sp_single.spSafe.Proverka( data.u, data.x, data.y, data.l );
			}
			catch( ex )
			{
				dump( "Cannot process ext api request " + ex + "\r\n" );
			}
		break;	
			
		case "Pokazat":
			try
			{
				var media = sp_single.spPreview.ShowThumbnail( data.u, data.h );
			}
			catch( ex )
			{
				dump( "Cannot process ext api request " + ex + "\r\n" );
			}
		break;	
			
		case "ClickDocument":
			try
			{
				sp_single.spSafe.ClickDocument(  );
				//sp_single.spPreview.ClickDocument(  );
				sp_single.spLive.ClickDocument(  );
			}
			catch( ex )
			{
				dump( "Cannot process ext api request " + ex + "\r\n" );
			}
		break;	
			
		case "EscDocument":
			try
			{
				sp_single.spSafe.ClickDocument(  );
				//sp_single.spPreview.ClickDocument(  );
				sp_single.spLive.EscDocument(  );
			}
			catch( ex )
			{
				dump( "Cannot process ext api request " + ex + "\r\n" );
			}
		break;	
			
		case "ShowLiveRegular":
			try
			{
				sp_single.spLive.ShowLiveRegular( data.u );
			}
			catch( ex )
			{
				dump( "Cannot process ext api request " + ex + "\r\n" );
			}
		break;	
			
		case "ShowLiveIncognito":
			try
			{
				sp_single.spLive.ShowLiveIncognito( data.u );
			}
			catch( ex )
			{
				dump( "Cannot process ext api request " + ex + "\r\n" );
			}
		break;	
			


}
	
}, false, true );