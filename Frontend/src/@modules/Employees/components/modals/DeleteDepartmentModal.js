import {
  ErpCheckbox,
  ErpInput,
  ErpSelect
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
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
import { departmentApi } from "../../common/api"
import Avatar from "@apps/modules/download/pages/Avatar"
import _ from "lodash"
const DeleteDepartmentModal = (props) => {
  const {
    modal,
    handleModal,
    loadData,
    options,
    listDepartment,
    dataDetail,
    params
  } = props
  const [state, setState] = useMergedState({
    loading: false,
    deleteAll: false,
    childDelete: []
  })
  const arrFields = useSelector(
    (state) => state.app.modules["departments"].metas
  )
  const optionsArr = useSelector(
    (state) => state.app.modules["departments"].options
  )
  //const atest = listDepartment.find((x) => x.id === "70")
  const onSubmit = (values) => {
    // setState({ loading: true })
    const data = { ...values }
    if (dataDetail.id) data.department_delete = dataDetail.id
    data.department_next = values.parent
    data.childDelete = state.childDelete
    departmentApi
      .deleteDepartment(data)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        //  setState({ loading: false })
        handleModal()
        loadData(params)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
        //  setState({ loading: false })
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

  const fieldParent = {
    module: "departments",
    fieldData: {
      ...arrFields.parent,
      field_form_require: true
    },
    useForm: methods,
    updateData: dataDetail?.parent,
    options
  }

  const renderEmployee = (arr = []) => {
    return _.map(arr, (item) => {
      return (
        <Avatar
          src={item.avatar}
          title={item.full_name}
          className={"avatar_in_department"}
          style={{ border: "1px solid" }}
        />
      )
    })
  }
  const findChild = (arr = [], parent = 0) => {
    const arrChild = []
    let arrAUTH = []
    _.map(arr, (item) => {
      if (item?.parent?.value === parent) {
        const arrEach = findChild(arr, item?.id)
        arrChild.push(item?.id)
        if (arrEach) {
          const cc = arrChild.concat(arrEach)
          arrAUTH = cc
        }
      }
    })

    return arrAUTH
  }
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      size="md"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.departments.text.delete_department")}
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row>
            {dataDetail?.employees?.length > 0 && (
              <Col sm={12}>
                <div
                  className="mt-1 text-center"
                  style={{
                    padding: "5px",
                    borderRadius: "8px"
                  }}>
                  {renderEmployee(dataDetail?.employees)}
                </div>
                <div className="mt-1 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-arrow-down-circle"
                    viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"
                    />
                  </svg>
                </div>
                <div className="mt-1">
                  <FieldHandle
                    {...fieldParent}
                    nolabel
                    required
                    placeholder={"Next Department"}
                  />
                </div>
              </Col>
            )}

            <Col sm={12}>
              <ErpCheckbox
                id="deleteAll"
                name="deleteAll"
                label={useFormatMessage(
                  "modules.departments.text.delete_all_department"
                )}
                useForm={methods}
                onChange={(e) => {
                  const arr = findChild(listDepartment, dataDetail.id)
                  setState({ childDelete: arr })
                }}
              />
            </Col>
            <Col sm={12} className="mt-1">
              <code>
                {useFormatMessage(
                  "modules.departments.text.note_delete_deparment"
                )}
              </code>
            </Col>
            <Col sm={12} className="mt-1">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Button
                  type="submit"
                  color="primary"
                  disabled={state.loading}
                  className="me-50">
                  {state.loading && (
                    <Spinner size="sm" className="me-50 mr-1" />
                  )}
                  Transfer & Delete
                </Button>
                <Button
                  className="btn-cancel"
                  color="flat-danger"
                  onClick={() => handleModal(false)}>
                  {useFormatMessage("button.cancel")}
                </Button>
              </form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </FormProvider>
    </Modal>
  )
}
export default DeleteDepartmentModal
