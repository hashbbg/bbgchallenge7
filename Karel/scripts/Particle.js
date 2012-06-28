define(["Compose", "Logger", "Background", "Random", "Vector2"], function(Compose, Logger, Background, Random, Vector2) {

	var Particle = Compose(function constructor(game, imageName, point, rotation, scale, velocity, angularVelocity) {
		this.game = game;
		this.image = this.game.images[imageName];

		this.width = this.image.width;
		this.height = this.image.height;

		this.position = new Vector2(point.x - (this.width / 2), point.y - (this.height / 2));
		this.rotation = rotation;
		this.scale = scale;
		this.velocity = velocity;
		this.angularVelocity = angularVelocity;
	},
	{

		update: function() {
			this.velocity.x *= 0.995;
			this.velocity.y += 0.075;

			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
			this.rotation = this.rotation + this.angularVelocity;

			if ((this.position.y > this.game.height)
				|| (this.position.y < (0 - this.height))) {
				this.game.stopParticle(this);
				return;
			}
		},

		draw: function(ctx) {
			ctx.save();

			 // Translate to midpoint before rotating
			ctx.translate(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
			ctx.rotate(this.rotation);
			ctx.translate(-(this.width / 2), -(this.height / 2));
			ctx.scale(this.scale, this.scale);
			ctx.drawImage(this.image, 0, 0, this.width, this.height);

			ctx.restore();
		},

	});
	
	return Particle;
});