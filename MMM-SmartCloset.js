/* global Module */

/* Magic Mirror
 * Module: MMM-SmartCloset
 *
 * By Veronica Osei
 * 
 */

Module.register("MMM-SmartCloset", {
	defaults: {
		apikey: "",
		latitude: "",
		longitude: "",
		updateInterval: 10, // minutes
		requestDelay: 0,
		language: config.language,
		units: "metric",
		imageDir: "./Outfits/",
		updateInterval: 60000,
		retryDelay: 5000,
		selectFromSubdirectories: true,
		maxWidth: "100%",
		maxHeight: "100%",
		randomOrder: true,
	},



	// LOAD IMAGES
	images: {},
	shownImagesCount: 5,
	imageIndex: 0,


	// loaded: function(callback) {
	// 	this.finishLoading();
	// 	Log.log(this.name + ' is loaded!');
	// 	callback();
	// },


	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		Log.info(" Starting module: Smart Closet ")
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		var self = this;
		

		var urlApi = "https://jsonplaceholder.typicode.com/posts/1";
		var retry = true;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;
		// creating container to container HTML elements
		var wrapper = document.createElement("div");
		var imageDisplay = document.createElement("div");
		var imageTag = document.createElement("img");
		var classAttribute = document.createElement("div")
		// Image tag property
		imageTag.src = "./outfits/Fall/fall_outfit1.jpeg";
		wrapper.appendChild(imageTag);

		for (fit in outfits) {
			var seasonOutfit = this.config.seasons[fit];
		}



		// I need to know if we got a problem, so tell me!
		if (this.errorMessage != null) {
			wrapper.innerHTML = this.errorMessage;
		}
		if (!this.imageLoadFinished) {
			wrapper.innerHTML = this.translate("LOADING");
			return wrapper;
		}

		var imageFolder = document.createElement("div");
		imageFolder.i

		// otherwise work
		// else {
		// 	if (this.loaded === true) {
		// 		if (this.loaded === true) {

		// 		}
		// 	}
		// }


		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.dataRequest is not empty
		if (this.dataRequest) {
			var wrapperDataRequest = document.createElement("div");
			// check format https://jsonplaceholder.typicode.com/posts/1
			wrapperDataRequest.innerHTML = this.dataRequest.title;

			var labelDataRequest = document.createElement("label");
			// Use translate function
			//             this id defined in translations files
			labelDataRequest.innerHTML = this.translate("TITLE");


			wrapper.appendChild(labelDataRequest);
			wrapper.appendChild(wrapperDataRequest);
		}

		// Data from helper
		if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			wrapperDataNotification.innerHTML =  this.translate("UPDATE") + ": " + this.dataNotification.date;

			wrapper.appendChild(wrapperDataNotification);
		}
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-SmartCloset.css",
		];
	},
// covert HTML to nunjucks
	getTemplate: function () {
		return [
			"MMM-SmartCloset.njk",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json"
		};
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("SmartCloset_Get", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "SmartCloset-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
