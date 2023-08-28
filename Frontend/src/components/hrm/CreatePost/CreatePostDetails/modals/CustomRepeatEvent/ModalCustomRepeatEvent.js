// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import dayjs from "dayjs"
import { useForm } from "react-hook-form"
// ** Styles
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
// ** Components
import {
  ErpDate,
  ErpInput,
  ErpSelect,
  ErpRadio
} from "@apps/components/common/ErpField"
import classNames from "classnames"

const ModalCustomRepeatEvent = (props) => {
  const {
    // ** props
    modal,
    // ** methods
    handleModal
  } = props

  const [state, setState] = useMergedState({
    repeatAt: dayjs().day(),
    endTime: "never"
  })

  const optionSelect = [
    {
      label: useFormatMessage(
        "modules.feed_create_event.text.custom_repeat.day"
      ),
      value: "day"
    },
    {
      label: useFormatMessage(
        "modules.feed_create_event.text.custom_repeat.week"
      ),
      value: "week"
    },
    {
      label: useFormatMessage(
        "modules.feed_create_event.text.custom_repeat.month"
      ),
      value: "month"
    }
  ]

  const methods = useForm()

  const arrWeekDay = [1, 2, 3, 4, 5, 6, 0]

  const handleClickSave = () => {}

  // ** render
  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="modal-dialog-centered feed modal-create-post modal-create-event modal-custom-repeat"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <span className="text-title">
          {useFormatMessage(
            "modules.feed.create_event.text.custom_repeat.title"
          )}
        </span>
        <div className="div-btn-close" onClick={() => handleModal()}>
          <i className="fa-regular fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="repeat-body">
          <Row className="mb-2">
            <Col sm={5}>
              <span className="col-label">
                {useFormatMessage(
                  "modules.feed.create_event.text.custom_repeat.repeat_every"
                )}
              </span>
            </Col>
            <Col sm={7}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="me-50">
                  <ErpInput
                    name="every-number"
                    type="number"
                    nolabel={true}
                    className=" common-input input-every-number"
                    useForm={methods}
                  />
                </div>
                <div>
                  <ErpSelect
                    name="every-select"
                    options={optionSelect}
                    nolabel={true}
                    className="common-input input-every-select"
                    useForm={methods}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col sm={5}>
              <span className="col-label">
                {useFormatMessage(
                  "modules.feed.create_event.text.custom_repeat.repeat_at"
                )}
              </span>
            </Col>
            <Col sm={7}>
              <div className="d-flex align-items-center justify-content-between repeat-at-option-list">
                {arrWeekDay.map((item) => {
                  return (
                    <div
                      key={`repeat-at-option-item-${item}`}
                      className={classNames("repeat-at-option-item", {
                        active: parseInt(state.repeatAt) === parseInt(item)
                      })}>
                      {useFormatMessage(
                        `modules.feed.create_event.text.custom_repeat.repeat_at_option.${item}`
                      )}
                    </div>
                  )
                })}
              </div>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={12}>
              <span className="col-label">
                {useFormatMessage("modules.feed.create_event.text.end_time")}
              </span>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={12}>
              <div className="d-flex align-items-center">
                <ErpRadio
                  name="end-time"
                  checked={state.endTime === "never"}
                  value="never"
                  onChange={() => handleChangeEndTime("never")}
                  useForm={methods}
                />
                <span className="col-label">
                  {useFormatMessage(
                    "modules.feed.create_event.text.custom_repeat.end_time.never"
                  )}
                </span>
              </div>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={5}>
              <div className="d-flex align-items-center">
                <ErpRadio
                  name="end-time"
                  checked={state.endTime === "on_date"}
                  value="on_date"
                  onChange={() => handleChangeEndTime("on_date")}
                  useForm={methods}
                />
                <span className="col-label">
                  {useFormatMessage(
                    "modules.feed.create_event.text.custom_repeat.end_time.on_date"
                  )}
                </span>
              </div>
            </Col>
            <Col sm={7} className="pick-date">
              <ErpDate
                checked={state.endTime === ""}
                nolabel={true}
                name="on-date-end-time"
                useForm={methods}
              />
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={5}>
              <div className="d-flex align-items-center">
                <ErpRadio
                  name="end-time"
                  checked={state.endTime === "after"}
                  value="after"
                  onChange={() => handleChangeEndTime("after")}
                  useForm={methods}
                />
                <span className="col-label">
                  {useFormatMessage(
                    "modules.feed.create_event.text.custom_repeat.end_time.after"
                  )}
                </span>
              </div>
            </Col>
            <Col sm={7}>
              <div className="d-flex align-items-center justify-content-start">
                <ErpInput
                  name="after-time"
                  type="number"
                  nolabel={true}
                  className="me-50 common-input input-after-times"
                  useForm={methods}
                />
                <span>
                  {useFormatMessage(
                    "modules.feed.create_event.text.custom_repeat.end_time.times"
                  )}
                </span>
              </div>
            </Col>
          </Row>
        </div>
        <div className="w-100 d-flex justify-content-center">
          <Button.Ripple
            color="primary"
            className="btn-post"
            onClick={() => handleClickSave()}>
            {useFormatMessage("button.save")}
          </Button.Ripple>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalCustomRepeatEvent
