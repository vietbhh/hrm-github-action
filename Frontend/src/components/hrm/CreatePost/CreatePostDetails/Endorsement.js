import { ErpDate, ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { manageEndorsementApi } from "@modules/FriNet/common/api"
import { getBadgeFromKey } from "@modules/FriNet/common/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import { ContentState, EditorState, convertToRaw } from "draft-js"
import React, { Fragment, useEffect, useState } from "react"
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
  getKeyNumberCoverEndorsementByKeyCover,
  iconDateEndorsement,
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
  detectHashtag,
  detectUrl,
  handleTagUserAndReplaceContent
} from "@modules/Feed/common/common"
import { endorsementApi } from "@modules/Feed/common/api"
import htmlToDraft from "html-to-draftjs"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import moment from "moment"
import MemberSelect from "../../MemberSelect/MemberSelect"
import ModalChooseBadge from "./modals/ModalChooseBadge"

const Endorsement = (props) => {
  const {
    modal,
    toggleModal,
    dataMention,
    setDataCreateNew,
    showTooltip = true,
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
    openDatePicker: false,

    // edit
    loadingEdit: false,
    dataEdit: {},
    cover_url: null,

    //
    valueSelectMember: [],
    activeCoverNumber: 0,
    activeCoverString: "cover0",
    coverImg: null,
    valueBadge: {},
    date: null
  })
  const [editorState, stEditorState] = useState(EditorState.createEmpty())

  const dataEmployee = useSelector((state) => state.users.list)

  // ** function
  const onEditorStateChange = (editorState) => {
    stEditorState(editorState)
  }
  const setEmptyEditorState = () => {
    const emptyEditorState = EditorState.moveFocusToEnd(
      EditorState.createEmpty()
    )
    stEditorState(emptyEditorState)
  }

  const toggleModalChooseBadge = () =>
    setState({ modalChooseBadge: !state.modalChooseBadge })

  const handleCheckContentBeforeSubmit = () => {
    const editorStateRaw = convertToRaw(editorState.getCurrentContent())
    let html = draftToHtml(editorStateRaw)
    html = decodeHTMLEntities(html)
    let check_content = false
    if (html.trim().length) {
      check_content = true
    }

    if (check_content === false) {
      return {
        canSubmit: false,
        err: ""
      }
    }

    if (_.isEmpty(state.valueSelectMember)) {
      return {
        canSubmit: false,
        err: "empty_member"
      }
    }
    if (_.isEmpty(state.valueBadge)) {
      return {
        canSubmit: false,
        err: "empty_badge"
      }
    }

    return {
      canSubmit: true
    }
  }

  const submitEndorsement = () => {
    const checkSubmit = handleCheckContentBeforeSubmit()
    if (checkSubmit.canSubmit === true) {
      setState({ loadingSubmit: true })

      const editorStateRaw = convertToRaw(editorState.getCurrentContent())
      const content = draftToHtml(editorStateRaw)
      const _content = detectUrl(content)
      const result_tag_user = handleTagUserAndReplaceContent(
        dataMention,
        _content
      )
      const __content = result_tag_user.content
      const arrHashtag = detectHashtag(__content)

      const params = {
        content: __content,
        valueSelectMember: state.valueSelectMember,
        activeCoverString: state.activeCoverString,
        cover_url: state.cover_url,
        valueBadge: state.valueBadge,
        date: state.date,
        idEndorsement: idEndorsement,
        idPost: idPost,
        arrHashtag: arrHashtag
      }

      const _params = { body: JSON.stringify(params), file: state.coverImg }

      endorsementApi
        .postSubmitEndorsement(_params)
        .then(async (res) => {
          if (_.isFunction(setDataCreateNew)) {
            setDataCreateNew(res.data.dataFeed)
          }
          if (_.isFunction(setData)) {
            setData(res.data.dataFeed)
          }
          if (_.isFunction(setDataLink)) {
            const _data = await dataUrlImageAfterSubmit(res.data.dataLink)
            setDataLink(_data)
          }

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
      const notificationText =
        checkSubmit.err === ""
          ? useFormatMessage("notification.something_went_wrong")
          : useFormatMessage(
              `modules.feed.create_post.endorsement.${checkSubmit.err}`
            )
      notification.showError({
        text: notificationText
      })
    }
  }

  const resetAfterSubmit = () => {
    toggleModal()
    setEmptyEditorState()
    setState({
      valueSelectMember: [],
      activeCoverNumber: 0,
      activeCoverString: "cover0",
      coverImg: null,
      valueBadge: {},
      date: null,
      loadingSubmit: false
    })
  }

  const dataUrlImageAfterSubmit = async (data) => {
    const promise = new Promise(async (resolve, reject) => {
      const _data = { ...data }
      if (_data.cover_type === "upload") {
        await downloadApi.getPhoto(_data.cover).then((response) => {
          _data.cover_url = URL.createObjectURL(response.data)
        })
      }
      if (_data.badge_type === "upload") {
        await downloadApi.getPhoto(_data.badge).then((response) => {
          _data.badge_url = URL.createObjectURL(response.data)
        })
      }
      resolve(_data)
    })
    return promise
      .then((res_promise) => {
        return res_promise
      })
      .catch((err) => {
        return data
      })
  }

  const handleOpenChangeDatePicker = (open) => {
    setState({
      openDatePicker: open
    })
  }

  const handleToggleOpenCalendar = () => {
    setState({
      openDatePicker: !state.openDatePicker
    })
  }

  const handleSetValueSelectMember = (e) => {
    setState({
      valueSelectMember: e
    })
  }

  // ** useEffect
  useEffect(() => {
    const optionSelectMember = []
    _.forEach(dataEmployee, (item) => {
      optionSelectMember.push({
        value: item.id,
        label: item.full_name,
        tag: item.email
      })
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

  useEffect(() => {
    if (modal && idEndorsement) {
      setState({ loadingEdit: true })
      endorsementApi
        .getEndorsementById(idEndorsement)
        .then((res) => {
          const content_html = res.data.content
          const contentBlock = htmlToDraft(content_html)
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
              contentBlock.contentBlocks
            )
            const editorState = EditorState.createWithContent(contentState)
            setEditorState(editorState)
          }

          const valueSelectMember = []
          if (!_.isEmpty(res.data.member)) {
            _.forEach(res.data.member, (item) => {
              if (dataEmployee[item]) {
                valueSelectMember.push({
                  value: dataEmployee[item].id,
                  label: dataEmployee[item].full_name
                })
              }
            })
          }

          setState({
            dataEdit: res.data,
            valueSelectMember: valueSelectMember,
            activeCoverString: res.data.cover,
            date: res.data.date ? moment(res.data.date) : null,
            activeCoverNumber: getKeyNumberCoverEndorsementByKeyCover(
              res.data.cover
            )
          })

          const promise = new Promise(async (resolve, reject) => {
            const result = { cover_url: null, badge_url: "" }
            if (res.data.cover_type === "upload") {
              await downloadApi.getPhoto(res.data.cover).then((response) => {
                result.cover_url = URL.createObjectURL(response.data)
              })
            }
            if (res.data.badge_type === "upload") {
              await downloadApi.getPhoto(res.data.badge).then((response) => {
                result.badge_url = URL.createObjectURL(response.data)
              })
            }
            resolve(result)
          })
          promise
            .then((res_promise) => {
              setState({
                loadingEdit: false,
                cover_url: res_promise.cover_url,
                valueBadge: {
                  name: res.data.badge_name,
                  badge: res.data.badge,
                  url: res_promise.badge_url,
                  badge_type: res.data.badge_type
                }
              })
            })
            .catch((err) => {
              setState({
                loadingEdit: false,
                cover_url: null,
                valueBadge: {
                  name: res.data.badge_name,
                  badge: res.data.badge,
                  url: "",
                  badge_type: res.data.badge_type
                }
              })
            })
        })
        .catch((err) => {
          setState({ loadingEdit: false, dataEdit: {} })
        })
    }
  }, [idEndorsement, modal])

  return (
    <Fragment>
      {showTooltip && (
        <Tooltip
          title={useFormatMessage(
            "modules.feed.create_post.endorsement.title"
          )}>
          <li
            className={classNames("create_post_footer-li cursor-pointer", {})}
            onClick={() => {
              toggleModal()
            }}>
            {iconEndorsement}
          </li>
        </Tooltip>
      )}

      <Modal
        isOpen={modal}
        toggle={() => {
          toggleModal()
        }}
        className="feed modal-dialog-centered modal-create-post modal-create-event modal-create-endorsement"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader>
          <span className="text-title">
            {useFormatMessage(
              "modules.feed.create_post.endorsement.appreciation"
            )}
          </span>
          <div
            className="div-btn-close"
            onClick={() => {
              toggleModal()
            }}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </ModalHeader>
        <ModalBody>
          {state.loadingEdit && <DefaultSpinner />}

          <div className="div-select div-attendees">
            <div className="select-attendees">
              <label title="Attendees" className="form-label">
                {useFormatMessage(
                  "modules.feed.create_post.endorsement.select_member_for_endorsing"
                )}
              </label>
              <div className="div-input-btn-select">
                <MemberSelect
                  noLabel={true}
                  placeholder={useFormatMessage(
                    "modules.feed.create_post.endorsement.select_member"
                  )}
                  options={state.optionSelectMember}
                  isMulti={true}
                  value={state.valueSelectMember}
                  renderHeader={true}
                  handleOnchange={(e) => handleSetValueSelectMember(e)}
                />
              </div>
              {/*<ErpSelect nolabel options={state.optionSelectMember}
                isMulti={true}
                value={state.valueSelectMember}
                onChange={(e) => setState({ valueSelectMember: e })}/>*/}
            </div>
          </div>
          <div className="div-cover">
            {(state.coverImg !== null || state.cover_url !== null) && (
              <Fragment>
                <div className="div-cover-img">
                  <img
                    className="img-cover-img"
                    src={
                      state.coverImg
                        ? URL.createObjectURL(state.coverImg)
                        : state.cover_url
                    }
                  />
                </div>
                <div
                  className="btn-remove-cover"
                  onClick={() => {
                    setState({ coverImg: null, cover_url: null })
                    if (state.cover_url !== null) {
                      setState({
                        activeCoverNumber: 0,
                        activeCoverString: "cover0"
                      })
                    }
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
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none">
                <path
                  d="M12.5005 16.5999L7.06719 11.1666C6.42552 10.5249 6.42552 9.4749 7.06719 8.83324L12.5005 3.3999"
                  stroke="#696760"
                  strokeWidth="1.5"
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
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none">
                <path
                  d="M7.42578 16.5999L12.8591 11.1666C13.5008 10.5249 13.5008 9.4749 12.8591 8.83324L7.42578 3.3999"
                  stroke="#696760"
                  strokeWidth="1.5"
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
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              dataMention={dataMention}
              backgroundImage={null}
              placeholder={useFormatMessage(
                "modules.feed.create_post.endorsement.editor_placeholder"
              )}
            />
            <Emoji
              editorState={editorState}
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
              {idEndorsement
                ? useFormatMessage("button.update")
                : useFormatMessage(
                    "modules.feed.create_post.text.post_endorsement"
                  )}
            </Button.Ripple>
            <div className="div-icon-date">
              <div onClick={() => handleToggleOpenCalendar()}>
                <ErpDate
                  nolabel
                  suffixIcon={iconDateEndorsement}
                  open={state.openDatePicker}
                  placement="topRight"
                  popupClassName="custom-date-picker-endorsement"
                  onOpenChange={handleOpenChangeDatePicker}
                  value={state.date}
                  onChange={(e) => {
                    setState({ date: e })
                  }}
                />
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <ModalChooseBadge
        listBadge={state.listBadge}
        modalChooseBadge={state.modalChooseBadge}
        toggleModalChooseBadge={toggleModalChooseBadge}
        setState={setState}
      />
    </Fragment>
  )
}

export default Endorsement
