import { ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { manageEndorsementApi } from "@modules/FriNet/common/api"
import { getBadgeFromKey } from "@modules/FriNet/common/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import { EditorState, convertToRaw } from "draft-js"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner
} from "reactstrap"
import { Carousel } from "rsuite"
import {
  getKeyCoverEndorsement,
  iconEndorsement,
  listCoverEndorsement
} from "../../common/common"
import EditorComponent from "./EditorComponent"
import Emoji from "./Emoji"
import { downloadApi } from "@apps/modules/download/common/api"
import notification from "@apps/utility/notification"
import draftToHtml from "draftjs-to-html"
import {
  decodeHTMLEntities,
  detectUrl,
  handleTagUserAndReplaceContent
} from "@modules/Feed/common/common"
import { endorsementApi } from "@modules/Feed/common/api"

const Endorsement = (props) => {
  const {
    modal,
    toggleModal,
    toggleModalCreatePost,
    dataMention,
    setDataCreateNew,

    // ** edit
    idEndorsement = null,
    setData,
    setDataLink,
    idPost = null
  } = props
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
    valueBadge: {},
    editorState: EditorState.createEmpty()
  })

  const dataEmployee = useSelector((state) => state.users.list)

  // ** function
  const onEditorStateChange = (editorState) => {
    setState({ editorState: editorState })
  }
  const setEmptyEditorState = () => {
    const emptyEditorState = EditorState.moveFocusToEnd(
      EditorState.createEmpty()
    )
    setState({ editorState: emptyEditorState })
  }
  const toggleModalChooseBadge = () =>
    setState({ modalChooseBadge: !state.modalChooseBadge })

  const handleCheckContentBeforeSubmit = () => {
    const editorStateRaw = convertToRaw(state.editorState.getCurrentContent())
    let html = draftToHtml(editorStateRaw)
    html = decodeHTMLEntities(html)
    let check_content = false
    if (html.trim().length) {
      check_content = true
    }

    let check_can_submit = false
    if (
      check_content === true &&
      !_.isEmpty(state.valueSelectMember) &&
      !_.isEmpty(state.valueBadge)
    ) {
      check_can_submit = true
    }

    return check_can_submit
  }

  const submitEndorsement = () => {
    const checkSubmit = handleCheckContentBeforeSubmit()
    if (checkSubmit) {
      setState({ loadingSubmit: true })

      const editorStateRaw = convertToRaw(state.editorState.getCurrentContent())
      const content = draftToHtml(editorStateRaw)
      const _content = detectUrl(content)
      const result_tag_user = handleTagUserAndReplaceContent(
        dataMention,
        _content
      )
      const __content = result_tag_user.content

      const params = {
        content: __content,
        valueSelectMember: state.valueSelectMember,
        activeCoverString: state.activeCoverString,
        valueBadge: state.valueBadge,
        idEndorsement: idEndorsement,
        idPost: idPost
      }

      endorsementApi
        .postSubmitEndorsement(params)
        .then((res) => {
          if (_.isFunction(setDataCreateNew)) {
            setDataCreateNew(res.data.dataFeed)
          }
          if (_.isFunction(setData)) {
            setData(res.data.dataFeed)
          }
          if (_.isFunction(setDataLink)) {
            setDataLink(res.data.dataLink)
          }

          if (state.coverImg !== null) {
            endorsementApi
              .postSubmitEndorsementCover({
                idEndorsement: res.data.idEndorsement,
                file: state.coverImg
              })
              .then((res) => {
                resetAfterSubmit()
                notification.showSuccess({
                  text: useFormatMessage("notification.success")
                })
              })
              .catch((err) => {
                setState({ loadingSubmit: false })
                notification.showError({
                  text: useFormatMessage("notification.something_went_wrong")
                })
              })
          } else {
            resetAfterSubmit()
            notification.showSuccess({
              text: useFormatMessage("notification.success")
            })
          }
        })
        .catch((err) => {
          setState({ loadingSubmit: false })
          notification.showError({
            text: useFormatMessage("notification.something_went_wrong")
          })
        })
    } else {
      notification.showError({
        text: useFormatMessage("notification.something_went_wrong")
      })
    }
  }

  const resetAfterSubmit = () => {
    toggleModal()
    toggleModalCreatePost()
    setEmptyEditorState()
    setState({
      valueSelectMember: [],
      activeCoverNumber: 0,
      activeCoverString: "cover0",
      coverImg: null,
      valueBadge: {},
      loadingSubmit: false
    })
  }

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
        const promises = []
        _.forEach(res.data, (item) => {
          const promise = new Promise(async (resolve, reject) => {
            const _item = { ...item }
            if (_item.badge_type === "upload") {
              await downloadApi.getPhoto(item.badge).then((response) => {
                _item.url = URL.createObjectURL(response.data)
                resolve(_item)
              })
            } else {
              resolve(_item)
            }
          })
          promises.push(promise)
        })
        Promise.all(promises).then((res) => {
          setState({ listBadge: res })
        })
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
                    ? state.valueBadge.url
                      ? state.valueBadge.url
                      : getBadgeFromKey(state.valueBadge.badge)
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

          <div className="div-write-editor">
            <EditorComponent
              editorState={state.editorState}
              onEditorStateChange={onEditorStateChange}
              dataMention={dataMention}
              backgroundImage={null}
              placeholder={useFormatMessage(
                "modules.feed.create_post.endorsement.editor_placeholder"
              )}
            />
            <Emoji
              editorState={state.editorState}
              setEditorState={onEditorStateChange}
            />
          </div>

          <div className="div-btn-post">
            <Button.Ripple
              color="primary"
              type="submit"
              className="btn-post"
              disabled={state.loadingSubmit}
              onClick={() => submitEndorsement()}>
              {state.loadingSubmit && <Spinner size={"sm"} className="me-50" />}
              {useFormatMessage("modules.feed.create_post.text.post")}
            </Button.Ripple>
            <div className="div-icon-date">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none">
                <path
                  d="M11 2.75V6.875"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2.75V6.875"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.8125 12.4987H28.1875"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28.875 11.6875V23.375C28.875 27.5 26.8125 30.25 22 30.25H11C6.1875 30.25 4.125 27.5 4.125 23.375V11.6875C4.125 7.5625 6.1875 4.8125 11 4.8125H22C26.8125 4.8125 28.875 7.5625 28.875 11.6875Z"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.5803 18.8375H21.5927"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.5803 22.9625H21.5927"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.4934 18.8375H16.5058"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.4934 22.9625H16.5058"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.4046 18.8375H11.4169"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.4046 22.9625H11.4169"
                  stroke="#32434F"
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
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
                      valueBadge: {
                        name: item.name,
                        badge: item.badge,
                        url: item.url ? item.url : "",
                        badge_type: item.badge_type
                      },
                      modalChooseBadge: false
                    })
                  }}>
                  <div className="div-img">
                    <img
                      src={
                        item.badge_type === "local"
                          ? getBadgeFromKey(item.badge)
                          : item.url
                      }
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
