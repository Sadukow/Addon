var showSmallDivTimer = null;	
var hideSmallDivTimer = null;	

var smallDivRemoveTimer=null;

var isShowingSmallDiv = false;
var isShowingPreview  = false;
var isShowingThumbnailPreview = false;
var isShowingThumbnailPreviewNo = false;
var isShowingLivePreview = false;

var vClickLivePreview = "frame";

var isShowIcons = true;
var isEnableSafe = true;
var isEnablePreview	= true;
var isEnableLive	= true;

var offset_x = 10;
var offset_y = -10;
var offset_mode = "after";

var mouse_x = 0;
var mouse_y = 0;

var curElem = null;
var curWinLoc = null;
var activeUrl;
var curLink = null;
var curHost = null;
var showTime=500;
var closeTime=2000;
var closePreviewTime=2000;
var rect_Link = null;

const FILE_IMAGES = {

		// иконка Safe активная
		84:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAIAAABL1vtsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVCOTQyMUNEQTVCNDExRTJCQTY3Q0I3OTYxMjJFMEFFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVCOTQyMUNFQTVCNDExRTJCQTY3Q0I3OTYxMjJFMEFFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUI5NDIxQ0JBNUI0MTFFMkJBNjdDQjc5NjEyMkUwQUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUI5NDIxQ0NBNUI0MTFFMkJBNjdDQjc5NjEyMkUwQUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6UfPu/AAACVElEQVR42qRUPWsqURB9q2v8QoM2IgiCSiKiEdRGkBSCJFjZWGsRSGkbA7b6A6wCIkkV0MJOBUWstDMkihAhVjY2ioofiV85j7usm93weCQDy+7OPWfm3Jm5l/r4+PjzO6PxUBT1Y/5+v6fJi7ew2+3K5XKxWGy1Wvh1uVzBYPDy8lIkEgmjUNgIN8R2u22323d3dy8vLzzo2dnZ9fW1w+EQi8UHPoyEWC6Xo9Ho7e2tUqnUarV/KPf7/YFAwGw2a7VauVx+CBGPx/v9/mAw+M8SGAwGk8mUSqUQganF09PTbDbjghQKRSgUuri4gOx6vZ7L5abTKbuKZJPJBESEYMqj1+t5eU5OTtxud6PR6Ha7kUgkFovRNM0FsBRGBf57vR4X8fr6enNzs16v8a1SqVDLo6OjzWbDDUH6wKiwWCzHx8fcECgw4VutVpvNVigUFosFuwowKORbRFRAtlqtFpYN5EQiUa1W8/k81w8wKF9UnJ6eGo1GHh+FvL29HQ6H6XSaKGINYFC+qMBuz8/PeSEkEkmpVHp8fBSqAxgUouLvXJAM2Go0GkXOL8NLUVKpdLVacZ06ne7+/h5dJ2kYFTCMWjgc5mV7eHjIZrO8dgIGMGExTWUNBwlT1Ol0WA92gaOFU8d67HY7YPxjxr0ynp+fUcL5fP7tXCuVymQy6XQ6WQ+G5bARYhghTBRKJeTDiSUAuHj+Roj5fD6ZTIZs4/GYdWo0GqjzeDzf3xfv7+/CBRzcTCbTbDbx7fV6r66ucDSFMPTr0NSfGZpKk9dvrt9PAQYA9O4pKg6yWDsAAAAASUVORK5CYII=",		
		// иконка Preview   активная
		85:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAIAAABL1vtsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY3RTE2QUQxQTc0OTExRTI5NTM1RUYwNDUzMjk5N0YzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY3RTE2QUQyQTc0OTExRTI5NTM1RUYwNDUzMjk5N0YzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjdFMTZBQ0ZBNzQ5MTFFMjk1MzVFRjA0NTMyOTk3RjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjdFMTZBRDBBNzQ5MTFFMjk1MzVFRjA0NTMyOTk3RjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7a/KsxAAACU0lEQVR42rxUT4hpcRR+FzPIhkzoLTSNGkVvMTULKWpYUEpZzUpNVigUWU4pyynJgqXF1JQNs1EsUBI7VoiFZDXDBqXx3/u40yXX9KZe753V73znnO+e3znf7xKbzebH3xlxkmI6nb6/vy+XS4Ig4CKHxWKJxWIOh0NPZp0kHo1G7XZ7tVpRCJPJ5OzsW118fHz4/f5cLneE6/X6p6cnLpf7ZReoHI/HYMzn8/R6GMBUKnV3d8dgMPh8PpvN3nexXq8bjUYoFKpUKt8coU6n83g819fXnxT4bDAYFAgEXq/38fHx7e0NAYlEcn9/r1Qqca7X64lEgsQpk8vlPp9Po9EwFovFy8sLwhcXF1Kp9OzsDGGz2fz6+mq323/tDAe4AA8pWq3W8/PzZxcmk6nT6VAxtVodiUSGw2E0Gi0Wi0C0Wq3T6cT93W53uVymMq+urtLp9Hac5PJJw9psNhtW6HK5ms0mCSaTSZzRLELVahWq+RzkrpBxNCehUKhSqbLZLFVPGlyACCHhqOSYAl2ghW63S98CQFJgf6BAkxiwTCajUwBEiLrFlxSDwaBUKhkMhtvb20McLkCEkHCC4lDj8/k8Ho9PJpNwOGy1Wn/uDAe4ABFCApVMFm6XioUVCoVDYqg4EAiIRCJ0Dhdi6ff7QOhpWPx2qQ8PD1BBrVajYkiFa7FYFAoFXMgfrwM5h/U3Nzco3L/UXq8Xi8UymQx9WnTDUoxGo8PhgJr3LxXbvry8hNpmsxl1T1yevPn5+TmPx6MUiDeKZEogxL/68f1vit8CDACMkDYcOacBQQAAAABJRU5ErkJggg==",
		// иконка Live   активная
		86:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAIAAABL1vtsAAAAB3RJTUUH3QQRChgWBAmbtQAAAmxJREFUeJyVVDFP20AYfXc+pFQKsRsiFdHEQsDQWgyVQJjfQKXCWImpYir8jzLSpSyFrRkaEcYyFChjAIlMRYSpLlKNBAwMjevavq/DkeTkGIm+yaf77n1P7/v8GBEhC9QBANZBZqXof8kYk1JKKYXo3cZxzDnnnKsC/QnrVyGl5JwDuL299TwPgG3blmXpV9mCpZRElCQJEfmXl2+Xlyu2DcbAWLlSWV5Z8X2/W6AD+iGOY0l0fn4+NjGhGuRNM2+a6ntsfLzVaqmybAopZZIkYRhOuy6AkXL548bGD8/zPG9jc3OkUgEw7bp/wjBJEl1LjyKKIiKqb28DGCwUGo2G3qpxeDhYKADYqte7xQq85whARF93dxnwan7edd0wDJMkkVKGYejOzMwvLDBgd29Pn3dvqETEAMbYzc0NAY7jqCkahgGAcx7HseM4BFxfX6sd6U73ToU6EFGxWGRAq9USQkgNQoizszMGlIaGlITedqS8+FyrAShY1snJie5Fs9kcNE0AtVot5UWPQvkcBMGLqSkA9ujop2r1l+/7vl+tVp+WywBmZmeDILh3It2Bfz89rdi20lgslR6XSgCYEIzzvf39lIQ0RZfl58XFm6WlJ8PDiuhRPj+QywF4vbioKNQqZ1DoO05EV1dXx8fHzWbz8OioYFnGwACALzs793qRYklt8bvVVQBciOeTk7/bbd2ONIXOpYiiKIqiKAiCZ47DhQDwYX2diP52hPT9ud0UYEytlkqNXC73fm1NxjEA0zRJi4iMvOjHXTfOvx0ctNvtl3Nz1Emzh1IoZOfNwylUmTLbMAw9+/5DxX34B1+Mxc4abIZdAAAAAElFTkSuQmCC",		
		// иконка Live - Frame
		87:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBGODg0MTNCQTg1MjExRTI4Rjk2Rjg3OUY3NzZCMThFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBGODg0MTNDQTg1MjExRTI4Rjk2Rjg3OUY3NzZCMThFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEY4ODQxMzlBODUyMTFFMjhGOTZGODc5Rjc3NkIxOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEY4ODQxM0FBODUyMTFFMjhGOTZGODc5Rjc3NkIxOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6q5zWoAAABDElEQVR42mL8//8/AzUBEwOVAQuMYWJiIgCkZgNxEJpFF4E4HkrjBGfOnMFwYSMQhwDxMyCuAOIMID4BxPpAPB+IeUhyIRBEAfFnIA4A4rNQsWVAvA/kASB2BeL1pIShCFTzWSQxkAVLoWxHciLlMRY116E0B6leZkALJwkgFgTiT0CcAMSvgFgThzlPoL5BMbAaybtG0PCSg/L/AjEzHocdgAUJsoFtSOxAJMMYCBgGAg6EEvZ/aucUbAY+AmIvIM4C4h/UyHr3gHg7EG+ERQAxsYwPWAOxPBA7AbEoNVzICsSSaJFFtAtxWQQqPPjIMfAPDnEdUnMKDCwEYg9iDIACeKHBOOhLbIAAAwDX2jDa4nGe/QAAAABJRU5ErkJggg==",		
		// иконка Live - Incognito
		88:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUzRjI4QUVCQTg1MTExRTI5QjNBRTZBMzlCQzU5MDg5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUzRjI4QUVDQTg1MTExRTI5QjNBRTZBMzlCQzU5MDg5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTNGMjhBRTlBODUxMTFFMjlCM0FFNkEzOUJDNTkwODkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTNGMjhBRUFBODUxMTFFMjlCM0FFNkEzOUJDNTkwODkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4cEOgRAAAB30lEQVR42qyUO0sDQRDHby8vUQmoYBFBELE1gihoodhaaCGIWohY+Bms7Cz8AnaK2AQ7QVBBELGxsAhoYesLAoLiA0nI5e78TdwLl1ziMwN/ZnZ27n8zs7OrXNc16ilhz0gmk2UbSinDNM129DTLYdAM3sGp4zg76Cd/fDqdLiesISNUMIvuB1FggU5wh3/ftm2nskKzBlEDget8sAmGQQy4ICprMkyxvwriQugnLWVoWZavWrUCFrFj4AI7hb4CPXw8ozNexr5Fb4B8gND3ly7sSU12Rh/nwLUv+22y3CVmCHsJ7IH7ACFBntmhyUS2+PBGjHw+b4TDxfAHYo/RA6Cb/ZgcYIAwl8sZoVBI6hVmV9f+Sr9c2RNCMjUikYj4pURHOoXtFgqFIKE4JUtIHd8fFYSGQHyipdcQKy/G+ZQgIQFSahzSCew23ddxVKueBmER3wsEg9rXxHoefQ4OijzeYSQSCTmIUdYL6JZfXpDLTCbTW1mypY/f/sONs6v2sJZQ6gnqUM+g3FH17V32jU01wiPI1mSwNaHxL0JkTB4F0PdVdr8hfAaPIPvj5wtCU68jVeKmgIxQYw2eaLVDyepMXrTfLm+jkhF7826R77WS03woBdb7xTaNOsuHAAMA/ib81l0+i3cAAAAASUVORK5CYII=",

		
	};
	
