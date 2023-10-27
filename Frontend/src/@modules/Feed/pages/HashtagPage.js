import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import LoadFeed from "../components/LoadFeed"
import backgroundHashtag from "../assets/images/background-hashtag.jpg"
import "../assets/scss/hashtag.scss"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { hashtagApi } from "../common/api"

const HashtagPage = () => {
  const [state, setState] = useMergedState({
    countHashtag: 0
  })
  const { hashtag } = useParams()

  useEffect(() => {
    hashtagApi
      .getGetDataHashtag(hashtag)
      .then((res) => {
        setState({ countHashtag: res.data.post_id.length })
      })
      .catch((err) => {})
  }, [hashtag])

  return (
    <div className="div-content div-hashtag">
      <div className="div-left">
        <div className="div-header">
          <div
            className="div-background"
            style={{ backgroundImage: `url(${backgroundHashtag})` }}></div>
          <div className="div-info">
            <p className="p-hashtag">#{hashtag}</p>
            <p className="p-des">
              {state.countHashtag}{" "}
              {useFormatMessage(
                `modules.hashtag.${state.countHashtag > 1 ? "posts" : "post"}`
              )}
            </p>
          </div>
        </div>
        <div className="feed">
          <LoadFeed
            apiLoadFeed={hashtagApi.getLoadFeedHashtag}
            paramsLoadFeed={{ hashtag: hashtag }}
          />
        </div>
      </div>
    </div>
  )
}

export default HashtagPage
