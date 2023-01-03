import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { assetInventoryApi } from "@modules/Asset/common/api"
import moment from "moment"
import React, { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"

const AddInventoriesModal = (props) => {
  const { modal, toggleModal } = props
  const [state, setState] = useMergedState({
    loadingSubmit: false
  })

  const refInput = useRef(null)

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    setState({ loadingSubmit: true })
    assetInventoryApi
      .postAddInventory(values)
      .then((res) => {
        setState({ loadingSubmit: false })
        toggleModal()
      })
      .catch((err) => {
        setState({ loadingSubmit: false })
      })
  }

  useEffect(() => {
    if (modal === true) {
      setTimeout(() => {
        if (refInput.current) {
          refInput.current.focus()
        }
      }, 100)
    }
  }, [modal])

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="modal-sm modal-yt-tool"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => toggleModal()}>
        {useFormatMessage("modules.asset.inventories.text.add_new_inventory")}
      </ModalHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row className="my-1">
              <Col sm={12}>
                <ErpInput
                  innerRef={refInput}
                  nolabel
                  name="inventory_name"
                  className="input-tool"
                  useForm={methods}
                  defaultValue={`${useFormatMessage(
                    "modules.asset.inventories.text.inventory"
                  )} ${moment().format("DD/MM/YYYY")} `}
                  placeholder={useFormatMessage(
                    "modules.asset.inventories.text.inventory_name"
                  )}
                  required
                />
              </Col>
              <Col sm={12}>
                <ErpInput
                  nolabel
                  name="inventory_description"
                  className="input-tool"
                  useForm={methods}
                  defaultValue={""}
                  placeholder={useFormatMessage(
                    "modules.asset.inventories.text.inventory_description"
                  )}
                  type="textarea"
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <Button
              type="submit"
              color="primary"
              className="btn-tool"
              disabled={state.loadingSubmit}>
              {state.loadingSubmit && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("modules.asset.inventories.button.add")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default AddInventoriesModal
