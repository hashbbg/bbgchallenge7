define(["Compose", "Logger"], function(Compose, Logger, ImageLoader) {
	
	var Background = Compose(function() {
		this.done = false;
		this.ship = null;

		this.processImage = function(img) {
			this.ship = img;
			this.done = true;
		};

		require(["image!data/ship.png"], this.processImage.bind(this));
	},
	{
		draw: function(ctx) {
			if (!this.done) return;
			ctx.drawImage(this.ship, 0, 0);
		}
	});

	return Background;
});