define(["Compose", "Vector2"], function(Compose, Vector2) {

	var Rectangle = Compose(function(topLeft, bottomRight) {
		this.topLeft = topLeft;
		this.bottomRight = bottomRight;
	},
	{
		collidesWith: function(rect) {
			if (this.bottomRight.x < rect.topLeft.x) return false;
			if (this.bottomRight.y < rect.topLeft.y) return false;
			if (rect.bottomRight.x < this.topLeft.x) return false;
			if (rect.bottomRight.y < this.topLeft.y) return false;
			return true;
		},

		collidesWithSphere: function(center, radius) {
			var rect = {
				x: (this.topLeft.x + this.bottomRight.x) / 2,
				y: (this.topLeft.y + this.bottomRight.y) / 2,
				width: this.bottomRight.x - this.topLeft.x,
				height: this.bottomRight.y - this.topLeft.y
			};
			var circleDistance = new Vector2(Math.abs(center.x - rect.x), Math.abs(center.y - rect.y));
		    if (circleDistance.x > (rect.width/2 + radius)) { return false; }
		    if (circleDistance.y > (rect.height/2 + radius)) { return false; }

		    if (circleDistance.x <= (rect.width/2)) { return true; } 
		    if (circleDistance.y <= (rect.height/2)) { return true; }

		    cornerDistance_sq = (circleDistance.x - rect.width/2)*(circleDistance.x - rect.width/2) +
		                         (circleDistance.y - rect.height/2)*(circleDistance.y - rect.height/2);

		    return (cornerDistance_sq <= (radius*radius));
		}

	});

	return Rectangle;
});