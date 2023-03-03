import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"
import { feedApi } from "@modules/Feed/common/api"
import { Dropdown } from "antd"
import React from "react"
import { useSelector } from "react-redux"

const DropdownReaction = (props) => {
  const { data, buttonDropdown, setData } = props

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id

  const item_reaction = [
    {
      key: "1",
      label: (
        <div className="div-dropdown-reaction">
          <button className="pull-up" onClick={() => updateReaction("like")}>
            <img src={img_like} />
          </button>
          <button className="pull-up" onClick={() => updateReaction("love")}>
            <img src={img_love} />
          </button>
          <button className="pull-up" onClick={() => updateReaction("care")}>
            <img src={img_care} />
          </button>
          <button className="pull-up" onClick={() => updateReaction("smile")}>
            <img src={img_smile} />
          </button>
          <button className="pull-up" onClick={() => updateReaction("sad")}>
            <img src={img_sad} />
          </button>
          <button className="pull-up" onClick={() => updateReaction("wow")}>
            <img src={img_wow} />
          </button>
        </div>
      )
    }
  ]

  // ** function
  const updateReaction = (react_type) => {
    return
    const _data = { ...data }
    const reaction = _data.reaction ? _data.reaction : []
    const index_react_type = reaction.findIndex(
      (item) => item.react_type === react_type
    )
    if (index_react_type !== -1) {
      const index_user =
        reaction[index_react_type]["react_user"].indexOf(userId)
      if (index_user !== -1) {
        reaction[index_react_type]["react_user"].splice(index_user, 1)
      } else {
        reaction[index_react_type]["react_user"].push(userId)
      }
    } else {
      reaction.push({
        react_type: react_type,
        react_user: [userId]
      })
    }
    _.forEach(reaction, (value) => {
      if (react_type !== value.react_type) {
        const index = value["react_user"].indexOf(userId)
        if (index !== -1) {
          value["react_user"].splice(index, 1)
        }
      }
    })

    const params = {
      _id: _data._id,
      reaction: reaction
    }
    feedApi
      .postUpdatePost(params)
      .then((res) => {
        if (_.isFunction(setData)) {
          setData({
            ...res.data,
            url_thumb: _data.url_thumb,
            medias: _data.medias
          })
        }
      })
      .catch((err) => {})
  }

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