function Cons_Event()
{ 
	var element = document.getElementById("sp_console_event");
	if (!element)
	{
		element = document.createElement("div");
		element.setAttribute("id", "sp_console_event");
	    element.setAttribute("style", "display:none");
		document.documentElement.appendChild(element);
	}
	element.addEventListener("runCommandEvent", function(event)		{
							var element = event.target;
							var data = JSON.parse(element.getAttribute("data"));
							if ( data.a == 'SafeContext')
							{
								Show_Context( data.u, data.x, data.y);
							}
							else if ( data.a == 'ReloadOptions')
							{
								Reload_Options();  
							}
							else if ( data.a == 'removeSmallDiv')
							{
								removeSmallDiv();
							}
							else if ( data.a == 'show_Div')
							{
								curLink = data.url;
								curHost = data.host;
								show_Div( data.safe, data.preview );
							}
							else if ( data.a == 'hideSmallDivTimer')
							{
								window.clearTimeout(hideSmallDivTimer);   	hideSmallDivTimer = null;
							}
							else if ( data.a == 'setShowingSafe')
							{
								isShowingPreview = data.f;
							}
							else if ( data.a == 'setShowingPreview')
							{
								isShowingThumbnailPreview = data.f;
							}
							else if ( data.a == 'setShowingLivePreview')
							{
								isShowingLivePreview = data.f;
							}
							else
							{
								Log('---runCommandEvent: ' + data.a + ' --- ' + data.u);
							}	
						}, true);
}

