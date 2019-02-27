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
 Version: 1.2
*/

 // start by declaring the variables we need.
 // get the media from the sections
 var media_data=[];
 var current=0;
 var current_action=0;
 var next_subtitle;
 var last_action=-1;
 var video=null;
 var img=null;
 var audio=null;
 var audio_source=null;
 var subs=null;
 var overlay=document.getElementById("overlay");
 var loopFunction=null;
 loop();
var media=document.getElementsByTagName("section");
if(media.length==0)
 {
  window.alert("Media Projector couldn't find any sections, did you define any sections in html?");
 }else
 {
	prepareMedia();
 }
 document.body.addEventListener("pointerdown",firstClick,true);
  // get stuff from the right section!
 var hiding_overlay=-1; // interval for hiding the overlay.

function loop()
{
	if(loopFunction!=null)
	{
		loopFunction();
	}
	window.requestAnimationFrame(loop);
}
function prepareMedia()
{
	for(var i=0;i<media.length;i++)
	{
		var json=media[i].getElementsByTagName("json")[0].innerText;
		console.log("reading section "+media[i].id);
		//console.log(json);
		media_data[i]=JSON.parse(json);
		media_data[i].dom={};
		media_data[i].dom.video=document.createElement("video");
		media_data[i].dom.video.className="video";
		if(typeof(media_data[i].sourceVideo)!="undefined")
		{
			media_data[i].dom.video.src="media/"+media_data[i].sourceVideo;
		}else
		{
			media_data[i].dom.video.src="media/black.mp4";
		}
		media_data[i].dom.img=document.createElement("img");
		if(typeof(media_data[i].sourceImage)!="undefined")
		{
			media_data[i].dom.img.src="media/"+media_data[i].sourceImage;
		}else
		{
			media_data[i].dom.img.src="media/black.png";
		}
		media_data[i].dom.img.className="image";
		media_data[i].dom.audio=document.createElement("audio");
		media_data[i].dom.audio.className="audio";
		media_data[i].dom.audio_source=document.createElement("source");
		if(typeof(media_data[i].sourceAudio)!="undefined")
		{
			media_data[i].dom.audio_source.src="media/"+media_data[i].sourceAudio;
		}else
		{
			media_data[i].dom.audio_source.src="media/silence.wav";
		}
		media_data[i].dom.audio.appendChild(media_data[i].dom.audio_source);
		media_data[i].dom.audio.pause(); // NO auto start of ANY audio?
		media_data[i].dom.subs=document.createElement("div");
		media_data[i].dom.subs.className="subtitles";
		media[i].innerHTML= '';
		media[i].appendChild(media_data[i].dom.video);
		media[i].appendChild(media_data[i].dom.img);
		media[i].appendChild(media_data[i].dom.audio);
		media[i].appendChild(media_data[i].dom.subs);
		// create all subtitles as divs.
		if(media_data[i].subtitles.length!=0)
		{
			for(var all in media_data[i].subtitles[0])
			{
				if(all!="from" && all!="to")
				{
					var sub=document.createElement("div");
					sub.className=all;
					media_data[i].dom.subs.appendChild(sub);
					console.log("creating subtitles for: "+all);
				}
			}				
		}
		media[i].style.display="none";
	}
}
// subtitler subsection :)_

function clearSubtitles()
{
	var languages=subs.getElementsByTagName("div");
	for(var i=0;i<languages.length;i++)
	{
		languages[i].innerHTML="";
	}
}
function searchSubtitles()
{
	var m=media_data[current];
	 for(var i=0;i<m.subtitles.length;i++)
	 {
		m.subtitles[i].show=false;
	 }
	clearSubtitles();
	 next_subtitle=0; // he'll find the right one soon enough!
}


