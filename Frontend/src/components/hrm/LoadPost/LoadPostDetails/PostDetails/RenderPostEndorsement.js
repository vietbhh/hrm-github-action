import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { renderContentHashtag } from "@modules/Feed/common/common"
import { getBadgeFromKey } from "@modules/FriNet/common/common"
import {
  getCoverEndorsementByKey,
  listCoverEndorsement
} from "@/components/hrm/common/common"
import React, { Fragment, useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const RenderPostEndorsement = (props) => {
  const { dataLink } = props
  const [state, setState] = useMergedState({
    showSeeMore: false,
    seeMore: false
  })
  const dataEmployee = useSelector((state) => state.users.list)

  // ** useEffect
  useEffect(() => {
    if (document.getElementById(`endorsement__div-content-${dataLink?._id}`)) {
      const height = document.getElementById(
        `endorsement__div-content-${dataLink?._id}`
      ).offsetHeight
      if (height >= 60) {
        setState({ showSeeMore: true })
      }
    }
  }, [dataLink])

  // ** render
  const renderTitle = () => {
    const member = []
    if (!_.isEmpty(dataLink?.member)) {
      _.forEach(dataLink.member, (item) => {
        if (dataEmployee[item]) {
          member.push({
            username: dataEmployee[item].username,
            full_name: dataEmployee[item].full_name
          })
        }
      })
    }

    return (
      <Fragment>
        <span>
          {useFormatMessage("modules.feed.post.endorsement.congratulate")}
        </span>{" "}
        <span>
          {_.map(member, (item, key) => {
            return (
              <Fragment key={key}>
                <Link to={`/u/${item.username}`}>
                  <span className="name">{item.full_name}</span>
                </Link>

                {key < member.length - 1 && <span>, </span>}
              </Fragment>
            )
          })}
        </span>
        <br />
        <span>
          {useFormatMessage("modules.feed.post.endorsement.is_endorsed")}
        </span>{" "}
        <span>“{dataLink?.badge_name}”</span>
      </Fragment>
    )
  }

  const renderContent = () => {
    if (dataLink.content) {
      const content = renderContentHashtag(dataLink.content, dataLink.hashtag)
      return content
    }
    return ""
  }

  return (
    <div className="post-body__endorsement">
      <div className="endorsement__div-cover">
        <img
          src={
            dataLink?.cover_url
              ? dataLink.cover_url
              : getCoverEndorsementByKey(dataLink?.cover)
          }
        />
      </div>
      <div className="endorsement__div-badge">
        <img
          src={
            dataLink?.badge_url
              ? dataLink.badge_url
              : dataLink?.badge
              ? getBadgeFromKey(dataLink?.badge)
              : listCoverEndorsement[0]["cover"]
          }
        />
      </div>

      <div className="endorsement__div-title">{renderTitle()}</div>

      <div
        id={`endorsement__div-content-${dataLink?._id}`}
        className="endorsement__div-content">
        <div
          className={`${
            state.showSeeMore && state.seeMore === false ? "hide" : ""
          }`}>
          {ReactHtmlParser(renderContent())}
        </div>
        {state.showSeeMore && (
          <a
            className="btn-see-more"
            onClick={(e) => {
              e.preventDefault()
              setState({ seeMore: !state.seeMore })
            }}>
            <p>
              {state.seeMore === false
                ? useFormatMessage("modules.feed.post.text.see_more")
                : useFormatMessage("modules.feed.post.text.hide")}
            </p>
          </a>
        )}
      </div>
    </div>
  )
}

export default RenderPostEndorsement
