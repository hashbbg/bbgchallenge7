define(["Compose", "Logger", "Background", "Random", "Building", "Vector2", "Dino", "Animation", "Particle", "Projectile", "Color", "Rectangle", "Civilian", "Chopper", "Tank"],
	function(Compose, Logger, Background, Random, Building, Vector2, Dino, Animation, Particle, Projectile, Color, Rectangle, Civilian, Chopper, Tank) {
	
	var Game = Compose(function constructor() {
		
		// first time
		this.firstTime = true;

		// width, height
		this.width = 1000;
		this.height = 600;

		// floor height
		this.floorHeight = 25;
		
		// the canvas
		this.canvas = document.createElement('canvas');
		this.canvas.style = "canvas-game";
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		// Load images
		var imagesFileNames=["ground", "buildingBlock1", "buildingBlock2", "buildingBlock3", "buildingBlock4", "buildingBlock5", "buildingBlock6", "buildingTop1", "buildingTop2", "buildingTop3", "buildingTop4", "dinoAnimLegSS", "explosionSS", "BG2", "dino/body", "dino/headClosed", "dino/neckPart", "dino/headOpen",
				"debri1", "debri2", "debri3", "debri4", "debri5", "debri6", "debri7", "debri8", "rocket", "beam"];
		imagesFileNames.push("dino/dinoAnimLegSS");
		imagesFileNames.push("dino/tail");
		imagesFileNames.push("dino/headClosedLaser");
		imagesFileNames.push("dino/headOpenLaser");
		imagesFileNames.push("human/civilianSS");
		imagesFileNames.push("human/heliSS");
		imagesFileNames.push("human/heli2SS");
		imagesFileNames.push("human/tankSS");
		imagesFileNames.push("human/civilian1SS");
		imagesFileNames.push("human/civilian2SS");
		imagesFileNames.push("human/civilian3SS");
		imagesFileNames.push("human/civilian4SS");
		imagesFileNames.push("human/civilian5SS");
		imagesFileNames.push("bloodSausageSS");
		imagesFileNames.push("debris/bloodSausage2SS");
		imagesFileNames.push("dino/beam");
		imagesFileNames.push("human/gore1");
		imagesFileNames.push("human/gore2");
		imagesFileNames.push("human/gore3");
		imagesFileNames.push("human/gore4");
		imagesFileNames.push("human/gore5");
		imagesFileNames.push("human/gore6");
		imagesFileNames.push("human/gore7");
		imagesFileNames.push("human/gore8");
		imagesFileNames.push("human/gore9");
		imagesFileNames.push("splashScreenBegin");
		imagesFileNames.push("splashScreenTutorial");
		imagesFileNames.push("explosionSideWaySS");
		
		this.loadImages(imagesFileNames);

		// Load json data
		var jsonFileNames = ["explosion"];
		jsonFileNames.push("dino/dinoAnimLeg");
		jsonFileNames.push("human/civilianSS");
		jsonFileNames.push("human/heliSS");
		jsonFileNames.push("human/heli2SS");
		jsonFileNames.push("human/tankSS");
		//jsonFileNames.push("human/civilian1SS");
		//jsonFileNames.push("human/civilian2SS");
		//jsonFileNames.push("human/civilian3SS");
		//jsonFileNames.push("human/civilian4SS");
		jsonFileNames.push("bloodSausageSS");
		jsonFileNames.push("debris/bloodSausageSS");
		jsonFileNames.push("debris/bloodSausage2SS");
		jsonFileNames.push("explosionSideWay");

		this.loadJson(jsonFileNames);

		// Launch phase
		this.phase = 2;

		// Generate the buildings
		this.minBuildingSpacing = 135;
		this.maxBuildingSpacing = 220;
		this.generateBuildings(100);

		this.worldPosition = 0;

		// Animations
		this.animations = new Array();
		// Particles
		this.particles = new Array();
		// Projectiles
		this.projectiles = new Array();
		// Actors
		this.actors = new Array();

		// dino
		this.dino = new Dino();

		// objects
		this.civilians = new Array();

		// enemies
		this.enemies = new Array();

		// game over
		this.gameOver = false;

		// enemies heuristics
		this.minEnemies = 5;
		this.maxEnemies = 40;
		this.maxEnemiesTime = 240; 
		this.tankChance = 0.7;
		this.chopperChance = 0.3;

		// keys
		this.keys = {};
		this.keyDown = function(e) {
			if (this.phase != 0) {
				this.phase--;
			}
			var ch = String.fromCharCode(e.keyCode);
			this.keys['key' + e.keyCode] = true;
			if (e.keyCode != 116) e.preventDefault();
		};
		
		this.keyUp = function(e) {
			var ch = String.fromCharCode(e.keyCode);
			this.keys['key' + e.keyCode] = false;
			if (e.keyCode != 116) e.preventDefault();
		};

		this.mouseClick = function(e) {
			if (this.phase != 0) {
				this.phase--;
			}
			var mousePosX = -1;
			var mousePosY = -1;
			if (!e) var e = window.event;
			if (e.pageX || e.pageY) 	{
				mousePosX = e.pageX;
				mousePosY = e.pageY;
			}
			else if (e.clientX || e.clientY) 	{
				mousePosX = e.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
				mousePosY = e.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
			}

			if ((this.mousePosX != -1) && (this.mousePosX != -1)) {
				this.mousePressed = true;
				mousePosX -= this.canvas.offsetLeft;
				mousePosY -= this.canvas.offsetTop;

				this.MousePosition = new Vector2(mousePosX, mousePosY);
			}
		};
		
		document.onkeydown = this.keyDown.bind(this);
		document.onkeyup = this.keyUp.bind(this);
		this.canvas.onmousedown = this.mouseClick.bind(this);
	},
	{
		getImage: function(name) {
			return this.images[name];
		},

		update: function() {

			if (this.gameOver) {
				this.drawGameOver();
				return;
			}

			if (!(this.imagesPending == 0) || !(this.jsonPending == 0)) {
				this.mousePressed = false;
				return;
			}

			// Show splashes if needed
			if (this.phase == 2) {
				var ctx = this.canvas.getContext('2d');
				var image = this.images['splashScreenBegin'];
				ctx.drawImage(image, 0, 0, image.width, image.height);
				return;
			} else if (this.phase == 1) {
				var ctx = this.canvas.getContext('2d');
				var image = this.images['splashScreenTutorial'];
				ctx.drawImage(image, 0, 0, image.width, image.height);
				return;
			}

			if (this.firstTime) {
				this.startTime = new Date().getTime();
				this.dino.init(this);
				this.firstTime = false;
				this.mousePressed = false;
			}

			this.update_dave();
			this.update_karel();

			// Handle mouse events
			this.handleMouseClick();

			// Spawn actors
			this.spawnActors();

			// dead
			if (this.dino.getHealth() <= 0) {
				this.gameOver = true;
				this.gameOverTime = this.getSurviveTime();
				this.tip = Random.getInt(1, 12);
			}
		},

		drawGameOver: function() {
			var ctx = this.canvas.getContext('2d');
			ctx.save();
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, this.width, this.height);
			ctx.fillStyle = "#FF0000";
			ctx.font = "30px Arial";
			ctx.fillText("You died. Survive time: " + this.gameOverTime + "s", 150, this.height/2);
			var pick = this.tip;
			ctx.font = "20px Arial";
			ctx.fillText("Random tip:", 150, this.height/2 + 50);
			if (pick < 4) {
				ctx.fillText("Try to suck less.", 150, this.height/2 + 100);
			}
			else if (pick == 5) {
				ctx.fillText("Civilians will flee destroyed buildings.", 150, this.height/2 + 100);
			}
			else if (pick == 6) {
				ctx.fillText("Moving your dino is tricky but not impossible.", 150, this.height/2 + 100);
			}
			else if (pick == 7) {
				ctx.fillText("Dino's can only lift one foot at a time.", 150, this.height/2 + 100);
			}
			else if (pick == 8) {
				ctx.fillText("Move your dino one leg at a time.", 150, this.height/2 + 100);
			}
			else if (pick == 9) {
				ctx.fillText("Kill choppers with your jaws to take no damage.", 150, this.height/2 + 100);
			}
			else if (pick == 10) {
				ctx.fillText("Eat civilians by snapping your jaws.", 150, this.height/2 + 100);
			}
			else if (pick == 11) {
				ctx.fillText("Kill tanks with your jaws to take no damage.", 150, this.height/2 + 100);
			}
			else if (pick == 12) {
				ctx.fillText("You can headbutt enemies but you will take damage.", 150, this.height/2 + 100);
			}
			ctx.restore();
		},

		isKeyDown: function(c) {
			return this.keys['key' + c.charCodeAt(0)];
		},

		update_karel: function() {

			// update the different keys
			if (this.isKeyDown('E')) this.dino.issueCommand('moveLeg', 0, false);
			else if (this.isKeyDown('R')) this.dino.issueCommand('moveLeg', 0, true);
			else if (this.isKeyDown('T')) this.dino.issueCommand('moveLeg', 1, false);
			else if (this.isKeyDown('Y')) this.dino.issueCommand('moveLeg', 1, true);
			else if (this.isKeyDown('D')) this.dino.issueCommand('moveLeg', 3, false);
			else if (this.isKeyDown('F')) this.dino.issueCommand('moveLeg', 3, true);
			else if (this.isKeyDown('G')) this.dino.issueCommand('moveLeg', 2, false);
			else if (this.isKeyDown('H')) this.dino.issueCommand('moveLeg', 2, true);
			if (this.keys['key37']) this.dino.issueCommand('moveHead', new Vector2(-1, 0));
			if (this.keys['key38']) this.dino.issueCommand('moveHead', new Vector2(0, -1));
			if (this.keys['key39']) this.dino.issueCommand('moveHead', new Vector2(1, 0));
			if (this.keys['key40']) this.dino.issueCommand('moveHead', new Vector2(0, 1));
			if (this.keys['key109']) this.dino.issueCommand('openMouth', true);
			else if (this.keys['key107']) this.dino.issueCommand('openMouth', false);

			// start
			var ctx = this.canvas.getContext('2d');
			ctx.save();
			ctx.translate(-this.worldPosition, 0);

			// draw the dino
			this.dino.update();
			this.dino.draw(ctx);

			// get health
			var health = this.dino.getHealth();

			// draw civilians
			for (var i = 0; i < this.civilians.length; ++i) {
				this.civilians[i].update();
				this.civilians[i].draw(ctx);
			}

			// draw the front legs of the dino
			this.dino.drawFrontLegs(ctx);

			// done
			ctx.restore();

			// draw a health bar in the right color on top of the screen
			ctx.fillStyle = "#000000";
			ctx.fillRect(50, 50, this.width-100, 50);
			var red = new Color(255, 0, 0);
			var green = new Color(0, 255, 0);
			var col = new Color();
			col.interpolate(red, green, health/100);
			ctx.fillStyle = "rgba(" + col.red + "," + col.green + "," + col.blue + ",1.0)";
			var width = health / 100 * (this.width-108);
			ctx.fillRect(54, 54, width, 42);

			// draw laser charge
			var laser = this.dino.neck.getLaserChargePct();
			ctx.fillStyle = "#000000";
			ctx.fillRect(50, 100, this.width-100, 12);
			ctx.fillStyle = "#FF00FF";
			ctx.fillRect(54, 100, (this.width-108) * laser, 8);

			// time survived
			ctx.fillStyle = "#000000";
			var surviveTime = this.getSurviveTime();
			ctx.font = "30px Arial";
			ctx.fillText("Time survived: " + surviveTime + "s", 60, 85);

		},

		getSurviveTime: function() {
			return (new Date().getTime() - this.startTime) / 1000;
		},

        loadImages: function(fileNames) {
        	this.images = new Array();
        	this.imagesPending = fileNames.length;
        	for(var i = 0, length = fileNames.length; fileName = fileNames[i], i < length; i++) {
				require(["image!data/" + fileName + '.png'], this.imageLoaded.bind(this, fileName));
			}
        },

		imageLoaded: function(fileName, img) {
			this.imagesPending--;
			this.images[fileName] = img;
			//Logger.log('image loaded: ' + fileName + ' - ' + img);
		},

		loadJson: function(fileNames) {
			this.json = new Array();
			this.jsonPending = fileNames.length;
			for(var i = 0, length = fileNames.length; fileName = fileNames[i], i < length; i++) {
				//Logger.log(fileName);
				require(["json!data/" + fileName + '.json'], this.jsonLoaded.bind(this, fileName));
			}
		},

		jsonLoaded: function(fileName, json) {
			this.jsonPending--;
			this.json[fileName] = json;
			//Logger.log('json loaded: ' + fileName + ' - ' + json);
		},



		update_dave: function() {
			var ctx = this.canvas.getContext('2d');
			ctx.save();
			ctx.translate(-this.worldPosition, 0);

			// Draw the background
			ctx.drawImage(this.images["BG2"], this.worldPosition - (Math.floor(this.worldPosition / 3) % this.width), 0);
			ctx.drawImage(this.images["BG2"], this.worldPosition - (Math.floor(this.worldPosition / 3) % this.width) + this.width, 0);

			// Draw buildings
			for(var i = 0; i < this.buildings.length; i++) {
				if (!this.buildings[i].isVisible(this.worldPosition)) {
					continue;
				}

				this.buildings[i].draw(ctx, this.worldPosition);
			}	
			// Check for collisions with projectiles
			for(var i = 0; i < this.buildings.length; i++) {
				if (!this.buildings[i].isVisible(this.worldPosition)) {
					continue;
				}

				this.buildings[i].draw(ctx, this.worldPosition);

				var collisionShape = this.buildings[i].getCollisionShape();
				for(var i2 = 0; i2 < this.projectiles.length; i2++) {
					if (this.projectiles[i2].dinoProjectile) {
						if (this.projectiles[i2].getCollisionShape().collidesWith(collisionShape)) {
							this.buildings[i].handleDamage(this.projectiles[i2].getDamage(), this.projectiles[i2].position);
							this.projectiles[i2].handleDamage();
						}
					}
				}
			}

			// Draw the ground
			ctx.drawImage(this.images["ground"], this.worldPosition - (this.worldPosition % this.width), this.height - 50);
			ctx.drawImage(this.images["ground"], this.worldPosition + this.width - (this.worldPosition % this.width), this.height - 50);
			ctx.drawImage(this.images["ground"], this.worldPosition + (this.width * 2) - (this.worldPosition % this.width), this.height - 50);

			// Draw animations
			for(var j = 0; j < this.animations.length; j++) {
				this.animations[j].draw(ctx);
			}

			// Draw particles
			for(var k = 0; k < this.particles.length; k++) {
				this.particles[k].draw(ctx);
			}
			for(var k = 0; k < this.particles.length; k++) {
				this.particles[k].update();
			}

			// Draw projectiles
			for(var l = 0; l < this.projectiles.length; l++) {
				this.projectiles[l].draw(ctx);
			}
			for(var l = 0; l < this.projectiles.length; l++) {
				this.projectiles[l].update();
			}

			// Draw actors
			for(var m = 0; m < this.actors.length; m++) {
				this.actors[m].draw(ctx);
			}
			for(var m = 0; m < this.actors.length; m++) {
				// Check for collisions with projectiles
				var collisionShape = this.actors[m].getCollisionShape();
				for(var m2 = 0; m2 < this.projectiles.length; m2++) {
					if (this.projectiles[m2].dinoProjectile) {
						if (this.projectiles[m2].getCollisionShape().collidesWith(collisionShape)) {
							this.actors[m].handleDamage(this.projectiles[m2].getDamage(), this.projectiles[m2].position);
							this.projectiles[m2].handleDamage();
						}
					}
				}
			}
			for(var m = 0; m < this.actors.length; m++) {
				this.actors[m].update();					
			}

			ctx.restore();
		},



		generateBuildings: function(numBuildings) {
			this.buildings = new Array();
			var position = 2700;
			for(var i = 0; i < numBuildings; i++) {
				position += Random.getInt(this.minBuildingSpacing, this.maxBuildingSpacing);
				this.buildings[i] = new Building(this, position);
			}
		},

		removeBuilding: function(building) {
			var idx = this.buildings.indexOf(building);
			if(idx != -1) {
				this.buildings.splice(idx, 1);
			}
		},

		handleMouseClick: function() {
			if (!this.mousePressed) {
				return;
			}

			this.dino.processClick(this.MousePosition);

			this.mousePressed = false;
		},


		addAnimation: function(animation) {
			this.animations[this.animations.length] = animation;
		},

		stopAnimation: function(animation) {
			var idx = this.animations.indexOf(animation);
			if(idx != -1) {
				this.animations.splice(idx, 1);
			}
		},

		addParticle: function(particle) {
			this.particles[this.particles.length] = particle;
		},

		stopParticle: function(particle) {
			var idx = this.particles.indexOf(particle);
			if(idx != -1) {
				this.particles.splice(idx, 1);
			}
		},

		addProjectile: function(projectile) {
			this.projectiles[this.projectiles.length] = projectile;
		},

		stopProjectile: function(projectile) {
			var idx = this.projectiles.indexOf(projectile);
			if(idx != -1) {
				this.projectiles.splice(idx, 1);
			}
		},

		spawnActors: function() {

			// determine the number of max enemies based on the survive time
			var maxEnemies = this.minEnemies + (this.maxEnemies - this.minEnemies) * (this.getSurviveTime() / this.maxEnemiesTime);
			if (maxEnemies > this.maxEnemies) maxEnemies = this.maxEnemies;

			// generate more enemies
			var nNew = Math.floor(maxEnemies - this.enemies.length);
			if (nNew > 2) nNew = 2;
			if (nNew == 0) return;
			while (--nNew >= 0) {
				var loc = new Vector2(this.worldPosition + this.width + Random.getInt(0, 150), 0);
				//Logger.log(loc);
				var pick = Random.getDouble();
				if (pick <= this.tankChance) {
					var tank = new Tank(this, loc);
					this.enemies.push(tank);
					this.addActor(tank);
				}
				else {
					loc.y = Random.getInt(250, 400);
					var chopper = new Chopper(this, loc);
					this.enemies.push(chopper);
					this.addActor(chopper);
				}
			}
		},

		// TODO only add if list not above max size
		addActor: function(actor) {
			this.actors[this.actors.length] = actor;
		},

		stopActor: function(actor) {
			var idx = this.actors.indexOf(actor);
			if(idx != -1) {
				this.actors.splice(idx, 1);
			}
		},
		
		getCanvas: function() {
			return this.canvas;
		}
	});
	
	return Game;
});