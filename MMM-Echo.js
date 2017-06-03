
Module.register('MMM-Echo',{

	defaults: {
		// recognition intervall in seconds (scale this based on desired CPU usage)
		interval: 1,
		// Logout delay after last recognition so that a user does not get instantly logged out when out of cameras field of vision
		logoutDelay: 15,
		// Array with usernames
		users: [],
		// Module set used for strangers and if no user is detected
		defaultClass: "default",
		// Set of modules which should be shown for every user
		everyoneClass: "everyone",
		// Boolean to toggle welcomeMessage
		welcomeMessage: true
	},

	// Define required translations.
	getTranslations: function() {
		return {
			en: "translations/en.json",
			de: "translations/de.json",
      		es: "translations/es.json",
      		zh: "translations/zh.json",
      		nl: "translations/nl.json",
			sv: "translations/sv.json",
			fr: "translations/fr.json",
			id: "translations/id.json",
			nb: "translations/nb.json"
		};
	},

	login_user: function () {

		MM.getModules().withClass(this.config.defaultClass).exceptWithClass(this.config.everyoneClass).enumerate(function(module) {
			module.hide(1000, function() {
				Log.log(module.name + ' is hidden.');
			});
		});

		MM.getModules().withClass(this.current_user).enumerate(function(module) {
			module.show(1000, function() {
				Log.log(module.name + ' is shown.');
			});
		});

		this.sendNotification("CURRENT_USER", this.current_user);
	},
	logout_user: function () {

		MM.getModules().withClass(this.current_user).enumerate(function(module) {
			module.hide(1000, function() {
				Log.log(module.name + ' is hidden.');
			});
		});

		MM.getModules().withClass(this.config.defaultClass).exceptWithClass(this.config.everyoneClass).enumerate(function(module) {
			module.show(1000, function() {
				Log.log(module.name + ' is shown.');
			});
		});

		this.sendNotification("CURRENT_USER", "None");
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (payload.action == "login"){
			if (this.current_user_id != payload.user){
				this.logout_user()
			}
			if (payload.user == -1){
				this.current_user = this.translate("stranger")
				this.current_user_id = payload.user;
			}
			else{
				this.current_user = this.config.users[payload.user];
				this.current_user_id = payload.user;
				this.login_user()
			}

			if (this.config.welcomeMessage) {
				this.sendNotification("SHOW_ALERT", {type: "notification", message: this.translate("message").replace("%person", this.current_user), title: this.translate("title")});
			}
		}
		else if (payload.action == "logout"){
			this.logout_user()
			this.current_user = null;
		}
	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === 'DOM_OBJECTS_CREATED') {
			MM.getModules().exceptWithClass("default").enumerate(function(module) {
				module.hide(1000, function() {
					Log.log('Module is hidden.');
				});
			});
		}
	},

	start: function() {
		this.current_user = null;
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('Starting module: ' + this.name);
	}

});