function audioWithSubtitlesLoop()
{
	var t=audio.currentTime;
	var d=audio.duration

	var subtitle_data=media_data[current].subtitles;
//	console.log(t+"/"+d+"next_subtitle: "+next_subtitle);

	if(next_subtitle>=subtitle_data.length) next_subtitle=-1;
	if(next_subtitle!=-1)
	{		
		 if(t>subtitle_data[next_subtitle].from)
		 {
			 if(subtitle_data[next_subtitle].showing==true)
			 {
				 // wait until from is reached, then erase!
				 if(t>subtitle_data[next_subtitle].to)
				 {
					 subtitle_data[next_subtitle].showing=false;
					 next_subtitle++;
					 clearSubtitles();
				 }
			 }else{
				 subtitle_data[next_subtitle].showing=true;
				 // show the next subtitle.
				 var languages=subs.getElementsByTagName("div");
				 for(var i=0;i<languages.length;i++)
				 {
					var lang=languages[i].className;
					console.log(JSON.stringify(subtitle_data[next_subtitle]));
					languages[i].innerHTML=subtitle_data[next_subtitle][lang];
				 }
			 }
		 }
	}
	//console.log(t+"/"+d);
	if(t>=d)
	{
		sectionEnd();
	}
}


// current leading media in section has ended.
function sectionEnd()
{
	var end_action=media_data[current].end;
	console.log("section End Action: "+end_action);
	switch(end_action)
	{
		case "next":
			arrowDown();
		break;
		case "loop":
			startSection();
		break;
		default:
			console.log("unknown section End Action: "+end_action);
	}
}
function endSection()
{
	switch(media_data[current].kind)
	{
		case "audio-with-subtitles":
			clearSubtitles();
			next_subtitle=0;
			audio.currentTime=0;
			audio.pause();
		break;
		case "video":
		case "video-with-actions":
			video.pause();
		break;
		case "pause":
			// don't need to do a thing!
		break;
		default: console.log("don't know how to end a section of kind: "+media_data[current].kind);
	}
	// also end any loops !
	loopFunction=null;
}
function startSection()
{
  // show the current section.
  for(var i=0;i<media.length;i++)
  {
	  if(i!=current)
	  {
			media[i].style.display="none";
//			media_data[i].dom.video.removeEventListener("ended",videoEnded,false);
	  }else
	  {
			video=media_data[current].dom.video;
			audio=media_data[current].dom.audio;
			if(typeof(media_data[current].volume)!="undefined")
			{
				var vol_fract=parseInt(media_data[current].volume)/100;
				console.log("setting volume to "+vol_fract+" for section "+media[current].id);
				video.volume=vol_fract;
				audio.volume=vol_fract;
			}

			audio_source=media_data[current].dom.audio_source;
			img=media_data[current].dom.img
			subs=media_data[current].dom.subs
			//  video.pause();
			 // audio.pause();
			media[i].style.display="block";
//			media_data[i].dom.video.addEventListener("ended",videoEnded,false);
			switch(media_data[i].kind)
			{
				case "audio-with-subtitles":
					next_subtitle=0;
					img.style.display="block"; // show the image
					video.style.display="none"; // don't show the video
					audio.currentTime=0;
					audio.play();
					loopFunction=audioWithSubtitlesLoop;

				break;
				case "video-with-actions":
					current_action=0;
					img.style.display="none"; // dont' show the image
					subs.style.display="none"; // don't show the subs
					video.style.display="block"; // show the video
					video.currentTime=0;
					video.play();
					loopFunction=videoWithActionsLoop;

				break;
				case "pause":
					img.style.display="block"; // show the image
					video.style.display="none"; // don't show the video
				break;
				case "video":
					img.style.display="none"; // dont' show the image
					subs.style.display="none"; // don't show the subs
					video.style.display="block"; // show the video
					video.currentTime=0;
					video.play();
					loopFunction=videoLoop;
				break;
				default: console.log("don't know how to start a section of kind "+media_data[i].kind);
			}
	  }
  }
  last_action=Date.now();
} 
// USER KEY CONTROLS
function arrowRight()
{
	switch(media_data[current].kind)
	{
		case "audio-with-subtitles":
			audio.currentTime=audio.currentTime+10; // easy for testing loops
			searchSubtitles();
		break;
		case "video-with-actions":
		case "video":
			video.currentTime=video.currentTime+10; // easy for testing loops
			if(media_data[current].kind=="video-with-actions")
			{
				// we need to set the current action as the one closest after the currentTime.
				searchVideoActions();
			}			
		break;
		default:
			console.log("no function defined for arrowRight for kind: "+media_data[current].kind);
	}
}
function arrowLeft()
{
	switch(media_data[current].kind)
	{
		case "audio-with-subtitles":
			audio.currentTime=audio.currentTime-10; // easy for testing loops
			searchSubtitles();
		break;
		case "video-with-actions":
		case "video":
			video.currentTime=video.currentTime-10; // easy for testing loops
			if(media_data[current].kind=="video-with-actions")
			{
				// we need to set the current action as the one closest after the currentTime.
				searchVideoActions();
			}
		break;
		default:
			console.log("no function defined for arrowLeft for kind: "+media_data[current].kind);
	}
}
function arrowDown()
{
	endSection(); // stop video and or audio
	current++;
	if(current>media.length-1)
	{
		current=media.length-1;
	}
	startSection();
}
function arrowUp()
{
	endSection(); // stop video and or audio
	current--;
	if(current<0) current=0;
	startSection();
}
function space()
{
	if(media_data[current].end=="loop")
	{
		// then in ALL cases this just means, get on with it.
		arrowDown();
		return;		
	}
	switch(media_data[current].kind)
	{
		case "pause":
			arrowDown();
		break;
		case "video":
		case "video-with-actions":
			if(video.paused)
			{	
				console.log("resumed playing video.");
				video.play();
			}
			else 
			{
				console.log("user paused video at: "+video.currentTime);
				video.pause();
			}
		break;
		default:
			console.log("no function defined for space for kind: "+media_data[current].kind);
	}
}
 function handleKeys(ev)
 {
	if(ev.type=="keydown")
	{
		var code=ev.keyCode;
		 switch(code)
		 {
			case 39:
				arrowRight();
			break;
			case 37:
				arrowLeft();
			 break;
			case 38:
				arrowUp();
			break;
			case 40:
				arrowDown();
			 break;
			 case 32:
				space();
			 break;
			 default:
				console.log(ev.type+" "+code);
		 }
	}
 }
