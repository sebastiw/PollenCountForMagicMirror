Module.register("pollencount", {

    /*
     * API towards MagicMirror
     */

    defaults: {
        url: "",
        updateInterval: 4*60*60*1000, // every 4h
        regexTable: {
        },
        iconTable: {
        }
    },

    // Required scripts
    getScripts: function() {
	return [];
    },

    // Required styles
    getStyles: function() {
	return ["pollen.css"];
    },

    // Required translations
    getTranslations: function() {
	return false;
    },

    // Define start sequence.
    start: function() {
	Log.info("Starting module: " + this.name);

        // Retrieve data!
        this.getPollenCount();
    },

    /*
     * Private functions
     */

    callbackFunction: function() {
        return function () { self.getPollenCount(); };
    },

    getPollenCount: function() {
	var self = this;

	var httpRequest = new XMLHttpRequest();
	httpRequest.open("GET", this.config.url, true);
	httpRequest.onreadystatechange = function() {
	    if (this.readyState === 4) {
		if (this.status === 200) {
		    self.processResponse(JSON.parse(this.response));
                    Log.info("HTTP request successful!");
		} else {
		    Log.error("HTTP request failed.");
		}
	    }
	};
	httpRequest.send();

        // Set new timer
	self.setTimer(callbackFunction(), self.config.retryDelay);
    },

    processResponse: function(data) {
        Log.info("Processing data: " + data);
    },

    setTimer: function(fun, timeout) {
	if (typeof timeout === "undefined" || timeout < 0) {
	    timeout = this.config.updateInterval;
	}

        // Remove previous timers (we don't want no forkbomb)
	clearTimeout(this.updateTimer);

        // Create the new timer
	var self = this;
	this.updateTimer = setTimeout(fun, timeout);
    }
});
