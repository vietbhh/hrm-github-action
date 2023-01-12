import { ErpCheckbox } from "@apps/components/common/ErpField"

import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { Tree } from "antd"
import { map } from "lodash"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap"
import { DashboardApi } from "../../common/api"

const SettingShowDepartmentModal = (props) => {
  const { modal, toggleModal, loadData, idChecked } = props

  const user = useSelector((state) => state.auth.userData)

  const settings = useSelector((state) => state.auth.settings)
  const departmentShow = idChecked
  const [state, setState] = useMergedState({
    loadingModal: false,
    loading: false,
    listDepartment: [],
    departmentChecked: []
  })

  const onSubmit = (values) => {
    setState({ loading: true })
    const departmentShow = []
    map(state.departmentChecked, (value, index) => {
      if (value) {
        departmentShow.push(value?.id)
      }
    })
    const data = { department: departmentShow }
    data.id = user.id
    DashboardApi.updateShowDepartment(data)
      .then((res) => {
        setState({ loading: false })
        toggleModal()
        loadData()
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({ text: err.message })
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, watch, setValue, getValues } = methods

  useEffect(() => {
    setState({ loading: true })
    defaultModuleApi
      .getList("departments", { perPage: 100 })
      .then((res) => {
        setState({ loading: false, listDepartment: res.data.results })
      })
      .catch((err) => {
        setState({ loading: false })
      })
  }, [modal])

  const buildTree = (arr = [], parent = 0) => {
    const arrParent = []
    _.map(arr, (item) => {
      item.title = item.name
      item.value = item.id
      const itemParent = item.parent ? item.parent.value : 0
      if (itemParent === parent) {
        item.children = buildTree(arr, item?.id)
        arrParent.push(item)
      }
    })
    return arrParent
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="modal-sm modal-notepad"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => toggleModal()}>
        <span className={`dashboard-title-icon`}>
          <i
            className="fa-sharp fa-solid fa-gear"
            onClick={() => handleSetting()}
            style={{ fontSize: "18px" }}></i>
        </span>
        <span className="title">
          {useFormatMessage("modules.dashboard.st_show_department")}
        </span>
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          {state.loadingModal && (
            <>
              <Row>
                <Col xs="12">
                  <DefaultSpinner />
                </Col>
              </Row>
            </>
          )}
          {!state.loadingModal && (
            <>
              <Row>
                <Col sm={12}>
                  <Tree
                    checkable={true}
                    selectable={false}
                    multiple={true}
                    checkStrictly={true}
                    defaultExpandAll={true}
                    fieldNames={{ key: "id" }}
                    className={"departments_tree w-100"}
                    loading={state.groupLoading}
                    treeData={buildTree(state.listDepartment)}
                    defaultCheckedKeys={departmentShow}
                    onCheck={(selectedKeys, e) => {
                      setState({ departmentChecked: e.checkedNodes })
                    }}
                  />
                </Col>
              </Row>
            </>
          )}
          <hr />
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter className="justify-content-center">
            <Button type="submit" color="primary" disabled={state.submit}>
              {state.submit && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("app.save")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default SettingShowDepartmentModal