// VIDEO ACTIONS
 function next()
 {
 }
 function videoaction_Jump(d)
 {
	 var m=media[current];
	 current_action=current_action+d;
	 if(current_action<0) current_action=0;
	 if(current_action>=m.actions.length) current_action=m.actions.length-1;
	 video.currentTime = m.actions[current_action].time; // seeks to right point
	 video.play();
 }
 function searchVideoActions()
 {
	var m=media_data[current];
	 for(var i=0;i<m.actions.length;i++)
	 {
		 if(m.actions.time>video.currentTime)
		 {
			 current_action=i;
			 console.log("found next action: "+JSON.stringify(m.actions[current_action]));
			 break;
			 return; // quit the function the moment you find the first NEXT action.
		 }
	 }
 }
 function videoWithActionsLoop()
 {
	var m=media_data[current];
	if(typeof(m.actions)!="undefined")
	{
		if(current_action<m.actions.length)
		{
			var action_trigger_time=m.actions[current_action].time;
			var t=video.currentTime;
			if(t>action_trigger_time)
			{
				switch(m.actions[current_action].action)
				{
					case "stop":
						console.log("video paused at: "+action_trigger_time+" seconds");
						video.pause();
						current_action++;
					break;
					case "jump":
						console.log("video jumped at: "+action_trigger_time+" seconds to "+m.actions[current_action].jump_to);
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
	videoLoop();
 }
 function videoLoop()
 {
	if(video.currentTime>=video.duration)
	{
		sectionEnd();
	}
 }
// MEDIA PERMISSIONS
 function fullscreen()
 {
   var mediacontainer=document.getElementById("mediacontainer");
   console.log("mediacontainer: "+mediacontainer);
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
 function firstClick()
 {
	document.body.removeEventListener("pointerdown",firstClick,true);
	
	// control presentation with keys! 
	document.body.addEventListener("keydown",handleKeys,true);

	document.body.style.cursor ="none";
	var sn=document.getElementById("overlay");
	sn.style.display="none";
	hiding_overlay=setTimeout(hideOverlay,3000);
	fullscreen();
	// just go fullscreen if we weren't and remove the overlay;
	// play a first sections sound and video, just to get the permissions.
	media_data[0].dom.audio.play();
	media_data[0].dom.video.play();
	setTimeout(startSection,1000); // starts the presentation
 }
 // show hide stuff.
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
 function hideOverlay()
 {
  if(hiding_overlay!=-1)
  {
   window.clearTimeout(hiding_overlay);
   hiding_overlay=-1;
  }
  document.getElementById("overlay").style.display="none";
 }
 function hideVideo()
 {
  video.style.display="none";
 }
 function hideImage()
 {
  img.style.display="none";
 }
}());