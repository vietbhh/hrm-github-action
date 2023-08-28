// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import AttachFileItem from "./AttachFileItem"

const EventInfo = (props) => {
  const {
    // ** props
    infoEvent
    // ** methods
  } = props

  const meetingRoom = infoEvent.meeting_room
  const isOwner = infoEvent.is_owner

  const [state, setState] = useMergedState({
    listAttachment: infoEvent.attachment
  })

  const setListAttachment = (attachment) => {
    setState({
      listAttachment: attachment
    })
  }

  // ** render
  const renderAttachment = () => {
    if (!_.isArray(state.listAttachment)) {
      return ""
    }

    if (state.listAttachment.length === 0) {
      return useFormatMessage("modules.feed.create_event.text.no_attachment")
    }

    return (
      <div className="w-100 d-flex flex-wrap align-items-center attach-file-section">
        {state.listAttachment.map((item, index) => {
          return (
            <AttachFileItem
              key={`attach-file-item-${index}`}
              infoEvent={infoEvent}
              listAttachment={state.listAttachment}
              file={item}
              isOwner={isOwner}
              setListAttachment={setListAttachment}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-100 mb-2 event-info-section">
      <div className="d-flex align-items-start mb-1 pb-25 event-info-item">
        <div className="icon-area">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none">
            <path
              d="M11 12.3108C12.5795 12.3108 13.86 11.0304 13.86 9.45082C13.86 7.87129 12.5795 6.59082 11 6.59082C9.42048 6.59082 8.14001 7.87129 8.14001 9.45082C8.14001 11.0304 9.42048 12.3108 11 12.3108Z"
              stroke="#32434F"
              strokeWidth="1.5"
            />
            <path
              d="M3.31835 7.78242C5.12418 -0.155913 16.885 -0.146746 18.6817 7.79159C19.7359 12.4483 16.8392 16.3899 14.3 18.8283C12.4575 20.6066 9.54252 20.6066 7.69085 18.8283C5.16085 16.3899 2.26418 12.4391 3.31835 7.78242Z"
              stroke="#32434F"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="text-area">
          {meetingRoom?.label === undefined || _.isEmpty(meetingRoom.label)
            ? useFormatMessage("modules.feed.create_event.text.no_meeting_room")
            : meetingRoom.label}
        </div>
      </div>
      <div className="d-flex align-items-start mb-1 pb-25 event-info-item">
        <div className="icon-area">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none">
            <path
              d="M11.0184 1.83325C7.64503 1.83325 4.91336 4.56492 4.91336 7.93825V9.86325C4.91336 10.4866 4.6567 11.4216 4.33586 11.9533L3.1717 13.8966C2.4567 15.0974 2.95169 16.4358 4.27169 16.8758C8.65336 18.3333 13.3925 18.3333 17.7742 16.8758C19.0117 16.4633 19.5434 15.0149 18.8742 13.8966L17.71 11.9533C17.3892 11.4216 17.1325 10.4774 17.1325 9.86325V7.93825C17.1234 4.58325 14.3734 1.83325 11.0184 1.83325Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M14.0525 17.2517C14.0525 18.9292 12.6775 20.3042 11 20.3042C10.1658 20.3042 9.39584 19.9559 8.84584 19.4059C8.29584 18.8559 7.94751 18.0859 7.94751 17.2517"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
        <div className="text-area">
          {infoEvent.reminder !== null
            ? useFormatMessage(
                `modules.feed.create_event.text.${infoEvent.reminder}`
              )
            : useFormatMessage("modules.feed.create_event.no_reminder")}
        </div>
      </div>
      <div className="d-flex align-items-start mb-1 pb-25 event-info-item">
        <div className="icon-area">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none">
            <path
              d="M13.6492 4.65662C12.8517 4.41828 11.9717 4.26245 11 4.26245C6.60916 4.26245 3.05249 7.81912 3.05249 12.21C3.05249 16.61 6.60916 20.1666 11 20.1666C15.3908 20.1666 18.9475 16.61 18.9475 12.2191C18.9475 10.5875 18.4525 9.06578 17.6092 7.80078"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.7859 4.87659L12.1367 1.83325"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.7858 4.87671L11.6967 7.13171"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-area">
          {infoEvent.repeat !== null
            ? useFormatMessage(
                `modules.feed.create_event.text.${infoEvent.repeat}`
              )
            : useFormatMessage(`modules.feed.create_event.text.no_repeat`)}
        </div>
      </div>
      <div className="d-flex align-items-start mb-1 pb-25 event-info-item">
        <div className="icon-area">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none">
            <path
              d="M7.21692 1.83325V4.58325"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.4338 1.83325V4.58325"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.31482 11.9167H13.5318"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.31482 15.5833H10.8254"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.4338 3.20825C17.4379 3.37325 18.9444 4.53742 18.9444 8.84575V14.5108C18.9444 18.2874 18.0423 20.1758 13.5317 20.1758H8.119C3.60842 20.1758 2.7063 18.2874 2.7063 14.5108V8.84575C2.7063 4.53742 4.21283 3.38242 7.21688 3.20825H14.4338Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-area">{infoEvent.details}</div>
      </div>
      <div className="d-flex align-items-start mb-1 event-info-item">
        <div className="icon-area">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none">
            <path
              d="M10.9725 11V14.2083C10.9725 15.9775 12.4116 17.4167 14.1808 17.4167C15.95 17.4167 17.3891 15.9775 17.3891 14.2083V9.16667C17.3891 5.61917 14.52 2.75 10.9725 2.75C7.42495 2.75 4.55579 5.61917 4.55579 9.16667V14.6667C4.55579 17.7008 7.02162 20.1667 10.0558 20.1667"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-area">{renderAttachment()}</div>
      </div>
    </div>
  )
}

export default EventInfo
