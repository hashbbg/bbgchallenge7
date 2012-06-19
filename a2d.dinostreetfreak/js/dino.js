var game = {
	init: function() {	
		game.get("data/level.dst?" + Math.random(), function(data) {
			var lines = data.split("\n");
			var level = {};
			level.gridSize = [lines[lines.length -1].length, lines.length];
			level.tileSize = [64, 64];
			level.tileSet = "tiles";
			level.tiles = [];
			for(var x = 0; x < level.gridSize[0]; x++) {
				for(var y = 0; y < level.gridSize[1]; y++) {
					console.log(lines[y][x]);
					if(lines[y].length > x) {
						level.tiles.push(lines[y][x] === "-" ? 0 : -1);	
					} else {
						level.tiles.push(-1);
					}					
				}
			}
			for(var x = 0; x < level.gridSize[0]; x++) {
				for(var y = 0; y < level.gridSize[1]; y++) {
					level.tiles.push(-1);
				}
			}
			game.level = new a2d.TileGrid(level);
			a2d.root.push(game.level);
			a2d.root.push(new a2d.Tile(a2d.resources["dino"], {position: new a2d.Position(100, 100)}));
			console.log(game.level.getTiles());
		})
	},
	get: function(datafile, cb) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", datafile);
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4) {
				cb(xhr.responseText);
			}
		};
		xhr.send(null);
	}
};

window.onload = function() {
	a2d.forceClear = true;
	a2d.on("load", function() {
		game.init();
	});
	a2d.load({	"dino" : "images/dinosaur.png",
				"tiles": "images/tiles.png" });
}
