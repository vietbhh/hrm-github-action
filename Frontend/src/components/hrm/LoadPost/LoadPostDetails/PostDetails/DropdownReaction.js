import { useFormatMessage } from "@apps/utility/common"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"
import { Dropdown } from "antd"
import React from "react"

const DropdownReaction = (props) => {
  const { buttonDropdown, updateReaction, checkLike, showIconReact } = props

  const item_reaction = [
    {
      key: "1",
      label: (
        <div className="div-dropdown-reaction">
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("like")
              }
            }}>
            <img src={img_like} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("love")
              }
            }}>
            <img src={img_love} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("care")
              }
            }}>
            <img src={img_care} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("smile")
              }
            }}>
            <img src={img_smile} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("sad")
              }
            }}>
            <img src={img_sad} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("wow")
              }
            }}>
            <img src={img_wow} />
          </button>
        </div>
      )
    }
  ]

  // ** render
  const renderButtonDropdown = () => {
    if (checkLike !== "") {
      switch (checkLike) {
        case "like":
          return (
            <button
              className="btn-reaction"
              onClick={() => updateReaction("like")}>
              {showIconReact && <img src={img_like} />}{" "}
              <span className="react-like">
                {useFormatMessage("modules.feed.post.react.like")}
              </span>
            </button>
          )

        case "love":
          return (
            <button
              className="btn-reaction"
              onClick={() => updateReaction("love")}>
              {showIconReact && <img src={img_love} />}{" "}
              <span className="react-love">
                {useFormatMessage("modules.feed.post.react.love")}
              </span>
            </button>
          )

        case "care":
          return (
            <button
              className="btn-reaction"
              onClick={() => updateReaction("care")}>
              {showIconReact && <img src={img_care} />}{" "}
              <span className="react-care">
                {useFormatMessage("modules.feed.post.react.care")}
              </span>
            </button>
          )

        case "smile":
          return (
            <button
              className="btn-reaction"
              onClick={() => updateReaction("smile")}>
              {showIconReact && <img src={img_smile} />}{" "}
              <span className="react-smile">
                {useFormatMessage("modules.feed.post.react.haha")}
              </span>
            </button>
          )

        case "sad":
          return (
            <button
              className="btn-reaction"
              onClick={() => updateReaction("sad")}>
              {showIconReact && <img src={img_sad} />}{" "}
              <span className="react-sad">
                {useFormatMessage("modules.feed.post.react.sad")}
              </span>
            </button>
          )

        case "wow":
          return (
            <button
              className="btn-reaction"
              onClick={() => updateReaction("wow")}>
              {showIconReact && <img src={img_wow} />}{" "}
              <span className="react-wow">
                {useFormatMessage("modules.feed.post.react.wow")}
              </span>
            </button>
          )

        default:
          return buttonDropdown
      }
    }

    return buttonDropdown
  }

  return (
    <Dropdown
      menu={{ items: item_reaction }}
      placement="top"
      overlayClassName="post-footer-button-reaction-dropdown"
      trigger={["hover"]}>
      {renderButtonDropdown()}
    </Dropdown>
  )
}

export default DropdownReaction
