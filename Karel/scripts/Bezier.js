define(["Logger", "Compose", "Vector2"], function(Logger, Compose, Vector2) {
	
	var Bezier = Compose(function(P1, C, P2) {
		
		this.P1 = P1;
		this.C = C;
		this.P2 = P2;
	},
	{
		get: function(t) {
			return new Vector2((1-t)*(1-t)*this.P1.x + (1-t)*t*this.C.x + t*t*this.P2.x, (1-t)*(1-t)*this.P1.y + (1-t)*t*this.C.y + t*t*this.P2.y);
		}
	});
	
	return Bezier;
});