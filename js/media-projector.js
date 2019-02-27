"use strict";
(function () {
/*
 ,-,-,-.         .                                .          
 `,| | |   ,-. ,-| . ,-.    ,-. ,-. ,-. . ,-. ,-. |- ,-. ,-. 
   | ; | . |-' | | | ,-| -- | | |   | | | |-' |   |  | | |   
   '   `-' `-' `-' ' `-^    |-' '   `-' | `-' `-' `' `-' '   
                            |           |                    
                            '          `'             
 By Hjalmar Snoep
 Version: 1.1 
*/

 // start by declaring the variables we need.
 // check if the user has made some variable called media!

 if(typeof(media)==="undefined")
 {
  window.alert("Media Projector couldn't find any media, did you define it, before you loaded media-projector?");
 }
 var current_action=0;
 var current=0;
 var video=document.getElementById("video");
 var image=document.getElementById("image");
 var last_action=Date.now();
 video.style.display="none";
 image.style.display="none";
 document.body.addEventListener("keydown",handleKeys,false);
 video.addEventListener("ended",videoEnded,false);
 video.addEventListener("loadeddata", function() {
   // Video is loaded and can be played
   console.log("video is loaded.");
   video.play();
   current_action=0; // we started a brand new video.
   
}, false);
 document.body.addEventListener("click",click,true);
 var firstclick=false;
 var hiding_overlay=-1;
 loop();
 show();

 function handleKeys(ev)
 {
	 var code=ev.keyCode;
	 var m=media[current];
	if(m.kind=="video")
	{
		 switch(code)
		 {
			 case 39:
				if(ev.type=="keydown")
					video_gotoRelativeAction(+1);
			 break;
			 case 37:
				if(ev.type=="keydown")
					video_gotoRelativeAction(-1);
			 break;
			 case 32:
				console.log("current time: "+video.currentTime);
				if(ev.type=="keydown")
					if(video.paused) video.play();
			 break;
			 default:
				console.log(ev.type+" "+code);
		 }
	}
 }
 function video_gotoRelativeAction(d)
 {
	 var m=media[current];
	 current_action=current_action+d;
	 if(current_action<0) current_action=0;
	 if(current_action>=m.actions.length) current_action=m.actions.length-1;
	 video.currentTime = m.actions[current_action].time; // seeks to right point
	 video.play();
	 
 }
 function fullscreen()
 {

   var mediacontainer=document.getElementById("mediacontainer");
   if (
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
   ) {
   var i = document.getElementById("mediacontainer");
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
 
 }

 function click()
 {
	var sn=document.getElementById("overlay");
	if(sn!=null)
	{
		if(firstclick==false)
		{
			firstclick=true;
			document.body.style.cursor ="none";
			// just go fullscreen if we weren't and remove the overlay;
			// if there IS an overlay, if there isn't there is probably an index..
			sn.style.display="block";
			sn.innerHTML="Klik nogmaals om de presentatie te starten";
			hiding_overlay=setTimeout(hideOverlay,3000);
			fullscreen();
		}
	}else{
		document.body.style.cursor ="none";
		console.log("click");
		var m=media[current];
		if(m.kind=="video")
		{
			if(typeof(m.actions)!="undefined")
			{
				if(video.paused)
				{
					video.play();
					return; // don't do the rest!, video was JUST paused..
				}else
				{
					if(m.actions.length-1==current_action)
					{
						// that was the last one!
						console.log("last action");
					}else
					{	
						video_gotoRelativeAction(1);
						return; // don't do the rest!, video was JUST paused..
					}
				}
			}
		}
		switch(m.click)
		{
			case "next": next(); break;
			default: console.log("not found "+m.click);
		}
		//  this one is ONLY needed when there IS an overlay!
		if(sn!=null)
		{
			fullscreen();
		}
	}
 }
 function checkVideoActions()
 {
	var m=media[current];
	if(typeof(m.actions)!="undefined")
	{
		if(current_action<m.actions.length)
		{
			var stop_at=m.actions[current_action].time;
			var t=video.currentTime;
			if(t>stop_at)
			{
				switch(m.actions[current_action].action)
				{
					case "stop":
						console.log("video paused at: "+stop_at+" seconds");
						video.pause();
						current_action++;
					break;
					case "jump":
						console.log("video paused at: "+stop_at+" seconds");
						video.currentTime=m.actions[current_action].jump_to;
						current_action++;
					break;
					default: 
					 console.log("unknown action type in video"+m.actions[current_action].action);
				}
			}
		}else{
			// we are out of actions to check for..
		}
	}
 }
 function loop()
 {
  var m=media[current];
  if(m.kind=="video")
  {
	 checkVideoActions();
  }
  if(typeof(m.time)!="undefined" && m.time!=0)
  {
   console.log("check the time..");
   // we need to check if it's time for the next thing.
   // we need to check if it's time for the next thing.
   var now=Date.now();
   var dt=now-last_action;
   if(dt>(m.time*1000))
   {
    next();
   }else{
    console.log("not time yet: "+dt);
   }
  }
  window.requestAnimationFrame(loop);
 }
 function next()
 {
  current++;
  if(current>=media.length)
  {
   current=media.length-1;
   console.log("briefly show the how to exit message.");
   var sn=document.getElementById("overlay");
   console.log(sn);
   sn.style.display="block";
   sn.innerHTML="Gebruik ESC-toets om volledig scherm af te sluiten";
    document.body.style.cursor ="default";
   setTimeout(hideOverlay,3000);
  }
  last_action=Date.now();
  show();
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
 function show()
 {
  if(hiding_overlay!=-1)
  {
   hideOverlay(); // do it now..
  }
  var m=media[current];
  console.log("show '"+m.src+"' at "+last_action+"ms");
  if(m.kind=="image")
  {
   image.src="media/"+m.src;
   image.style.display="block";
   setTimeout(hideVideo,100);// nice transition
   video.pause();
  }else
  {
   video.style.display="block";
   setTimeout(hideImage,100); // nice transition
   video.src="media/"+m.src;
   video.load();
  }
 }
 function hideVideo()
 {
  video.style.display="none";
 }
 function hideImage()
 {
  image.style.display="none";
 }
    function videoEnded(e) 
	{
        // What you want to do after the event
  var m=media[current];
  switch(m.end)
  {
   case "next":
    next();
   break;
   case "loop":
    video.seek(0);
   break;
   default:
    video.pause();
    console.log("video end action '"+m.end+"' not known, pausing..");
  }
    }
}());