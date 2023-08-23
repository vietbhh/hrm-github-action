// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
import { eventApi } from "@modules/Feed/common/api"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import dayjs from "dayjs"
import classNames from "classnames"

const JoinEventAction = (props) => {
  const {
    // ** props
    infoEvent
    // ** methods
  } = props

  const currentEmployee = useSelector((state) => state.auth.userData)
  const listEmployee = !_.isArray(infoEvent.employee) ? [] : infoEvent.employee
  let currentStatus = null
  listEmployee.map((item) => {
    if (parseInt(item.id) === parseInt(currentEmployee.id)) {
      currentStatus = item.status
    }
  })

  const [state, setState] = useMergedState({
    status: currentStatus
  })

  const infoOwner = infoEvent.info_owner

  const handleClickAction = (status) => {
    setState({
      status: status
    })

    const params = { id: infoEvent._id, status: status }
    eventApi
      .postUpdateEventStatus(params)
      .then((res) => {})
      .catch((err) => {})
  }

  // ** render
  const renderAction = () => {
    return (
      <Space>
        <Button.Ripple
          className={classNames(
            "d-flex align-items-center common-action-button btn-accept",
            {
              active: state.status === "yes"
            }
          )}
          onClick={() => handleClickAction("yes")}>
          {state.status === "yes" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-25">
              <path
                d="M9.99999 1.66675C5.40832 1.66675 1.66666 5.40841 1.66666 10.0001C1.66666 14.5917 5.40832 18.3334 9.99999 18.3334C14.5917 18.3334 18.3333 14.5917 18.3333 10.0001C18.3333 5.40841 14.5917 1.66675 9.99999 1.66675ZM13.9833 8.08341L9.25832 12.8084C9.14165 12.9251 8.98332 12.9917 8.81666 12.9917C8.64999 12.9917 8.49166 12.9251 8.37499 12.8084L6.01666 10.4501C5.77499 10.2084 5.77499 9.80841 6.01666 9.56675C6.25832 9.32508 6.65832 9.32508 6.89999 9.56675L8.81666 11.4834L13.1 7.20008C13.3417 6.95841 13.7417 6.95841 13.9833 7.20008C14.225 7.44175 14.225 7.83341 13.9833 8.08341Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-25">
              <path
                d="M10 1.66675C5.40835 1.66675 1.66669 5.40841 1.66669 10.0001C1.66669 14.5917 5.40835 18.3334 10 18.3334C14.5917 18.3334 18.3334 14.5917 18.3334 10.0001C18.3334 5.40841 14.5917 1.66675 10 1.66675ZM13.9834 8.08341L9.25835 12.8084C9.14169 12.9251 8.98335 12.9917 8.81669 12.9917C8.65002 12.9917 8.49169 12.9251 8.37502 12.8084L6.01669 10.4501C5.77502 10.2084 5.77502 9.80841 6.01669 9.56675C6.25835 9.32508 6.65835 9.32508 6.90002 9.56675L8.81669 11.4834L13.1 7.20008C13.3417 6.95841 13.7417 6.95841 13.9834 7.20008C14.225 7.44175 14.225 7.83341 13.9834 8.08341Z"
                fill="#292D32"
              />
            </svg>
          )}

          {useFormatMessage("button.accept")}
        </Button.Ripple>
        <Button.Ripple
          className={classNames(
            "d-flex align-items-center common-action-button btn-decline",
            {
              active: state.status === "no"
            }
          )}
          onClick={() => handleClickAction("no")}>
          {state.status === "no" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-25">
              <path
                d="M10 1.66675C5.40835 1.66675 1.66669 5.40841 1.66669 10.0001C1.66669 14.5917 5.40835 18.3334 10 18.3334C14.5917 18.3334 18.3334 14.5917 18.3334 10.0001C18.3334 5.40841 14.5917 1.66675 10 1.66675ZM12.8 11.9167C13.0417 12.1584 13.0417 12.5584 12.8 12.8001C12.675 12.9251 12.5167 12.9834 12.3584 12.9834C12.2 12.9834 12.0417 12.9251 11.9167 12.8001L10 10.8834L8.08335 12.8001C7.95835 12.9251 7.80002 12.9834 7.64169 12.9834C7.48335 12.9834 7.32502 12.9251 7.20002 12.8001C6.95835 12.5584 6.95835 12.1584 7.20002 11.9167L9.11669 10.0001L7.20002 8.08341C6.95835 7.84175 6.95835 7.44175 7.20002 7.20008C7.44169 6.95842 7.84169 6.95842 8.08335 7.20008L10 9.11675L11.9167 7.20008C12.1584 6.95842 12.5584 6.95842 12.8 7.20008C13.0417 7.44175 13.0417 7.84175 12.8 8.08341L10.8834 10.0001L12.8 11.9167Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-25">
              <path
                d="M10 1.66675C5.40835 1.66675 1.66669 5.40841 1.66669 10.0001C1.66669 14.5917 5.40835 18.3334 10 18.3334C14.5917 18.3334 18.3334 14.5917 18.3334 10.0001C18.3334 5.40841 14.5917 1.66675 10 1.66675ZM12.8 11.9167C13.0417 12.1584 13.0417 12.5584 12.8 12.8001C12.675 12.9251 12.5167 12.9834 12.3584 12.9834C12.2 12.9834 12.0417 12.9251 11.9167 12.8001L10 10.8834L8.08335 12.8001C7.95835 12.9251 7.80002 12.9834 7.64169 12.9834C7.48335 12.9834 7.32502 12.9251 7.20002 12.8001C6.95835 12.5584 6.95835 12.1584 7.20002 11.9167L9.11669 10.0001L7.20002 8.08341C6.95835 7.84175 6.95835 7.44175 7.20002 7.20008C7.44169 6.95842 7.84169 6.95842 8.08335 7.20008L10 9.11675L11.9167 7.20008C12.1584 6.95842 12.5584 6.95842 12.8 7.20008C13.0417 7.44175 13.0417 7.84175 12.8 8.08341L10.8834 10.0001L12.8 11.9167Z"
                fill="#4F4D55"
              />
            </svg>
          )}
          {useFormatMessage("button.decline")}
        </Button.Ripple>
        <Button.Ripple
          className={classNames(
            "d-flex align-items-center common-action-button btn-decline",
            {
              active: state.status === "maybe"
            }
          )}
          onClick={() => handleClickAction("maybe")}>
          {state.status === "maybe" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-25">
              <path
                d="M14.1667 15.3583H10.8334L7.12501 17.8249C6.57501 18.1916 5.83335 17.8 5.83335 17.1333V15.3583C3.33335 15.3583 1.66669 13.6916 1.66669 11.1916V6.19157C1.66669 3.69157 3.33335 2.0249 5.83335 2.0249H14.1667C16.6667 2.0249 18.3334 3.69157 18.3334 6.19157V11.1916C18.3334 13.6916 16.6667 15.3583 14.1667 15.3583Z"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 9.46655V9.29159C10 8.72492 10.35 8.4249 10.7 8.18324C11.0417 7.9499 11.3833 7.64991 11.3833 7.09991C11.3833 6.33325 10.7667 5.71655 10 5.71655C9.23334 5.71655 8.6167 6.33325 8.6167 7.09991"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.99623 11.4584H10.0037"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-25">
              <path
                d="M14.1667 15.3583H10.8334L7.12501 17.8249C6.57501 18.1916 5.83335 17.8 5.83335 17.1333V15.3583C3.33335 15.3583 1.66669 13.6916 1.66669 11.1916V6.19157C1.66669 3.69157 3.33335 2.0249 5.83335 2.0249H14.1667C16.6667 2.0249 18.3334 3.69157 18.3334 6.19157V11.1916C18.3334 13.6916 16.6667 15.3583 14.1667 15.3583Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 9.46655V9.29159C10 8.72492 10.35 8.4249 10.7 8.18324C11.0417 7.9499 11.3833 7.64991 11.3833 7.09991C11.3833 6.33325 10.7667 5.71655 10 5.71655C9.23334 5.71655 8.6167 6.33325 8.6167 7.09991"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.99623 11.4584H10.0037"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {useFormatMessage("modules.feed.post.event.maybe")}
        </Button.Ripple>
      </Space>
    )
  }

  const renderComponent = () => {
    if (infoEvent.is_owner === true) {
      return ""
    }

    return (
      <div className="mb-2 join-event-action-section">
        <div className="d-flex align-items-start">
          <div className="me-75">
            <Avatar imgWidth="46" imgHeight="46" src={infoOwner.avatar} />
          </div>
          <div>
            <p className="mb-0 event-info">
              <b>{infoOwner.label}</b>{" "}
              {useFormatMessage("modules.feed.create_post.text.invited_you_to")}{" "}
              <span className="event-name-text">{infoEvent.name}</span>
            </p>
            <p className="mt-0 time-created">
              {dayjs(infoEvent.created_at).format("MMM DD, YYYY")}
            </p>
            <div className="button-action">
              <Fragment>{renderAction()}</Fragment>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default JoinEventAction
