function openHTMLinCenter(path) {
	document.getElementById("center").innerHTML =
    '<object type="text/html" data=' + path + ' width=100% height=100%></object>';
}

function openSYT() {
	openHTMLinCenter("websites/searchYT.html");
}

function openOML() {
	openHTMLinCenter("websites/searchWeb.html");
}

function openNC() {
	openHTMLinCenter("websites/acConverter.html");
}

function openSC() {
	openHTMLinCenter("websites/stringConverter.html");
}

function openINC() {
	openHTMLinCenter("incremental/incremental.html");
}

function openFractal() {
	openHTMLinCenter("fractal/fractal.html");
}

function openSnakeGame() {
	openHTMLinCenter("snake/snake.html");
}

// DEBUG
window.onload = function() {
  //openINC();
  openSnakeGame();
};