function Reload_Options( )
{ 
	SP_SINGLEYT_Page_Insertor.reloadPrefs(  );
}

function podgotovka(  )
{
	SP_SINGLEYT_Page_Insertor.reloadPrefs(  );
}
	
function init( win, elem )
{
//Log('----init--- '+document.location.href);
//Log('window.parent.location= ' + window.parent.location);
//Log('win.location = '+win.location);
	
	curWinLoc = document.location.href;
	podgotovka(  );

	getAllHrefs();
	
	window.setInterval(function(){  getAllHrefs()  }, 300);

	Cons_Event();
	
	document.addEventListener("click",function(event){
										SP_SINGLEYT_Page_Insertor.click_document();
								}, false);
	
	
}

function Log( text )
{
	SP_SINGLEYT_Page_Insertor.alert(text);
}

function set_reloadPrefs( response )
{
	showTime=response.showTime;
	closeTime=response.closeTime;
	closePreviewTime=response.closePreview;
	offset_x = response.x;
	offset_y = response.y;
	offset_mode = response.mode;
	
	isShowIcons	= response.isShowIcons;
	isEnableSafe	= response.isSafe;
	isEnablePreview	= response.isPreview;
	isEnableLive	= response.isLive;
}
	

// ----------------------------------
function getAllHrefs()
{
	var elems = document.getElementsByTagName("a");
	for(var i=0; i<elems.length; i++)
	{
		var n = elems[i];
		try
		{
			n.removeEventListener("mouseover",hrefMouseOver,false);
			n.removeEventListener("mouseout",hrefMouseOut,false)
		}
		catch(r){}
		
		try
		{
			n.addEventListener("mouseover",hrefMouseOver,false);
			n.addEventListener("mouseout",hrefMouseOut,false)
		}
		catch(r){}
	}
}

