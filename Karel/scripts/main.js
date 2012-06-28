
require(["Logger", "Loader", "Game", "FPSTimer", "Example"], function callback(Logger, Loader, Game, FPSTimer, Example) {
	
	// draw the log
	var log = document.getElementById("log");
	log.appendChild(Logger.getElement());
	
	// launch the game
	var main = document.getElementById("main");
	var game = new Game();
	main.appendChild(game.getCanvas());
	
	// set up update loop/FPS timer
	var fpsTimer = new FPSTimer(60, function(dt) {
		game.update();
		document.getElementById('fps').innerHTML = "FPS: " + fpsTimer.getFPS();
	});
	fpsTimer.start();
});