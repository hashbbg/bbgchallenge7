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
			var level = {}, city = {};
			level.gridSize = [lines[lines.length -1].length, lines.length];
			level.tileSize = [64, 64];
			level.tileSet = "tiles";
			level.tiles = [];
			game.level = new a2d.TileGrid();
			for(var x = 0; x < level.gridSize[0]; x++) {
				for(var y = 0; y < level.gridSize[1]; y++) {
					//console.log(lines[y][x]);
					if(lines[y].length > x) {
						level.tiles.push(lines[y][x] === "-" ? 0 : -1);
						if(lines[y][x] === 'h') {
							//level.tiles[level.tiles.length -1].meat = true;							
							game.level.push(new game.Meat(new a2d.Position(x * 64 + parseInt(64 / 2, 10), y * 64 + parseInt(64 / 2, 10))));
						}						
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
			game.level.setData(level);

			city.gridSize = [6, 1];
			city.tileSize = [1240, 768];
			city.tileSet = "city";
			city.tiles = [0, 0, 0, 0, 0, 0];
			game.city = new a2d.TileGrid(city);
			//create physics boxes for each tile in grid
			var tiles = game.level.getTiles(),
				pos = new Box2D.Common.Math.b2Vec2(0, 0);
			for(var x = 0; x < level.gridSize[0]; x++) {
				for(var y = 0; y < level.gridSize[1]; y++) {
					if(tiles[x][y].tile !== -1) {
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
			a2d.root.push(game.city);
			a2d.root.push(game.level);
			game.player = new game.Player(new a2d.Position(100, 120));			
			game.level.push(game.player);
			a2d.resources.start.play();
		})

		document.addEventListener("keydown", function(e) {
			//game.player.right = true;
			switch(e.keyCode) {
				case a2d.key.ARROW_LEFT:
					game.player.left();
				break;
				case a2d.key.ARROW_RIGHT:
					game.player.right();
				break
				case a2d.key.SPACE:
					game.player.jump();
				break;
			}						
		});

		document.addEventListener("keyup", function() {			
			game.player.stop();
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

game.credits = {
	game : "12 hour BBG Challenge #7",
	title : "Dinosaur Street Freak",
	dev : "Armen138",
	background : "HyperFoxX (http://hyperfoxx.deviantart.com/art/City-Background-139773996)"
};

window.onload = function() {
	a2d.forceClear = true;
	a2d.on("load", function() {
		game.init();
	});

	a2d.on("draw", function() {
		if(game.world) {
			game.world.Step(0.12, 10, 10);
			if(game.player) {
				var p = game.player.position.clone(),
					parallax;
				p.X -= a2d.dimension.Width / 2;
				p.Y -= a2d.dimension.Height / 2;
				p.scale(new a2d.Position(-1, -1));				
				game.level.offset = p;
				parallax = p.clone();
				parallax.divide(new a2d.Position(2, 2));
				game.city.offset = parallax;
			}			
		}
	});

	a2d.load({	"dino" : "images/dinosaur.png",
				"tiles": "images/tiles.png",
				"meat" : "images/meat.png",
				"city" : "images/bg.jpg",
				"blip" : "audio/Blip_Select.wav",
				"start": "audio/Randomize.wav",
				"coin" : "audio/Pickup_Coin.wav",
				"jump" : "audio/Jump5.wav" });
}
