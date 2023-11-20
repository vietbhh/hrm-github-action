// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
// ** Styles
import {
  Button,
  Col,
  FormFeedback,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
// ** Components
import SettingWidgetItem from "./SettingWidgetItem"

const SettingWidgetModal = (props) => {
  const {
    // ** props
    modal,
    listWidget,
    // ** methods
    toggleModal,
    handleWidget,
    onLayoutChange
  } = props

  const methods = useForm()
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    const newLayout = [...listWidget]
      .map((itemMap) => {
        const isCheck = values[itemMap.id] === true
        if (isCheck) {
          return itemMap.data_grid
        }

        return undefined
      })
      .filter((itemFilter) => {
        return itemFilter !== undefined
      })

    onLayoutChange(null, {
      lg: newLayout
    })

    toggleModal()
  }

  // ** render
  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="modal-lg modal-setting-widgets"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        {useFormatMessage("modules.dashboard.setting_widgets.title")}
        <Button.Ripple
          className="btn-close-modal"
          onClick={() => toggleModal()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M6 18L18 6"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 18L6 6"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button.Ripple>
      </ModalHeader>
      <ModalBody>
        <FormProvider {...methods}>
          <Row>
            {listWidget.map((item) => {
              return (
                <Col sm="4" key={`widget-item-${item?.id}`}>
                  <SettingWidgetItem item={item} methods={methods} />
                </Col>
              )
            })}
          </Row>
        </FormProvider>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col sm="12">
              <Button.Ripple type="submit" className="btn-submit">
                {useFormatMessage(
                  "modules.dashboard.setting_widgets.save_setting"
                )}
              </Button.Ripple>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default SettingWidgetModal
