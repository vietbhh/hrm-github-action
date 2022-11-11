// ** Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/9.9.4/firebase-app-compat.js")
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.4/firebase-messaging-compat.js"
)

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      //console.log("Registration successful, scope is:", registration.scope)
    })
    .catch(function (err) {
      //console.log("Service worker registration failed, error:", err)
    })
}

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyC2Qp4HLnOWTQZ9xMZAqqfGNbfsUO1SOA0",
  authDomain: "fir-messaging-f94fd.firebaseapp.com",
  projectId: "fir-messaging-f94fd",
  storageBucket: "fir-messaging-f94fd.appspot.com",
  messagingSenderId: "672698124875",
  appId: "1:672698124875:web:adf97a7830afbe4c3d9bce"
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationData = payload?.data
  if (notificationData?.add_notification === "true") {
    const notificationInfo = JSON.parse(notificationData.notification_info)
    self.clients.matchAll({ includeUncontrolled: true }).then(function (clients) {
      //you can see your main window client in this list.
      clients.forEach(function (client) {
        client.postMessage(notificationInfo)
      })
    })
  }
  
})
