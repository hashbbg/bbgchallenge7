define(["Compose", "Vector2", "Logger"], function(Compose, Vector2, Logger) {
	
	// command listeners
	var Controller = Compose(function constructor() {
		this.commandListeners = [];
	},
	{
		addCommandListener: function(command, listener) {
			if (typeof this.commandListeners[command] == 'undefined') this.commandListeners[command] = [];
			this.commandListeners[command].push(listener);
		},
		
		issueCommand: function(command) {
			if (typeof this.commandListeners[command] == 'undefined') return;
			
			// copy arguments
			var args = [];
			for (var i = 1; i < arguments.length; ++i) args.push(arguments[i]);
				
			for (var i = 0; i < this.commandListeners[command].length; ++i) {
				this.commandListeners[command][i].apply(null, args);
			}
		}
	});
	
	
	
	return Controller;
});