import { EmptyContent } from "@apps/components/common/EmptyContent"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { useRTL } from "@hooks/useRTL"
import "@styles/react/libs/swiper/swiper.scss"
import { Tooltip } from "antd"
import classNames from "classnames"
import draftToHtml from "draftjs-to-html"
import moment from "moment"
import { useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import { CardBody, Col, Row } from "reactstrap"
import SwiperCore, { Grid, Lazy, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react/swiper-react"
import { NotepadApi } from "../common/api"
import AddModal from "./details/notepad/AddModal"
import LayoutDashboard from "./LayoutDashboard"

// ** Init Swiper Functions
SwiperCore.use([Grid, Pagination, Lazy])

const Notepad = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    data_pin: [],
    data_un_pin: [],
    modal: false,
    idNotepad: 0,
    arrTick: []
  })
  const [isRtl] = useRTL()
  const params = {
    slidesPerView: 5,
    spaceBetween: 50,
    pagination: {
      clickable: true
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  }

  const loadData = (loading = true) => {
    setState({ loading: loading })
    NotepadApi.getNotepadAll()
      .then((res) => {
        setState({
          loading: false,
          data_pin: res.data.dataPin,
          data_un_pin: res.data.dataUnPin
        })
        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
      .catch((err) => {
        setState({ loading: false })
        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleModal = (id = 0) => {
    setState({ modal: !state.modal, idNotepad: id })
  }

  useEffect(() => {
    if (!state.loading) {
      props.handleWidget("notepad", "static", { modal: state.modal })
    }
  }, [state.modal])

  const handlePin = ($id) => {
    NotepadApi.getNotepadPin($id)
      .then((res) => {
        loadData(false)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  const handleUnPin = ($id) => {
    NotepadApi.getNotepadUnPin($id)
      .then((res) => {
        loadData(false)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  const renderStar = (action, $id) => {
    return (
      <Tooltip
        title={useFormatMessage(
          `modules.dashboard.notepad.${action === "pin" ? "pin" : "un_pin"}`
        )}>
        <svg
          onClick={() => {
            if (action === "pin") {
              return handlePin($id)
            } else {
              return handleUnPin($id)
            }
          }}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.85623 4.09848L8.85625 4.09838C8.60317 4.05129 8.35802 3.92774 8.15957 3.78133C7.96281 3.63616 7.76864 3.43649 7.65192 3.19836L6.59594 1.0864C6.59584 1.08619 6.59574 1.08599 6.59564 1.08579C6.34264 0.583402 6.09844 0.500249 5.99876 0.500001C5.8995 0.499754 5.65651 0.581171 5.40405 1.07892C5.40385 1.07931 5.40366 1.07969 5.40346 1.08007L4.34809 3.19084C4.23226 3.42718 4.03954 3.62853 3.84201 3.77547C3.64386 3.92287 3.39442 4.05008 3.13317 4.09273C3.13299 4.09276 3.13281 4.09278 3.13264 4.09281L1.22268 4.4074C0.698431 4.49782 0.54576 4.70135 0.513276 4.8028C0.481061 4.9034 0.486382 5.15662 0.863178 5.53341L2.35578 7.02601C2.55463 7.22486 2.68689 7.49058 2.76134 7.74395C2.83624 7.99885 2.86767 8.29218 2.81619 8.56679L2.81423 8.57719L2.81184 8.58751L2.38432 10.4326L2.38429 10.4327C2.22573 11.1163 2.39222 11.3358 2.4464 11.3752C2.50229 11.4159 2.76514 11.5053 3.3675 11.1497C3.36769 11.1496 3.36787 11.1494 3.36806 11.1493L5.15814 10.0858C5.41657 9.93013 5.72719 9.86852 6.0075 9.86852C6.28781 9.86852 6.59843 9.93013 6.85686 10.0858L8.64806 11.15L8.6488 11.1504C9.25103 11.5097 9.51286 11.4188 9.56782 11.3786C9.62299 11.3383 9.78921 11.1161 9.63071 10.4327L9.63069 10.4326L9.20341 8.58858C9.20337 8.58841 9.20333 8.58823 9.20328 8.58806C9.13801 8.30861 9.16642 8.00988 9.23949 7.75412C9.31248 7.49868 9.44538 7.23235 9.64422 7.03351L11.1353 5.54242C11.1355 5.54221 11.1357 5.54199 11.136 5.54177C11.5133 5.16092 11.5191 4.90569 11.4867 4.80467C11.4547 4.70466 11.3037 4.50219 10.7791 4.41519L8.85623 4.09848ZM8.85623 4.09848L8.86644 4.10016L10.7786 4.41511L8.85623 4.09848Z"
            fill="#FFE658"
            stroke="#32434F"
          />
        </svg>
      </Tooltip>
    )
  }

  const renderTime = (time) => {
    return moment(time).format("DD MMM YYYY")
  }

  const renderContent = (content) => {
    if (content === null || content === "") return ""
    try {
      const json = JSON.parse(content)
      return ReactHtmlParser(draftToHtml(json).replace(/<\/?[^>]+(>|$)/g, ""))
    } catch (e) {
      return ""
    }
  }

  const renderTick = ($id) => {
    const clickTick = ($id) => {
      const arrTick = [...state.arrTick]
      if (arrTick.includes($id)) {
        arrTick.splice(arrTick.indexOf($id), 1)
      } else {
        arrTick.push($id)
      }
      setState({ arrTick: arrTick })
    }

    return (
      <div
        className={classNames("tick", {
          show: state.arrTick.includes($id)
        })}
        onClick={() => clickTick($id)}>
        <i className="fa-solid fa-check"></i>
      </div>
    )
  }

  const deleteMultiple = () => {
    if (!_.isEmpty(state.arrTick)) {
      const params = {
        arrId: state.arrTick
      }
      NotepadApi.postDeleteMultiple(params)
        .then((res) => {
          loadData(false)
          setState({ arrTick: [] })
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.something_went_wrong")
          })
        })
    }
  }

  return (
    <LayoutDashboard
      headerProps={{
        id: "notepad",
        title: useFormatMessage("modules.dashboard.notepad.title"),
        isRemoveWidget: true,
        classIconBg: "notepad-bg-icon",
        icon: (
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M16.5 7.5V11.25C16.5 15 15 16.5 11.25 16.5H6.75C3 16.5 1.5 15 1.5 11.25V6.75C1.5 3 3 1.5 6.75 1.5H10.5"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 7.5H13.5C11.25 7.5 10.5 6.75 10.5 4.5V1.5L16.5 7.5Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.25 9.75H9.75"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.25 12.75H8.25"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        customRight: (
          <>
            {!_.isEmpty(state.arrTick) && (
              <Tooltip title={useFormatMessage(`app.delete`)}>
                <i
                  className="fa-solid fa-trash me-1 cursor-pointer"
                  onClick={() => deleteMultiple()}></i>
              </Tooltip>
            )}

            <Tooltip title={useFormatMessage(`app.add`)}>
              <svg
                onClick={() => toggleModal()}
                className="me-1 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none">
                <path
                  d="M11.6666 17.5H23.3333"
                  stroke="#32434F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 23.3333V11.6667"
                  stroke="#32434F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Tooltip>
          </>
        ),
        ...props
      }}>
      <CardBody className="card-notepad">
        {state.loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
            }}>
            <DefaultSpinner />
          </div>
        )}

        {!state.loading &&
          _.isEmpty(state.data_pin) &&
          _.isEmpty(state.data_un_pin) && (
            <EmptyContent
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none">
                  <path
                    d="M16.5 7.5V11.25C16.5 15 15 16.5 11.25 16.5H6.75C3 16.5 1.5 15 1.5 11.25V6.75C1.5 3 3 1.5 6.75 1.5H10.5"
                    stroke="#32434F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 7.5H13.5C11.25 7.5 10.5 6.75 10.5 4.5V1.5L16.5 7.5Z"
                    stroke="#32434F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.25 9.75H9.75"
                    stroke="#32434F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.25 12.75H8.25"
                    stroke="#32434F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              title={useFormatMessage("notification.empty_content.title")}
              text={useFormatMessage("notification.empty_content.text")}
            />
          )}

        {!state.loading && (
          <>
            {!_.isEmpty(state.data_pin) && (
              <>
                <Row>
                  <Col xs="12">
                    <Swiper {...params} dir={isRtl ? "rtl" : "ltr"}>
                      {_.map(state.data_pin, (value, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <div
                              onClick={() => toggleModal(value.id)}
                              className={classNames(
                                "div-notepad div-notepad-pin",
                                {
                                  "no-title":
                                    value.title === null ||
                                    value.title === "" ||
                                    value.title === " ",
                                  title:
                                    value.title !== null &&
                                    value.title !== "" &&
                                    value.title !== " "
                                }
                              )}>
                              <span className="text-title">{value.title}</span>
                              <span className="text-content">
                                {renderContent(value.content)}
                              </span>
                              <span className="text-time">
                                {renderTime(value.created_at)}
                              </span>
                            </div>

                            {renderStar("un_pin", value.id)}
                            {renderTick(value.id)}
                          </SwiperSlide>
                        )
                      })}
                    </Swiper>
                  </Col>
                </Row>
                <hr />
              </>
            )}
            {!_.isEmpty(state.data_un_pin) && (
              <>
                <Row>
                  <Col xs="12">
                    <Swiper {...params} dir={isRtl ? "rtl" : "ltr"}>
                      {_.map(state.data_un_pin, (value, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <div
                              onClick={() => toggleModal(value.id)}
                              className={classNames("div-notepad", {
                                "no-title":
                                  value.title === null ||
                                  value.title === "" ||
                                  value.title === " "
                              })}>
                              <span className="text-title">{value.title}</span>
                              <span className="text-content">
                                {renderContent(value.content)}
                              </span>
                              <span className="text-time">
                                {renderTime(value.created_at)}
                              </span>
                            </div>

                            {renderStar("pin", value.id)}
                            {renderTick(value.id)}
                          </SwiperSlide>
                        )
                      })}
                    </Swiper>
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </CardBody>

      <AddModal
        modal={state.modal}
        toggleModal={toggleModal}
        idNotepad={state.idNotepad}
        loadData={loadData}
      />
    </LayoutDashboard>
  )
}

export default Notepad
