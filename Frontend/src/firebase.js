import firebase from "firebase/compat/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"
import { usersApi } from "@apps/modules/settings/common/api"

const firebaseConfig = {
  apiKey: "AIzaSyC2Qp4HLnOWTQZ9xMZAqqfGNbfsUO1SOA0",
  authDomain: "fir-messaging-f94fd.firebaseapp.com",
  projectId: "fir-messaging-f94fd",
  storageBucket: "fir-messaging-f94fd.appspot.com",
  messagingSenderId: "672698124875",
  appId: "1:672698124875:web:adf97a7830afbe4c3d9bce",
  measurementId: "G-BR7054YN0Z"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

export const messaging = getMessaging(firebaseApp)

export const requestPermission = () => {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification")
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    getRegistrationToken()
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        getRegistrationToken()
        //getAccessToken()
        // …
      }
    })
  }
}

const getRegistrationToken = async () => {
  return await getToken(messaging, {
    vapidKey:
      "BETECJAEphx67h2DnHm0FVazaEPNtmhkh5GblAEBoymtkB8YTF5nvRSm3abN39wkNsoXOzLe5mt-um5TD6z0e4o"
  })
    .then((currentToken) => {
      if (currentToken) {
        usersApi
          .saveDeviceToken({
            token: currentToken
          })
          .then((res) => {})
          .catch((err) => {
            console.log(err)
          })
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        )
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err)
      // catch error while creating client token
    })
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })

export default firebase
