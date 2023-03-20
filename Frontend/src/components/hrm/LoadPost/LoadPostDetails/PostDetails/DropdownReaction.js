import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"
import { Dropdown } from "antd"
import React from "react"

const DropdownReaction = (props) => {
  const { buttonDropdown, updateReaction, dataComment = {} } = props

  const item_reaction = [
    {
      key: "1",
      label: (
        <div className="div-dropdown-reaction">
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("like", dataComment)
              }
            }}>
            <img src={img_like} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("love", dataComment)
              }
            }}>
            <img src={img_love} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("care", dataComment)
              }
            }}>
            <img src={img_care} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("smile", dataComment)
              }
            }}>
            <img src={img_smile} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("sad", dataComment)
              }
            }}>
            <img src={img_sad} />
          </button>
          <button
            className="pull-up"
            onClick={() => {
              if (_.isFunction(updateReaction)) {
                updateReaction("wow", dataComment)
              }
            }}>
            <img src={img_wow} />
          </button>
        </div>
      )
    }
  ]

  return (
    <Dropdown
      menu={{ items: item_reaction }}
      placement="top"
      overlayClassName="post-footer-button-reaction-dropdown"
      trigger={["hover"]}>
      {buttonDropdown}
    </Dropdown>
  )
}

export default DropdownReaction
