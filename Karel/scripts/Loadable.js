define(["Compose"], function(Compose) {
	
	var Loadable = Compose(function constructor() {
		this.callbacks = [];
		this.done = false;
	},
	{
		addCallback: function(callback) {
			this.callbacks.push(callback);
		},
		
		loaded: function() {
			this.done = true;
			for (var i = 0; i < this.callbacks.length; ++i) {
				this.callbacks[i](this);
				this.callbacks = [];
			}
		},
		
		isDone: function() {
			return this.done;
		}
	})
	
	
	return Loadable;
});