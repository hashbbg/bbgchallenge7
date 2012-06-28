define(["Compose", "Vector2", "Rectangle", "Animation", "Random", "Logger", "Particle"], function(Compose, Vector2, Rectangle, Animation, Random, Logger, Particle) {

	var Civilian = Compose(function(x) {
		this.x = x;
		this.panic = false;
		this.walkSpeed = 0.5;
		this.runSpeed = 1.5;
		this.direction = 0; // 0 = left, 1 = right
		this.frame = 0;
		this.frameCounter = 6;
		this.targetX = null;

	},
	{

		init: function(game) {
			this.game = game;
			this.json = this.game.json["human/civilianSS"];
			this.img = this.game.images["human/civilian" + Random.getInt(1, 5) + "SS"];
			this.width = this.img.width/5;
			this.height = this.img.height/3;
		},

		update: function() {


			if (!this.panic) this.x -= this.walkSpeed;

			// look for distance from dino
			if (Math.abs(this.x - this.game.dino.getLoc().x) < 300) this.panic = true;

			// PANIC MODE
			if (this.panic) {
				if (this.targetX == null) {
					this.targetX = Random.getInt(this.x - 150, this.x + 150);
				}
				this.direction = (this.targetX < this.x) ? 0 : 1;
				if (this.direction == 0) {
					this.x -= this.runSpeed;
					if (this.x < this.targetX) this.targetX = null;
				}
				else {
					this.x += this.runSpeed;
					if (this.x > this.targetX) this.targetX = null;
				}
			}
		},

		draw: function(ctx) {

			// walking
			var animationOffset = !this.panic ? this.height : this.height*2;
			var frameOffset = this.frame * this.width;
			//var frameOffset = 0;
			var loc = this.getLoc();

			// move to the right position
			ctx.save();
			ctx.translate(loc.x, loc.y);
			if (this.direction == 1) ctx.scale(-1, 1);
			ctx.translate(-this.width/2, -10);
			ctx.drawImage(this.img, frameOffset, animationOffset, this.width, this.height, 0, 0, this.width, this.height);
			ctx.restore();

			// next frame
			--this.frameCounter;
			if (this.frameCounter == 0) {
				this.frame = (this.frame + 1) % 5;
				this.frameCounter = 5;
			}
		},

		getCollisionShape: function() {
			return new Rectangle(new Vector2(this.getLoc().x, this.getLoc().y - 15), new Vector2(this.x + this.width/2, this.game.height - this.game.floorHeight));
		},

		getDamage: function() {
			return 1;
		},

		getLoc: function() {
			return new Vector2(this.x - this.width/2, this.game.height - (this.game.floorHeight + this.height));
		},

		handleDamage: function(damage) {
			//var animation = new Animation(this.game, "bloodSausageSS",  1.0, this.getLoc());
			//var animation = new Animation(this.game, "bloodSausageSS", 0.1, Random.getInt(0, 360), this.getLoc());
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc().subtract(this.width/2, this.height/2));
			this.game.addAnimation(animation);
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc());
			this.game.addAnimation(animation);
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc());
			this.game.addAnimation(animation);
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc());
			this.game.addAnimation(animation);
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc());
			this.game.addAnimation(animation);
			var animation = new Animation(this.game, "debris/bloodSausage2SS", 1.0, Random.getInt(0, 360), this.getLoc());
			this.game.addAnimation(animation);
			this.game.civilians.splice(this.game.animations.indexOf(this), 1);
			//this.game.stopActor(this);
			
			for (var i = 0; i < 20; ++i) {
				this.generateParticle(this.getLoc().add(new Vector2(Random.getInt(-10, 10), Random.getInt(-10, 10))));
			}
		},

		generateParticle: function(point) {
			var particleVelocity = new Vector2(Random.getInt(1, 5) - 3.5, Random.getInt(1, 7) - 8);
			var particle = new Particle(this.game, "human/gore" + Random.getInt(1, 9), point, Random.getInt(0, 360), 0.50, particleVelocity, 0.025);
			this.game.addParticle(particle);
		}
	})

	return Civilian;
});