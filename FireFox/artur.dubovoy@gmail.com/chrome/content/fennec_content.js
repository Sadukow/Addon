dump("Init fennec_content " +content.document.location.href + "\n");

const POPUP_ID = "fvd-single-fennec-popup";
const STREAMSLIST_ID = "fvd-single-fennec-streams-list";
const STREAM_LIST_URL = "chrome://fvd.single/content/fennec_streams_list.html";


/*
var console = {
	log: function( text ){
		
		dump( "CONTENT: " + text + "\n" );
		
	}
};
*/


var domLoaded = false;
var responseMediaCallback = null;
var urlSizeCallbacks = {};

// --------------------------------------------------------------------------
addEventListener( "load", function(){
	
	if( isStreamsPage() )
	{
		
		var document = content.document;
		
		var url = content.document.location.search.replace( "?url=", "" );
		
		if( url )
		{
			url = decodeURIComponent(url);

			requestMedia( function( media ){
				
						var container = document.getElementById("list");
						while( container.firstChild )
						{
							container.removeChild( container.firstChild );
						}
				
						var template = document.getElementById("streamTemplate");
				
						media.forEach(function( item, index ){
									
									var elem = template.cloneNode( true );
									elem.removeAttribute("id");
					
									elem.querySelector(".icon").className += " " + item.ext;
									elem.querySelector(".title").textContent = item.ext;
				
									if( !item.size )
									{
										getSizeByUrl( item.url, function( size ){
													elem.querySelector(".size").textContent = prepareFileSize( size );
												} );												
									}
									else
									{
										elem.querySelector(".size").textContent = prepareFileSize( item.size );
									}
					
									elem.querySelector(".download").addEventListener("click", function(){
						
												var button = elem.querySelector(".download");
						
												sendAsyncMessage("FVDSingle:Content:Download", {
															media: item
														});
						
												var backupContent = button.innerHTML;
												button.textContent = "Loading...";
						
												content.setTimeout( function() {
															button.innerHTML = backupContent;
														}, 3000 );
											});
					
									container.appendChild(elem);
								});
				
					}, url );
		}
		
	}
	
}, true );

// --------------------------------------------------------------------------
content.addEventListener( "load", function(){
	
	dump("!!!Load " + content.document.location.href + "\n");
	
	domLoaded = true;
	
}, true );

content.document.addEventListener( "DOMContentLoaded", function(){
	
	domLoaded = true;

}, true );



// --------------------------------------------------------------------------
function isStreamsPage(){
	
	return content.document.location.href.replace(content.document.location.search, "") == STREAM_LIST_URL;
	
}

// --------------------------------------------------------------------------
function waitForBody( callback ){
	
	var interval = content.setInterval( function(){
		
		if( content.document.body ){
			callback();
			content.clearInterval( interval );
		}		
		
	}, 300 );
	
}

// --------------------------------------------------------------------------
function requestMedia( callback, url ){
	
	responseMediaCallback = function( message ){
		
		callback( message.json.media );
		
		responseMediaCallback = null;
		
	}
	
	url = url || content.document.location.href;
	
	sendAsyncMessage("FVDSingle:Content:requestMedia", {
		url: url
	});
	
}

// --------------------------------------------------------------------------
function getSizeByUrl( url, callback ){
	
	urlSizeCallbacks[ url ] = function( size ){
		callback( size );
	}
	
	sendAsyncMessage("FVDSingle:Content:getMediaSize", {
		url: url
	});	
			
	
	/*
	var ajax = new content.XMLHttpRequest();//Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
	ajax.open('HEAD', url, true);
	ajax.setRequestHeader('Cache-Control', 'no-cache');
			
	ajax.onreadystatechange = function(){
		if( this.readyState == 3 ){
			var size = this.getResponseHeader("Content-Length");
			if (this.status == 200) {
				if( size ){
					callback( size );		
					this.abort();
				}
			}				
		}
		
		if (this.readyState == 4) {
			
			if (this.status == 200) {
				
				var size = null;
				try{
					size = this.getResponseHeader("Content-Length");
				}
				catch(ex){}

				callback( size );					
			}
			else{
				callback( null );
			}
		}
		
	}		
	
	ajax.send( null );
	*/
}

// --------------------------------------------------------------------------
function prepareFileSize( size ){
	
	return Math.round(size / 1024 / 1024 * 100) / 100 + "MB"; 
	
}

