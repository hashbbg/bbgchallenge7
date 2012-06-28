define(["Compose", "Logger", "Background", "Random", "Vector2", "Animation", "Particle", "Projectile", "Rectangle", "Civilian"],
	function(Compose, Logger, Background, Random, Vector2, Animation, Particle, Projectile, Rectangle, Civilian) {
	
	var Building = Compose(function constructor(game, position) {
		this.game = game;
		this.position = position;

		this.maxHeight = 8;
		this.numTopTypes = 4;
		this.numBlockTypes = 6;
		this.buildBlockHeight = 60;
		this.buildBlockWidth = 100;

		// Generate building blocks
		this.numBlocks = Random.getInt(1, this.maxHeight);
		this.buildingBlocks = new Array();
		this.buildingBlocksFlipped = new Array();
		for(var i = 0; i < this.numBlocks; i++) {
			this.buildingBlocks[i] = ["buildingBlock" + Random.getInt(1, this.numBlockTypes)];
			this.buildingBlocksFlipped[i] = Random.getInt(0, 1);
		}

		// Generate top
		this.buildingTop = ["buildingTop" + Random.getInt(1, this.numTopTypes)];
		this.buildingTopFlipped = Random.getInt(0, 1);

		this.hitPoints = 20 + (this.buildingBlocks.length * 10);
		this.destroyed = false;
	},
	{

		draw: function(ctx, cameraPosition) {
			if (this.destroyed) return;
			if (((this.position - cameraPosition) < (-this.buildBlockWidth))
				|| ((this.position - cameraPosition) > (this.game.width))) return;

			ctx.save();
			ctx.translate(this.position, this.game.height - this.game.floorHeight);
			for(var i = 0; i < this.buildingBlocks.length; i++) {
				this.drawBlock(ctx, this.game.images[this.buildingBlocks[i]], this.buildingBlocksFlipped[i], 0, - (this.buildBlockHeight * (i + 1)));				
			}

			this.drawBlock(ctx, this.game.images[this.buildingTop], this.buildingTopFlipped, 0, - (this.buildBlockHeight * (i + 1)));

			ctx.restore();
		},

		drawBlock: function(ctx, img, inverted, width, height) {
			if (inverted == 0) {
				ctx.save();
				ctx.scale(-1, 1);
				ctx.translate(-this.buildBlockWidth, 0)
				ctx.drawImage(img, width, height);
				ctx.restore();
			} else {
				ctx.drawImage(img, width, height); // TODO fix
			}
		},

		isVisible: function(cameraPosition) {
			if (((this.position + this.buildBlockWidth) < cameraPosition) || (this.position > (cameraPosition + this.game.width))) {
				return false;
			}

			return true;
		},

		getCollisionShape: function() {
			return new Rectangle(
				new Vector2(this.position, this.game.height - ((this.buildingBlocks.length +  2) * this.buildBlockHeight)),
				new Vector2(this.position + this.buildBlockWidth, this.game.height - this.game.floorHeight)
			);
		},

		getDamage: function() {
			return 0;
		},

		handleDamage: function(damage, point) {
			if (this.destroyed) return;

			if (Math.abs(point.x - this.position) > Math.abs(point.x - (this.position + this.buildBlockWidth))) {
				var explosionPosition = new Vector2(this.position + this.buildBlockWidth, point.y + 35);
				var animation = new Animation(this.game, "explosionSideWay", 1.0, 180, explosionPosition);
				this.game.addAnimation(animation);
			} else {
				var explosionPosition = new Vector2(this.position, point.y + 35);
				var animation = new Animation(this.game, "explosionSideWay", 1.0, 0, explosionPosition);
				this.game.addAnimation(animation);
			}

			this.generateParticle(point);
			this.generateParticle(point);
			this.generateParticle(point);

			this.hitPoints -= damage;
			if (this.hitPoints < 0) {
				this.destroyed = true;

				for(var i = 0; i < (this.buildingBlocks.length + 1); i++) {

					var minX = this.position;
					var maxX = this.position + this.buildBlockWidth + 25;
					var minY = this.game.height - this.game.floorHeight - (i * this.buildBlockHeight + 1) + 20;
					var maxY = this.game.height - this.game.floorHeight - (i * this.buildBlockHeight) - 20;
					
					explosionPosition1 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition2 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition3 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition4 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition5 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					explosionPosition6 = new Vector2(Random.getInt(minX, maxX), Random.getInt(minY, maxY));
					var animation1 = new Animation(this.game, "explosion", 0.8, Random.getInt(0, 360), explosionPosition1);
					var animation2 = new Animation(this.game, "explosion", 0.6, Random.getInt(0, 360), explosionPosition2);
					var animation3 = new Animation(this.game, "explosion", 0.4, Random.getInt(0, 360), explosionPosition3);
					var animation4 = new Animation(this.game, "explosion", 0.3, Random.getInt(0, 360), explosionPosition4);
					var animation5 = new Animation(this.game, "explosion", 0.2, Random.getInt(0, 360), explosionPosition5);
					var animation6 = new Animation(this.game, "explosion", 0.1, Random.getInt(0, 360), explosionPosition6);
					this.game.addAnimation(animation1);
					this.game.addAnimation(animation2);
					this.game.addAnimation(animation3);
					this.game.addAnimation(animation4);
					this.game.addAnimation(animation5);
					this.game.addAnimation(animation6);

					this.generateParticle(explosionPosition1);
					this.generateParticle(explosionPosition2);
					this.generateParticle(explosionPosition3);
					this.generateParticle(explosionPosition4);
					this.generateParticle(explosionPosition5);
					this.generateParticle(explosionPosition6);
					this.generateParticle(explosionPosition1);
					this.generateParticle(explosionPosition2);
					this.generateParticle(explosionPosition3);
					this.generateParticle(explosionPosition4);
					this.generateParticle(explosionPosition5);
					this.generateParticle(explosionPosition6);
				}

				this.game.removeBuilding(this);


				// spawn random civilians
				for (var i = 0; i < 10; ++i) {
					var civ = new Civilian(Random.getInt(this.position - this.buildBlockWidth/2, this.position + this.buildBlockWidth/2));
					civ.init(this.game);
					//this.game.addActor(civ);
					this.game.civilians.push(civ);
				}
			}
		},

		generateParticle: function(point) {
			var particleVelocity = new Vector2(Random.getInt(1, 5) - 3.5, Random.getInt(1, 7) - 5);
			var particle = new Particle(this.game, ["debri" + Random.getInt(1, 8)], point, Random.getInt(0, 360), 0.50, particleVelocity, 0.025);
			this.game.addParticle(particle);
		}
	});
	
	return Building;
});