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
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect width="52" height="52" rx="16" fill="#F2F1ED" />
                <path
                  d="M26 29C27.6569 29 29 27.6569 29 26C29 24.3431 27.6569 23 26 23C24.3431 23 23 24.3431 23 26C23 27.6569 24.3431 29 26 29Z"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 26.8799V25.1199C16 24.0799 16.85 23.2199 17.9 23.2199C19.71 23.2199 20.45 21.9399 19.54 20.3699C19.02 19.4699 19.33 18.2999 20.24 17.7799L21.97 16.7899C22.76 16.3199 23.78 16.5999 24.25 17.3899L24.36 17.5799C25.26 19.1499 26.74 19.1499 27.65 17.5799L27.76 17.3899C28.23 16.5999 29.25 16.3199 30.04 16.7899L31.77 17.7799C32.68 18.2999 32.99 19.4699 32.47 20.3699C31.56 21.9399 32.3 23.2199 34.11 23.2199C35.15 23.2199 36.01 24.0699 36.01 25.1199V26.8799C36.01 27.9199 35.16 28.7799 34.11 28.7799C32.3 28.7799 31.56 30.0599 32.47 31.6299C32.99 32.5399 32.68 33.6999 31.77 34.2199L30.04 35.2099C29.25 35.6799 28.23 35.3999 27.76 34.6099L27.65 34.4199C26.75 32.8499 25.27 32.8499 24.36 34.4199L24.25 34.6099C23.78 35.3999 22.76 35.6799 21.97 35.2099L20.24 34.2199C19.33 33.6999 19.02 32.5299 19.54 31.6299C20.45 30.0599 19.71 28.7799 17.9 28.7799C16.85 28.7799 16 27.9199 16 26.8799Z"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
