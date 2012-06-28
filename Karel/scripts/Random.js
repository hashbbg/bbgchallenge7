define([], new function() {
	return {
		getInt: function(min, max) {
			if (typeof min == 'undefined') min = 0;
			if (typeof max == 'undefined') max = 1;
			return Math.round(min + Math.random() * (max - min));
		},
		
		getDouble: function(min, max) {
			if (typeof min == 'undefined') min = 0;
			if (typeof max == 'undefined') max = 1;
			return min + Math.random() * (max - min);
		}
	}
});