# media-projector
A HTML5 media projector. Utilising the capabilities of HTML5. Images, videos and overlays supported.

## roadmap
if anyone has any suggestions, I'm all ears.
I have no immedeate plans for this project, but I expect to revisit it from time to time, when I need new functionality.
I used to make a lot of these presentations for concept makers and I know what a stunning visual is worth.

## how to use
Create a folder called 'media' and put your stuff in there.
Then open the index.html.
You'll find a small piece of javascript specifying what to display.

```javascript
var media=[
				{src:"zwart.png",time: 0.0, end: "next", click: "next",kind: "image"},
				{src:"marcheren.mp4",end: "next", click: "next",kind: "video"},
				{src:"karateka.jpg",time: 0, click: "next",kind: "image"},
				{src:"vechten-naar-hemel.mp4",end: "next", click: "next",kind: "video"},
				{src:"dames-in-hemel.jpg",time: 0, click: "next",kind: "image"},
				{src:"eindbeeld.png",time: 0, click: "next",kind: "image"}
			   ];
</script>
<script src="js/media-projector.js"></script>
```
So this means the image 'zwart.png' will be displayed indefinitely until the click.
After that Marcheren.mp4 will show until it's either clicked or ended.
Etc..

## commands
You can also put a video end on "loop", which will make it loop forever.
If you need different commands, just tell me.
Also I might do fading and music and translation (internal instructions are now in Dutch)
But for now, this was all I needed. So any suggestions are very welcome.

## USAGE ONLINE.
You CAN use this online, but it's recommended you use it from a USB-stick or just the hard-drive.
This will give you best performance. Loading videos online is sometimes a bit long.

## Testing
It's been tested on the newest browsers, Chrome, Edge, Safari, Firefox.
