import {
  ErpCheckbox,
  ErpDatetime,
  ErpInput
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classNames from "classnames"
import moment from "moment"
import React, { Fragment, useRef } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Modal, ModalBody } from "reactstrap"

const PollVote = (props) => {
  const { setPollVoteDetail, poll_vote_detail } = props
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
        <div className="body-header"></div>
        <div className="body-content">
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
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="19"
                viewBox="0 0 21 19"
                fill="none">
                <path
                  d="M18.1 6.6589C16.29 6.6589 15.55 5.3789 16.45 3.8089C16.97 2.8989 16.66 1.7389 15.75 1.2189L14.02 0.228901C13.23 -0.241099 12.21 0.0389014 11.74 0.828901L11.63 1.0189C10.73 2.5889 9.25 2.5889 8.34 1.0189L8.23 0.828901C7.78 0.0389014 6.76 -0.241099 5.97 0.228901L4.24 1.2189C3.33 1.7389 3.02 2.9089 3.54 3.8189C4.45 5.3789 3.71 6.6589 1.9 6.6589C0.86 6.6589 0 7.5089 0 8.5589V10.3189C0 11.3589 0.85 12.2189 1.9 12.2189C3.71 12.2189 4.45 13.4989 3.54 15.0689C3.02 15.9789 3.33 17.1389 4.24 17.6589L5.97 18.6489C6.76 19.1189 7.78 18.8389 8.25 18.0489L8.36 17.8589C9.26 16.2889 10.74 16.2889 11.65 17.8589L11.76 18.0489C12.23 18.8389 13.25 19.1189 14.04 18.6489L15.77 17.6589C16.68 17.1389 16.99 15.9689 16.47 15.0689C15.56 13.4989 16.3 12.2189 18.11 12.2189C19.15 12.2189 20.01 11.3689 20.01 10.3189V8.5589C20 7.5189 19.15 6.6589 18.1 6.6589ZM10 12.6889C8.21 12.6889 6.75 11.2289 6.75 9.4389C6.75 7.6489 8.21 6.1889 10 6.1889C11.79 6.1889 13.25 7.6489 13.25 9.4389C13.25 11.2289 11.79 12.6889 10 12.6889Z"
                  fill="#32434F"
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
                <div key={index} className="div-add-options">
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

                  <div className="div-btn-delete-options">
                    <button
                      color="danger"
                      className={classNames("btn-delete-options", {
                        "visibility-hidden":
                          poll_vote_detail.options.length <= 2
                      })}
                      onClick={() => handleDeleteOptions(index)}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
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
              className="me-50"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M8 12H16"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16V8"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {useFormatMessage("modules.feed.create_post.text.add_options")}
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
              <ErpCheckbox
                label={useFormatMessage(
                  "modules.feed.create_post.text.allow_multiple_selection"
                )}
                checked={poll_vote_detail.setting.multiple_selection}
                onChange={(e) =>
                  handleChangeSetting(e.target.checked, "multiple_selection")
                }
              />
              <ErpCheckbox
                label={useFormatMessage(
                  "modules.feed.create_post.text.allow_adding_more_options"
                )}
                checked={poll_vote_detail.setting.adding_more_options}
                onChange={(e) =>
                  handleChangeSetting(e.target.checked, "adding_more_options")
                }
              />
              <ErpCheckbox
                label={useFormatMessage(
                  "modules.feed.create_post.text.allow_incognito"
                )}
                checked={poll_vote_detail.setting.incognito}
                onChange={(e) =>
                  handleChangeSetting(e.target.checked, "incognito")
                }
              />
              <ErpCheckbox
                label={useFormatMessage(
                  "modules.feed.create_post.text.limit_time_for_poll"
                )}
                checked={poll_vote_detail.setting.limit_time}
                onChange={(e) => {
                  handleChangeSetting(e.target.checked, "limit_time")
                }}
              />
            </div>

            {poll_vote_detail.setting.limit_time && (
              <div className="div-setting-time-end">
                <ErpDatetime
                  nolabel
                  placement="topRight"
                  value={
                    poll_vote_detail.time_end
                      ? moment(poll_vote_detail.time_end)
                      : poll_vote_detail.time_end
                  }
                  onChange={(e) => setPollVoteDetail({ time_end: e })}
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
