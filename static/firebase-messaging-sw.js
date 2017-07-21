// proper initialization
// if( 'function' === typeof importScripts) {
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');

	// enter your own keys
    firebase.initializeApp({
        apiKey: "",
        projectId: "",
        messagingSenderId: ""
     })

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	const title = 'Your Title Is here';
	const options = {
		body: payload.body.status
	};
	return self.registration.showNotification(title, options)
})

// }
