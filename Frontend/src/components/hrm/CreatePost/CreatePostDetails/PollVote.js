import {
  ErpCheckbox,
  ErpDatetime,
  ErpInput
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import React, { Fragment, useEffect, useRef } from "react"
import { Button, Modal, ModalBody } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"

const PollVote = (props) => {
  const {
    backgroundImage,
    setPollVoteDetail,
    modalPollVote,
    toggleModalPollVote,
    loadingSubmit
  } = props
  const [state, setState] = useMergedState({
    question: "",
    options: ["", ""],
    setting: {
      multiple_selection: false,
      adding_more_options: false,
      incognito: false,
      limit_time: false
    },
    time_end: null,
    disable_btn_continue: true
  })

  const refInputAddOptions = useRef(null)

  // function
  const handleChangeSetting = (checked, name) => {
    setState({ setting: { ...state.setting, [name]: checked } })
  }

  const handleChangeOptions = (value, index) => {
    const options = [...state.options]
    options[index] = value
    setState({ options: options })
  }

  const handleAddOptions = () => {
    const options = [...state.options]
    options.push("")
    setState({ options: options })

    setTimeout(() => {
      if (refInputAddOptions.current) {
        refInputAddOptions.current.focus()
      }
    }, 100)
  }

  const handleDeleteOptions = (index) => {
    const options = [...state.options]
    options.splice(index, 1)
    setState({ options: options })
  }

  // useEffect
  useEffect(() => {
    let check_options = true
    _.forEach(state.options, (value) => {
      if (value === "") {
        check_options = false
      }
    })
    if (check_options && state.question !== "") {
      let disable_btn_continue = false

      if (state.setting.limit_time === true && state.time_end === null) {
        disable_btn_continue = true
      } else {
        disable_btn_continue = false
      }
      setState({ disable_btn_continue: disable_btn_continue })
    } else {
      setState({ disable_btn_continue: true })
    }
  }, [state.question, state.options, state.setting, state.time_end])

  useEffect(() => {
    setState({
      question: "",
      options: ["", ""],
      setting: {
        multiple_selection: false,
        adding_more_options: false,
        incognito: false,
        limit_time: false
      },
      time_end: null,
      disable_btn_continue: true
    })
  }, [loadingSubmit])

  return (
    <Fragment>
      <Tooltip
        title={useFormatMessage("modules.feed.create_post.text.poll_vote")}>
        <li
          className={classNames("create_post_footer-li", {
            "cursor-not-allowed": backgroundImage !== null,
            "cursor-pointer": backgroundImage === null
          })}
          onClick={() => {
            if (backgroundImage === null) {
              toggleModalPollVote()
            }
          }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.5 2C9.5 1.44772 9.94772 1 10.5 1H13.5C14.0523 1 14.5 1.44772 14.5 2V20C14.5 20.5523 14.0523 21 13.5 21H10.5C9.94772 21 9.5 20.5523 9.5 20V2Z"
              fill="#FFA940"></path>
            <path
              d="M17 6C17 5.44772 17.4477 5 18 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H18C17.4477 21 17 20.5523 17 20V6Z"
              fill="#FFA940"></path>
            <path
              d="M2 10C2 9.44772 2.44772 9 3 9H6C6.55228 9 7 9.44772 7 10V20C7 20.5523 6.55228 21 6 21H3C2.44772 21 2 20.5523 2 20V10Z"
              fill="#FFA940"></path>
          </svg>
        </li>
      </Tooltip>

      <Modal
        isOpen={modalPollVote}
        toggle={() => toggleModalPollVote()}
        className="modal-dialog-centered feed modal-create-post modal-poll-vote"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        backdrop={"static"}>
        <ModalBody>
          <div className="body-header">
            <button className="btn-icon" onClick={() => toggleModalPollVote()}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <span className="text-title">
              {useFormatMessage("modules.feed.create_post.text.create_poll")}
            </span>
          </div>
          <div className="body-content">
            <ErpInput
              label={useFormatMessage("modules.feed.create_post.text.question")}
              required
              placeholder={useFormatMessage(
                "modules.feed.create_post.text.enter_question"
              )}
              value={state.question}
              onChange={(e) => setState({ question: e.target.value })}
            />

            <label
              title={useFormatMessage(
                "modules.feed.create_post.text.add_options"
              )}
              className="form-label">
              {useFormatMessage("modules.feed.create_post.text.add_options")} *
            </label>
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              {_.map(state.options, (value, index) => {
                return (
                  <div key={index} className="div-add-options">
                    <ErpInput
                      nolabel
                      required
                      placeholder={useFormatMessage(
                        "modules.feed.create_post.text.option",
                        { number: index + 1 }
                      )}
                      value={value}
                      onChange={(e) =>
                        handleChangeOptions(e.target.value, index)
                      }
                      innerRef={
                        index === state.options.length - 1
                          ? refInputAddOptions
                          : null
                      }
                    />

                    {state.options.length > 2 && (
                      <Button.Ripple
                        color="danger"
                        className="btn-delete-options"
                        onClick={() => handleDeleteOptions(index)}>
                        <i className="fa-solid fa-xmark"></i>
                      </Button.Ripple>
                    )}
                  </div>
                )
              })}
            </PerfectScrollbar>

            <button
              type="button"
              className="btn-add-option"
              onClick={() => handleAddOptions()}>
              <i className="fa-regular fa-circle-plus fs-4 me-50"></i>
              {useFormatMessage("modules.feed.create_post.text.add_options")}
            </button>

            <div className="div-setting">
              <label
                title={useFormatMessage("app.setting")}
                className="form-label">
                {useFormatMessage("app.setting")}
              </label>
              <ErpCheckbox
                label={useFormatMessage(
                  "modules.feed.create_post.text.allow_multiple_selection"
                )}
                className="mb-50"
                checked={state.setting.multiple_selection}
                onChange={(e) =>
                  handleChangeSetting(e.target.checked, "multiple_selection")
                }
              />
              <ErpCheckbox
                label={useFormatMessage(
                  "modules.feed.create_post.text.allow_adding_more_options"
                )}
                className="mb-50"
                checked={state.setting.adding_more_options}
                onChange={(e) =>
                  handleChangeSetting(e.target.checked, "adding_more_options")
                }
              />
              <ErpCheckbox
                label={useFormatMessage(
                  "modules.feed.create_post.text.allow_incognito"
                )}
                className="mb-50"
                checked={state.setting.incognito}
                onChange={(e) =>
                  handleChangeSetting(e.target.checked, "incognito")
                }
              />
              <ErpCheckbox
                label={useFormatMessage(
                  "modules.feed.create_post.text.limit_time_for_poll"
                )}
                checked={state.setting.limit_time}
                onChange={(e) => {
                  handleChangeSetting(e.target.checked, "limit_time")
                  setState({ time_end: null })
                }}
              />
            </div>

            {state.setting.limit_time && (
              <div className="div-setting-time-end">
                <ErpDatetime
                  label={useFormatMessage(
                    "modules.feed.create_post.text.end_at"
                  )}
                  labelInline
                  placement="topRight"
                  value={state.time_end}
                  onChange={(e) => setState({ time_end: e })}
                />
              </div>
            )}

            <button
              type="button"
              className="btn-post"
              disabled={state.disable_btn_continue}
              onClick={() => {
                setPollVoteDetail({
                  question: state.question,
                  options: state.options,
                  setting: state.setting,
                  time_end: state.time_end
                })
                toggleModalPollVote()
              }}>
              {useFormatMessage("modules.feed.create_post.text.continue")}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default PollVote
