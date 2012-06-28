define(["Compose", "Logger", "Vector2", "DinoLeg", "DinoNeck", "Controller", "Rectangle"], function(Compose, Logger, Vector2, DinoLeg, DinoNeck, Controller, Rectangle) {

	var Dino = Compose(Controller, function() {

		// dino canvas and UI fancas
		/*var main = document.getElementById("main");
		this.dinoCanvas = document.createElement('canvas');
		this.dinoCanvas.className = 'canvas-dino';
		main.appendChild(this.dinoCanvas);
		this.healthCanvas = document.createElement('canvas-health');
		main.appendChild(this.healthCanvas);*/


		// loc
		this.loc = new Vector2(2600, 550);

		// body size
		this.bodySize = new Vector2(200, 50);

		// body loc relative to dino loc
		this.bodyLoc = new Vector2(-100, -120);

		// tail location
		this.tailLoc = new Vector2(-210, -60);

		// make the legs
		this.legs = new Array();
		this.legs[0] = new DinoLeg(new Vector2(-85, -55), 1, this, 0, '#AAAA00'); // left back
		this.legs[1] = new DinoLeg(new Vector2(40, -55), -1, this, 1, '#AAAA00'); // right back
		this.legs[2] = new DinoLeg(new Vector2(25, -50), 2, this, 2, '#FFFF00'); // right front
		this.legs[3] = new DinoLeg(new Vector2(-100, -50), -2, this, 3, '#FFFF00'); // left front

		// neck
		this.neck = new DinoNeck(this, new Vector2(80, -80));

		// dino health (in percent)
		this.health = 100;

		// bite damage
		this.biteDamage = 1;
		this.biteHeal = 3;
		this.normalDamage = 10;

		// handle leg command
		this.legCommand = function(idx, forward) {
			if (forward) this.legs[idx].moveForward();
			else this.legs[idx].moveBackward();
		};

		// add controls
		var that = this;
		this.addCommandListener('moveLeg', this.legCommand.bind(this));
		this.addCommandListener('moveHead', this.neck.move.bind(this.neck));
		this.addCommandListener('openMouth', this.neck.openMouth.bind(this.neck));
	},
	{
		init: function(game) {
			this.bodyImg = game.getImage('dino/body');
			this.tailImg = game.getImage('dino/tail');
			this.neck.init(game);
			for (var i = 0; i < this.legs.length; ++i) this.legs[i].init(game);
			this.game = game;
		},

		update: function() {

			// world position
			this.game.worldPosition = this.loc.x - this.game.width/2;

			// update the neck
			this.neck.update();

			// go over all buildings and process collisions
			for (var i = 0; i < this.game.buildings.length; ++i) {
				var obj = this.game.buildings[i];
				if (!obj.isVisible(this.game.worldPosition)) continue;
				this.processCollision(obj, true, false, false);
			}

			// look for a collision
			for (var i = 0; i < this.game.civilians.length; ++i) {
				var civ = this.game.civilians[i];
				this.processCollision(civ, false, true, false);
			}

			// projectiles
			for (var i = 0; i < this.game.projectiles.length; ++i) {
				var obj = this.game.projectiles[i];
				if (!obj.dinoProjectile) this.processCollision(obj, false, false, false);
			}

			// enemies (tanks, choppers)
			for (var i = 0; i < this.game.enemies.length; ++i) {
				var obj = this.game.enemies[i];
				this.processCollision(obj, false, false, true);
			}
		},

		draw: function(ctx) {

			// draw back legs
			for (var i = 0; i < 2; ++i) {
				this.legs[i].draw(ctx);
			}

			ctx.save();
			ctx.translate(this.loc.x, this.loc.y);
			// draw neck
			
			//ctx.fillRect(this.bodyLoc.x, this.bodyLoc.y, this.bodySize.x, this.bodySize.y);
			// draw body
			ctx.drawImage(this.bodyImg, this.bodyLoc.x, this.bodyLoc.y);
			ctx.drawImage(this.tailImg, this.tailLoc.x, this.tailLoc.y);
			this.neck.draw(ctx);
			ctx.restore();
		},

		drawFrontLegs: function(ctx) {
			for (var i = 2; i < this.legs.length; ++i) {
				this.legs[i].draw(ctx);
			}
		},

		getHealth: function() {
			return this.health;
		},

		getRootLoc: function(attachLoc) {
			return new Vector2(this.loc.x + attachLoc.x, this.loc.y + attachLoc.y);
		},

		hasMovingLeg: function() {
			for (var i = 0; i < this.legs.length; ++i) {
				if (this.legs[i].isMoving()) return true;
			}
			return false;
		},

		updateBody: function(bodySpeed) {
			this.loc.x += bodySpeed;
		},

		processCollision: function(obj, blocking, healing, noDamageOnBite) {
			var rect = obj.getCollisionShape();

			// blocking?
			if (blocking) rect.topLeft.y -= 5000;
			if (this.isNormalCollision(rect) && blocking) {
				this.loc.x -= this.legs[0].moveSpeed/4;
				return;
			}

			// look for bite collision - this does extra damage
			if (this.neck.isBiteCollision(rect)) {
				obj.handleDamage(this.biteDamage, this.neck.getHeadLoc());
				if (healing) {
					this.health += this.biteHeal;
					if (this.health > 100) this.health = 100;
				}
				else if (!noDamageOnBite) this.health -= obj.getDamage();
			}

			// normal "impact" collision
			else if (this.isNormalCollision(rect)) {
				if (!blocking) obj.handleDamage(this.normalDamage);
				this.health -= obj.getDamage();
			}

		},

		isNormalCollision: function(rect) {
			if (this.neck.isNormalCollision(rect)) return true;
			var bodyLoc = this.getRootLoc(this.bodyLoc);
			if (this.isInRectangle(rect, {topLeft: new Vector2(40, 32), bottomRight: new Vector2(125, 105)})) return true;
			if (this.isInRectangle(rect, {topLeft: new Vector2(125, 22), bottomRight: new Vector2(168, 92)})) return true;
			if (this.isInRectangle(rect, {topLeft: new Vector2(150, 22), bottomRight: new Vector2(180, 85)})) return true;
			if (this.isInRectangle(rect, {topLeft: new Vector2(180, 22), bottomRight: new Vector2(195, 78)})) return true;
			if (this.isInRectangle(rect, {topLeft: new Vector2(8,58), bottomRight: new Vector2(15, 85)})) return true;
			if (this.isInRectangle(rect, {topLeft: new Vector2(15,49), bottomRight: new Vector2(30, 94)})) return true;
			if (this.isInRectangle(rect, {topLeft: new Vector2(30,40), bottomRight: new Vector2(40, 102)})) return true;
			return false;
		},

		isInRectangle: function(rect1, rect2) {
			return rect1.collidesWith(rect2);
		},

		processClick: function(loc) {
			this.neck.launchLaser(loc.copy());
		},

		getLoc: function() {
			return this.loc;
		}

	});

	return Dino;
});