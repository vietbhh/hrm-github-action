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
  apiKey: "AIzaSyA927U22MOf2vYDGqFSIRVIpzU_G0bJ6fM",
  authDomain: "friday-351410.firebaseapp.com",
  databaseURL: "https://friday-351410-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "friday-351410",
  storageBucket: "friday-351410.appspot.com",
  messagingSenderId: "802894112425",
  appId: "1:802894112425:web:cae06e5522d5bb31bcebb8",
  measurementId: "G-PLDYVP5EMH"
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
