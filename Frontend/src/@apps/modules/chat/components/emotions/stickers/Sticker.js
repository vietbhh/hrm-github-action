import "./assets/sticker.scss"
import stickerDefault from "@modules/Sticker/common/stickerDefault"
import StickerCollection from "./StickerCollection"
import { useMergedState } from "@apps/utility/common"
import { Tabs } from "antd"
import { useEffect, useRef } from "react"
import { stickerApi } from "@modules/Sticker/common/api"
import PhotoPublic from "@apps/modules/download/pages/PhotoPublic"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"

const Sticker = ({
  sendMessage,
  selectedUser,
  focusInputMsg,
  setReplyingDefault,
  setShowEmotion,
  ...rest
}) => {
  const [state, setState] = useMergedState({
    list: [],
    page: 1,
    perPage: 7,
    default: true,
    total: 0,
    activeTabKey: 0
  })

  const stickerTabsRef = useRef(null)

  const handleSend = (url, stickerName) => {
    if (stickerName !== stickerDefault.name) {
      url =
        import.meta.env.VITE_APP_API_URL + `/download/public/image?name=${url}`
    } else {
      url = import.meta.env.VITE_APP_URL + url
    }

    if (rest.setStatePostComment) {
      rest.setStatePostComment({
        image: url
      })
      setShowEmotion(false)
      return
    }

    sendMessage(selectedUser.chat.id, url, {
      type: "gif",
      break_type: "sticker"
    })
    focusInputMsg()
    setReplyingDefault()
    setShowEmotion(false)
  }

  const getData = async () => {
    const dataList = await stickerApi.list(
      "",
      state.page,
      state.perPage,
      state.default
    )
    let stickerList = dataList.data.data

    if (state.page === 1) {
      stickerList = [stickerDefault].concat(stickerList)
    }

    const stickerTabs = stickerList.map((item, index) => {
      let stickerIconDefault = item.list.find((subItem) => subItem.default)
      let stickerIconList = item

      const stickerTab = {
        key: index
      }

      if (item.name !== stickerDefault.name) {
        stickerTab.label = (
          <PhotoPublic
            src={stickerIconDefault.url}
            width={40}
            preview={false}
            defaultPhoto="/"
          />
        )
      } else {
        stickerTab.label = <img src={stickerIconDefault.url} width={40} />
      }

      stickerTab.children = (
        <StickerCollection
          data={stickerIconList}
          handleSend={handleSend}
          stickerName={item.name}
        />
      )
      return stickerTab
    })
    setState({
      list: stickerTabs,
      total: dataList.data.total,
      activeTabKey: 0
    })
  }

  const onChangeKey = (key) => {
    setState({
      activeTabKey: key
    })
  }

  const nextSticker = () => {
    setState({
      page: state.page + 1
    })
  }

  const prevSticker = () => {
    setState({
      page: state.page - 1
    })
  }

  useEffect(() => {
    getData()
  }, [state.page])

  const renderTabBar = (props, DefaultTabBar) => {
    return (
      <div id="sticker-tab-custom">
        {state.page !== 1 && (
          <div className="left-tab" onClick={prevSticker}>
            <LeftOutlined />
          </div>
        )}
        <DefaultTabBar {...props} ref={stickerTabsRef} />
        {state.page * state.perPage < state.total && (
          <div className="right-tab" onClick={nextSticker}>
            <RightOutlined />
          </div>
        )}
      </div>
    )
  }

  return (
    <div id="sticker-chat">
      <Tabs
        items={state.list}
        centered={false}
        activeKey={state.activeTabKey}
        onChange={onChangeKey}
        destroyInactiveTabPane={true}
        renderTabBar={renderTabBar}
        tabBarStyle={{ marginBottom: "0" }}
      />
    </div>
  )
}

export default Sticker
