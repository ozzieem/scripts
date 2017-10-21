var creal = -.8
var cimag = .156;
var frame = 0;
var context;
var pallette=[]; //an array that stores the RGB combinations
var xLen;
var yLen;
 
function julia() {
        for( y = 0; y < 200; y++) {
			for( x = 0; x < 200; x++) {
					// div by 4 to keep the fractal centered
					var cx = -2 + x / 50; 
					var cy = -2 + y / 50;
					var i = 0;

					do {
						xt = cx * cx - cy * cy + creal;
						cy = 2 * cx * cy + cimag;
						cx = xt;
						i++;
					} while ( ( cx * cx + cy * cy < 4) && i < 25 );

					context.beginPath();
					context.rect(x * 4, y * 4, 4, 4);
					context.fillStyle = pallette[i];
					context.fill();
			}
		}
        frame += 1;
		console.log(frame);
        creal = -0.8 + 0.6 * Math.sin( frame / (3.14 * 20) );
        cimag = 0.156 + 0.4 * Math.cos( frame / (3.14 * 40) );    
}

function fillPallette() {
	for(x=0;x<9;x++) // this loop populates the color pallette array
	{
		color=(31*x).toString(16); // convert the number to hex
		if(color.length==1) {
			color='0'+color;  // add a zero in front if only one hex digit
		} 
		pallette[x]="#"+color+color+'ff'; // colors 0-8: the Red and Green components change, Blue=FF
		pallette[x+8]='#00ff'+color;      // colors 8-16: the Blue component changes, Red and Green=FF
		pallette[17+x]="#"+color+'0000';  // colors 17-25: the Red component changes, Green and Blue=0
	}
}
 

window.setInterval(function() {
	context = document.getElementById('myCanvas').getContext('2d');
	xLen = context.width;
	yLen = context.height;
	
	julia();
	fillPallette();

}, 10);