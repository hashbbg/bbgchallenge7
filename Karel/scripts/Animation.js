define(["Compose", "Logger", "Background", "Random", "Vector2"], function(Compose, Logger, Background, Random, Vector2) {
	
	var animationFrameRate = 5;

	var Animation = Compose(function constructor(game, animation, scale, rotation, point) {
		this.game = game;
		this.animation = this.game.json[animation];
		// Shift so point is center of animation
		this.position = new Vector2(point.x - (this.animation.width / 2), point.y - (this.animation.height / 2));
		this.scale = scale;
		this.rotation = rotation;

		this.done = false;
		this.framesPassed = 0;
		this.frame = 0;
	},
	{

		draw: function(ctx) {
			if (this.done) return;

			ctx.save();
			 // Translate to midpoint before rotating
			ctx.translate(this.position.x + (this.animation.width / 2), this.position.y + (this.animation.height / 2));
			ctx.rotate(this.rotation);
			ctx.scale(this.scale, this.scale);
			ctx.translate(-(this.animation.width * this.scale / 2), -(this.animation.height * this.scale / 2));
			ctx.drawImage(this.game.images[this.animation.fileName],
				this.animation.width * this.frame, 0, this.animation.width, this.animation.height,
				0, 0, this.animation.width, this.animation.height);
			ctx.restore();

			this.framesPassed++;
			this.frame = Math.floor(this.framesPassed / animationFrameRate);

			if (this.frame == this.animation.animations[0].nFrames) {
				this.done = true;
				this.game.stopAnimation(this);
			}
		},

	});
	
	return Animation;
});