// ----------------------------------
function hrefMouseOver()
{
	if (!isShowIcons) return;
	
	var url = this.getAttribute("href");
	if (!url) return;	

	activeUrl = url;
	previewOpen( this );
}

// ----------------------------------
function hrefMouseOut()
{
	previewClose( );
}

// -----------------------------------   открыть иконку к адресу
function previewOpen( elem )  {
	
	window.clearTimeout(hideSmallDivTimer);  	hideSmallDivTimer=null;      // очистка таймера закрытия

	showSmallDivTimer = window.setTimeout(function() {   showSmallDiv( elem );  	 },  showTime );
	
}

// ------------------------------------ закрыть иконку у адреса
function previewClose(  )  {
//Log('previewClose');
	window.clearTimeout(showSmallDivTimer);  	showSmallDivTimer=null;      // очистка таймера открытия

	hideSmallDivTimer = window.setTimeout(function(){	removeSmallDiv();	},  closeTime);
		
}	

// ---  скрыть иконку
function removeSmallDiv( fl )  {    
	
	if ( isShowingPreview ) return;
	if ( isShowingThumbnailPreview ) return;
	if ( isShowingLivePreview ) return;
	
	var element_sp =  document.getElementById("sp_smallDivTip");
	
	if(element_sp != null)
	{
		while( element_sp.firstChild )
		{
			element_sp.removeChild( element_sp.firstChild );
		}
		document.body.removeChild( element_sp );
	
		window.clearTimeout(showSmallDivTimer);  	showSmallDivTimer=null;      // очистка таймера открытия
	}
	
	isShowingSmallDiv = false;
	curElem = null;
}	

// ---  показать иконку
function showSmallDiv( elem )  {    

	if (curElem == elem) return;
	if ( isShowingPreview ) return;
	if ( isShowingSmallDiv )	removeSmallDiv( true );
	curElem = elem;

	isLink( elem );
}	
	
