import { usersApi } from "@apps/modules/settings/common/api"
import firebase from "firebase/compat/app"
import { getFirestore } from "firebase/firestore"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyA927U22MOf2vYDGqFSIRVIpzU_G0bJ6fM",
  authDomain: "friday-351410.firebaseapp.com",
  projectId: "friday-351410",
  storageBucket: "friday-351410.appspot.com",
  messagingSenderId: "802894112425",
  appId: "1:802894112425:web:bb905d1836b787e7bcebb8",
  measurementId: "G-2LBDCCGXJP"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

export const messaging = getMessaging(firebaseApp)
export const db = getFirestore(firebaseApp)

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
      "BJzv2V3CDTFohLwbC4iwF8EkqfJJRUwgrnxN4mAXYCN57I5Ual8p5fDvc1B-AFplk87OFMJysVGhL-0mWff9_hI"
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
