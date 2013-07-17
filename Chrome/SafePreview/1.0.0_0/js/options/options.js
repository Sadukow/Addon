(function(){

	// ---------------------------------  Class OPTIONS
	var Options = function(){
	
	}
	
	Options.prototype = {
		
		_roller: null,
		
		_settingsTypesIndexes:{
			"general": 0,
			"service": 1,
			"websites": 2,
			"about": 3
		},
		
		_typesButtons:{
			"general": "general",
			"service": "service",
			"websites": "websites",
			"about": "about"
		},
		
		
		init: function(){
			var that = this;
	
			this._listenOptions();
			this.refreshOptionValues();			
			
			this._roller = SafePreview.Roller.create( document.getElementById("rollerContent") );
			
			// init tabs
			this.Tabs.init();

			// hash
			var hash = document.location.hash;

			document.getElementById( "closeButton" ).setAttribute( "active", 1 );
			
			// GoodSite
			var listGoodsite		= SafePreview.Prefs.get("sp.goodsite");
			this.readGoodSite(listGoodsite);				

			document.getElementById("GoodSiteList").addEventListener( "change", function(){
				
							that.displaySelectDomain();
				
						}, false );

			function changeScale(){	
				var cdRange = document.getElementById("scaleShowIcon");
				var width = Math.round(cdRange.value/100)/10;
				document.getElementById( "custom_scaleShowIcon" ).textContent = width+" sec";

				cdRange = document.getElementById("scaleHideIcon");
				width = Math.round(cdRange.value/100)/10;
				document.getElementById( "custom_scaleHideIcon" ).textContent = width+" sec";

				cdRange = document.getElementById("scaleClosePreview");
				width = Math.round(cdRange.value/100)/10;
				document.getElementById( "custom_scaleClosePreview" ).textContent = width+" sec";

				cdRange = document.getElementById("scaleDailyHistory");
				width = Math.round(cdRange.value);
				document.getElementById( "custom_scaleDailyHistory" ).textContent = width+" day";
			}
			
			changeScale();

						
			document.getElementById("scaleShowIcon").addEventListener( "change", changeScale, false );
			document.getElementById("scaleHideIcon").addEventListener( "change", changeScale, false );
			document.getElementById("scaleClosePreview").addEventListener( "change", changeScale, false );
			document.getElementById("scaleDailyHistory").addEventListener( "change", changeScale, false );
						
						
			// version
			var span = document.getElementById( "sp_version_value" );
			var app = chrome.app.getDetails();
			span.textContent = app.version;			
		},
		
		setType: function( type ){
		
			document.getElementById( "closeButton" ).setAttribute( "active", 0 );
			
			var index = this._settingsTypesIndexes[ type ];
			this._roller.rollTo( index );
			
			var buttons = document.getElementsByClassName( "buttonBig" );
			for( var i = 0; i != buttons.length; i++ )
			{
				buttons[i].setAttribute( "active", 0 );
			}
			var button = document.getElementsByClassName( this._typesButtons[type] )[0];
			button.setAttribute( "active", 1 );
		},

		// --------------- Закладки	
		Tabs: {
			
			tabs: [],
			
			_createInstance: function( tabsBox ){
				
				var TabBox = function( tabsBox ){				
					
					function tabsContent()
					{
						return tabsBox.getElementsByClassName( "tabContent" );
					}
					
					// -------------	
					function tabsHeads()
					{
						return tabsBox.getElementsByClassName( "tabHead" );	
					}
					
					// -------------	
					function setActiveTab( tabNum )
					{
						
						var heads = tabsHeads();
						var contents = tabsContent();
						
						for( var i = 0; i != heads.length; i++ )
						{							
							if( i == tabNum )
							{
								heads[i].setAttribute( "active", 1 );
							}
							else
							{
								heads[i].removeAttribute( "active", 1 );
							}							
						}
						
						for( var i = 0; i != contents.length; i++ )
						{
							if( i == tabNum )
							{
								contents[i].style.display = "block";
							}
							else
							{
								contents[i].style.display = "none";
							}
						}
						
					}

					// -------------	
					this.setActiveTab = function( tabNum )
					{
						setActiveTab( tabNum );
					}
					
					var heads = tabsHeads();
					
					for( var i = 0; i != heads.length; i++ )
					{
						
						(function(i){
							heads[i].addEventListener( "click", function( event ){
								
								if( event.button != 0 )		return;
								
								setActiveTab( i );
								
							}, false );
						})(i);						

					}
					
					setActiveTab(0);
					
				}
				
				return new TabBox( tabsBox );
				
			},		
		
			
			init: function(){
				
				var tabs = document.getElementsByClassName( "tabs" );
				
				for( var i = 0; i != tabs.length; i++ ){
					
					this.tabs.push( this._createInstance( tabs[i] ) );
					
				}
				
			}
			
		},

		// ------------------------------------------   данные считать
		refreshOptionValues: function( callback ){
			var that = this;
			
			var options = document.querySelectorAll( "[sname]" );
			for (var i = 0; i != options.length; i++) 
			{
				var option = options[i];
				this._setOptionVal( option, SafePreview.Prefs.get( option.getAttribute( "sname" ) ) );				
			}
		},
		
		
		
		// ---------------------------------------------- 
		_refreshEnableTypes: function(){
		
		},
		
		// ---------------------------------------------- изменить опцию
		_changeOption: function( option ){
			
			var settingName = option.getAttribute( "sname" );
			var newValue = this._getOptionValue( option );

			document.getElementById( "mainContainer" ).setAttribute( "havechanges", 1 );
			document.getElementById( "closeButton" ).setAttribute( "active", 0 );
			
			if( ["fvd.enable_37","fvd.enable_22","fvd.enable_35","fvd.enable_34","fvd.enable_6_5","fvd.enable_18","fvd.enable_17_13","fvd.enable_43","fvd.enable_44","fvd.enable_45","fvd.enable_46" ].indexOf(settingName) != -1 )
			{
				this._refreshEnableTypes();
			}
		},
		
		// ---------------------------------------------- 
		_listenOptions: function(){
			var options = document.querySelectorAll( "[sname]" );
			var that = this;
			for( var i = 0; i != options.length; i++ )
			{
				var option = options[i];
				(function( option ){
					option.addEventListener( "change", function( event ){
						that._changeOption( option );
					}, false );									
				})( option );
			}
		},
		
		// ---------------------------------------------- установить опцию
		_setOptionVal: function( option, value ){
			try
			{
				if( option.tagName == "INPUT" )
				{
					if( option.className == "color" )
					{
						if( option.color )		option.color.fromString(value);							
									else		option.value = value;						
						return;
					}
				 	else if( option.type == "checkbox" )
					{
						option.checked = _b(value);
						return;
					}
					else if( option.type == "radio" )
					{
						var name = option.name;
						document.querySelector( "[name="+name+"][value="+value+"]" ).checked = true;
						return;					
					}
				}	
				option.value = value;				
			}
			catch( ex ){		}
		},
		
		// ---------------------------------------------- получить опцию
		_getOptionValue: function( option ){
			
			if( option.tagName == "INPUT" )
			{
			 	if( option.type == "checkbox" )
				{
					return option.checked;
				}
				else if( option.type == "radio" )
				{
					var name = option.name;
					return document.querySelector( "[name="+name+"]:checked" ).value;
				}
			}
			
			return option.value;
		},
		
		// ------------------------------------------------   применение изменений
		applyChanges: function( applyChangesCallback ){
			
			var settedOptions = [];
			var setOptions = [];
			var options = document.querySelectorAll( "[sname]" );
									
			for( var i = 0; i != options.length; i++ )
			{
				var name = options[i].getAttribute( "sname" );
				if( settedOptions.indexOf(name) != -1 )			continue;
				
				settedOptions.push( name );
				
				SafePreview.Prefs.set( name, this._getOptionValue( options[i] ) );
				
//				console.log ('name=' + name + ' == ' + this._getOptionValue( options[i] ));
				
				setOptions[name] = this._getOptionValue( options[i] );
			}
			
			var applyChangesButton = document.getElementById( "applyChangesButton" );
			applyChangesButton.setAttribute( "loading", 1 );

			// good_site	
			this.writeGoodSite();				
		
			var doneCallback = function(){
				document.getElementById( "mainContainer" ).setAttribute( "havechanges", 0 );
				applyChangesButton.setAttribute( "loading", 0 );
				document.getElementById( "closeButton" ).setAttribute( "active", 1 );
				
				if( applyChangesCallback )	
				{
					applyChangesCallback(setOptions);					
				}
			}	

			doneCallback();
			
			// заставить все страницы провести чтение настроек
			this.reloadPrefs();
		},

		// ------------------------------------------------   закрыть окно ОПЦИЙ	
		close: function(){
			window.close();
		},
		
		change_scale: function( value ){
//				var cdRange = document.getElementById("cdSizeRange_" + document.getElementById("themeSelect").value);
						
//				var width = cdRange.value;
//				var height = Math.round(width / fvdSpeedDial.SpeedDial._cellsSizeRatio);
//				document.getElementById( "customDialSizePreview" ).textContent = width + "x" + height;
		},

		service_change: function( event ){
			var be_google = document.getElementById("enableGoogle");
			var be_mcafee = document.getElementById("enableMcAfee");
			var be_norton = document.getElementById("enableNorton");
			var be_wot 	  = document.getElementById("enableWOT");
			var be_avast  = document.getElementById("enableAvast");
			var be_trust  = document.getElementById("enableTrust");
			var be_drweb  = document.getElementById("enableDrWeb");
		
			var be = event.target;

			if (   !be_mcafee.checked 
				&& !be_norton.checked 
				&& !be_wot.checked 
				&& !be_google.checked 
				&& !be_avast.checked
				&& !be_trust.checked
				&& !be_drweb.checked
				)
			{
				this.display_show_display_alert("You must have at least one secure service.");
				be.checked = true;
			}
		
		},

		// ---------------------------------------------  установить список
		readGoodSite: function( value ){
		
			if (!value) return;
			var gems = value.split(';');
			var opt = document.getElementById("GoodSiteList")
			for (var i = 0; i < gems.length; i++)
			{
				var row = document.createElement('option');
				row.textContent=gems[i];
				opt.appendChild( row );
			}
		},
		
		// ---------------------------------------------  установить список
		writeGoodSite: function( ){
			var list = document.getElementById('GoodSiteList');	
			var str = '';
			for (var i=0; i<list.options.length; i++) 
			{
				var option = list.options[i];
				if (str != "") str += ';';
				str += option.value;
		    }
				
			SafePreview.Prefs.set( "sp.goodsite", str );
		},

		displaySelectDomain: function(){

			var options = document.getElementById("GoodSiteList").options;
			var selected = document.getElementById("GoodSiteList").value;
			var ind = document.getElementById("GoodSiteList").selectedIndex;
			
			var arr = selected.split('.');
		
			var k = arr.length;
			if (arr[k-1] == '') return '';
			if (!arr[k-2] || arr[k-2] == '') return '';
		
			var domain = arr[k-2] + '.' + arr[k-1];
			
			var subd = false;
			if (arr[k-3] && arr[k-3] == '*') subd = true;
			
			document.getElementById("DomainGoodsite").value = domain;
			document.getElementById("subDomainGoodsite").checked = subd;
			
		},
		
		goodsite_add: function(){
			var str = document.getElementById("DomainGoodsite").value;
			if (!str) return;
			
			if (str.match(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/) == null) 
			{
				this.display_show_display_alert("Wrong Domain or Sub-domain!");
				return;
			}	
			
			var domain = this.goodsite_domain( str );

			var options = document.getElementById("GoodSiteList").options;
			// проверка на повторение
			for( var i = 0; i != options.length; i++ )
			{
				var s = this.goodsite_domain( options[i].value );
				if ( domain == s)
				{
					this.display_show_display_alert("Domain alredy added!");
					return;
				}
			}

			var subd = document.getElementById("subDomainGoodsite").checked;
			if (subd)  domain = '*.'+domain;
			
			var list = document.getElementById('GoodSiteList');	
			var row = document.createElement('option');
			row.textContent=domain;
			list.appendChild( row );
			
			document.getElementById("DomainGoodsite").value = '';
			document.getElementById("subDomainGoodsite").checked = false;
			
			document.getElementById( "mainContainer" ).setAttribute( "havechanges", 1 );
			document.getElementById( "closeButton" ).setAttribute( "active", 0 );
		},
		goodsite_remove: function(){
			var list = document.getElementById('GoodSiteList');	
			// удалить текущий	
			var current = list.selectedIndex;
			if (current >= 0)
			{
				var option = list.options[current];
				
				list.removeChild( option );
				
				document.getElementById("DomainGoodsite").value = '';
				document.getElementById("subDomainGoodsite").checked = false;
			}
			document.getElementById( "mainContainer" ).setAttribute( "havechanges", 1 );
			document.getElementById( "closeButton" ).setAttribute( "active", 0 );
		},
		goodsite_edit: function(){
			var list = document.getElementById('GoodSiteList');	
			var current = list.selectedIndex;
			
			var str = document.getElementById("DomainGoodsite").value;
			if (!str) return;
			
			if (str.match(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/) == null) 
			{
				this.display_show_display_alert("Domain define frong!");
				return;
			}	
			
			var domain = this.goodsite_domain( str );

			var options = document.getElementById("GoodSiteList").options;
			// проверка на повторение
			for( var i = 0; i != options.length; i++ )
			{
				var s = this.goodsite_domain( options[i].value );
				if ( domain == s && i != current)
				{
					this.display_show_display_alert("Domain alredy added!");
					return;
				}
			}

			var subd = document.getElementById("subDomainGoodsite").checked;
			if (subd)  domain = '*.'+domain;

			var option = list.options[current];
			option.textContent=domain;
			
			document.getElementById( "mainContainer" ).setAttribute( "havechanges", 1 );
			document.getElementById( "closeButton" ).setAttribute( "active", 0 );
		},
		
		goodsite_domain: function( str ){
			var arr = str.split('.');
			var k = arr.length;
			if (arr[k-1] == '') return '';
			if (!arr[k-2] || arr[k-2] == '') return '';
			var domain = arr[k-2] + '.' + arr[k-1];
			return domain;
		},
		
		display_show_display_alert: function( str ){
			alert(str);
		},

		reloadPrefs:function() {
			chrome.windows.getAll({populate:true}, function(e) {
								for(var t=0;t<e.length;t++)
								{
									var n=e[t].tabs;
									for(var r=0;r<n.length;r++)
									{
										var i=n[r];
										if(i.url.indexOf("http")!=-1)
										{
											chrome.tabs.executeScript(i.id,{code:"reloadPrefs();"})
										}
									}
								}
							})
		},

		modeLive_change: function(){
		
			var currentMode = document.getElementById("mode_Live").value;
		
			console.log(currentMode);
		
		},


		
		// -----------------------------------------------	
		openGetSatisfactionSuggestions: function(){
			window.open( "https://getsatisfaction.com/fvd_suite/topics/" );
		}
		// -----------------------------------------------	
		
		
		
	};	
	
	this.Options = new Options();
	
	
}).apply( SafePreview );
