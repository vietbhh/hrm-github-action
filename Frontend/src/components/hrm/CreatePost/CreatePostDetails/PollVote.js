import {
  ErpCheckbox,
  ErpDatetime,
  ErpInput
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import React, { Fragment, useRef } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Button, Modal, ModalBody } from "reactstrap"
import dayjs from "dayjs"

const PollVote = (props) => {
  const { setPollVoteDetail, poll_vote_detail, toggleModalPollVote } = props
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
    modalPollVoteSetting: false
  })

  const refInputAddOptions = useRef(null)

  // function
  const handleChangeSetting = (checked, name) => {
    let setting = { [name]: checked }
    if (name === "limit_time") {
      setting = { ...setting, time_end: null }
    }
    setPollVoteDetail({
      setting: { ...poll_vote_detail.setting, ...setting }
    })
  }

  const handleChangeOptions = (value, index) => {
    const options = [...poll_vote_detail.options]
    options[index] = value
    setPollVoteDetail({ options: options })
  }

  const handleAddOptions = () => {
    const options = [...poll_vote_detail.options]
    options.push("")
    setPollVoteDetail({ options: options })

    setTimeout(() => {
      if (refInputAddOptions.current) {
        refInputAddOptions.current.focus()
      }
    }, 100)
  }

  const handleDeleteOptions = (index) => {
    const options = [...poll_vote_detail.options]
    options.splice(index, 1)
    setPollVoteDetail({ options: options })
  }

  const toggleModalPollVoteSetting = () =>
    setState({ modalPollVoteSetting: !state.modalPollVoteSetting })

  return (
    <Fragment>
      <div className="feed modal-create-post modal-poll-vote">
        <div className="body-content">
          <Tooltip
            title={useFormatMessage(
              "modules.feed.create_post.text.close_poll_vote"
            )}>
            <div
              className="div-btn-close-poll-vote"
              onClick={() => toggleModalPollVote()}>
              <i className="fa-regular fa-xmark"></i>
            </div>
          </Tooltip>
          <div className="div-question">
            <ErpInput
              label={useFormatMessage("modules.feed.create_post.text.question")}
              required
              placeholder={useFormatMessage(
                "modules.feed.create_post.text.enter_question"
              )}
              value={poll_vote_detail.question}
              onChange={(e) => setPollVoteDetail({ question: e.target.value })}
            />

            <div
              className="div-btn-setting"
              onClick={() => toggleModalPollVoteSetting()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#696760" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" stroke="#696760" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <label
            title={useFormatMessage(
              "modules.feed.create_post.text.add_options"
            )}
            className="form-label">
            {useFormatMessage("modules.feed.create_post.text.add_options")} *
          </label>
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            {_.map(poll_vote_detail.options, (value, index) => {
              return (
                <div key={index} className="div-add-options"
                >
                  <ErpInput
                    nolabel
                    required
                    placeholder={useFormatMessage(
                      "modules.feed.create_post.text.option",
                      { number: index + 1 }
                    )}
                    value={value}
                    onChange={(e) => handleChangeOptions(e.target.value, index)}
                    innerRef={
                      index === poll_vote_detail.options.length - 1
                        ? refInputAddOptions
                        : null
                    }
                  />
                  <div className={classNames("div-btn-delete-options", {
                      "visibility-hidden":
                        poll_vote_detail.options.length <= 2
                    })} >
                    <Button
                      color="flat"
                      className={classNames("btn-delete-options", {
                        "visibility-hidden":
                          poll_vote_detail.options.length <= 2
                      })}
                      onClick={() => handleDeleteOptions(index)}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.36 14.3C15.65 14.59 15.65 15.07 15.36 15.36C15.21 15.51 15.02 15.58 14.83 15.58C14.64 15.58 14.45 15.51 14.3 15.36L12 13.06L9.7 15.36C9.55 15.51 9.36 15.58 9.17 15.58C8.98 15.58 8.79 15.51 8.64 15.36C8.35 15.07 8.35 14.59 8.64 14.3L10.94 12L8.64 9.7C8.35 9.41 8.35 8.93 8.64 8.64C8.93 8.35 9.41 8.35 9.7 8.64L12 10.94L14.3 8.64C14.59 8.35 15.07 8.35 15.36 8.64C15.65 8.93 15.65 9.41 15.36 9.7L13.06 12L15.36 14.3Z"
                          fill="#696760"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )
            })}
          </PerfectScrollbar>
          <button
            type="button"
            className="btn-add-option"
            onClick={() => handleAddOptions()}
            disabled={poll_vote_detail.options.length >= 10}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.5 12H18.5"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 18V6"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text">
              {useFormatMessage("modules.feed.create_post.text.add_options")}
            </span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={state.modalPollVoteSetting}
        toggle={() => toggleModalPollVoteSetting()}
        className="modal-dialog-centered feed modal-create-post modal-poll-vote modal-poll-vote-setting"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        /* backdrop={"static"} */
      >
        <ModalBody>
          <div className="body-header">
            <button
              className="btn-icon"
              onClick={() => toggleModalPollVoteSetting()}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <span className="text-title">
              {useFormatMessage("modules.feed.create_post.text.poll_setting")}
            </span>
          </div>
          <div className="body-content">
            <div className="div-setting">
              <div className="d-flex">
                <span className="div-setting-label me-auto">
                  {useFormatMessage(
                    "modules.feed.create_post.text.allow_multiple_selection"
                  )}
                </span>
                <ErpCheckbox
                  nolabel
                  checked={poll_vote_detail.setting.multiple_selection}
                  onChange={(e) =>
                    handleChangeSetting(e.target.checked, "multiple_selection")
                  }
                />
              </div>
              <div className="d-flex">
                <span className="div-setting-label me-auto">
                  {useFormatMessage(
                    "modules.feed.create_post.text.allow_adding_more_options"
                  )}
                </span>
                <ErpCheckbox
                  nolabel
                  checked={poll_vote_detail.setting.adding_more_options}
                  onChange={(e) =>
                    handleChangeSetting(e.target.checked, "adding_more_options")
                  }
                />
              </div>
              <div className="d-flex">
                <span className="div-setting-label me-auto">
                  {useFormatMessage(
                    "modules.feed.create_post.text.allow_incognito"
                  )}
                </span>
                <ErpCheckbox
                  nolabel
                  checked={poll_vote_detail.setting.incognito}
                  onChange={(e) =>
                    handleChangeSetting(e.target.checked, "incognito")
                  }
                />
              </div>
              <div className="d-flex">
                <span className="div-setting-label me-auto">
                  {useFormatMessage(
                    "modules.feed.create_post.text.limit_time_for_poll"
                  )}
                </span>
                <ErpCheckbox
                  nolabel
                  checked={poll_vote_detail.setting.limit_time}
                  onChange={(e) => {
                    handleChangeSetting(e.target.checked, "limit_time")
                  }}
                />
              </div>
            </div>

            {poll_vote_detail.setting.limit_time && (
              <div className="div-setting-time-end">
                <ErpDatetime
                  nolabel
                  placement="topRight"
                  value={
                    poll_vote_detail.time_end
                      ? dayjs(poll_vote_detail.time_end)
                      : poll_vote_detail.time_end
                  }
                  onChange={(e) => {
                    setPollVoteDetail({ time_end: e })
                  }}
                />
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default PollVote