// --------------------------------------------------------------------------
function insertToolbar(){
			
	var document = content.document;
	
	var element = document.getElementById( POPUP_ID );
	
	function hideElements( tag ){
		
		var data = [];
		
		var elements = document.getElementsByTagName(tag);
		for( var i = 0; i < elements.length; i++ ){

			var el = elements[i];

			if( !el ){
				continue;
			}
			
			var parentNode = el.parentNode;			
			
			var clone = el.cloneNode( true );
			
			
			var next = null;
			if( el.nextSibling ){
				next = el.nextSibling;
			}
			
			el.parentNode.removeChild( el );
			
			data.push( {
				el: clone,
				parent: parentNode,
				next: next
			} );
		}
		
		return data;
		
	}
	
	if (!element) {
		
		element = document.createElement( "div" );
		element.setAttribute( "id", POPUP_ID );
		
		document.body.insertBefore( element, document.body.firstChild );
		
		
		var size = 52;
		var maxSize = 360;
		var radius = 70;
		var bgSize = 32;
		var bgLeftPos = 7;
		var bgTopPos = 17;		
		var itemWidth = 250;
		
		var sizeFont = 7;
		var textFont = 12;
		var buttonFont= 10;
		var iconSize = 16;
		
		var closeSize = 32;
		
		var textWidth = (itemWidth-40);
		
		if( content.document.documentElement.offsetWidth > maxSize ){
			var ratio = content.document.documentElement.offsetWidth/maxSize;
			size = size * ratio;
			radius = radius * ratio;
			bgSize *= ratio;
			bgLeftPos *= ratio;
			bgTopPos *= ratio;		
			
			itemWidth *= ratio;	
			sizeFont *= ratio;
			textFont *= ratio;
			buttonFont *= ratio;
			iconSize *= ratio;
			closeSize *= ratio;	
			textWidth *= ratio;		
		}		
		
		//content.alert( itemWidth );
		
		var css = document.createElement( "style" );
		css.innerHTML = "#" + POPUP_ID + " {" + 
		"background: url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJlSURBVHja5JVfT9NQFMDPNrvO1WUMkEkkcJkkKgnhyTcfyqPxzfgF+BK+Gl9991v47osREicPkBiZuow/29oxMloYw5DRrl2r9zasiuvae8sIiZ7kZGt7c36/3tt7TyT+7A34BMK5cv7LGhLOpfPfgXGDptLbF09gMpOkJjdaZ/D89TuqsVQCpmWDgZM2TIax9ALdaxQg8A6DAIsslQCB66ZFXbRzNQL29QmQt9cYZoBltuhmAL+9bjAsgTnsGcBTqjEU1f+9Jfjvd4GB4SwflsH4EaKAbuj0AaaT8PdRHNRFpQhux1W/EY8XZ9HMnQxzL5YPWpDfrEoB7XrZWYJcDiFB8G63OheHrabNLABcGhYW5j1noN0+g0pFknpLsIwvXt67PyeOjo/BMCPB8333jo+aBL6K/74is0AEyAWUt3YhysfFsewEXFU0FZVwevDVP3eBc7FTKELsUVwcvzs5dPjRfoPUvwD/exs6N0sbX2Aez8TE9NTQ4GqtTur2wb3OAedhMb8O0SVOzM5OXxquVGuknid80EHkDPq28gmisYiYzc2Eh1dkUmcgnEQs9vDpoD0qK5UaupVJkwwBr0Hhfd4X7idwQSKZEpCQEuCnZVHlQVmGrx/WAuFBAq6EKtXRzWSCJNjdrm8q1T34/nGDCk4j4Eoc7jUQz3MowXNgG4ZnqvI+lNYL1HDqbtgrtv25CNYDJI7e7u8Nx4ctKJckJjiLgCuBIWBpmjgyIrgPTk7aIMkKM5xVwJXAMJjSUmJa4OFHuwN19TQUPIyAK4GhYKV0sXFqhoaHFXAlMBwuAyfxS4ABAPlKht3q9VWqAAAAAElFTkSuQmCC ) no-repeat center center;" + 
		"background-position: "+bgLeftPos+"px "+bgTopPos+"px;" + 
		"background-size: "+bgSize+"px "+bgSize+"px;" + 
		"width: "+size+"px;"+
		"height: "+size+"px;"+
		"position: fixed;" + 
		"left: 0px;" + 
		"bottom: 0px;" + 
		
		"padding: 4px;" + 
		"border-right: 1px solid #1f5f9a;" + 
		"border-top: 1px solid #1f5f9a;" +					
		"border-top-right-radius: "+ radius +"px;" + 
		"background-color: rgba(0,0,0,0.5);" + 
		"box-shadow: 0px 0px 10px -3px #000;" + 
		"z-index: 8888888;" + 	
		"}" +
		"#" + STREAMSLIST_ID + "{" + 
		"position: fixed;" + 
		"left: 0px;" + 
		"top: 0px;" + 
		"bottom: 0px;" + 
		"right: 0px;" + 
		"background-color: rgba(0,0,0,0.7);" + 
		"z-index: 9999999999999;" + 
		"overflow: auto;" + 
		"-moz-user-select: none;" + 
		"}" + 
		
		"#" + STREAMSLIST_ID + " * {" +
		"-moz-user-select: none;" + 
		"}" + 
		
		"#" + STREAMSLIST_ID + " .item{" + 
		"height: 40px; overflow: hidden; color: #fff;" + 
		"width: "+itemWidth+"px;" + 	
		"max-width: "+itemWidth+"px;" + 	
		"white-space: nowrap;" + 
		"display: table;" + 
		"float: left;" + 
		"margin-top: 5px;" + 
		"}" + 
		
		"#" + STREAMSLIST_ID + "  .item > div{" + 
		"display: table-cell;" +
		"vertical-align: middle;" +
		"}" + 
		"#" + STREAMSLIST_ID + "  .item .text{" + 
		"white-space: nowrap;" + 
		"overflow: hidden;" + 		
		"text-overflow: ellipsis;" + 
		"max-width: "+textWidth+"px;" + 
		"font-size: "+ textFont +"px;"+
		"}" + 
		"#" + STREAMSLIST_ID + "  .item button{" + 
		"background: -moz-linear-gradient(90deg, #4DA5D8, #58D2FD);" + 		
		"border: 1px solid #EEE;" + 
		"border-radius: 5px;" + 		
		"color: #fff;" + 			
		"padding: 3px;" + 	
		"margin-left: 5px;" + 
		"font-size: "+buttonFont+"px;" + 
		"}" + 
		
		"#" + STREAMSLIST_ID + "  .item .icon{" + 
		"min-width: "+iconSize+"px;" + 
		"max-width: "+iconSize+"px;" + 
		"height: "+iconSize+"px;" + 	
		"margin: auto;" + 
		"background: url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAANkE3LLaAgAAARxJREFUeJydkTFqhEAUhv/RaQRJJRirnEJILhEJpLGyMpfxAFaWOUGaVHuAgHXA2iKCYCUS5vkmzWaZWV3X5IdhmOGb7/HmCRxzOBy+mVlhJY7juF3X1WmaPgP4WgC+7z8Rkb60pmnSTdPoqqo+ANxY8uOu1yqbGccRWZbFZVm+AwjOBZuRUoKI0Pc98jx/KIriDcDtboEQAkoptG2Luq6RJMl9FEWPACBNUOvLncRxDCICEcHzPAgh3IVgTytS2k+sEzPvErmu+z8BM4OZ4Xne3wTMDK01mBmO41isJVBKnQATMsXnRSwBEW22sBYJAPM8w9yvRWt9Yq/+gRBicWdyliAIgl19m2P81d+FYfjCBrkxEQEAwzC8Avj8ARK8rCIgUJQ+AAAAAElFTkSuQmCC) no-repeat center center" + 
		"background-size: "+iconSize+"px "+iconSize+"px;" +
		"}" + 
		
		"#" + STREAMSLIST_ID + " .iconContainer{" + 
		"min-width: 25px;" + 
		"margin-right: 3px;" + 
		"}" + 
		
		"#" + STREAMSLIST_ID + "  .item .size{" + 
		"font-size: "+sizeFont+"px;" + 
		"text-align: center;" + 
		"}" + 		
		
		"#" + STREAMSLIST_ID + "  .item .icon.3gp{" + 
		"background: url( data:image/png;base64,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) no-repeat center center;" + 	
		"background-size: "+iconSize+"px "+iconSize+"px;" +		
		"}" + 
		
		"#" + STREAMSLIST_ID + "  .item .icon.flv{" + 
		"background: url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhtJREFUeNqMU79rFEEU/mZn9tddTrIrmuAP8Ad4YhPE3kpCChux0Jg0/gUWEZSoGAQ7wTTamFhpLWilvQpWBsTkgnf+gKQQ9RJQL7u37vPN7O1ejjvEB293Z+d933zzzRtBRNCxunvvlzRJ9iNNMTgELEt8rja/Hsj/aKzICVbCETp6fx6GwLK6OD3+wykEljZ/wr8y+7j6qzmdE5iHzuXhXUSLD2m5HFItGClSj2lhgd5BkY63d+apVg4e5QSqR2U7hj00BMt1ugLi2CgQysEGj8dmLmHJ96Zq129qmRes7XtEK4J0XUjHKVL5Pr4/eYrwxHGsCwfvpYexrRZSokmNsrbjEUcZ0O6ksiGFRJstCBcf4BjFqOzZByTtrL6HQMdWTmBnyWaWJsYx+vwZ5PAObN64Bel5pi6Prgfssp5QTCCU0g6BohjhvbtI6h/x7eQpWDtDKPbIEAgxQEGkFbiZfEuiPHkuW+XwQYyu1bMt8byu61egN8XmKC4QzE5RG975s6C1dfyeuw3BZtp+CaR7hOtyE1SPiVqBrSD46NTFacjqEbRm50CrH7hSQfoeTN9pBaJPAbJjZNftq5ehTk8grTcgXr2BKpWLPZvuG2hi7kEQGDA1PiGZuQZZqfS2dqdu8Cnw+TpuCTgzZXxwXJ/Bou9SobVRKCoIfgAvVl6+Hkfncv0zGKzrzWd+G3nFQ/wK8P/RZGzjrwADADmH0oUUM6YwAAAAAElFTkSuQmCC)  no-repeat center center;" + 
		"background-size: "+iconSize+"px "+iconSize+"px;" +		
		"}" + 
		
		"#" + STREAMSLIST_ID + "  .item .icon.mp3{" + 
		"background: url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA5dJREFUeNpsk21oW2UUx//3JffevN50SZYsrm1SyyptVkrbLXZTit2ouslwijKduIF+EYcKDhTFF3AyXxC/DffJLypjICjaKa3spTDLunYd2Tpns4Ssmc3SvN/kJrm5L48384uIB35fDuf/5zznPIfC/4TFwrAul9jBWWiK3jDc6nvs+EaaUsM0y/RRDPNAo6VvvXxp+f1GvXmO/bcwMhAZ3rP/8Mvbh6MP+73u4InpHLWSg1rVKdGgeV5tEkhNHbliDY3yXQ80GfcMKJMXj77x7uhzb77nkn18gDPAkBJWqgpIQESL0lFRgVydQKYIwBtmm5oOQ/nH4NBrh97a9dnhY4kMQelWEVxZgI8lcHe6sFRkoOsWiFYGw90W9PtpxP5oYi5GdIABu6W3d8tLHz/9YbxxE06LE1KoB/FbLOolDq1yBm+PODAx0o1eHwfRxtx76vGfDVw9dcPTWFsE/eS+iQMR1hBGKRUDzgJ84hJKnX8i1lw3uFbN2NnV0vxWmThNcbmloSDXUZIVHHhm4qhIknY2MjQwYqm74KsYECkZQb4MD8kTEh5Lz19WuIUrsRmrwO9YTed63C47baN1VIsSHhyN9ld2PbqPtgtuB4sgaGyGpRmCZ/1+RLJBErK6lGyxUnj9lVePZNfuzOnlhMznFyFqSRBFgsDKeGQ8Osmm0oW/6oYPksZBIQbU9lg9FC3XjE0ddqH16efHvrS53aF5aYnZGlCgKE7UWiEoTQOBgHUzfe7C7HSd5aEKNhC7A26/F93hLggO0UmxFo/PO/jC1+fz0V/kbttMfhzfZh/HxTUvmm4JJa0ss2d/m/7p2tWl5LaxsR6aEGQlDT9cr+JSXEVOMddEU3xICCF+TcPC3S7krU6kNBYJsQBp5vbvjGpGKpGQDh58/okOK0e/810aP6ZdWCyLIFIJ+yMsbDoHWeExFZeRAQHrrqLPsV46/8mJI+3FutKrt2upRNK+e3JyKF1kcWqhgoZew5BXw+B9NvAqBadDQDDIgLdU8dA2GpmTX3x0ZW5+qm3QHptzefl6dXZ21nhqd3/ns9FNwnavjh1hHm7zB1rNAlpjENjoQ8BRVFdOfvDN9OnvvzLTlfYZ0Ca8ic8kJPDc4J69e3eOT0wO+jvDQcHmsBmybtxZzZZjNxZunv319FQylTpj1qZMGtR/LrndkWBiN9kg8LzXarM6DMOALFfLmkYyZj7fFpoYbcHfAgwA8IWCw4Q+/vsAAAAASUVORK5CYII=)  no-repeat center center;" + 
		"background-size: "+iconSize+"px "+iconSize+"px;" +		
		"}" + 
		
		"#" + STREAMSLIST_ID + "  .item .icon.mp4{" + 
		"background: url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC8UlEQVR4nH3SX2ibVRjH8e95T94kK1lTF5Jqu/WPxq3iOlY35zY3LwSxN0M2qVNvBRmICLv3RkEUvFBBr71q2cCB0CsdLRuzy9pNa7J2HXHSbItNljZNmr9vzvue40VptDL8XT0XPz485/AI/icff/p5aDC+70i10TpsSXly+sfx9364dOnRvztia7iRSHzw/P797wghap7nOZ42Qw72s8WKQ8NRFMsbqHz6wvp68ebk5OT4xMTEXwC+78cv7hsaOfm+7VXflpbV83sySTKVolBYAwzCssAY+nb3EI11nz19+szZ2dnZW8AmsHg7tXdH34nz8UgQKS0WFhYprfzJ+TePoVwPAL8d4KNvJhl9/TVSqSS9vb3hrc19c4lfpl4d+xBwQQiqtSq5XJ7rMwk8bTBAIOBnvVQiEAgwMDDA/Px8VxuYnpqqnVt9mHyyL3rAGKjX6zzK55n7NYc2myW/30+tqlFKEQ6HiUQi/wAAG6sPfqY/egBjaNTr1Bywu4fxtAbAsiQbv82glMKyLMLhcOcWYAGkUzd/8kkJQNNxCNqCFwZiHNwT42B/jBfjPVSqVZRSSClpNpuBbcD1a1enOwJCe9rj2NHjjLx0nJyyWTNB1nSQXMtmbOwt9vT1o7VHJBptf2L7Dq5cvXJtZOTQyxpB3WmhPQ3C2nyntPD5JJYw+CxJrlBc2ju4+7n2BgDNhnNfC0lTGeqOS7XlUnNcGspQV4Z6S+O4AldDvqyGPvvyq13bANv2tZSnaWlBJlempSX3V2vkyw0yhQoukuxqGWUExY0Kw4eOjm4DXKU8zwg8BJdvpZlZfEBiucTtbIUbd3MsZQp8d+EyRkg6d4ZoOu4r2wHPdQ2CuYV7PBV7guy6Q6wrhCskR4bj1JVHJNxJqeawci/57djoiXPtOwC4s3gnY3eEM907o/27OmxCHUHSf6QzrquL2eqy8UlhHX46ZC0vJQMrD7N3eVwGn4nv+OSLry+eeuPMu12RSPSxpf/kbyr9W3ISlXDzAAAAAElFTkSuQmCC)  no-repeat center center;" + 
		"background-size: "+iconSize+"px "+iconSize+"px;" +		
		"}" + 
		
		"#" + STREAMSLIST_ID + "  .item .icon.pdf{" + 
		"background: url( data:image/gif;base64,R0lGODlhEAAQANUAAOR8gd3Q0uCsr+lARuKUmN+4u/JVW3t8fJ2DhPDw8N7ExuVwdbEVG+FES9s+RDc3N1NGR4UPFOsoLzsHCc8YH+dYXqeNj3YOElgKDXI+QG9iY+OIjOZkaehMUqWlpm5ub+0cJMDAwNzd3v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACMALAAAAAAQABAAQAZ9wNEoESoaj8JkyCNqigjO5icEqlqvHedUuBQFOACnYtPRUK/ojodBQSS4TKcgKtqOuk1AoaPQhrgWA1l0Un93Bx6Jih4HEQhCaGkeGBcTIQYGDQ4dnB2CC35wUXNRdnheHQGlhngBFQAcAyADHKYeBB2ghKYQGR+/wMAPIUEAOw==)  no-repeat center center;" + 
		"background-size: "+iconSize+"px "+iconSize+"px;" +		
		"}" + 

		"#" + STREAMSLIST_ID + "  .item .icon.swf{" + 
		"background: url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF0NDQwQMDvgMD09PT0AEB6urq2QEB39/f+fn5wTc39PT0t7e30tLSPz8/sbGx2gEB48HB7Ozs29vb6+vriIiI+Pj4ra2t4uLiuwEB1NTUgQEByEZGr6+vmJiY2AEBxwEB6wEBvg8PvzY2Hh4euxAQxzc3xEdH3Nzc6enpoqKi8/Pz6cbGwMDAZgEB+QEBwTg42NjY4+Pj37Cw1QEBhAEBtAEBx0ND8wEBq6urqqqqvLy8rq6uwwEB5ubmvr6+o6OjoAEB5eXl8PDw4LCwylRU47Oz7+/vyAEBxERE/AEBlJSU9vb23wEB3gEBx8fHvgEB58XFk5OTv7+/1wEB6Ojo4eHh9fX1tra2ww4Og4OD3Le3qgEBvb294gEBlwEB0gEB7u7upKSk3rm5swEBwcHB9/f3+/v7/Pz8+vr6YwEBJSUl/f39rKys/v7+////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAg1O7SAAAAHB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ALdhYtIAAADdSURBVHjaYsjPz5fkE8sRy8nJkQkFchiA2C4jTMtJ0FaH3VoIKBDs68PGIu9vGu1gn8ZuKZTPEK/naa4Qy8ZiExeZlsae48iQLMfPz2bM4i5hIisi4qXJwyCVCQW64iGGfoFWDOrMzInMDEBgEGXGmMATzuAmLMwtyMrKqpEUwejBxcUHsjYlIxUIVBmNvFNFc8AC2Wkcos6MipwCGRxQgfT0NBcmTiWBjAy4gCuTfhpHKkJAmkklAKgsOxsqkMukpp0LBHl5YIGg7FwoyMuzAAnE8GZBgTIvN0CAAQCCX0cVtLCG1QAAAABJRU5ErkJggg==)  no-repeat center center;" + 
		"background-size: "+iconSize+"px "+iconSize+"px;" +		
		"}" + 
		
		"#" + STREAMSLIST_ID + "  .item .icon.webm{" + 
		"background: url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnBJREFUeNqkk8trE1EUxr+5M8lMYhtT66sFK5ZWfEAXIv4BBcXqVsGVC1F04UrEx8bHSqTLghUfCEVcCRV15aIrKYW0sbW2SmrbVPNqnpNJZpKZZGY8Ny2lqLULL/ODO+ee+91zzzlXcF0X/zOkaZxrTEjnlFaw+n1bpNeKLD52XDcJAfxDxbAhMMCnSGBk6b/5CVOjWcg+kf6x4uQ4blc6ZhxaipTupOLGhGXaD8h5r9BY3XiwdfM6EwXYtot8utq29L18a1XoIWNCpyBsLtAY3JELOStCrYsR7UZuuRK26+4ALe1nv0XENgptTcgBinlra2yxfDWVMMbNmj1Ia22bCqwXkrwMdA3Eo3rzu1fRK7EFvYfbGlX4Z4IoAtqHslbH/ExRmw0XhuhaA2W1FpFoTSCkjTbyspXyNSx81XLfJtXn8cXyMyr2nL/JA4/MYNdcqFkTkgIRNqiZRJeJ0krhS2oNc9PFzEwo/yK3XH1E11hyKReyXwR3LeYsJKI6MqkqpPBEFu0dflimYxYyFiJTajLyRX2y/NN4auj1uCyL8NB9A9s8SCcqiEyq0OiAtRw1B704cWYPAi3eHdlU5XQmaXyoGk6iWDARm9d5hyIQ9GB4tg/3L4Uw8ib+94QpfgmtuxU0k/Nq0/iJy41Jk4SQeRbH6aA/3gJxnuetatQLRIBrEUeIj8RF4ujOdt97hbGxjq6mNInfo6g6yG4QJi9mH3GNuEv0Ehd4WxMniSQx3N0TvK7rtbFjvbtu0wM6TLYfqxF2Ulqxj8gTFvGS4DYeyTjRTRxo2S6PehVp8O1QdGRhVjtIEXwme4kf9EuAAQCi5QsEyi5VUgAAAABJRU5ErkJggg==)  no-repeat center center;" + 
		"background-size: "+iconSize+"px "+iconSize+"px;" +		
		"}"	+
		
		"#" + STREAMSLIST_ID + " .top{" + 
		"text-align: center; position: absolute; bottom: 0px; right: 0px; left: 0px;top: 80%;" + 
		"}" + 		
			
		"#" + STREAMSLIST_ID + " .close{" + 
		//"margin-right: 5px;" + 
		//"margin-top: 5px;" + 		
		"z-index: 999999;" + 
		"display: inline-block;" + 
		//"width: " + closeSize + "px;" +
		//"height: " + closeSize + "px;" +	
			
		"border: 1px solid #eee;" +
		"background:-moz-linear-gradient( center top, #f0c911 5%, #f2ab1e 100% );" +
		"-moz-box-shadow:inset 0px 1px 0px 0px #f9eca0;" +
		"border-radius:6px;" +
		"border:1px solid #ad6f62;" +
		"display:inline-block;" +
		"color:#c92200;" +
		"font-family:arial;" +
		"font-size:15px;" +
		"font-weight:bold;" +
		"padding:6px 24px;" +
		"text-decoration:none;" +
		"text-shadow:1px 1px 0px #ded17c;" +
		
		//"background: url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAABX9JREFUWIXllmmMFEUUgL+q6pndGRbZiAhyeKDihaJR0Rhv+SEqokGNGuOVKAY1gonGyA+NMUQTAzEkJB4RFcRbEq9EiYagRuMBIqxgQFSOXRZd9pyd6e46/FE9s7Pdg8boPyt5qZmqeu999V7Vq4b/exPpgdVPzVBPr9oYdHaVM3P/puVy0t4263i9YMnX9oAAnz0/66xyufzMnr09J5UjK3KBFDklCAJJLhAEShIoQaAESkmEkAjAOYuxDm0s2ji0dsTG+l5btHFOCuzo1vymYrEwd+Z9n36bAXjziYtUIe/WTzn58lMOb52Eivr/ywBg8yPZ8cc2tm3+6HtU4Ywr719jAILqgrc/2R5cevZhJ1ykijR99yTg/lMAhOCoE+/g24Fw6uc/7A2A4QCDFS1+/KVXiFN3gqk0svAPPWY3IAc62PRzr+v8vVQzVgM4tNBPd3sJUxkEfQCAf8LgsgA2KtG5t5OJo0xtrA5ggPZesGEVIO3NQdDs54RsPI8AqcDEjYhwYQmhe8XIkUOjMm2iFgFTBhMmUoFDT4Zb1sLkGRCXQJdTUoELH4WrV3rQmm6irysQljKJkan/2EoZrAajwURexk6Dq1fAQRPhsmW4Iy/BxX6dMzE2DnEXPgbTboVJ58DsFyAoDOmb2K/VYSYuDQBKSQRC0CFu9HEw5zUoHuIX5IqI2cvRR84gDktEUYS7eBHi9LkgkrQcfh5c9RIOMRQFXYG4nAEI6v9YC7YyiJNJDgXYvnZkXzuiCgCQH0FuzgoGXr+J3NGXoKbPG3IO4BxmXxsiLoOLa/l1cRk7rA6mABwQhxFx3juXgOtrp/LyFRRuWo0cf3odRAstN74BMpdxHn25FP3xg+SJa3adA2vs35wBB3G5Qmgg0vjegO3bQ/fy2ej274drq3zGefmLpxn44AGciQmNtxEmtqwjUx4yZ0CXQ6LEcVWsA1HqoOPZK4j2rE+r1Jz3r1vM/vcfQqHRTqBlE7SMg4Mn01+czI4tP2fUMinYtfN3SgqKOcgraApASU8a93VgfvoQxp9Kpg6YkMHN75ErtmLzzQxqSbkSUdrdRU9pL9ZB1CUyKRgO4CCOYnoq0BdCIEBK38cWjrngBgpn3galzuHFyFnAccg1S9m49Fri3dtQAozzIpNlUmQLZKYQSSEQgBI+vUr4NBxx7vWMmbXIO7PVGpFcMevvuSq0Mu3u12geeyzWeV1ZZ0vK7AuROQMiWSyS39rC5POvZ/yVjyfOjRej2fHWw3RvXjM0Zg2q0MrUu16hOO5YX5xT9tItA1Bf5QVw0OixjJu5EJzxO0/k17ce5Jd1q/jmuXl0t60ZNqcKo5gy5xGMG3IqaPyWDQOw1q+qD1NpfyfbV97rQw7gHLtWP8zOr95hTAuMKcRsWH4vvT+trenoP7azZcV9BGmPgkwhykTA1bl3+BvQvXUt21feDdEAHe8uZNdXbzOq2a9REg7Ox2x+8R76t36C3reVtmdvRg90+d27IVuNWpAeqFYtl5zY6mHq2bqOtiUzGejex4hU/ZESRhCzZeV8mgtFzGAPItmtTWw0qEFZAAfYpDfO56zaSwlR/z6aco13IgTkiTDlqKZnnLf3VxCZCFg8uZDJR5sFLUFZf4+l8NERyfdHDT6xXo1aFcDURSH7EtQBRA6bUxiNC1QSCpfcW2W90yqAgNpjRZIql+yw5qxOjPObMkBzDiPqCmINYOwodE6xUTaVphdyEMih0Ku6eyzrr1W1ENYdtCqMTcFoA/tHwzF5NrU0o2upqw/HqvmctruL59p2MbVUQaXD1aiQNGoNvkdpzmOmHMam4ydw53WL2dAQAODVBUK1/eYC47JzaYB6RyJ9HlLNWtxxE9C3L8NkZ//P7U/FQea/erBaVgAAAABJRU5ErkJggg==)  no-repeat center center;" + 		
		"background-size: " + closeSize + "px " + closeSize + "px" + ";" +
		"}"
		+
		"#" + STREAMSLIST_ID + " .fvd-items{" + 
		"position: absolute; top: 0px; right: 0px; left: 0px; bottom: 25%; overflow: auto; " + 
		"}"
		
		;
		
		document.body.appendChild( css );
		
		element.addEventListener( "click", function(){			
			
			content.open( "chrome://fvd.single/content/fennec_streams_list.html?url="+encodeURIComponent( document.location.href ) );
			
			return;
			
			var hidden = [];
			
			var listContainer = document.createElement("div");
			listContainer.setAttribute( "id", STREAMSLIST_ID );
			
			var d = document.createElement("div");
			var closeBtn = document.createElement("div");
			closeBtn.className = "close";	
			
			closeBtn.textContent = "CLOSE";
					
			d.appendChild( closeBtn );
			
			d.className = "top";
			
			listContainer.appendChild( d );
			
			var itemsContainer = document.createElement("div");
			itemsContainer.className = "fvd-items";
			listContainer.appendChild( itemsContainer );
			
			
			closeBtn.addEventListener( "touchstart", function(){
								
				listContainer.parentNode.removeChild( listContainer );
				
				hidden.forEach( function( data ){
					
					if( data.next ){
						data.parent.insertBefore( data.el, data.next );
					}
					else{
						data.parent.appendChild( data.el );						
					}
					
				} );
				
			}, false );
			
			requestMedia( function( media ){				
																																						
					
				try{
					media.forEach( function( mediaItem ){
						
						var item = document.createElement( "div" );
						item.setAttribute( "class", "item" );
						
						var iconContainer = document.createElement("div");
						iconContainer.setAttribute( "class", "iconContainer" );
						
						var icon = document.createElement( "div" );
						icon.setAttribute( "class", "icon " + mediaItem.ext );
						
						var size = document.createElement( "div" );
						size.setAttribute( "class", "size" );
						if( mediaItem.height ){
							size.textContent = mediaItem.height;
						}
						
						var text = document.createElement( "div" );
						text.setAttribute( "class", "text" );
						
						var buttonContainer = document.createElement("div");
						buttonContainer.setAttribute( "class", "buttonContainer" );
						
						var button = document.createElement( "button" );
						
						var buttonSpan = document.createElement("span");	
						buttonSpan.textContent = "Download";
						
						var fileSize = document.createElement("div")
						fileSize.setAttribute( "class", "fileSize" );
						
						if( !mediaItem.size ){
							getSizeByUrl( mediaItem.url, function( size ){
								fileSize.textContent = prepareFileSize( size );
							} );												
						}
						else{
							fileSize.textContent = prepareFileSize( mediaItem.size );
						}
						
						button.appendChild( buttonSpan );
						button.appendChild( fileSize );						
						
						button.addEventListener( "click", function(){
							
							sendAsyncMessage("FVDSingle:Content:Download", {
								media: mediaItem
							});
							
							var backupContent = button.innerHTML;
							button.textContent = "Loading...";
							
							content.setTimeout( function(){
								button.innerHTML = backupContent;
							}, 3000 );
							
						}, false );
						
						buttonContainer.appendChild( button );
						
						text.textContent = mediaItem.display_name;
						
						iconContainer.appendChild( icon );		
						iconContainer.appendChild( size );						
						item.appendChild( iconContainer );
						item.appendChild( text );
						item.appendChild( buttonContainer );					
						
						itemsContainer.appendChild( item );
						
					} );
					
					if (content.getSelection().removeAllRanges){
						content.getSelection().removeAllRanges();
					}
					
					var item = document.createElement("div");
					item.setAttribute( "class", "closeContainer" );				
					
					listContainer.appendChild( item );			
					
				}
				catch( ex ){
					content.alert( ex );
				}
				
	
				try{
					
					
					
					var tagsToHide = [ "object", "embed" ];
					
					tagsToHide.forEach( function( tag ){
						
						do{
							var hidded = hideElements( tag );
							hidden = hidden.concat( hidded );								
						}
						while( hidded.length > 0 );
						
					} );

								
				}
				catch( ex ){
					content.alert(ex);
				}
				
				//dump( JSON.stringify( hidden ) );									
		
						
		
								
			} );
			
			document.body.insertBefore( listContainer, document.body.firstChild );
			
			/*
			sendAsyncMessage("FVDSingle:Content:clickIcon", {
				
			});
			*/
			
		}, false );
		
	}
	
} 

