define(["Compose", "Loadable"], function(Compose, Loadable) {
	
	var Loader = Compose(function constructor() {
		
		// the number of pending loads
		this.nPendingLoads = 0;
		
		// callbacks
		this.callbacks = [];
		
	},
	{
		processLoadableLoaded: function() {
			--this.nPendingLoads;
			if (this.nPendingLoads == 0) {
				for (var i = 0; i < this.callbacks.length; ++i) {
					this.callbacks[i].onDone();
				}
				this.callbacks = [];
			}
		},
		
		addCallback: function(callback) {
		
			// no pending images - just call the callback straight away
			if (this.nPendingLoads == 0) callback.onDone();
			else this.callbacks.push(callback);
		},
		
		hold: function() {
			// hold without using an actual loadable
			++this.nPendingLoads;
		},
		
		release: function() {
			this.processLoadableLoaded();
		},
		
		add: function(loadable) {
			if (loadable.isDone()) return;
			loadable.addCallback(this.processLoadableLoaded.bind(this));
			++this.nPendingLoads;
		}
	});
	
	return Loader;
});