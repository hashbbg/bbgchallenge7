//make b2Vec2 behave like a2d.Position
Box2D.Common.Math.b2Vec2.prototype.__defineGetter__("X", function() { return this.x * 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineGetter__("Y", function() { return this.y * 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineSetter__("X", function(x) { this.x = x / 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineSetter__("Y", function(y) { this.y = y / 10; });

var game = {
	init: function() {	
		// setting up physics stuff
		var fixDef = new Box2D.Dynamics.b2FixtureDef,
			bodyDef = new Box2D.Dynamics.b2BodyDef;
		game.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 10), true);
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;

		//loading level data
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

			//create physics boxes for each tile in grid
			var tiles = game.level.getTiles(),
				pos = new Box2D.Common.Math.b2Vec2(0, 0);
			for(var x = 0; x < level.gridSize[0]; x++) {
				for(var y = 0; y < level.gridSize[1]; y++) {
					if(tiles[x][y].tile !== -1) {
						console.log(tiles[x][y]);
						pos.X = tiles[x][y].position.X;
						pos.Y = tiles[x][y].position.Y;
						bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
						fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
						fixDef.shape.SetAsBox(3.2, 3.2);
						bodyDef.position.Set(pos.x, pos.y);
						game.world.CreateBody(bodyDef).CreateFixture(fixDef);				
					}
				}
			}
			a2d.root.push(game.level);
			game.player = new game.Player(new a2d.Position(100, 120));
			game.level.push(game.player);
			console.log(game.level.getTiles());
		})

		document.addEventListener("keydown", function() {
			//game.player.right = true;
			game.player.right();
		});

		document.addEventListener("keyup", function() {
			//game.player.right = false;
			//game.player.stop();
		});		
		/*a2d.canvas.addEventListener("click", function(e) {
		game.level.push(new game.Player(new a2d.Position(e.clientX, e.clientY)));
		})*/
		
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

	a2d.on("draw", function() {
		if(game.world) {
			game.world.Step(1/60, 10, 10);
		}
	});

	a2d.load({	"dino" : "images/dinosaur.png",
				"tiles": "images/tiles.png" });
}
