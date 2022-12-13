import firebase from "firebase/compat/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"
import { usersApi } from "@apps/modules/settings/common/api"


// ** firebase config
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

const vapidKey = "BJzv2V3CDTFohLwbC4iwF8EkqfJJRUwgrnxN4mAXYCN57I5Ual8p5fDvc1B-AFplk87OFMJysVGhL-0mWff9_hI"
// ** end firebase config

const firebaseApp = firebase.initializeApp(firebaseConfig)

const getAccessToken = () => {
  return localStorage.getItem("accessToken")
}

export const messaging = getMessaging(firebaseApp)

export const requestPermission = () => {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification")
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    if (getAccessToken()) getRegistrationToken()
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted" && getAccessToken()) {
        getRegistrationToken()
        //getAccessToken()
        // …
      }
    })
  }
}

const getRegistrationToken = async () => {
  return await getToken(messaging, {
    vapidKey: vapidKey
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