// проверить адрес (необходимо выводить иконку
function isLink( elem ) {

	var url = elem.getAttribute("href");
	SP_SINGLEYT_Page_Insertor.isLink( url, curWinLoc );
}


// ==============================  Показать иконку
// показать иконку по умолчанию
function show_Div( isSafe, isPreview, isLive )  {    

	if (typeof isSafe == "undefined") isSafe = isEnableSafe;
	if (typeof isPreview == "undefined") isPreview = isEnablePreview;
	if (typeof isLive == "undefined") isLive = isEnableLive;
	
	if (  !((isSafe && isEnableSafe) || (isPreview && isEnablePreview) || (isLive && isEnableLive)) ) return;
	
	if(curElem == null) return;

	var pos = get_position_div( curElem );

	if (offset_mode == "after")
	{
		var rect= curElem.getClientRects();
		var k = rect.length;
		var py = curElem.ownerDocument.defaultView.pageYOffset;
		var px = curElem.ownerDocument.defaultView.pageXOffset;
		for(var i=0; i<k; i++)
		{
			r = rect[i];
			if(this.pageY < py+ rect[i].bottom)			break;
		}
		pos.py= py + r.bottom - 16;
		x = r.right;
		pos.px = x + 20;
		pos.px = Math.round(pos.px);
		pos.py = Math.round(pos.py);
	}
	else
	{
		var scroll_top = this.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
		var scroll_left = this.pageXOffset || (document.documentElement && document.documentElement.scrollLeft) || (document.body && document.body.scrollLeft);
		pos.px = mouse_x + scroll_left + offset_x + 20;
		pos.py = mouse_y + scroll_top + offset_y;   
	}	

	if( !isShowingSmallDiv )
	{
		var div = document.createElement("div");
		div.setAttribute("id","sp_smallDivTip");
		div.setAttribute("style","z-index:2146483647; border:1px solid #cacaca; -moz-opacity:0.20; cursor:pointer; position:absolute; width:auto; height:18px; display:inline-block; background-color: white; ");

		document.body.appendChild( div );
		isShowingSmallDiv=true;
		div.style.left=pos.px+"px";
		div.style.top=pos.py+"px";
	
		var xx = 0;
		// -----------------------------  Safe
		if (isSafe && isEnableSafe)
		{
			//-------------------------    рисуем иконку Safe
			var img1 = document.createElement("img");
			img1.setAttribute("src", FILE_IMAGES[84]);
			img1.setAttribute("title","Is it Safe?"+" ("+curHost+")");
			img1.setAttribute("style","z-index:2146483647; -moz-opacity:0.20; cursor:pointer; width:18px; height:18px; display:inline-block;");
			img1.style.opacity=0.5;
			div.appendChild( img1 );

			// --------- реакция на иконку
			img1.addEventListener("mouseover",function(event){
											this.style.opacity=1.0;
											window.clearTimeout(hideSmallDivTimer);  	hideSmallDivTimer=null;      // очистка таймера закрытия
								},true);
								
			img1.addEventListener("mouseout",function(event){
											this.style.opacity=0.5;
											previewClose( );
								},true);
								
			img1.addEventListener("click",function(event){
									this.style.opacity=0.9;
									click_fullDivTip = true;
									if (!isShowingPreview)
									{
										initPreviewShow( pos );
									}
									else
									{
										initPreviewHide(  );
										removeSmallDiv();
									}	
								},true);
								
			xx +=18;					
		}							

		// -----------------------------  Preview
		if (isPreview && isEnablePreview)
		{
			//-----------------  рисуем иконку Preview
			var img2 = document.createElement("img");
			img2.setAttribute("src", FILE_IMAGES[85]);
			img2.setAttribute("title","Google Instant Preview: "+curLink+"");
			img2.setAttribute("style","z-index:2146483647; border:0px solid blue; -moz-opacity:0.20; cursor:pointer; width:18px;height:18px;  display:inline-block;");
			img2.style.opacity=0.5;
			div.appendChild( img2 );
	
			// --------- реакция на иконку
			img2.addEventListener("mouseover",function(event){
											this.style.opacity=1.0;
											window.clearTimeout(hideSmallDivTimer);  	hideSmallDivTimer=null;      // очистка таймера закрытия
								},true);
								
			img2.addEventListener("mouseout",function(event){
											this.style.opacity=0.5;
											previewClose( );
								},true);
								
			img2.addEventListener("click",function(event){
									this.style.opacity=0.9;
									click_fullDivTip = true;
									if (!isShowingThumbnailPreview)
									{
										initPreviewShowThumbnail(  );
									}
									else
									{
										initPreviewHideThumbnail(  );
										removeSmallDiv();
									}	
								},true);
			xx +=18;					
		}					

		// -----------------------------  Live
		if (isEnableLive)
		{
			var img3 = document.createElement("img");
			var imageUrl = FILE_IMAGES[86];
			img3.setAttribute("src", imageUrl);
//			img3.setAttribute("title","Live Preview: "+curLink+"");
			img3.setAttribute("style","z-index:2146483647; -moz-opacity:0.20; cursor:pointer; width:18px;height:18px; display:inline-block;");
			img3.style.opacity=0.5;
			div.appendChild( img3 );
	
			// --------- реакция на иконку
			img3.addEventListener("mouseover",function(event){
											this.style.opacity=1.0;
											window.clearTimeout(hideSmallDivTimer);  	hideSmallDivTimer=null;      // очистка таймера закрытия
											
											// показать изображение
											var el =  document.getElementById("sp_smallDivTip_ext");
											if (el.style.display != "block")
											{
												el.style.height="6px";  el.style.width="12px";
												el.style.display="block";
												window.setTimeout(function(){		el.style.height="12px";	 el.style.width="24px";	},40);
												window.setTimeout(function(){		el.style.height="18px";	 el.style.width="36px";	},80);
												window.setTimeout(function(){		el.style.height="24px";	 el.style.width="48px";	},120);
												window.setTimeout(function(){		el.style.height="30px";	 el.style.width="64px";	},160);
												window.setTimeout(function(){		el.style.height="38px";  el.style.width="75px";	},200);
											}	
											
								},true);
								
			img3.addEventListener("mouseout",function(event){
											this.style.opacity=0.5;
											previewClose( );
								},true);
								
			img3.addEventListener("click",function(event){
									this.style.opacity=0.9;
									click_fullDivTip = true;
									if (!isShowingLivePreview)
									{
										if (vClickLivePreview == "frame")	initPreviewShowLiveRegular( curLink );
										else initPreviewShowLiveIncognito( curLink );
									}
									else
									{
										if (vClickLivePreview == "frame")
										{
											initPreviewHideLiveRegular(  );
											removeSmallDiv();
										}	
									}	
								},true);
								
			// дополнительные иконки
			var div1 = document.createElement("div");
			div1.setAttribute("id","sp_smallDivTip_ext");
			div1.setAttribute("style","z-index:2146483647; border:1px solid #cacaca; -moz-opacity:0.20; cursor:pointer; position:absolute; width:75px; height:36px; display:none; background-color: white; overflow:hidden; ");
			div.appendChild( div1 );
			div1.style.left=(xx+18)+"px";
			div1.style.top="0px";

			var div1a = document.createElement("div");
			div1a.setAttribute("style","width:75px; height:18px; position:relative; -moz-opacity:0.20; cursor:pointer;");
			div1a.style.opacity=0.5;
			div1.appendChild( div1a );
			
			var img4 = document.createElement("img");
			img4.setAttribute("src", FILE_IMAGES[87]);
			img4.setAttribute("style","z-index:2146483647; position:absolute;  left: 1px; cursor:pointer; width:18px;height:18px; ");
			div1a.appendChild( img4 );
			// --------- реакция на иконку
			div1a.addEventListener("mouseover",function(event){
											this.style.opacity=1.0;
											window.clearTimeout(hideSmallDivTimer);  	hideSmallDivTimer=null;      // очистка таймера закрытия
								},true);
								
			div1a.addEventListener("mouseout",function(event){
											this.style.opacity=0.5;
											previewClose( );
								},true);
								
			div1a.addEventListener("click",function(event){
									this.style.opacity=0.9;
									click_fullDivTip = true;
									if (!isShowingLivePreview)
									{
										vClickLivePreview = "frame";
										initPreviewShowLiveRegular( curLink );
									}
									else
									{
										initPreviewHideLiveRegular(  );
										removeSmallDiv();
									}	
								},true);
			var span_a = document.createElement("span");
			span_a.setAttribute("style","font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; font-size: 10px; color: black; position:absolute; left: 22px; top:5px;");
			span_a.textContent = "Regular";
			div1a.appendChild( span_a );
								

			var div1b = document.createElement("div");
			div1b.setAttribute("style","width:75px; height:18px; position:relative; -moz-opacity:0.20; cursor:pointer;");
			div1b.style.opacity=0.5;
			div1.appendChild( div1b );
			
			var img5 = document.createElement("img");
			img5.setAttribute("src", FILE_IMAGES[88]);
			img5.setAttribute("style","z-index:2146483647; position:absolute;  left: 1px;  width:18px;height:18px;");
			img5.style.opacity=0.5;
			div1b.appendChild( img5 );
			// --------- реакция на иконку
			div1b.addEventListener("mouseover",function(event){
											this.style.opacity=1.0;
											window.clearTimeout(hideSmallDivTimer);  	hideSmallDivTimer=null;      // очистка таймера закрытия
								},true);
								
			div1b.addEventListener("mouseout",function(event){
											this.style.opacity=0.5;
											previewClose( );
								},true);
								
			div1b.addEventListener("click",function(event){
									this.style.opacity=0.9;
									click_fullDivTip = true;
									vClickLivePreview = "incognito";
									initPreviewShowLiveIncognito( curLink );
								},true);
								
			var span_b = document.createElement("span");
			span_b.setAttribute("style","font-family: Arial,Helvetica,SunSans-Regular,Sans-Serif; font-size: 10px; color: black; position:absolute; left: 22px; top:5px;");
			span_b.textContent = "Incognito";
			div1b.appendChild( span_b );
								
								
		}					
	}
}
// ================================================================================================
function initPreviewShowLiveRegular( url )  {   

	window.clearTimeout(hideSmallDivTimer);  	hideSmallDivTimer=null;      // очистка таймера закрытия

	SP_SINGLEYT_Page_Insertor.ShowLiveRegular( curLink );
	
}
function initPreviewHideLiveRegular(  )  {   

}
function initPreviewShowLiveIncognito( url )  {   

	window.clearTimeout(hideSmallDivTimer);  	hideSmallDivTimer=null;      // очистка таймера закрытия

	SP_SINGLEYT_Page_Insertor.ShowLiveIncognito( curLink );
	
}
// ================================================================================================
function initPreviewShowThumbnail(  )  {   

	window.setTimeout(function(){		Pokazat(  );	}, 100);

}
function initPreviewHideThumbnail(  )  {   

	
}
function Pokazat(  ) {
	SP_SINGLEYT_Page_Insertor.Pokazat( curLink, curHost );
}


