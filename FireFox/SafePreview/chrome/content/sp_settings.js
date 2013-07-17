try
{
	// try import addon manager for extension version detection in firefox4
	Components.utils.import('resource://gre/modules/AddonManager.jsm');

} catch (e) {}

function Log(outputString) 
{
	Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage(outputString);
}

function FVD_Settings()
{
	const EXTENSION_GUID = 'safepreview@everhelper.me';
	const SETTINGS_KEY_BRANCH = 'extensions.SafePreview.';

	var self = this;
	this.instant_apply = false;
	this.registry = null;
	this.folder = null;

	this.init = function()
	{
		this.registry = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('browser.preferences.');
		try
		{
			this.instant_apply = this.registry.getBoolPref('instantApply');
		} catch (e) {}

		this.registry = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch(SETTINGS_KEY_BRANCH);
		
		var xai = Components.classes['@mozilla.org/xre/app-info;1'].getService(Components.interfaces.nsIXULAppInfo);
		var vc = Components.classes['@mozilla.org/xpcom/version-comparator;1'].getService(Components.interfaces.nsIVersionComparator);
		if (vc.compare(xai.platformVersion, '1.9.3') >= 0)
		{
			// works via addon manager
			AddonManager.getAddonByID(EXTENSION_GUID, function(addon)
			{
				document.getElementById('fvdsd_version_value').setAttribute('value', addon.version);
			});
		} else
		{
			try
			{
				var ver = Components.classes['@mozilla.org/extensions/manager;1'].getService(Components.interfaces.nsIExtensionManager).getItemForID(EXTENSION_GUID).version;
				document.getElementById('fvdsd_version_value').setAttribute('value', ver);

			} catch (e) {}
		}

		var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
		var main_wnd = wm.getMostRecentWindow('navigator:browser');
	
		try
		{
			var y = this.registry.getIntPref("single.scale_show_icon");
			document.getElementById("scaleShowIcon").value = 10 - Math.ceil(y/250);
			
			y = this.registry.getIntPref("single.scale_hide_icon");
			document.getElementById("scaleHideIcon").value = 10 - Math.ceil(y/250);
			
			y = this.registry.getIntPref("single.scale_close_preview");
			document.getElementById("scaleClosePreview").value = 10 - Math.ceil(y/250);
			
			this.change_scale_time();

			y = this.registry.getIntPref("single.scale_daily_history");
			document.getElementById("scaleDailyHistory").value = y;
			
			var theList = document.getElementById('GoodSiteList');
			
		    var str_gems = this.registry.getCharPref("single.text_goodsite");
			var gems = str_gems.split('|');
			
			for (var i = 0; i < gems.length; i++)
			{
				var items = gems[i].split('-');
				if (items[1] == '*')
				{
					items[1] = 'domain/sub-domain';
					items[0] = '*.'+items[0];
				}	
				var row = document.createElement('listitem');
//				row.setAttribute('label', gems[i]);
				
				var cell = document.createElement('listcell');
				cell.setAttribute('label', items[0]);
				row.appendChild(cell);
				
				cell = document.createElement('listcell');
				cell.setAttribute('label',  items[1] );
				row.appendChild(cell);
				
				theList.appendChild(row);
			}

		} catch (e) {}
	
		var visit_label = document.getElementById("home_site_visit");
		visit_label.addEventListener( "click", function( event ){
				self.navigate_url( "http://www.everhelper.me/" );
				window.close();
			} );

	};

	this.navigate_url = function(url)
	{
		var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
		var mwnd = wm.getMostRecentWindow('navigator:browser');
		if (mwnd)
		{
			var gBrowser = mwnd.getBrowser();
			if (gBrowser)
			{
				var tab = gBrowser.addTab(url);
				if (tab) gBrowser.selectedTab = tab;
			}
		}
	};
		
	this.display_show_display_alert = function( event, message )
	{
		var pref = event.originalTarget;
		var bundle = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService).createBundle('chrome://sp.single/locale/sp.single.settings.properties');			
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
		prompts.alert(null, bundle.GetStringFromName("sp.single.select_format.alert.title"), bundle.GetStringFromName( message ));
	}

	this.service_click = function(event)
	{
		var be_mcafee = document.getElementById("fvdsd_mcafee");
		var be_norton = document.getElementById("fvdsd_norton");
		var be_wot = document.getElementById("fvdsd_wot");
		var be_google = document.getElementById("fvdsd_google");
		var be_trust = document.getElementById("fvdsd_trust");
		var be_drweb = document.getElementById("fvdsd_drweb");
		
		var be = event.originalTarget;

		if (   !be_mcafee.checked 
			&& !be_norton.checked 
			&& !be_wot.checked 
			&& !be_google.checked
			&& !be_trust.checked
			&& !be_drweb.checked
			)
		{
			this.display_show_display_alert(event, "sp.single.select_format.alert.text");
			be.checked = true;
		}
	};

	this.change_scale_time = function(event)
	{
		try
		{
			var y = (10-parseInt(document.getElementById("scaleShowIcon").value, 10) ) * 250;
			document.getElementById("nShowIcon").value = Math.ceil(y/10)/100;
		
			var y = (10-parseInt(document.getElementById("scaleHideIcon").value, 10) ) * 250;
			document.getElementById("nHideIcon").value = Math.ceil(y/10)/100;
		
			var y = (10-parseInt(document.getElementById("scaleClosePreview").value, 10) ) * 250;
			document.getElementById("nClosePreview").value = Math.ceil(y/10)/100;
		} catch (e){}
	};
	this.change_scale_history = function(event)
	{
		try
		{
			var y = parseInt(document.getElementById("scaleDailyHistory").value);
			document.getElementById("nDailyHistory").value = y;
		} catch (e){}
	};
	// -------------------------------------------
	this.main_button_setup = function(event)
	{
		if (this.instant_apply)
		{
			var be = event.originalTarget;
			var observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
			observer.notifyObservers(null, 'FVD.Single-MainButton-Change', (be.checked == true));
		}
	};
	
	this.status_button_setup = function(){
		
		if (this.instant_apply){
			var abe = document.getElementById('fvdsd_status_button_exists');
			if (abe)
			{
				var observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
				observer.notifyObservers(null, 'FVD.Single-StatusButton-Change', (abe.checked == true));
			}
		}
		

	}

	// ----------------------------------- выдление домена
	this.goodsite_delit = function( str ){
	
		var arr = str.split('.');
		var k = arr.length;
		if (arr[k-1] == '') return '';
		if (!arr[k-2] || arr[k-2] == '') return '';
		var domain = arr[k-2] + '.' + arr[k-1];
		return domain;
	
	}	
	
	this.goodsite_select = function( event ){

		var list = document.getElementById('GoodSiteList');	
//		var count = list.selectedCount;
		var current = list.currentIndex;
//		alert(list.itemCount);

		var row = list.getItemAtIndex(current);    
//		var y = row.childNodes[0];

		var s1 = row.firstChild.getAttribute("label");	
		var s2 = row.lastChild.getAttribute("label");	
		s1 = this.goodsite_delit(s1);
		
		var t = document.getElementById('fvdsd_goodsite_add_text');
		t.value = s1;

		if (s2 != '')
		{	
			var be = document.getElementById('fvdsd_goodsite_sub');
			if (be) be.checked = true;
		}
		else
		{
			var be = document.getElementById('fvdsd_goodsite_sub');
			if (be) be.checked = false;
		}
		
		var bb = document.getElementById('fvdsd_goodsite_edit');
		bb.disabled = false;
		
	}
	
	this.goodsite_remove = function( event ){

		var list = document.getElementById('GoodSiteList');	
/*		//удалить все выбранные
		var count = list.selectedCount;
		while (count--)
		{
			var item = list.selectedItems[0];
			list.removeItemAt(list.getIndexOfItem(item));
		}		*/
	
		// удалить текущий	
		var current = list.currentIndex;
		if (current >= 0)
		{
			list.removeItemAt( current );
			var bb = document.getElementById('fvdsd_goodsite_edit');
			bb.disabled = true;
			document.getElementById('fvdsd_goodsite_add_text').value = '';
			document.getElementById('fvdsd_goodsite_sub').checked = false;
		}
	}
	
	this.goodsite_add = function( event ){

		var val = document.getElementById('fvdsd_goodsite_add_text').value;
		// проверка
		if (val.match(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/) == null) 
		{
			this.display_show_display_alert(event, "sp.single.add_goodsite_url.alert.text");
			return;
		}	
		
		
		val = this.goodsite_delit(val);
		if (val == '') return;
		var list = document.getElementById('GoodSiteList');	
		
		// проверка на повторение
		var count = list.getRowCount();
		for (var i=0; i<count; i++)
		{
			var row = list.getItemAtIndex(i);    
			var s1 = row.firstChild.getAttribute("label");	
			s1 = this.goodsite_delit(s1);

			if ( val == s1)
			{
				this.display_show_display_alert(event, "sp.single.add_goodsite.alert.text");
				return;
			}
		}	
		
		var be = document.getElementById('fvdsd_goodsite_sub').checked;
		var v2 = '';
		if (be)
		{	
			val = '*.'+val;	
			v2 = 'domain/sub-domain';	
		}
		
		var row = document.createElement('listitem');

		var cell = document.createElement('listcell');
		cell.setAttribute('label', val);
		row.appendChild(cell);
				
		cell = document.createElement('listcell');
		cell.setAttribute('label',  v2 );
		row.appendChild(cell);
				
		list.appendChild(row);
		
		document.getElementById('fvdsd_goodsite_add_text').value = '';
		document.getElementById('fvdsd_goodsite_sub').checked = false;
		var bb = document.getElementById('fvdsd_goodsite_edit');
		bb.disabled = true;
	}

	this.goodsite_edit = function( event ){

		var list = document.getElementById('GoodSiteList');	
		var current = list.currentIndex;
		
		var val = document.getElementById('fvdsd_goodsite_add_text').value;
		// проверка
		if (val.match(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/) == null) 
		{
			this.display_show_display_alert(event, "sp.single.add_goodsite_url.alert.text");
			return;
		}	

		val = this.goodsite_delit(val);
		if (val == '') return;
		
		// проверка на повторение
		var count = list.getRowCount();
		for (var i=0; i<count; i++)
		{
			var row = list.getItemAtIndex(i);    
			var s1 = row.firstChild.getAttribute("label");	
			s1 = this.goodsite_delit(s1);

			if ( val == s1 && i != current)
			{
				this.display_show_display_alert(event, "sp.single.add_goodsite.alert.text");
				return;
			}
		}	
		
		document.getElementById('fvdsd_goodsite_add_text').value = val;
		var be = document.getElementById('fvdsd_goodsite_sub').checked;

		var row = list.getItemAtIndex(current);    
		if (be)
		{	
			row.firstChild.setAttribute("label", '*.'+val);	
			row.lastChild.setAttribute("label", 'domain/sub-domain');	
		}
		else
		{
			row.firstChild.setAttribute("label", val);	
			row.lastChild.setAttribute("label", '');	
		}
		var bb = document.getElementById('fvdsd_goodsite_edit');
//		bb.disabled = true;
	}
	
	this.ok = function(event)
	{
		try
		{
			var y = (10-parseInt(document.getElementById("scaleShowIcon").value, 10) ) * 250;
			this.registry.setIntPref('single.scale_show_icon', y);
		
			var y = (10-parseInt(document.getElementById("scaleHideIcon").value, 10) ) * 250;
			this.registry.setIntPref('single.scale_hide_icon', y);
		
			var y = (10-parseInt(document.getElementById("scaleClosePreview").value, 10) ) * 250;
			this.registry.setIntPref('single.scale_close_preview', y);
		
			var y = parseInt(document.getElementById("scaleDailyHistory").value);
			this.registry.setIntPref('single.scale_daily_history', y);
		} catch (e){}
		
		try
		{
			var list = document.getElementById('GoodSiteList');
			var count = list.getRowCount();
			var str = "";
			for (var i=0; i<count; i++)
			{
				if (str != "") str += '|';
				var row = list.getItemAtIndex(i);    

				var s1 = row.firstChild.getAttribute("label");	
				s1 = this.goodsite_delit(s1);
				str += s1 + '-';
				
				var s2 = row.lastChild.getAttribute("label");	
				if (s2 != '') str += '*';
			}	
			this.registry.setCharPref("single.text_goodsite", str);
		} catch (e){}
	
		var be = document.getElementById('fvdsd_main_button_exists');
		if (be)
		{
			var observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
			observer.notifyObservers(null, 'FVD.Single-MainButton-Change', (be.checked == true));
		}
		
		var abe = document.getElementById('fvdsd_status_button_exists');
		if (abe)
		{
			var observer = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
			observer.notifyObservers(null, 'FVD.Single-StatusButton-Change', (abe.checked == true));
		}

		// reload
		var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
		var main_wnd = wm.getMostRecentWindow('navigator:browser');
		main_wnd.sp_single.setting_reload();
		
		
		return true;
	};

	this.xul_ns_resolver = function(prefix)
	{
		var ns = {
				'xul' : 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
				'html' : 'http://www.w3.org/1999/xhtml'
		};
		return ns[prefix] || null;
	};

	window.addEventListener('load', function () {self.init.call(self)}, false);
};



var fvds = new FVD_Settings();