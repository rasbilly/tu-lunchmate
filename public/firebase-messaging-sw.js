importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');


firebase.initializeApp({
    'messagingSenderId': '954393267266'
});

const messaging = firebase.messaging();


/*messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});*/