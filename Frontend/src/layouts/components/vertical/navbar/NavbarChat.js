import { useFormatMessage } from "@apps/utility/common"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import { Badge, UncontrolledTooltip } from "reactstrap"

// ** firebase
import { db } from "firebase"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useSelector, useDispatch } from "react-redux"
import { handleTitleChat, handleUnseen } from "redux/chat"

export const BlinkingTitle = () => {
  const chat = useSelector((state) => state.chat)
  const chatTitle = chat.titleChat
  const defaultTitle = useSelector((state) => state.layout.app_name)
  const interval = 1500

  const changeTitle = () => {
    if (chatTitle === "") {
      document.title = defaultTitle
    } else {
      if (document.title === defaultTitle) {
        document.title = chatTitle
      } else {
        document.title = defaultTitle
      }
    }
  }

  useEffect(() => {
    const myInterval = setInterval(changeTitle, interval)

    return () => {
      clearInterval(myInterval)
    }
  }, [chatTitle])

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
  const firestoreDb = process.env.REACT_APP_FIRESTORE_DB

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
          const mute = data.mute
          const index = mute.indexOf(userId)
          if (change.type === "added") {
            if (index === -1) {
              unseen++
            }
          }
          if (change.type === "modified") {
          }
          if (change.type === "removed") {
            if (index === -1) {
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
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.0568 2.00014C8.54687 1.98596 5.28557 3.8071 3.4605 6.80041C1.63543 9.79372 1.51292 13.5224 3.13757 16.6287L3.33789 17.0192C3.50209 17.3264 3.53644 17.6865 3.43329 18.0192C3.14742 18.7784 2.90849 19.5545 2.71784 20.343C2.71784 20.743 2.83231 20.9715 3.26158 20.962C4.0219 20.7941 4.77068 20.5778 5.50332 20.3144C5.81886 20.2275 6.15437 20.2476 6.45725 20.3715C6.73389 20.5049 7.2967 20.8477 7.31578 20.8477C10.9915 22.7805 15.4808 22.2473 18.5998 19.5075C21.7187 16.7677 22.8199 12.39 21.3676 8.5041C19.9153 4.61815 16.2111 2.03059 12.0568 2.00014V2.00014Z"
              stroke="#00003B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <ellipse
              opacity="0.4"
              cx="7.28715"
              cy="12.0001"
              rx="0.476965"
              ry="0.47619"
              stroke="#11142D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <ellipse
              opacity="0.4"
              cx="12.0568"
              cy="12.0001"
              rx="0.476965"
              ry="0.47619"
              stroke="#11142D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <ellipse
              opacity="0.4"
              cx="16.8265"
              cy="12.0001"
              rx="0.476965"
              ry="0.47619"
              stroke="#11142D"
              strokeWidth="1.5"
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

      <BlinkingTitle />
    </>
  )
}

export default NavbarChat
