import { ErpAsyncSelect } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import { isEmpty } from "lodash"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { components } from "react-select"
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap"
import { defaultModuleApi } from "../../../../utility/moduleApi"

export const handlePermissionArray = (data) => {
  const listViewPer = !isEmpty(data.view_permissions)
    ? data.view_permissions.map((item) => ({
        id: item.value,
        title: item.label,
        img: item.icon,
        size: "sm"
      }))
    : []
  const listUpdatePer = !isEmpty(data.update_permissions)
    ? data.update_permissions.map((item) => ({
        id: item.value,
        title: item.label,
        img: item.icon,
        size: "sm"
      }))
    : []
  const arr = [...listViewPer, ...listUpdatePer]
  return arr.filter(
    (ele, ind) => ind === arr.findIndex((elem) => elem.id === ele.id)
  )
}

const OptionComponent = ({ data, ...props }) => {
  const charName = data.label.substr(0, 1)
  return (
    <components.Option {...props}>
      <Avatar
        className="my-0 me-50"
        content={charName}
        size="sm"
        src={data.icon}
        userId={data.value}
      />
      {data.label}
    </components.Option>
  )
}

function PermissionModalDefaultModule(props) {
  const onCloseModal = () => {}
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, reset } = methods

  const onSubmit = (data) => {
    props.handleSubmit(data)
    props.handleModal()
  }

  const loadOptions = async (search, { page, defaultOptions }) => {
    let result = {
      options: [],
      hasMore: true
    }

    await defaultModuleApi
      .getUsers({
        isLoadOption: "username",
        search,
        page,
        defaultOptions: defaultOptions
      })
      .then((res) => {
        result = {
          options: res.data.results,
          hasMore: res.data.hasMore,
          additional: {
            page: page + 1
          }
        }
      })
    return result
  }

  useEffect(() => {
    reset(props.permissions)
  }, [props.permissions])

  return (
    <React.Fragment>
      <Modal
        isOpen={props.modal}
        onClosed={onCloseModal}
        toggle={props.handleModal}
        backdrop={"static"}
        className="modal-sm">
        <ModalHeader toggle={props.handleModal}>
          {useFormatMessage("app.permissions")}
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col sm="12">
                <ErpAsyncSelect
                  label={useFormatMessage("common.owner")}
                  id="owner"
                  useForm={methods}
                  name="owner"
                  cacheOptions
                  defaultOptions
                  loadOptions={loadOptions}
                  additional={{
                    page: 1
                  }}
                  components={{
                    Option: OptionComponent
                  }}
                  required
                />
              </Col>
              <Col sm="12">
                <ErpAsyncSelect
                  label={useFormatMessage("common.view_permissions")}
                  id="view_permissions"
                  useForm={methods}
                  name="view_permissions"
                  isMulti={true}
                  cacheOptions
                  defaultOptions
                  loadOptions={loadOptions}
                  additional={{
                    page: 1
                  }}
                  components={{
                    Option: OptionComponent
                  }}
                />
              </Col>
              <Col sm="12">
                <ErpAsyncSelect
                  label={useFormatMessage("common.update_permissions")}
                  id="update_permissions"
                  useForm={methods}
                  name="update_permissions"
                  isMulti={true}
                  cacheOptions
                  defaultOptions
                  loadOptions={loadOptions}
                  additional={{
                    page: 1
                  }}
                  components={{
                    Option: OptionComponent
                  }}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple color="primary" type="submit" onClick={handleSubmit}>
              {useFormatMessage("app.save")}
            </Button.Ripple>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default PermissionModalDefaultModule
