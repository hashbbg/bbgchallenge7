define(["Compose"], function(Compose) {
	
	var Logger = Compose(function constructor() {
		
		// max entry size
		this.MaxEntrySize = 100;
		
		// entries
		this.entries = [];
		
		// the element with the data
		this.logDiv = document.createElement('div');
	},
	{
		log: function(obj) {
			
			// clean up the DOM elements from the object data structure to avoid circular references
			var json = JSON.stringify(obj, function replacer(key, value) {
				if (typeof value === 'undefined') return value;
				if (typeof value.appendChild === 'undefined') return value;
				return 'DOM';
			});
			
			// store the sanitized entry
			var entry = document.createElement('div');
			entry.className = 'log-entry';
			entry.innerHTML = json;
			this.entries.push(entry);
			this.logDiv.insertBefore(entry, this.logDiv.childNodes[0]);
			this.trimEntries();
		},
		
		trimEntries: function() {
			if (this.entries.length > this.MaxEntrySize) {
				var firstEntry = this.entries.shift();
				this.logDiv.removeChild(firstEntry);
			}
		},
		
		getElement: function() {
			return this.logDiv;
		}
	});
	
	// return an instance of the object
	return new Logger();
});