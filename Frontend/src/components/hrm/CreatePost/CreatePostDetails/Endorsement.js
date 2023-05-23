import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import React, { Fragment, useEffect } from "react"
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner
} from "reactstrap"
import {
  getKeyCoverEndorsement,
  iconEndorsement,
  listCoverEndorsement
} from "../../common/common"
import { ErpSelect } from "@apps/components/common/ErpField"
import { useSelector } from "react-redux"
import { Carousel } from "rsuite"
import { manageEndorsementApi } from "@modules/FriNet/common/api"
import { getBadgeFromKey } from "@modules/FriNet/common/common"

const Endorsement = (props) => {
  const { modal, toggleModal } = props
  const [state, setState] = useMergedState({
    loadingSubmit: false,
    optionSelectMember: [],
    modalChooseBadge: false,
    listBadge: [],

    //
    valueSelectMember: [],
    activeCoverNumber: 0,
    activeCoverString: "cover0",
    coverImg: null,
    valueBadge: {}
  })

  const dataEmployee = useSelector((state) => state.users.list)

  // ** function
  const toggleModalChooseBadge = () =>
    setState({ modalChooseBadge: !state.modalChooseBadge })

  // ** useEffect
  useEffect(() => {
    const optionSelectMember = []
    _.forEach(dataEmployee, (item) => {
      optionSelectMember.push({ value: item.id, label: item.full_name })
    })
    setState({ optionSelectMember: optionSelectMember })

    manageEndorsementApi
      .getListDataBadgeSetting()
      .then((res) => {
        setState({ listBadge: res.data })
      })
      .catch((err) => {})
  }, [])

  return (
    <Fragment>
      <Tooltip
        title={useFormatMessage("modules.feed.create_post.endorsement.title")}>
        <li
          className={classNames("create_post_footer-li cursor-pointer", {})}
          onClick={() => {
            toggleModal()
          }}>
          {iconEndorsement}
        </li>
      </Tooltip>

      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="feed modal-dialog-centered modal-create-post modal-create-event modal-create-endorsement"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader>
          <span className="text-title">
            {useFormatMessage(
              "modules.feed.create_post.endorsement.appreciation"
            )}
          </span>
          <div className="div-btn-close" onClick={() => toggleModal()}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="div-select mt-1">
            <label title="Attendees" className="form-label">
              {useFormatMessage(
                "modules.feed.create_post.endorsement.select_member_for_endorsing"
              )}
            </label>
            <ErpSelect
              nolabel
              className="select"
              options={state.optionSelectMember}
              isMulti={true}
              value={state.valueSelectMember}
              onChange={(e) => setState({ valueSelectMember: e })}
            />
          </div>

          <div className="div-cover">
            {state.coverImg !== null && (
              <Fragment>
                <div className="div-cover-img">
                  <img
                    className="img-cover-img"
                    src={URL.createObjectURL(state.coverImg)}
                  />
                </div>
                <div
                  className="btn-remove-cover"
                  onClick={() => {
                    setState({ coverImg: null })
                    if (document.getElementById("attach-cover-photo")) {
                      document.getElementById("attach-cover-photo").value = null
                    }
                  }}>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </Fragment>
            )}

            <button
              className="btn-arrows btn-previous"
              onClick={() => {
                let prev = state.activeCoverNumber - 1
                if (prev < 0) {
                  prev = listCoverEndorsement.length - 1
                }
                setState({
                  activeCoverNumber: prev,
                  activeCoverString: getKeyCoverEndorsement(prev)
                })
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none">
                <path
                  d="M11.3174 14.94L6.42738 10.05C5.84988 9.4725 5.84988 8.5275 6.42738 7.95L11.3174 3.06"
                  stroke="white"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <Carousel activeIndex={state.activeCoverNumber}>
              {_.map(listCoverEndorsement, (item, index) => {
                return (
                  <div key={index} className="div-item-cover">
                    <img src={item.cover} />
                  </div>
                )
              })}
            </Carousel>
            <button
              className="btn-arrows btn-next"
              onClick={() => {
                let next = state.activeCoverNumber + 1
                if (next === listCoverEndorsement.length) {
                  next = 0
                }
                setState({
                  activeCoverNumber: next,
                  activeCoverString: getKeyCoverEndorsement(next)
                })
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none">
                <path
                  d="M6.68262 14.94L11.5726 10.05C12.1501 9.4725 12.1501 8.5275 11.5726 7.95L6.68262 3.06"
                  stroke="white"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <Label
              className={`mb-0 label-btn-add-cover`}
              for="attach-cover-photo">
              <div className="btn-add-cover">
                {useFormatMessage(
                  "modules.feed.create_post.endorsement.add_cover_photo"
                )}
                <input
                  type="file"
                  id="attach-cover-photo"
                  accept="image/*"
                  disabled={false}
                  hidden
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setState({ coverImg: e.target.files[0] })
                    }
                  }}
                />
              </div>
            </Label>
          </div>

          <div className="div-badge">
            <div className="div-img">
              <img
                src={
                  state.valueBadge.badge
                    ? getBadgeFromKey(state.valueBadge.badge)
                    : listCoverEndorsement[0]["cover"]
                }
              />
            </div>
            <div className="div-text">“{state.valueBadge?.name}”</div>

            <div
              className="div-handle-choose-badge"
              onClick={() => toggleModalChooseBadge()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none">
                <path
                  d="M1.5 6.9427C1.5 5.59364 2.59364 4.5 3.9427 4.5V4.5C4.75943 4.5 5.52212 4.09182 5.97516 3.41226L6 3.375C6.46856 2.67216 7.25738 2.25 8.10208 2.25H9.89792C10.7426 2.25 11.5314 2.67216 12 3.375L12.0248 3.41226C12.4779 4.09182 13.2406 4.5 14.0573 4.5V4.5C15.4064 4.5 16.5 5.59364 16.5 6.9427V11.75C16.5 13.9591 14.7091 15.75 12.5 15.75H5.5C3.29086 15.75 1.5 13.9591 1.5 11.75V6.9427Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <circle
                  cx="9"
                  cy="9.75"
                  r="3"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"></circle>
              </svg>
            </div>
          </div>

          <div className="text-center mt-2">
            <Button.Ripple
              color="primary"
              type="submit"
              className="btn-post"
              disabled={state.loadingSubmit}>
              {state.loadingSubmit && <Spinner size={"sm"} className="me-50" />}
              {useFormatMessage("modules.feed.create_post.text.post")}
            </Button.Ripple>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={state.modalChooseBadge}
        toggle={() => toggleModalChooseBadge()}
        className="feed modal-dialog-centered modal-create-post modal-create-event modal-choose-badge"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader>
          <button className="btn-icon-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none">
              <path
                d="M12.5249 14.235H5.47491C5.15991 14.235 4.8074 13.9875 4.7024 13.6875L1.59741 5.00249C1.15491 3.75749 1.67241 3.37499 2.73741 4.13999L5.66241 6.23249C6.14991 6.56999 6.70491 6.39749 6.91491 5.84999L8.23491 2.33249C8.65491 1.20749 9.35241 1.20749 9.77241 2.33249L11.0924 5.84999C11.3024 6.39749 11.8574 6.56999 12.3374 6.23249L15.0824 4.27499C16.2524 3.43499 16.8149 3.86249 16.3349 5.21999L13.3049 13.7025C13.1924 13.9875 12.8399 14.235 12.5249 14.235Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.875 16.5H13.125"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.125 10.5H10.875"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="text-title">
            {useFormatMessage(
              "modules.feed.create_post.endorsement.list_badges"
            )}
          </span>
          <div
            className="div-btn-close"
            onClick={() => toggleModalChooseBadge()}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="div-list-badge">
            {_.map(state.listBadge, (item, index) => {
              return (
                <div
                  key={index}
                  className="div-item-badge"
                  onClick={() => {
                    setState({
                      valueBadge: { name: item.name, badge: item.badge },
                      modalChooseBadge: false
                    })
                  }}>
                  <div className="div-img">
                    <img
                      src={getBadgeFromKey(item.badge)}
                      alt={getBadgeFromKey(item.badge)}
                    />
                  </div>
                  <div className="div-text">“{item.name}”</div>
                </div>
              )
            })}
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default Endorsement
