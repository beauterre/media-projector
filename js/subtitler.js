"use strict";
(function () {
/*
 Subtitler.
 
 By Hjalmar Snoep
 Version: 1.1 
*/

 // start by declaring the variables we need.
 // check if the user has made some variable called media!
var start_time=Date.now();
var next_subtitle=0;
var subtitles_dom=document.getElementById("subtitles");
document.body.style.cursor ="none";

start();

function start()
{
	console.log("start");
	start_time=Date.now();
	 next_subtitle=0;
	document.getElementById("iframeAudio").src=audio.source;
}
// var audio=document.getElementById("audio");
// autostart in chrome works via iframe.. see
//https://stackoverflow.com/questions/50490304/how-to-make-audio-autoplay-on-chrome

// started the audio

image.addEventListener("click",click,true);
clearSubtitles();
loop();
function clearSubtitles()
{
	var languages=subtitles_dom.getElementsByTagName("div");
	for(var i=0;i<languages.length;i++)
	{
		var lang=languages[i].id;
		languages[i].innerHTML="";
	}
}
 function loop()
 {
	if(next_subtitle>=subtitles.length) next_subtitle=-1;
	if(next_subtitle!=-1)
	{		
		 var t=(Date.now()-start_time)/1000;
		 if(t>audio.loop_after) 
		 {	
			console.log("time "+t+" is bigger then "+audio.loop_after);
			start();
		 }
		 if(t>subtitles[next_subtitle].from)
		 {
			 if(subtitles[next_subtitle].showing==true)
			 {
				 // wait until from is reached, then erase!
				 if(t>subtitles[next_subtitle].to)
				 {
					 next_subtitle++;
					 clearSubtitles();
				 }
			 }else{
				 subtitles[next_subtitle].showing=true;
				 // show the next subtitle.
				 var languages=subtitles_dom.getElementsByTagName("div");
				 for(var i=0;i<languages.length;i++)
				 {
					var lang=languages[i].id;
					languages[i].innerHTML=subtitles[next_subtitle][lang];
				 }
			 }
		 }
	}
	window.requestAnimationFrame(loop);
 }

function end()
{
}

 function click()
 {
   console.log("click");
 }

}());