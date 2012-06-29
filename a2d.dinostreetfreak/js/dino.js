//make b2Vec2 behave like a2d.Position
Box2D.Common.Math.b2Vec2.prototype.__defineGetter__("X", function() { return this.x * 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineGetter__("Y", function() { return this.y * 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineSetter__("X", function(x) { this.x = x / 10; });
Box2D.Common.Math.b2Vec2.prototype.__defineSetter__("Y", function(y) { this.y = y / 10; });

var state = {
	init : function() {},
	clear : function() {},
	run : function() {},
	keyup : function() {},
	keydown : function() {}
};

var states = { current : null,
				set : function(newstate) {
					if(states.current) {
						states.current.clear();
					}
					states.current = newstate;
					states.current.init();
				}
};
function fixedFromCharCode (codePt) {  
    if (codePt > 0xFFFF) {  
        codePt -= 0x10000;  
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 +  (codePt & 0x3FF));  
    }  
    else {  
        return String.fromCharCode(codePt);  
    }  
}  

var icon = {
	home   : fixedFromCharCode(0x2302),
	pause  : fixedFromCharCode(0x2389),
	up     : fixedFromCharCode(0x25b4),
	play   : fixedFromCharCode(0x25b6),
	right  : fixedFromCharCode(0x25b8),
	down   : fixedFromCharCode(0x25be),
	left   : fixedFromCharCode(0x26c2),
	star   : fixedFromCharCode(0x2605),
	heart  : fixedFromCharCode(0xe800),
	attention: fixedFromCharCode(0x26a0),
	mail   : fixedFromCharCode(0x2709),
	help   : fixedFromCharCode(0xe704),
	logout : fixedFromCharCode(0xe741),
	reload : fixedFromCharCode(0xe760),
	road   : fixedFromCharCode(0xe78f),
	equal  : fixedFromCharCode(0xe795),
	list   : fixedFromCharCode(0xe7ad),
	puzzle : fixedFromCharCode(0xe7b6),
	github : fixedFromCharCode(0xf308),
	target : fixedFromCharCode(0x1f3af),
	toplist: fixedFromCharCode(0x1f3c6),
	user   : fixedFromCharCode(0x1f464),
	lamp   : fixedFromCharCode(0x1f4a1),
	volumeoff : fixedFromCharCode(0x1f507),
	volumedown: fixedFromCharCode(0x1f509),
	volumeup  : fixedFromCharCode(0x1f50a)
};

states.intro = {
	init : function() {
		game.intro = new a2d.Tile(a2d.resources.dialog);
		game.intro.position.X = a2d.dimension.Width / 2;
		game.intro.position.Y = a2d.dimension.Height / 2;
		game.intro.push(new a2d.Label("Dinosaur Street Freak", { font : "38px fearless", textAlign: "center", position: new a2d.Position( 0, -220 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("You know what I hate? Taking a 65 million", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -160 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("year nap, only to discover the entire", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -140 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("planet has been infested with pesky", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -120 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("humans when I wake up.", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -100 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("There is only one thing to do:", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -80 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("eat them all!", { font : "48px fearless", textAlign: "center", position: new a2d.Position( 0, 0 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.intro.push(new a2d.Label("press any key to start", { font : "32px fearless", textAlign: "center", position: new a2d.Position( 0, 200 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		a2d.root.push(game.intro);		
	},
	clear : function() {
		a2d.root.remove(a2d.root.indexOf(game.intro));
	},
	run : function() {},
	keyup : function() {
		states.set(states.game);
	},
	keydown : function() {}
};

states.lose = {
	init : function() {
		game.lose = new a2d.Tile(a2d.resources.dialog);
		game.lose.position.X = a2d.dimension.Width / 2;
		game.lose.position.Y = a2d.dimension.Height / 2;
		game.lose.push(new a2d.Label("Oh No!", { font : "38px fearless", textAlign: "center", position: new a2d.Position( 0, -220 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.lose.push(new a2d.Label("Those pesky humans are still", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -160 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.lose.push(new a2d.Label("Everywhere! and what's worse:", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -140 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.lose.push(new a2d.Label("You are now officially extinct!", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -100 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.lose.push(new a2d.Label("press any key to restart", { font : "32px fearless", textAlign: "center", position: new a2d.Position( 0, 200 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		a2d.root.push(game.lose);
	},
	clear : function() {
		a2d.root.remove(a2d.root.indexOf(game.lose));
	},
	run : function() {},
	keyup : function() {
		states.set(states.intro);
	},
	keydown : function() {}
};

states.win = {
	init : function() {
		game.win = new a2d.Tile(a2d.resources.dialog);
		game.win.position.X = a2d.dimension.Width / 2;
		game.win.position.Y = a2d.dimension.Height / 2;
		game.win.push(new a2d.Label("Victory!", { font : "38px fearless", textAlign: "center", position: new a2d.Position( 0, -220 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.win.push(new a2d.Label("Oh joy, the peace, the quiet, I think", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -160 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.win.push(new a2d.Label("I might just take a nap!", { font : "24px fearless", textAlign: "left", position: new a2d.Position( -230, -140 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		game.win.push(new a2d.Label("press any key to restart", { font : "32px fearless", textAlign: "center", position: new a2d.Position( 0, 200 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} }));
		a2d.root.push(game.win);
	},
	clear : function() {
		a2d.root.remove(a2d.root.indexOf(game.win));
	},
	run : function() {},
	keyup : function() {
		states.set(states.intro);
	},
	keydown : function() {}
};

states.game = {
	init: function() {			
		game.humans = 0;
		game.state = "intro";
		game.scene = new a2d.Node();
		game.level = null;		
		// setting up physics stuff
		var fixDef = new Box2D.Dynamics.b2FixtureDef,
			bodyDef = new Box2D.Dynamics.b2BodyDef;
		if(!game.world) {
			game.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 5), true);
		}
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
							game.humans++;
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
			city.tileSize = [1240, 1024];
			city.tileSet = "city";
			city.tiles = [0, 0, 0, 0, 0, 0];
			game.city = new a2d.TileGrid(city);
			city.tileSet = "sky";
			city.tileSize = [1240, 900];
			game.sky = new a2d.TileGrid(city);
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

			game.scene.push(game.sky);
			game.scene.push(game.city);
			game.scene.push(game.level);
			game.player = new game.Player(new a2d.Position(100, 120));			
			game.level.push(game.player);
			a2d.resources.start.play();
			a2d.resources.music.play(true);
			game.lives = new a2d.Label(icon.heart, { font : "48px fontello", textAlign: "left", position: new a2d.Position( 50, 50 ), color: "#FF4444", border: { width: 5, color: "#000000"} });		

			var mute = new a2d.Label(icon.volumeup, { font : "48px fontello", position: new a2d.Position( a2d.dimension.Width - 120, 50 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} });		
			var gh = new a2d.Label(icon.github, { font : "48px fontello", position: new a2d.Position( a2d.dimension.Width - 50, 50 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} });					
			game.humansLabel = new a2d.Label("humans eaten: 0/" + game.humans, { font : "48px fearless", textAlign: "left", position: new a2d.Position( 50, 100 ), color: "#FFFFFF", border: { width: 5, color: "#000000"} });
			gh.on("click", function() {
				window.location = "https://github.com/hashbbg/bbgchallenge7";
			});		
			gh.on("mouseover", function() {
				gh.set({border: { width: 5, color: "#e34500"} });
			});
			gh.on("mouseout", function() {
				gh.set({border: { width: 5, color: "#000000"} });
			});					
			mute.on("mouseover", function() {
				mute.set({border: { width: 5, color: "#e34500"} });
			});
			mute.on("mouseout", function() {
				mute.set({border: { width: 5, color: "#000000"} });
			});			
			mute.on("click", function() {
				a2d.mute = !a2d.mute;
				if(a2d.mute) {
					mute.text = icon.volumeoff;					
					a2d.resources.music.stop();					
				} else {
					mute.text = icon.volumeup;
					a2d.resources.music.play();
				}
				
			});
			//var mute = new a2d.Label('volume mute', { font : "21px fontello", position: new a2d.Position( 100, 100 ), color: "#FFFFFF" });



			game.scene.push(mute);
			game.scene.push(gh);
			game.scene.push(game.lives);
			game.scene.push(game.humansLabel);
			//game.scene.push(game.intro);
			a2d.root.push(game.scene);
			game.updateLives();
		})
	},
	keydown : function(keyCode) {
		switch(keyCode) {
			case a2d.key.ARROW_LEFT:
				game.player.left = true;
			break;
			case a2d.key.ARROW_RIGHT:
				game.player.right = true;
			break
			case a2d.key.SPACE:
				game.player.jump();
			break;
		}
	},
	keyup : function(keyCode) {
		switch(keyCode) {
			case a2d.key.ARROW_LEFT:
				game.player.left = false;
			break;
			case a2d.key.ARROW_RIGHT:
				game.player.right = false;
			break
		}
	},	
	clear : function () {
		a2d.root.remove(a2d.root.indexOf(game.scene));
		game.scene.length = 0;
		var bodies = game.world.GetBodyList();
		while(bodies) {
			var n = bodies.GetNext();
			game.world.DestroyBody(bodies);
			bodies = n;
		}
	},	
	run : function() {
	 	if(game.world && game.level) {
			game.world.Step(0.12, 10, 10);
			game.world.ClearForces();
			if(game.player) {
				var p = game.player.position.clone(),
					parallax;
				p.X -= a2d.dimension.Width / 2;
				p.Y -= a2d.dimension.Height / 2;
				p.scale(new a2d.Position(-1, -1));
				if(p.X > 0) {
					p.X = 0;
				}
				if(p.X < -game.level.getWidth() * 64 + a2d.dimension.Width) {
					p.X = -game.level.getWidth() * 64 + a2d.dimension.Width;
				}
				game.level.offset = p;
				parallax = p.clone();
				parallax.divide(new a2d.Position(2, 2));
				game.city.offset = parallax;
				parallax2 = parallax.clone();
				parallax2.divide(new a2d.Position(2, 2));
				game.sky.offset = parallax2;
				if(game.humans === 0) {
					states.set(states.win);
				}
				if(game.player.lives === 0) {					
					states.set(states.lose);
				}
			}			
		}
	}
};
var game = {

	updateLives: function() {
		game.lives.text = "";
		for(var i = 0; i < game.player.lives; i++) {
			game.lives.text += icon.heart + " ";
		}
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
	graphics : "Arme138",
	physics : "Box2D",
	background : "HyperFoxX (http://hyperfoxx.deviantart.com/art/City-Background-139773996)",
	music : "Beat One by Kevin MacLeod (http://freepd.com/Unclassified%20Electronic/Beat%20One)",
	font : "Jakob Fischer / pizzadude.dk"
};

window.onload = function() {
	a2d.forceClear = true;
	a2d.on("load", function() {
		//game.init();
		states.set(states.intro);
	});

	document.addEventListener("touchstart", function(e) {
		var touch = e.touches[0];
		if(states.current && states.current.keydown) {
			if(touch.pageX > a2d.dimension.Width / 2) {
				states.current.keydown(a2d.key.ARROW_RIGHT);
			} else {
				states.current.keydown(a2d.key.ARROW_LEFT);
			}
			game.touchy = touch.pageY;
		}
	});

	document.addEventListener("touchend", function(e) {
		var touch = e.touches[0];
		if(states.current && states.current.keydown) {
			if(touch.pageX > a2d.dimension.Width / 2) {
				states.current.keyup(a2d.key.ARROW_RIGHT);
			} else {
				states.current.keyup(a2d.key.ARROW_LEFT);
			}
			if(touchy < touch.pageY - 30) {
				states.current.keyup(a2d.key.SPACE);
			}
		}
	});

	document.addEventListener("keydown", function(e) {
		if(states.current) {
			states.current.keydown(e.keyCode);
		}
	});
	document.addEventListener("keyup", function(e) {
		if(states.current) {
			states.current.keyup(e.keyCode);
		}
	});	
	a2d.on("draw", function() {
		if(states.current && states.current.run) {
			states.current.run();
		}
	});
	var loading = new a2d.Label("loading...", { font : "72px fearless", position: new a2d.Position( a2d.dimension.Width / 2, a2d.dimension.Height / 2), color: "#FFFFFF", border: { width: 5, color: "#000000"} });
    a2d.on("progress", function(progress) {
    	var pct = (100.0 / progress.total) * progress.loaded;
    	loading.text = "loading ["  +  parseInt(pct, 10) + "%]";
    });
    a2d.on("load", function() {
    	a2d.root.remove(a2d.root.indexOf(loading));
    });
	a2d.root.push(loading);
	a2d.load({	"dino" : "images/dinosaur.png",
				"tiles": "images/tiles.png",
				"meat" : "images/meat.png",
				"city" : "images/city.png",
				"sky"  : "images/sky.png",
				"grenade" : "images/grenade.png",
				"explosion" : "images/explosion.png",
				"dialog" : "images/intro.png",
				"explode" : "audio/Explosion13.ogg",
				"blip" : "audio/Blip_Select.ogg",
				"start": "audio/Randomize.ogg",
				"coin" : "audio/Pickup_Coin.ogg",
				"jump" : "audio/Jump5.ogg",
				"shoot" : "audio/Laser_Shoot12.ogg",				
				"music": "audio/beat_one.ogg" });
}
