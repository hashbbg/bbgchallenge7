define(["Compose"], function(Compose) {
	
	var Color = Compose(function (red, green, blue, alpha) {
		
		// default is white
		if (typeof red == "undefined") red = 255;
		if (typeof green == "undefined") green = 255;
		if (typeof blue == "undefined") blue = 255;
		if (typeof alpha == "undefined") alpha = 1.0;
		
		// set the colors
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = 1.0;
		
	},
	{
		getRed: function() {
			return this.red;
		},
		
		getGreen: function() {
			return this.green;
		},
		
		getBlue: function() {
			return this.blue;
		},
		
		toString: function() {
			return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
		},
		
		interpolate: function(col1, col2, d) {
			//var col = new Color();
			this.red = Math.round(col1.red + (col2.red - col1.red) * d);
			this.green = Math.round(col1.green + (col2.green - col1.green) * d);
			this.blue = Math.round(col1.blue + (col2.blue - col1.blue) * d);
			this.alpha = Math.round(col1.alpha + (col2.alpha - col1.alpha) * d);
			//return this;
		}
	});
	
	
	return Color;
});