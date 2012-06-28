define(["Compose"], function(Compose) {
	
	var Vector2 = Compose(function constructor(x, y) {
		
		// default
		if (typeof x == 'undefined') x = 0;
		if (typeof y == 'undefined') y = 0;
		
		// set the initial values
		this.x = x;
		this.y = y;
	},
	{
		getX: function() {
			return this.x;
		},
		
		getY: function() {
			return this.y;
		},
		
		add: function(v) {
			if (typeof v == "number") return new Vector2(this.x + v, this.y + v);
			else return new Vector2(this.x + v.x, this.y + v.y);
		},
		
		addMutable: function(v) {
			if (typeof v == "number") {
				this.x += v;
				this.y += v;
			}
			else {
				this.x += v.x;
				this.y += v.y;
			}
			return this;
		},
		
		subtract: function(v) {
			if (typeof v == "number") return new Vector2(this.x - v, this.y - v);
			else return new Vector2(this.x - v.x, this.y - v.y);
		},
		
		subtractMutable: function(v) {
			if (typeof v == "number") {
				this.x -= v;
				this.y -= v;
			}
			else {
				this.x -= v.x;
				this.y -= v.y;
			}
			return this;
		},
		
		multiply: function(v) {
			if (typeof v == "number") return new Vector2(this.x * v, this.y * v);
			else return new Vector2(this.x * v.x, this.y * v.y);
		},
		
		multiplyMutable: function(v) {
			if (typeof v == "number") {
				this.x *= v;
				this.y *= v;
			}
			else {
				this.x *= v.x;
				this.y *= v.y;
			}
			return this;
		},
		
		divide: function(v) {
			if (typeof v == "number") return new Vector2(this.x / v, this.y / v);
			else return new Vector2(this.x / v.x, this.y / v.y);
		},
		
		divideMutable: function(v) {
			if (typeof v == "number") {
				this.x /= v;
				this.y /= v;
			}
			else {
				this.x /= v.x;
				this.y /= v.y;
			}
			return this;
		},
		
		normalize: function() {
			var d = this.length();
			return new Vector2(this.x / d, this.y / d);
		},
		
		normalizeMutable: function() {
			var d = this.length();
			this.x /= d;
			this.y /= d;
			return this;
		},
		
		rotate: function(theta) {
			return this.copy().rotateMutable(theta);
		},
		
		rotateMutable: function(theta) {
			var nx = this.x * Math.cos(theta) - this.y * Math.sin(theta);
			var ny = this.x * Math.sin(theta) + this.y * Math.cos(theta);
			this.x = nx;
			this.y = ny;
			return this;
		},
		
		dot: function(v) {
			return this.x*v.x + this.y*v.y;
		},
		
		length: function() {
			return Math.sqrt(this.x*this.x + this.y*this.y);
		},
		
		lengthSq: function() {
			return this.x*this.x + this.y*this.y;
		},
		
		isZero: function() {
			return this.lengthSq() < 0.0000001;
		},
		
		toString: function() {
			return "[" + this.x + "," + this.y + "]";
		},
		
		copy: function() {
			return new Vector2(this.x, this.y);
		}
	});
	
	return Vector2;
});