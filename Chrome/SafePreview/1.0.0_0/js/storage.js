// signletone, original saved in background page

// note:
// to get favicon use URL : chrome://favicon/http://www.google.com
//

if( window == chrome.extension.getBackgroundPage() ){
	(function(){
		
		var Storage = function(){		
								
		}
		
		Storage.prototype = {
			
			_connection: null,
			_dbName: "fvdSafePreviewDataBase",
			_estimatedSize: 500 * 1024 * 1024,
			
			// force use transaction
			_transaction: null,
			
			
			_backupRegexp: /_backup_(.+?)_(.+)$/i,


			// -----------------------------------  открытие базы данных
			connect: function( callback ){
				var that = this;
				
				this._connection = openDatabase(this._dbName, '1.0', '', this._estimatedSize);

//				console.log('openDatabase');
				
				//this._removeTables();
				
				this._createTables(function( result ){			
					
//					console.log( "Tables creation result: " + result );
							
				});
			},
			
			transaction: function( callback ){
				
				if( this._transaction )	callback( this._transaction );
							else	this._connection.transaction( callback );
				
			},
			
			_removeTables: function( callback ){
			
				this.transaction( function(tx){					
					
								tx.executeSql( "DROP TABLE `hosts`" );
								
							} );
			},				

			// -----------------------------------  создание таблицы
			_createTables: function( callback ){
				
				var that = this;
				
				this.transaction( function(tx){					
					
					SafePreview.Utils.Async.chain([
							function( callback2 ){
								tx.executeSql( "CREATE TABLE IF NOT EXISTS hosts (`host` TEXT, `srv` TEXT, `rez` TEXT, timestamp REAL)", [], function(){
															
									callback2();
												   	
								} );
									
							},
							
							function(){
								callback( true );
							}
						]);						
					
				});
			},
			
			// -----------------------------------  чтение таблицы
			readHosts: function( callback ){
												
				this.transaction(function( tx ){
					tx.executeSql( "SELECT * FROM `hosts` ", [], function( tx, results ){
						
										var data = [];
										for( var i = 0; i != results.rows.length; i++ )
										{
											var dial = results.rows.item(i);							
											data.push( {
														host: dial.host,
														srv:  dial.srv,
														rez:  dial.rez,
														dat:  dial.timestamp
													} );
										}
						
										callback( data );
						
									} );
				});				
			},
			
			// -----------------------------------  запись в таблицу
			writeHost: function( addData, callback ){
				
				this.transaction(function( tx ){
				
					tx.executeSql( "SELECT * FROM `hosts` WHERE `srv`=? AND `host`=? ", [addData.srv, addData.host], function( tx, results ){
						
										var data = [];
										if (results.rows.length > 0)
										{
											tx.executeSql( "UPDATE `hosts` SET   `rez` = ?,  `timestamp` = ?  WHERE `srv` = ? AND `host` = ?	", 
																[addData.rez, addData.dat, addData.srv, addData.host],	
																	function( tx, results ){
																						callback( results );
																					}, 
																	function(){
																				console.log( "Error edit dials", arguments );
																			} );
										}
										else
										{
											tx.executeSql( "INSERT INTO `hosts`(host, srv, rez, timestamp) VALUES(?, ?, ?, ?)", 
																	[addData.host, addData.srv, addData.rez, addData.dat], 
																	function( tx, results ){
																						callback( results );
																					}, 
																	function(){
																				console.log( "Error add dials", arguments );
																			} );
										}
						
									} );
							});
			},
			
			// -----------------------------------  добавить в таблицу
			insertHost: function( addData, callback ){
				
				this.transaction(function( tx ){
					tx.executeSql( "INSERT INTO `hosts`(host, srv, rez, timestamp) VALUES(?, ?, ?, ?)", 
									[addData.host, addData.srv, addData.rez, addData.dat], 
											function( tx, results ){
													callback( results );
												}, 
											function(){
													console.log( "Error add dials", arguments );
												} );
							});
			},
			
			deleteOldHost: function( dat, callback ){
				this.transaction( function( tx ){
								tx.executeSql( "DELETE FROM `hosts` WHERE `timestamp` < ?", [ dat ], function( tx, results ){  } );
							} );
			},
			
			
		};
		
		this.Storage = new Storage();
		
	}).apply(SafePreview);

}
else{
	SafePreview.Storage = chrome.extension.getBackgroundPage().SafePreview.Storage;
}


