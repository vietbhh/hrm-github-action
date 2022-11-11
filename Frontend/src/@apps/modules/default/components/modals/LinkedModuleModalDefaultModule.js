import { ErpSelect } from "@apps/components/common/ErpField"
import { objectMap, useFormatMessage } from "@apps/utility/common"
import { isEmpty } from "lodash-es"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  Alert,
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap"

function LinkedModuleModalDefaultModule(props) {
  const { linkedModule } = props
  const onCloseModal = () => {}
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods
  const [listModule, setListModule] = useState([])
  const onSubmit = (data) => {
    props.handleSubmit(data)
    props.handleModal()
  }
  const opts = [
    {
      label: useFormatMessage("module.default.linkedModule.options.nothing"),
      value: "nothing"
    },
    {
      label: useFormatMessage("module.default.linkedModule.options.format"),
      value: "format"
    }
  ]
  useEffect(() => {
    if (!isEmpty(linkedModule)) {
      let arrayOfModules = []
      objectMap(linkedModule, (key, value) => {
        arrayOfModules = [...arrayOfModules, { module: key, ...value }]
      })
      setListModule(arrayOfModules)
    }
  }, [linkedModule])
  return (
    <React.Fragment>
      <Modal
        isOpen={props.modal}
        onClosed={onCloseModal}
        toggle={props.handleModal}
        backdrop={"static"}
        className="modal-sm"
      >
        <ModalHeader toggle={props.handleModal}>
          {useFormatMessage("module.default.linkedModule.title")}
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col sm="12">
                <Alert color="primary">
                  <div className="alert-body">
                    {useFormatMessage(
                      "module.default.linkedModule.description"
                    )}
                  </div>
                </Alert>
              </Col>
              {listModule &&
                listModule.map((item, index) => (
                  <Col key={index} sm="12">
                    <ErpSelect
                      label={item.module}
                      id={item.module}
                      useForm={methods}
                      name={item.module}
                      options={opts}
                      defaultValue={opts[0]}
                    />
                  </Col>
                ))}
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple color="primary" type="submit" onClick={handleSubmit}>
              {useFormatMessage("button.confirm")}
            </Button.Ripple>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default LinkedModuleModalDefaultModule
