import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import React, { Fragment } from "react"
import { Modal, ModalBody } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"

const PollVote = (props) => {
  const { backgroundImage } = props
  const [state, setState] = useMergedState({
    modalPollVote: false
  })

  // function
  const toggleModalPollVote = () => {
    setState({ modalPollVote: !state.modalPollVote })
  }

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
        isOpen={state.modalPollVote}
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
            />

            <label
              title={useFormatMessage(
                "modules.feed.create_post.text.add_question"
              )}
              className="form-label">
              {useFormatMessage("modules.feed.create_post.text.add_options")} *
            </label>
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              <ErpInput
                nolabel
                required
                placeholder={useFormatMessage(
                  "modules.feed.create_post.text.option",
                  { number: 1 }
                )}
              />
              <ErpInput
                nolabel
                required
                placeholder={useFormatMessage(
                  "modules.feed.create_post.text.option",
                  { number: 2 }
                )}
              />
            </PerfectScrollbar>

            <button type="button" className="btn-add-option">
              {useFormatMessage("modules.feed.create_post.text.add_option")}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default PollVote
