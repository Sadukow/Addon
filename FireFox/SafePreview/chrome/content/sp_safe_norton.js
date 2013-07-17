// class describes downloads for specified window
(function(){

	const FILE_IMAGES = {
		0:	 "data:image/gif;base64,R0lGODlhEgASAMZ2AP39/fX19ePj4+7u7urq6uzs7HNycvr6+v7+/vj4+NbW1rGxseno6GdnZ/z8/Ovr62tqauTk5JOSkmBfX6ampunp6b69vYiIiMLCwuXl5djY2LCwsKCgoPPz856dnWJhYYSDg3d3d+Hh4fj395iXl+/v7/b29lRUVHZ1dXp6et/f35WVlVhYWOjo6IuKi319fZ+ensfHx8nJyXx8fKioqLSzs4KBgbu6unV1dXp5eaalpXRzc8TExHV0dN3d3bi4uIWFhWVlZYaFhbGwsJaWlsbFxaqqqmppaYiHh7W1tYGBgYWEhNDQ0Pf3+G9vb1FRUXZ2dvTz82hnZ9zc3GZmZvHx8b29vWRkZHJxccfGxmloaM3NzdjX16Ghoff4+IaGhqOjo35+frm5ufv7+25ubry8vHh4eI+Pj1dXV7e3t/v6+qWkpIyMjJybm9rZ2aGgoPDw8Ofn5/Ly8vT09Pn5+ff39////////////////////////////////////////yH5BAEAAH8ALAAAAAASABIAAAf+gH+Cg4IMhIeHFkgTKBBSEm6IgnFmbwoAmCZFSySIAkc/DgkdCXQBdA46IIdYNwcHdRk8C2UqUQdrHoMbFHR0dQthK2dXFxG/HwKCBhl1dVUhTy5JaFQYzmlgfy09Ad51RiFWHCxkGt5TKX8KX3PuJnIdMUE4WWruD1rrQnL9TXQA2MwQAWBOvwcN/jDYAadhAgd1XjCxM6chHA05lvkYMMALgggXMCCAw3FAjS6CNnAoUECOHQonnNApwZJAMkEjDCwgQGDOFiA0EJTg6aENIQENhlSI8yCOnDhxKsCwQeeQACgkZECNI0KMEiIjJI2xAGKCAQgNJHCRhIiBHLYCgQAAOw==",
		1:   "data:image/gif;base64,R0lGODlhEgASAMQfAMUpAuM2DcpXMP349/jp5MM5C+Ook+m6qfLVy9c6Ct2TevRFFdstCu7IussdAscWBtElBcAyA/fj3eo/EM0cCeCdhs9lQsEQA9Z+YNiDZ9BrSfrw7M4gA7QBAf///////yH5BAEAAB8ALAAAAAASABIAAAWZ4CeOZGmOW2McxEkiWgTMkdC4huzs+6yYBwBnSCQCKqRNAQK5dC7NJzMiGSkAUc+zo4UCMiMBg8H1aM3acWFUGD/K6M5jHNmIIoH8O/7IByItHwJ6cGZyeREDIhgJE3CPEwEaIwgRExRcHZhaFBMJBySMC5gUo5oLCRYlAxYJC6+wqAJ2qwoFjROeERiKLgQGGQIYFVUuxiYhADs=",
		2:	 "data:image/gif;base64,R0lGODlhEgASAMZCAPTWUPrtlLdoAvnpiPHNNvPTR/LQPuvSh+LDm/rul9y0ZPPVTPrvm/fpn/z589OjZfrvo8uTSrdqBLtxELdpBP/+/vXu5vnpiefFW+/gwLpwEPLYZ/TWUvDLL/PXWPPTTOPEm/vxo+LEm9mqQPntnebASrZpAvHNNd6zK/DPSvrulv79+vLRQOPLnvbfb/PUS7dzAPLQPfrwpdOjZPz68/PSR7pxEPfw19KiZPDKK9mrQ+zYb+zYdsiMPsyYFfbs3/rtk8GEAv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAH8ALAAAAAASABIAAAfwgH+Cg4SFhoIiPRomJho9Iod/Pw8SBw0yMg0HEg8/hT8RChAMPEFBOwwQChGegzgKIQkBPjc3PgEJIQo4gyASELJAQSsrQUC4EBIggj0HDAFAwjQ0xscMBz2CNg0q0cIODtVAKg02ggIkFwPrQeBB6wMXJALnLhwA+D4ZGT74ABwu6P2ZsOFFgYMoTKE4WODFhgnMMCxgYcBAkBYtglRksQBDtj8IKHiIQeAEDAsWYJwgEMMDBQSDZuhYQKCDD1M+OhBYoGMGIVAjPhDI4cNHDgIfRrD69IBCiRQ1aqQoQaFTJAQ9JggQMKEHzEhgCwUCADs=",
		3:   "data:image/gif;base64,R0lGODlhEgASAPeCALTttfLy8mHSYNTm1FfPVt3r3CmEJ6jqqRd7FmvWa/T484Pdg93733fad/b69k7MTfPz88DbwDSLMlmgWI/hkEKTQZvGmju0OpzmnIe6hg92DQx0Cvz8/Bp8GPf398jgyCeYJj+RPv///z+4PsXjxWeoZkW3RKnaqmrVak26TITOhGOxYWGuYaDfodjm1z2UPEvISsPdwk+pTszhzO717i6ILZzbnTGJL1+tXnCtb1W4VPn8+YvYi/Dy8KThpHPJc+rz6R2DG2KsYhyKG+v064ncisrgysHewF+jXi6QLUiWRzuxOs3izdP11W/Mb0uwSiqHKRF7Dy6eLWKlYNbl1nO7ch2TG+Xs5TihN3OvcsbexcDcv226bdnn2cPxxfDx8Nrq2pfNlxSAEki2R5PLlFW6VTGSMD+1Pj6rPWWvZTKeMJTfk32/fbLWsjeuNnzAfPz9/DiqN0K1Qo7Xj7/fvxt+GmrOaiKFIE63TdPk02qqaWrGadnp2X7NfsDxwcr1zNT41hmQF////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAIIALAAAAAASABIAAAj/AAUJHCiwAA2CCAfCsaBkA5Q6CCZoSSgQzA0hJxhobELmxRQHCAd0YAOopMmSaSqAFKjAwJs/MGP+sRHICws9AzPg8MOzpx8VgaoE8qFhgEADLQAoXdonEAkRYQJxySKowJ0DWAPxOPAjEB0OHIBYmSNBUAQzGDAEkhFoT6AjHjzwCaRjTQezSSgEWtFjS6A2ECC4CFSGQhEEVYMsCGQkQIArXwJQCYRnwQInZQUZsJMi0AzHAfIEGtOg9JMcAjNgSWAiEBMIXQLJSUAbRVGWBtAIOBPoQ6AlAoILUFOC4AAEcQhcCHSBgHMCUkKsHDigBogRD7LDcDMEiQKKOyxUDdggJkrEGBQTFiCSPiAAOw==",
		// loading
		20:  "data:image/gif;base64,R0lGODlhEgASAMQaAHl5d66urMXFw3l5dpSUk5WVlKOjoq+vrsbGw6Sko7u7uaWlpbm5t3h4doiIhtLSz4aGhJaWlsbGxNHRzrCwr5SUkqKiobq6uNHRz4eHhf///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAaACwAAAAAEgASAAAFaqAmjmRplstyrkmbrCNFaUZtaFF0HvyhWRZNYVgwBY4BEmFJOB1NlYpJoYBpHI7RZXtZZb4ZEbd7AodFDIYVAjFJJCYA4ISoI0hyuUnAF2geDxoDgwMnfBoYiRgaDQ1WiIqPJBMTkpYaIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo4aRZEoeaxHOiqKFsyBtizopV9ynfwJ0o43MhgNKAYjZbGQJBLXKBLRIK4IaWFbEHgFUoKYoPFKRZUK6fFIORwojBxDytgzpDkdANDc8SQTExp8fBoQEGcDiwNnJA0NLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOmqKQKHmtVzpKksa2FIUiOKIxjHb8B5JgKCAFjgHUMHUkPR6u0WKhwVgx0YQ2ccW6DGCDZjKJiiwWEgCQikRQ6zWpQC+QBviBxuHQEP4EKA0NGhmGGRoVFWaHiGYjEBAuIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6aJJEoiaxIOj6PJsyCpigopmNyff0X0o43AgZJk0mKwSABAK4RhaJ5PqOH7GHAHUQD4ICm0YiKwCSHI7VYoDLwDClBT5Di8khEY+gbUBAQGgWEBRoWFmYEiwRmJBUVLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaO2vOQKImtWDoCgMa2koTCsDZNGuIjpIFwQBIYBahGI2UkORyukUKhyVgz0Yv2csW6thcNBBIVMRikSCRFoaAK8ALpQD+QCHiCZrHQBP4BKBUVGgmGCX6BUQaMBmUkFhYuIQAAIfkEBQoAGgAsAQABABAAEAAABWagJo4aAJAoaZrp6DjaIA/a86BZnmlNo2FADEm3GwWFJAgkNZmQIpHWSCLRFK4FKWKLIHgJUoFYoKlUpCIxabFIKRSohDxButgvJIPeoKFQNHd4JBYWGgeHBxoMDGgBjgFoJI4tIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6a45Aoma1ZOkaRxrYAgBZ4oUGQVtckgpBAGhgHqEol1WiQFgvX6PHQJK4JKWaLMXgNWq7GYpGKJhMShZKSSFCH+IGEqCNIgXxAo1BoBIACKHkaF4YXf4JSh4hmIwwMLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOWhSRKFmsRToui0bMhOY4aKInWlVpmWCGZCgaSMIhyWJJQSAkCsU1AgA0h+yBarUGvgHqYDzQfKmiRoOkUKQeD9RlfiFh7hgSvS6RaPB5JAwMGgiGCBoTE2gCjQJoJI0uIQAAOw==",
		// captcha
		22:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAXCAMAAACrkjhLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEwRUUxMDMzN0NDMzExRTJBNUU2RjAxN0RBQzc5NDc0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEwRUUxMDM0N0NDMzExRTJBNUU2RjAxN0RBQzc5NDc0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTBFRTEwMzE3Q0MzMTFFMkE1RTZGMDE3REFDNzk0NzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTBFRTEwMzI3Q0MzMTFFMkE1RTZGMDE3REFDNzk0NzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7hMPChAAACvlBMVEUgAsrp5/qejOj8/P5PMNU1E88qBsxTNNZYO9edi+hRMtVSM9Xf2veNeuSVg+b59/38+/7i3vgiA8o8GtDDuPBQMdVTNdaikenWz/a7r+/VzfWhkOnc1fdXOdfg2/f9/f+Zhef49v3o5PksCc1EI9KMeeTz8P3r5/rk4PjQx/SuoOz8+v5HJ9Pc1vfCtfHv7fzo5vr18v3n4/kxDc5LKtT29PxaPde0p+0pBcwkA8s3FM/28/xcQNju6vtmS9puU9yFbuHEufHt6fvHvPHy7/w5F8/a0/f7+f6YhOZwVd1fQ9mZh+dWONc0Ec5OLtTGu/Hp5fpwVt3h3Pjj3/jSyfSunuuxo+ysnOt8ZN+Xg+Z9Zd+AaeCSf+W5re6+s/CRfuU/HNF+Z+C1qe6gj+k6GNBhRtne2PcvC82SgOXMwvOzpe2LeOPNw/NCINLJv/Ls6Pvv6/uUguZ/aOBEItKaiOcmBMv39f3b1PfPxvRUNtbm4vlDIdLe2fdGJtPPxfP6+P2gjul6Yt/Ty/W7sO91XN4rB8yjkumkk+mDbOE4Fs9qT9ywouxvVN1aPtiqmuokBMunlul2Xd308f2rm+trUNybiee6ru97Y98wDM3KwPJMK9Sfjeh0W97x7/zRyPQhAsrUzPW/tPDOxPPw7PuCa+FpTttAHtGllOni3fjSyvSciujBtvGtnetjSdpzWt5hRNl3Xt49G9Hl4fmtn+snBcy2qu47GNBkStq+s/AyDs6PfOSEbeHLwfLCt/E9GdDw7vx3X95VN9ZLLNRbP9htUtyFcOJeQtmKdeMzEM4lBMuIc+JnTNuLduPX0PbIvvJ+ZuCahudIKNOMd+NNLdS9svC8se/Z0va4rO6QfeV5Yd5ZPNfIvfJKKdOpmeqOe+SHcuJFJNJoT9tyWd5BH9Hd1/ctCs20qO00Es/Y0fb///+CA+6QAAAA6nRSTlP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wCkmYyXAAAD+0lEQVR42qzUZVNjSRQG4I5AQoSEBA2BCMHd3W1wdyjc3Qa3wd1h3N19GJ9Zd3f33fdfbEIYitkqqthd+tM9t+s+fU/36UNaxk5nVrjj345F+20myDLJ/qo5ZCPi79TjaRRvB1I0g7Gcog6SPXcKysy2BS01dbGmow6auDtO2aBt+z/UhSNPnbBHLv73WAfr0Xdc5AlLuyknlM3x4CIO9gUcYy4ANqnAqY84FqmWEYZ82/etIyDKoCm/o4iRYn9JhDQr4IPLwNPGE1YhcDBSgaFHbGTMeBNBohERLGKo69aB8dWSk0AFqwl/sEwikUmyP/FKYE8n3ostHYhc6ioCQs3Ofev6mmuAMQlCBNu7HW+ybpj1dvvZ/UUo5Y0x+bg6fNo7T8YKQvqD9GmxUEhq4H7GXhp2ppdZeYlbVfho//llBu8XDVJ4q596D7hZPir3oU+R+YMdkqnBN7Lcn7QF/kwbc4jKJ5RxAalGC52mkEK5h1dnDvS4PGebO+G8m8vJhFLfjuLqNZql2MfUgIFzrQ+DJ04UfeoLmh4VbC3D2e60Ak50ctNA2W0L83fwSuePUcqUH6dWYI8+mI1gVsDPz69WhyFV7pLcyxxFd5/dlrL2AYYapsZsaLnBNj6A4bYAGp0K1gjHR2ew1jI98vBQ76xFfqH87rxQBSb4rqhAE20wtSU99Nw6d+XygERBauYE2Wm/lYs2QRacSpjalVCDBhwNHaOzDQjev8ppra/mpg5PUNvWT5n3AsziFShrey9dS1UA+SSJywYiBBc2QT3ojIeq5raA7mvRpddl4Z4Ba4/CXTbKxtY0ZgPka1A3QaeCgsJfLdDtfUcFJqtBuWbVy6DiJtMzKBBZZodRd0y8AcptqBspwy0JsgY9FdhubfQW16sMVmYfAsf/5IwwVODe8CCE8baAdtbC9pwovPe5LcTHbHCKhAw/hsOXxs/BlEI/B4GzM9z6DtUe2k920te8n1HzrrjmGYhaHX6IRz9bAo/7l7l9ylMuhv6oabjV4HeGPouZpUe9zNNdeHGM76lkheTs88vIaZbXXscQmbtDCDdEI1sFvrsS6KsgcY4jhGjRbmiWCHRf90mBFiExyoviutpZ8qBOkNBvZu3x9hOi/TshVzBAiAO59nGP20GbWEYaw8OiKk7Ej7Vb+KwrXlkptkuKGmR4j6KBQQ/DGCN3ojJAuAf+drELwJpi+uJPmReF5vPCokPXZpaevkrIfacvyr8G2Xqx+f6AP+VF5KxsapJEZYsMO6IMHJ1p6tcU/3+0gz5HiQzSyRYva1g5vwz+91GWxHf+5uh6t9kdMCMakUmUXQTz4vyTH2IXwURXRnToboKYbD6kfvhbgAEAzONjAV0sasoAAAAASUVORK5CYII=",
		// Norton
		40:  "data:image/gif;base64,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",		
		// undefine
		80:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATxJREFUKM91kT1uE2EURW9J6SV4CVmCu5QpKZ2OinFJeWtEQfOGGTJWMuOfmQwOGDOKE1f0CIkVoCzBSzgpvgghRN4t33nSuXpCKCMjA/0vQhlpMt79rl25mMYkRpIkIWXAgY4DkHHjjWuXxDHO/wAdHQAHMj76zp+4pCCIk7+AH1zTkdF5yZ6WioUXb2KEhF7TPd1Hu2PBwBcqD+6dnyKhtz9Ti/dtsY1xTBbfb137zmuXD0goXLrxV7fH5B7jxntvXVOAhHLP3fuW4iFVixet791RkSegcOMdNTtStfL04BuuKIhjAmZrPjPnGyv30920d09PzzUXL5PDeUfDnN73bjx4z56BLWvHGAlJF7+CJLrxJUuWNFw5P5OegBjFq9yVVx5oKCn/+Vdyn+SzihUbPhCzOElLJJ6NQOgROBktk7FXYdYAAAAASUVORK5CYII=",
		};
		
	const API_HREF_SERVICE_NORTON = "http://safeweb.norton.com/report/show?url=";
	const TIMEOUT_NORTON = 10000;

	SP_SINGLE_SAFE_NORTON = function(  ){

		var self = this;
		
		this.norton = [];
		
		// ------------------  Norton  -------------------------------------------------------------------------
		this.set_PreviewDimensions_Norton = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("style","position:relative; height:36px; display:block; margin-left:20px;");

			var img = document.createElement("img");
			img.setAttribute("src", FILE_IMAGES[40]);
			img.setAttribute("title", "Check out this URL at Norton");
			img.setAttribute("style","position:absolute; cursor:pointer");
			img.setAttribute("id", "sp_icon_norton");
			img.style.left="0px";
			img.style.top="0px";
			divb.appendChild( img );
			img.addEventListener("click", function( event ){	sp_single.navigate_url('http://safeweb.norton.com/report/show?url='+self.curHost, event);	}, true);

			var imgR = document.createElement("img");
			imgR.setAttribute("id", "sp_fullDivTip_norton");
			imgR.setAttribute("style","position:absolute; cursor:pointer");
			imgR.style.top="10px";
			imgR.style.left="80px";
			imgR.setAttribute("title", "Refresh");
			imgR.setAttribute("src", FILE_IMAGES[20]);
			divb.appendChild( imgR );
			imgR.addEventListener("click", function( event ){  self.refresh_norton( );	}, true);

			div.appendChild( divb );
		}	

		// ===========================================================================================
		//  -----  запрос на Norton
		this.Proverka_Norton = function( host )  {      
			if (  sp_single.branch.getBoolPref('service_norton') )
			{
				setTimeout(function() {   
								self.read_Norton( host, function(  ){  
								
																	self.show_Div_Norton( host );		
																
																} ); 	 
							},  200 );
			}
		}

		// ===========================================================================================
		this.read_Norton =  function( host, callback ){
	
			if (this.norton[host] != null && this.norton[host] != 'captcha') 
			{ 
				callback( ); 
				return; 
			}

			var surl = API_HREF_SERVICE_NORTON + host;
sp_single.alert('read_Norton: '+surl);	

//			var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
			var request = new XMLHttpRequest();

			request.open('GET', surl, true);
			request.send(null)
		
			request.onreadystatechange=function()   {
					if(request.readyState==4 && request.status==200)
					{
						clearTimeout(self.NortonTimer);
						var e = request.responseText;
						
						var t = '';
						t = self.get_mezhdu_norton(e, 'class="ratingIcon ', '"', 20, 15000 );
sp_single.alert('read_Norton:::: '+t);	
						
						if ( t != '' )
						{
							self.norton[host] = t;
							var current_dt = new Date();
							var current_time = current_dt.getTime();
//							var text = current_time + '; Norton; ' + host + '; ' + t + '\n';
//							sp_single.storage._write_file(AD_SIGNS_FILE, text, 0);
							sp_single.storage.writeHost( { host: host,	srv:  'Norton',	rez:  self.norton[host], dat: current_time 	} )
						}
						
						callback();
					}
				}
			
			request.onerror = function(){
					sp_single.alert("Norton - Error") 
					callback( null );
				}
				
			this.NortonTimer = setTimeout( function() { 
		
							sp_single.alert("Norton Time over") 
							request.abort();   
							
							callback();
							
						}, TIMEOUT_NORTON);
		}	
	
	
		// ---  с парсить результат
		this.get_mezhdu_norton = function( str, str1, str2, len = 0, h = 0 )  {    

			var text;
			var p = str.indexOf( str1, h );
			if ( p == -1 ) p = str.indexOf( str1 );
		
			if (  p != -1)  
			{
				if (len == 0)  text = str.substr(p + str1.length);
					else text = str.substr(p + str1.length, len);
			
				p = text.indexOf( str2 );
				if (  p != -1)  
				{
					text = text.substr(0, p);
					return text.trim();
				}
			}
			else
			{
				p = str.indexOf("<div class='simple_captcha_image'>");
				return 'captcha';
			}
			return '';
		}	
		
		// ===========================================================================================
		this.get_Status_Norton = function( v )  {    
			if ( v == null) return 80;
			var status = 80;
			if ( v == 'icoSafe' ) status = 3;
			else if ( v == 'icoNSecured' ) status = 3;
			else if ( v == 'icoWarning' ) status = 2;
			else if ( v == 'icoCaution' ) status = 1;
			else if ( v == 'icoUntested' ) status = 0;
			else if ( v == 'captcha' ) status = 22;
			return status;
		}
		
		// ===========================================================================================
		this.show_Div_Norton = function( host )  {    
			status = this.get_Status_Norton( this.norton[host] );
			var document = gBrowser.selectedBrowser.contentDocument;
			var img_norton = document.getElementById("sp_fullDivTip_norton");
			if ( img_norton )
			{
				var imageUrl = FILE_IMAGES[status];
				img_norton.setAttribute("src", imageUrl);
				if (status == 22)	img_norton.title = "captcha";
						else 	img_norton.title = "Refresh";
			}	
			if (this.regimTest)
			{
				var div_info = document.getElementById('sp_fullDivTip_info');
				var text = div_info.getAttribute("title");
				text = text + " Norton = " + this.norton[host];
				div_info.setAttribute("title",text);
			}	
		}
	
		// ================================================================================================
		this.refresh_norton = function(  )  {    
			var r = this.norton[this.curHost];
			this.norton[this.curHost] = null;

			var document = gBrowser.selectedBrowser.contentDocument;
			var img_norton = document.getElementById("sp_fullDivTip_norton");
			if ( img_norton )	img_norton.setAttribute("src", FILE_IMAGES[20]);
			if ( r == 'captcha')	sp_single.navigate_url('http://safeweb.norton.com/report/show?url='+this.curHost);
			else   this.Proverka_Norton(this.curHost);
		}
		
// ================================================================================================
	}	
})();