// ================================================================================================
// -- открываем окно
function initPreviewShow( pos )  {   

	window.setTimeout(function(){		Proverka( pos );	}, 100);
	
}
// -- закрываем окно
function initPreviewHide(  )  {   

	//window.setTimeout(function(){ 	closeProverka(  );  },  100 );
	
}

// ---- запрос аддона на рисование окошка
function Proverka( pos ) {
	SP_SINGLEYT_Page_Insertor.Proverka( pos.px, pos.py, curLink, curWinLoc );
}
//function closeProverka(  ) {
//	SP_SINGLEYT_Page_Insertor.closeProverka( curLink, curWinLoc );
//}


// ================================================================================================
function get_position_div( elem ) {
	var pos = getElementPosition( elem );
		
	var px, py;

	var rect = elem.getClientRects();
	var rect_len = rect.length;
	var pageY = elem.ownerDocument.defaultView.pageYOffset;
	var pageX = elem.ownerDocument.defaultView.pageXOffset;
	for( var k=0; k<rect_len; k++)
	{
		r = rect[k];
		if ( elem.pageY < (pageY + r.bottom) )			break;
	}
	pos.py = pageY + r.bottom - 18 + offset_y;
	pos.px = r.right + 2  +  offset_x;

	pos.px = Math.round(pos.px);
	pos.py = Math.round(pos.py);
	
	return { px: pos.px, py: pos.py };
}

