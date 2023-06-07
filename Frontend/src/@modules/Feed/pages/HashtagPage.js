import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import LoadFeed from "../components/LoadFeed"

const HashtagPage = () => {
  const { hashtag } = useParams()

  // ** useEffect
  useEffect(() => {
    // hide menu
    if (document.getElementsByClassName(`main-menu menu-fixed`)[0]) {
      document.getElementsByClassName(`main-menu menu-fixed`)[0].style.display =
        "none"
    }
    if (document.getElementsByClassName(`app-content content`)[0]) {
      document.getElementsByClassName(
        `app-content content`
      )[0].style.marginLeft = 0
      document.getElementsByClassName(`app-content content`)[0].style.minWidth =
        "calc(1150px + 330px)"
    }

    return () => {
      // show menu
      if (document.getElementsByClassName(`main-menu menu-fixed`)[0]) {
        document.getElementsByClassName(
          `main-menu menu-fixed`
        )[0].style.display = "unset"
      }
      if (document.getElementsByClassName(`app-content content`)[0]) {
        document.getElementsByClassName(
          `app-content content`
        )[0].style.marginLeft = "330px"
        document.getElementsByClassName(
          `app-content content`
        )[0].style.minWidth = "1150px"
      }
    }
  }, [])

  return (
    <div className="div-content">
      <div className="div-left">
        <div className="feed">hashtag: #{hashtag}</div>
      </div>
    </div>
  )
}

export default HashtagPage
