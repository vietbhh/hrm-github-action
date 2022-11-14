import { ErpSelect, ErpUserSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import _, { isEmpty } from "lodash"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
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

import Avatar from "@apps/modules/download/pages/Avatar"
import { components } from "react-select"
import { departmentApi } from "../../common/api"
const NewDepartmentModal = (props) => {
  const { modal, handleModal, loadData, options, parent, dataDetail, params } =
    props
  const [state, setState] = useMergedState({
    loading: false,
    filesend: { cv: null, candidate_avatar: "" }
  })
  const arrFields = useSelector(
    (state) => state.app.modules["departments"].metas
  )

  const onSubmit = (values) => {
    // setState({ loading: true })
    const data = { ...values }
    if (dataDetail.id === 0) {
      data.parent = parent
    }

    if (dataDetail.updateOwner) data.updateOwner = true
    if (dataDetail.id && !dataDetail.newSub) data.id = dataDetail.id
    departmentApi
      .postSave(data)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ loading: false })
        handleModal()
        loadData(params)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
        setState({ loading: false })
      })
  }
  const methods = useForm({
    mode: "onSubmit"
  })
  const {
    handleSubmit,
    errors,
    control,
    register,
    reset,
    setValue,
    getValues
  } = methods

  const fieldLineMange = {
    module: "departments",
    fieldData: {
      ...arrFields.line_manage,
      field_form_require: false
    },
    useForm: methods,
    updateData: dataDetail?.line_manage,
    options
  }
  const optionsLineManager = []
  _.map(dataDetail?.employees, (item) => {
    optionsLineManager.push({
      value: item.id,
      label: item.username,
      full_name: item.full_name,
      email: item.email,
      icon: item.avatar
    })
  })

  const fieldName = {
    module: "departments",
    fieldData: {
      ...arrFields.name
    },
    useForm: methods,
    updateData: dataDetail?.name,
    options,
    updateDataId: dataDetail?.id
  }
  const fieldParent = {
    module: "departments",
    fieldData: {
      ...arrFields.parent
    },
    useForm: methods,
    updateData: dataDetail?.parent,
    options
  }

  const CustomUsersOption = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className="d-flex justify-content-left align-items-center">
          <Avatar className="my-0 me-50" size="sm" src={data.icon} />
          <div className="d-flex flex-column">
            <p className="user-name text-truncate mb-0">
              <span className="fw-bold">{data.full_name}</span>{" "}
              <small className="text-truncate text-username mb-0">
                @{data.label}
              </small>
            </p>
            <small className="text-truncate text-email mb-0">
              {data.email}
            </small>
          </div>
        </div>
      </components.Option>
    )
  }

  const CustomSingleUserSelect = ({ data, ...props }) => {
    return (
      <components.SingleValue {...props}>
        {!isEmpty(data) && (
          <div className="d-flex flex-wrap align-items-center">
            <Avatar className="my-0 me-50" size="sm" src={data.icon} />
            <span className="fw-bold">{data.full_name}</span> &nbsp;
            <small className="text-truncate text-muted mb-0">
              @{data.label}
            </small>
          </div>
        )}
      </components.SingleValue>
    )
  }
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      size="sm"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {dataDetail?.id
          ? useFormatMessage("modules.departments.text.edit_department")
          : useFormatMessage("modules.departments.text.new_department")}
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row>
            {dataDetail?.id >= 0 && (
              <>
                {!dataDetail?.updateOwner && (
                  <Col sm={12}>
                    <FieldHandle
                      {...fieldName}
                      nolabel
                      placeholder={useFormatMessage(
                        "modules.departments.fields.name"
                      )}
                      className="mt-1"
                    />
                  </Col>
                )}
                {!dataDetail?.updateOwner && (
                  <Col sm={12}>
                    <ErpSelect
                      options={optionsLineManager}
                      nolabel
                      id="line_manage"
                      name="line_manage"
                      useForm={methods}
                      isClearable={true}
                      defaultValue={dataDetail?.line_manage}
                      components={{
                        Option: CustomUsersOption,
                        SingleValue: CustomSingleUserSelect
                      }}
                    />
                  </Col>
                )}

                <Col sm={12}>
                  {!isEmpty(dataDetail?.id) && !dataDetail?.updateOwner && (
                    <FieldHandle {...fieldParent} nolabel />
                  )}
                </Col>
              </>
            )}
            {dataDetail?.updateOwner && (
              <Col sm={12}>
                <ErpUserSelect
                  nolabel
                  id="line_manage"
                  name="line_manage"
                  useForm={methods}
                  className="mt-50"
                  isClearable={true}
                  defaultValue={dataDetail?.line_manage}
                />
              </Col>
            )}
          </Row>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              disabled={state.loading}
              className="mr-2">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              {useFormatMessage("button.save")}
            </Button>
            <Button
              className="btn-cancel"
              color="flat-danger"
              onClick={() => handleModal(false)}>
              {useFormatMessage("button.cancel")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default NewDepartmentModal
