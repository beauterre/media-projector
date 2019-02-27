"use strict";
(function () {
/*
Index, purpose is to easily switch between more than one media-projector type presentation

 By Hjalmar Snoep
 Version: 1.1 
*/

 // start by declaring the variables we need.
 // check if the user has made some variable called media!

 if(typeof(index)==="undefined")
 {
  window.alert("Media Projector - Index couldn't find any media, did you define it in the page, before you loaded index.js?");
 }
 var current=-1; // first presentation to load after fullscreen..
 document.body.style="background: black";
 var iframe=document.getElementById("presentation");
 if(iframe==null) {
	 window.alert("no iframe called 'presentation' found in index.html?");
 }
 iframe.style.display="none";
 var last_action=Date.now();
 document.body.addEventListener("click",click,true);
 var firstclick=false;
 var hiding_overlay=-1;
 //loop();
 //show();

 function next()
 {
	 console.log("next called");
	 // user has clicked and we need to load the next thing..
	current++;
	if(current>=index.length)
	{
		// we automatically go to clear?
	}else{
		console.log("loading: "+index[current].id);
		 // presentation will determin what happens next.
		iframe.src=index[current].link;
	}
 }

 function fullscreen()
 {
	 document.body.style.cursor ="none";
   if (
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
   ) {
	iframe.style.display="block";
	iframe.style.position="fixed";
	iframe.style.top="0px";
	iframe.style.left="0px";
	iframe.style.right="0px";
	iframe.style.bottom="0px";
	iframe.style.width="0px";
	iframe.style.height="0px";
	  
   var i = iframe;
    // go full-screen
    if (i.requestFullscreen) {
     i.requestFullscreen();
    } else if (i.webkitRequestFullscreen) {
     i.webkitRequestFullscreen();
    } else if (i.mozRequestFullScreen) {
     i.mozRequestFullScreen();
    } else if (i.msRequestFullscreen) {
     i.msRequestFullscreen();
    }
   }
   console.log("requested fullscreen");
   next();
 }

 function click()
 {
	 console.log("click");
  if(firstclick==false)
  {
   firstclick=true;
   // just go fullscreen if we weren't and remove the overlay;;
   document.getElementById("overlay").style.display="none";
   var sn=document.getElementById("overlay");
   console.log(sn);
   sn.style.display="block";
   sn.innerHTML="Klik nogmaals om de presentatie te starten";
   hiding_overlay=setTimeout(hideOverlay,3000);
   fullscreen();
  }else{
	  console.log("second click..");
   var m=media[current];
   switch(m.click)
   {
		case "next": next(); break;
   }
   fullscreen();
  }
 }
 
 function hideOverlay()
 {
  if(hiding_overlay!=-1)
  {
   window.clearTimeout(hiding_overlay);
   hiding_overlay=-1;
  }
  document.getElementById("overlay").style.display="none";
 }


}());