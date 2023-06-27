import AvatarList from "@apps/components/common/AvatarList"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { handleTyping } from "@store/chat"
import ReactDOM from "react-dom"
import moment from "moment"

const Typing = (props) => {
  const {
    selectedGroup,
    dataEmployees,
    replying,
    unread,
    scrollToBottom,
    typing,
    handleHeight,
    chatArea,
    userId
  } = props

  const dispatch = useDispatch()

  useEffect(() => {
    handleSetTyping()
    const interval = setInterval(() => {
      handleSetTyping()
    }, 60000)
    return () => {
      clearInterval(interval)
    }
  }, [selectedGroup, dataEmployees])
  const handleSetTyping = () => {
    if (selectedGroup.chat && selectedGroup.chat.typing_id) {
      const typing = []
      _.forEach(selectedGroup.chat.typing_id, (value) => {
        if (value !== userId) {
          const index_employee = dataEmployees.findIndex(
            (item_employee) => item_employee.id === value
          )
          const index_typing = selectedGroup.chat.typing.findIndex(
            (val) => val.id === value
          )
          let old_timestamp = 0
          if (index_typing !== -1) {
            old_timestamp = selectedGroup.chat.typing[index_typing].timestamp
          }
          const new_timestamp = Date.now()
          const minute_diff = moment(new_timestamp).diff(
            moment(old_timestamp),
            "minutes"
          )
          if (index_employee > -1 && minute_diff < 1) {
            typing.push({
              id: value.id,
              name: dataEmployees[index_employee].full_name,
              avatar: dataEmployees[index_employee].avatar
            })
          }
        }
      })

      dispatch(handleTyping(typing))
    } else {
      dispatch(handleTyping([]))
    }
  }
  // ** listen change typing
  useEffect(() => {
    handleHeight(replying, false)
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    if (chatContainer) {
      if (
        unread === 0 &&
        chatContainer.scrollHeight -
          chatContainer.scrollTop -
          chatContainer.clientHeight <=
          35
      ) {
        scrollToBottom()
      }
    }
  }, [typing])

  const renderComponent = () => {
    if (!_.isEmpty(typing)) {
      const arrAva = []
      _.forEach(typing, (value) => {
        arrAva.push({
          id: value.id,
          src: value.avatar,
          title: value.name
        })
      })
      return (
        <div id="div-typing">
          <AvatarList data={arrAva} showNumberMore={true} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{ marginLeft: "-7px" }}
            width="50px"
            height="50px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid">
            <circle cx="34" cy="53.5" r="5" fill="#f3b72e">
              <animate
                attributeName="cy"
                calcMode="spline"
                keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                repeatCount="indefinite"
                values="53.5;46.5;53.5;53.5"
                keyTimes="0;0.24000000000000002;0.48000000000000004;1"
                dur="1s"
                begin="-0.48000000000000004s"></animate>
            </circle>
            <circle cx="50" cy="53.5" r="5" fill="#3869c5">
              <animate
                attributeName="cy"
                calcMode="spline"
                keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                repeatCount="indefinite"
                values="53.5;46.5;53.5;53.5"
                keyTimes="0;0.24000000000000002;0.48000000000000004;1"
                dur="1s"
                begin="-0.32s"></animate>
            </circle>
            <circle cx="66" cy="53.5" r="5" fill="#4686f4">
              <animate
                attributeName="cy"
                calcMode="spline"
                keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                repeatCount="indefinite"
                values="53.5;46.5;53.5;53.5"
                keyTimes="0;0.24000000000000002;0.48000000000000004;1"
                dur="1s"
                begin="-0.16s"></animate>
            </circle>
          </svg>
        </div>
      )
    }

    return ""
  }

  return renderComponent()
}

export default Typing