// --------------------------------------------------------------------------
addMessageListener( "FVDSingle:hideIcon", function( message ){

	var elem = content.document.getElementById( POPUP_ID );
	if( elem ){
		elem.parentNode.removeChild( elem );
	}
	
});


// --------------------------------------------------------------------------
addMessageListener( "FVDSingle:urlSize", function( message ){
	
	if( urlSizeCallbacks[ message.json.url ] ){	
		urlSizeCallbacks[ message.json.url ]( message.json.size );
		delete urlSizeCallbacks[ message.json.url ];
	}
	
});


addMessageListener( "FVDSingle:mediaResponse", function( message ){
	
	if( responseMediaCallback ){	
		responseMediaCallback( message );
	}
	
});

addMessageListener( "FVDSingle:mediaFound", function( message ){
	
	//content.alert( "INSERT!" );
		
	waitForBody( function(){
	
		//content.alert( "3" );
		
		try{
			insertToolbar( message );
		}
		catch( ex ){
			content.alert( ex );
		}
				
	} );
	
	/*
	if( domLoaded ){
		 
		try{
			insertToolbar( message );
		}
		catch( ex ){
			content.alert( ex );
		}
		
	}	
	else{
		
		content.document.addEventListener( "DOMContentLoaded", function(){
		
			content.alert( "3" );
			
			try{
				insertToolbar( message );
			}
			catch( ex ){
				content.alert( ex );
			}
					
		}, true);	
			
	}
	*/
	
} );

content.addEventListener( "close", function(){
	
	sendAsyncMessage("FVDSingle:Content:cleanUp", {
		
	});
	
} );