function getElementPosition( elem )   {  
	var x=0;
	var y=0;
	if( elem )
	{
		var p = elem.offsetParent;
		if(p)
		{
			while((p = elem.offsetParent) != null)
			{
				x += elem.offsetLeft;
				y += elem.offsetTop;
				elem = p;
			}
		}
		else
		{
			x = elem.offsetLeft;
			y = elem.offsetTop;
		}
	}
	return {"px":x,"py":y};
}

	
// ============================================================================================================================
SP_SINGLEYT_Page_Insertor = {
	

	alert: function(text)
	{
		SP_SINGLEYT_Page_Insertor.Single_LOG( text );
	},
	
	insert: function(  ){
		var that = this;
		
//		window.addEventListener("load",function( e ) {
		document.addEventListener("DOMContentLoaded",function( e ) {

						init( this, e )
						
					},false);
					
		window.addEventListener("mousemove", function(event) {
						mouse_x = event.clientX;
						mouse_y = event.clientY;
					}, false);
					
		window.addEventListener("keyup",	function(event){

							if( event.keyCode == 27)
							{
								if ( isShowingPreview || isShowingThumbnailPreview || isShowingLivePreview ) SP_SINGLEYT_Page_Insertor.esc_document();
							}

						},false)
	
	},
	
	
	
	// ---------------------------------  передать сообщение Расширению
	sendEvent: function( el, data ){
		var evento = document.createEvent('CustomEvent');  
		evento.initCustomEvent('SP_SingleApiEvent',true, false, data);  	
		el.dispatchEvent(evento);  	
	},
	
	sendAnonimouseEvent: function( data ){
		var t = document.createElement("div");
		document.documentElement.appendChild(t);  
		this.sendEvent( t, data );
		document.documentElement.removeChild(t);  
	},

	// ----------------------------- передать	
	Display_Setting: function(  ){
		this.sendAnonimouseEvent({
			"a": "DisplaySetting",
		});
	},
	Single_LOG: function( text ){
		this.sendAnonimouseEvent({
			"a": "Single_LOG",
			"text": text
		});
	},

	navigate_url: function( url, fl1, fl2 ){
		this.sendAnonimouseEvent({
			"a": 	"Navigate_URL",
			"url": 	url,
			"fl1": 	fl1,
			"fl2": 	fl2
		});
	},

	// ----------------------------- получить
	GetLikeStatus: function( menu ){
		this.sendAnonimouseEvent({
			"a": "getLikeStatus",
			"callback": function( flag ){	
					if (flag) create_Like_Button(  menu );
				}
		});
	},
	
	// ----------------------------------
	reloadPrefs: function() {
		var that = this;
		
		this.sendAnonimouseEvent({
			"a": "reloadPrefs",
			"callback": function( media ) {      
								media = JSON.parse(media);
								set_reloadPrefs( media );
							}   
		});
								
	},
	
	Proverka: function( pos_x, pos_y, url, loc ) {
		var that = this;

		this.sendAnonimouseEvent({
			"a": "Proverka",
			"x": pos_x,
			"y": pos_y,
			"u": url,
			"l": loc
		});
	},	
	
	Pokazat: function( url, host ) {
		var that = this;

		this.sendAnonimouseEvent({
			"a": "Pokazat",
			"u": url,
			"h": host
		});
	},	

	ShowLiveRegular: function( url, host ) {
		var that = this;

		this.sendAnonimouseEvent({
			"a": "ShowLiveRegular",
			"u": url
		});
	},	
	
	ShowLiveIncognito: function( url, host ) {
		var that = this;

		this.sendAnonimouseEvent({
			"a": "ShowLiveIncognito",
			"u": url
		});
	},	
	

	
	
	click_document: function(  ) {
		var that = this;
		
		this.sendAnonimouseEvent({
			"a": "ClickDocument"
		});
	},	
	
	esc_document: function(  ) {
		var that = this;
		
		this.sendAnonimouseEvent({
			"a": "EscDocument"
		});
	},	
	
	isLink: function( url, loc ) {
		var that = this;
		this.sendAnonimouseEvent({
			"a": "isLink",
			"u": url,
			"l": loc
		});
								
	}
	
	
};

(function(){
	SP_SINGLEYT_Page_Insertor.insert();	
})();