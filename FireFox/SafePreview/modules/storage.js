var EXPORTED_SYMBOLS = ["sp_single_Storage"];

const SETTINGS_KEY_BRANCH = 'extensions.SafePreview.';
const DB_FILE = "db_sp.sqlite";
const STORAGE_FOLDER = 'Save_Preview';

// singleton class
function SP_TOOLBAR_STORAGE(){

	
	var self = this;
	
	this.connection = null;
	this.observer = null; // for sending messages	
	
	this.registry = null;
	this.timer = null;	

	// -------------------------------------------------------------------------------------------------
	this._init = function(){		
		try
		{
			this.registry = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch(SETTINGS_KEY_BRANCH);
	
	        this.observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
	
	        var file = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('ProfD', Components.interfaces.nsIFile);
	        file.append(STORAGE_FOLDER);
	        		
	        if (!file.exists())       file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0755);
			
	        if (file.exists() && file.isDirectory()) 
			{
	            file.append(DB_FILE);
	            
				if( !file.exists() )  {	}			
	        }
			
			var storageService = Components.classes["@mozilla.org/storage/service;1"].getService(Components.interfaces.mozIStorageService);
			this.connection = storageService.openDatabase(file);		
			
			try
			{
				this._createTables();			
			}
			catch( ex ){		}			
		}
		catch( ex ){	}

	}
	
	// -------------------------------------------------------------------------------------------------
	this._createTables = function(){
		
		var foundTables = [];
		var foundIndexes = [];
		
		var statement = this.connection.createStatement( "SELECT `name`, `type` FROM sqlite_master" );
		var foundFields = [];
		while( statement.executeStep() )
		{
			
			switch( statement.row.type ){
				case "table":
					foundTables.push( statement.row.name );
				break;
				case "index":
					foundIndexes.push( statement.row.name );					
				break;				
			}

		}
			
		var foundNotExistsTables = false;	
		
		if( !this.connection.tableExists("dials_groups") )
		{
			
			foundNotExistsTables = true;
			
			try{
				this.connection.executeSimpleSQL("CREATE TABLE `hosts` (\
							`host` VARCHAR(255), \
							`srv` VARCHAR(64), \
							`rez` VARCHAR(128),\
							`timestamp` INT \
							);");			
			}	
	 		catch( ex ){		}
		}
	}	
	
	// -------------------------------------------------------------------------------------------------
	this.beginTransaction = function(){
		this.connection.beginTransaction();
	}
	this.commitTransaction = function(){
		this.connection.commitTransaction();
	}
	this.rollbackTransaction = function(){
		this.connection.rollbackTransaction();
	}
	
	
	// -------------------------------------------------------------------------------------------------
	this.tableColumnsNames = function( table ){
		var query = "PRAGMA TABLE_INFO("+table+")";
		
		var statement = this.connection.createStatement( query );
		var result = [];
		
		while( statement.executeStep() ){
			result.push( statement.row.name );
		}
		
		return result;
	};
	
	// -------------------------------------------------------------------------------------------------
	this.truncateTable = function( table, where ){		
		where = where || "";
		if( where ){
			where = "WHERE " + where;
		}
		
		this.connection.executeSimpleSQL( "DELETE FROM `"+table+"` " + where );
	};
	
	
	// -------------------------------------------------------------------------------------------------
	this.getAllTablesNames = function(){
		// get list of all tables
		var statement = this.connection.createStatement( "SELECT name FROM sqlite_master\
		WHERE type='table'\
		ORDER BY name;\
		" );
		
		var result = [];
		
		while( statement.executeStep() ){
			result.push( statement.row.name );
		}		
		
		return result;
	}	

	this.isHosts = function( host, srv ){
		
		try
		{
			var statement = this.connection.createStatement( "SELECT * FROM `hosts` WHERE `srv` = :srv AND `host` = :host" );
			
			statement.params.srv = srv;
			statement.params.host = host;
		
			if( statement.executeStep() )
			{
				return true;
			}
		
			return false;
		}	
		catch( ex ){	}
		
		return false;
	}
	
	// -------------------------------------------------------------------------------------------------
	this.writeHost  = function( addData ){
	
		if (this.isHosts( addData.host, addData.srv ))
		{
			this.updateHost( addData );
		}
		else
		{
			this.insertHost( addData );
		}
		return null;
	}
	// -------------------------------------------------------------------------------------------------
	this.updateHost  = function( addData ){
		
		try
		{
			var statement = this.connection.createStatement( "UPDATE `hosts`SET   `rez` = :r,  `timestamp` = :t  WHERE `srv` = :s AND `host` = :h" );
			
			statement.params.h = addData.host;
			statement.params.s = addData.srv;
			statement.params.r = addData.rez;
			statement.params.t = addData.dat;
			statement.execute();
			
			return this.connection.lastInsertRowID;			
		}
		catch( ex ){
			
		}
		
		return null;
	}
	// -------------------------------------------------------------------------------------------------
	this.insertHost  = function( addData ){
		
		try
		{
			var statement = this.connection.createStatement( "INSERT INTO `hosts`(`host`, `srv`, `rez`, `timestamp`) VALUES(:h, :s, :r, :t)" );
			statement.params.h = addData.host;
			statement.params.s = addData.srv;
			statement.params.r = addData.rez;
			statement.params.t = addData.dat;
			statement.execute();
			
			return this.connection.lastInsertRowID;			
		}
		catch( ex ){
			
		}
		
		return null;
	}
	// -------------------------------------------------------------------------------------------------
	this.readHosts = function(  ){
		try
		{
			var statement = this.connection.createStatement( "SELECT `host`, `srv`, `rez` FROM `hosts` " );

			var result = [];
			while( statement.executeStep() )
			{
				result.push({
							host: statement.row.host,
							srv:  statement.row.srv,
							rez:  statement.row.rez
							});
			}
			return result;

		}
		catch( ex ){		}
		return null;
	}
	// -------------------------------------------------------------------------------------------------
	this.deleteOldHost = function( dat ){
		try
		{
			var statement = this.connection.createStatement( "DELETE FROM `hosts` WHERE `timestamp` < :d" );
			statement.params.d = dat;
			statement.execute();
		}
		catch( ex ){
			
		}
	}
	// -------------------------------------------------------------------------------------------------
	this.notifyObservers = function( message, aData ){
		
        this.observer.notifyObservers(null, message, aData);
	}
	
	// -------------------------------------------------------------------------------------------------
    this._write_file = function(filePath, content, regim = 0){
        var file = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('ProfD', Components.interfaces.nsIFile);
        file.append(STORAGE_FOLDER);
        
        if (!file.exists())         file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0755); 
		
        if (file.exists() && file.isDirectory()) 
		{
            file.append(filePath);
            var fos = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
            var modeFlags;
			if (regim == 0) modeFlags = MODE_WRONLY | MODE_CREATE | MODE_APPEND;
					   else modeFlags = MODE_WRONLY | MODE_CREATE | MODE_TRUNCATE;
            fos.init(file, modeFlags, PERMS_FILE, 0);
            var ct = Components.classes['@mozilla.org/intl/converter-output-stream;1'].createInstance(Components.interfaces.nsIConverterOutputStream);
            ct.init(fos, 'UTF-8', 0, 0);
            ct.writeString(content);
			ct.flush();
            ct.close();
        }
    }
	// -------------------------------------------------------------------------------------------------
    this.load_ad_signs = function(){
        // open prifile folder
        var file = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('ProfD', Components.interfaces.nsIFile);
        if (file) 
		{
            file.append(STORAGE_FOLDER);
			
            if (file.exists() && file.isDirectory()) 
			{
                file.append(AD_SIGNS_FILE);
                
                if (file.exists() && file.isFile() && file.isReadable()) 
				{
                    var file_url = '';
                    
                    try 
					{
                        var fh = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService).getProtocolHandler('file').QueryInterface(Components.interfaces.nsIFileProtocolHandler);
                        
                        var file_url = fh.getURLSpecFromFile(file);
                    } 
                    catch (e) {                   }
                    
                    if (file_url != '') 
					{
                        var responseText = this._get_file_contents(file_url);
		
                        if (responseText != null)      return this.parse_ad_signs(responseText);
                    }
                }
            }
        }
        
        return '';
    };

    this._get_file_contents = function(file_url){
        try 
		{
            var ajax = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
            ajax.open('GET', file_url, false);
            ajax.overrideMimeType('text/plain');
            ajax.send(null);
            
            return ajax.responseText;
        } 
        catch (ex) {
            return "";
        }
        
    };

    this.parse_ad_signs = function(txt){
        var tmp = txt.split("\n");
		if (this.wot && this.wot.length > 0) this.wot.length = 0;
		if (this.mcafee && this.mcafee.length > 0) this.mcafee.length = 0;
		if (this.norton && this.norton.length > 0) this.norton.length = 0;

		var current_dt = new Date();
		var current_time = current_dt.getTime();
		
		var t = this.branch.getIntPref('single.scale_daily_history');
		var predel_time = current_time - DISPLAY_FVDSD_HINT_EVERY * t;
		var content = '';	
        for (var i = 0; i != tmp.length; i++) 
		{
            var sign = tmp[i];
            sign = sign.replace(/\s+/, "");
			
            if (!sign)            continue;

			var v = sign.split(";");

			var t = parseInt(v[0]);
			if (t < predel_time) continue;

			var host = v[2];	

			if (v[1] == 'WOT')				this.wot[host] = v[3];			
			else if (v[1] == 'McAfee')		this.mcafee[host] = v[3];			
			else if (v[1] == 'Norton')		this.norton[host] = v[3];			
			
			content += sign + '\n';
        }

        return content;
    };
	
	// -------------------------------------------------------------------------------------------------
    this.download_hosts_from_local = function(){

		// Считаем
		var content = this.load_ad_signs();

		// Запишем
        this._write_file(AD_SIGNS_FILE, content, 1);
    }

	
	// -------------------------------------------------------------------------------------------------
	this.save_file = function (filePath, content)   {
		if(window.Components)
			try
			{
				var file = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath(filePath);
				if (!file.exists())        file.create(0, 0664);
				
				var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				out.init(file, 0x20 | 0x02, 00004, null);
				out.write(content, content.length);
				out.flush();
				out.close();
				return true;
			}
			catch(e)
			{
				return false;
			}
		return null;
	}	
	// -------------------------------------------------------------------------------------------------

	
	this._init();
}

sp_single_Storage = new SP_TOOLBAR_STORAGE();
