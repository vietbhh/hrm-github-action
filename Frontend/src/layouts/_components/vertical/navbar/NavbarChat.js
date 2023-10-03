import { useFormatMessage } from "@apps/utility/common"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import { Badge, UncontrolledTooltip } from "reactstrap"

// ** firebase
import { db } from "@/firebase"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useSelector, useDispatch } from "react-redux"
import { handleTitleChat, handleUnseen } from "@store/chat"

export const BlinkingTitle = ({ chatTitle, defaultTitle }) => {
  const interval = 1500
  const appName = useSelector((state) => state.layout.app_name)

  const changeTitle = () => {
    if (chatTitle === "" || chatTitle === null || chatTitle === undefined) {
      document.title = defaultTitle ? `${defaultTitle} | ${appName}` : "Friday"
    } else {
      document.title = `${chatTitle} | ${appName}`
    }
  }

  useEffect(() => {
    const myInterval = setInterval(changeTitle, interval)

    return () => {
      clearInterval(myInterval)
    }
  }, [chatTitle, defaultTitle])

  return null
}

const NavbarChat = () => {
  const [unseen, setUnseen] = useState(0)

  const dispatch = useDispatch()

  // ** setting
  const auth = useSelector((state) => state.auth)
  const settingUser = auth.userData
  const userId = settingUser.id

  // ** env
  const firestoreDb = import.meta.env.VITE_APP_FIRESTORE_DB

  const chat = useSelector((state) => state.chat)
  const chatTitle = chat.titleChat
  const appState = useSelector((state) => state.app)
  const defaultTitle = appState.title
  useEffect(() => {
    let unseen = 0

    if (!_.isUndefined(firestoreDb) && firestoreDb !== "") {
      const q = query(
        collection(db, `${firestoreDb}/chat_groups/groups`),
        where("unseen", "array-contains", userId)
      )

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const docData = change.doc
          const data = docData.data()
          const user = data.user
          const mute = data.mute
          const index = mute.indexOf(userId)
          let check_chat_my_self = false
          if (user.length === 2 && user[0] === user[1]) {
            check_chat_my_self = true
          }
          if (change.type === "added") {
            if (index === -1 && check_chat_my_self === false) {
              unseen++
            }
          }
          if (change.type === "modified") {
          }
          if (change.type === "removed") {
            if (index === -1 && check_chat_my_self === false) {
              unseen--
            }
          }
        })

        setUnseen(unseen)
        dispatch(handleUnseen(unseen))
        const url = window.location.pathname
        if (
          (url.includes("/chat") === false && unseen > 0) ||
          (unseen > 0 && document.hidden === true)
        ) {
          dispatch(
            handleTitleChat(
              useFormatMessage("modules.chat.text.new_message", { num: unseen })
            )
          )
        } else {
          dispatch(handleTitleChat(""))
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [])

  return (
    <>
      <li className="nav-item">
        <Link to="/chat" className="nav-link" id="chat">
          <svg
            className="bell no-noti"
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.2499 22.2482C18.6844 25.8141 13.4047 26.5845 9.08413 24.5863C8.4463 24.3295 7.92338 24.122 7.42625 24.122C6.04155 24.1302 4.31801 25.4728 3.42223 24.5781C2.52646 23.6823 3.87012 21.9573 3.87012 20.5643C3.87012 20.0671 3.6708 19.5535 3.41403 18.9144C1.41495 14.5945 2.18644 9.31312 5.75195 5.74839C10.3035 1.19515 17.6983 1.19515 22.2499 5.74721C26.8097 10.3075 26.8015 17.6961 22.2499 22.2482Z"
              stroke="#32434F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 17H16"
              stroke="#32434F"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 12H19"
              stroke="#32434F"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {unseen > 0 && (
            <Badge pill color="warning" className="badge-up">
              {unseen}
            </Badge>
          )}

          <UncontrolledTooltip target="chat">
            {useFormatMessage("layout.chat")}
          </UncontrolledTooltip>
        </Link>
      </li>

      <BlinkingTitle chatTitle={chatTitle} defaultTitle={defaultTitle} />
    </>
  )
}

export default NavbarChat
