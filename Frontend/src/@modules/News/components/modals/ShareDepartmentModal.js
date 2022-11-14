import { ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import Avatar from "@apps/modules/download/pages/Avatar"
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
import { newsApi } from "@modules/News/common/api"
import { map, isEmpty } from "lodash"
import { useEffect } from "react"

const ShareDepartmentModal = (props) => {
  const {
    modal,
    toggleShareModal,
    optionsModules,
    modalTitle,
    departments,
    employees,
    setStateParent,
    setCheckShareEveryone,
    checkShareEveryone
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    loading_department: false,
    departments_child: departments,
    employees_child: employees
  })

  useEffect(() => {
    setState({
      departments_child: departments,
      employees_child: employees
    })
  }, [modal])

  useEffect(() => {
    setState({
      departments_child: departments
    })
  }, [departments])

  useEffect(() => {
    setState({
      employees_child: employees
    })
  }, [employees])

  const loadEmployees = (props) => {
    if (isEmpty(props)) {
      setState({
        employees_child: []
      })
      return
    }
    setState({
      loading_department: true
    })
    const params = {
      department: props
    }
    newsApi.getEmployeesByDepartment(params).then((res) => {
      setState({
        employees_child: res.data,
        departments_child: props,
        loading_department: false
      })
    })
  }

  const removeShare = (props) => {
    const employees_ = []
    map(state.employees_child, (item) => {
      if (item.value !== props) {
        employees_.push(item)
      }
    })
    setState({
      employees_child: employees_
    })
  }

  const saveShare = () => {
    setCheckShareEveryone(false)
    setStateParent(state.departments_child, state.employees_child)
    toggleShareModal()
  }

  return (
    <Modal
      className="modal-lg news"
      isOpen={modal}
      toggle={() => toggleShareModal()}
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => toggleShareModal()}>{modalTitle}</ModalHeader>
      <ModalBody>
        <Row>
          <Col sm={12} className="mb-25">
            <ErpSelect
              onChange={(e) => {
                loadEmployees(e)
              }}
              options={optionsModules.departments.name}
              isMulti={true}
              defaultValue={state.departments_child}
            />
          </Col>

          {state.loading_department && (
            <Col sm={12} className="mb-25 share-department text-center">
              <Spinner size="sm" className="me-50" />
            </Col>
          )}

          {!state.loading_department &&
            map(state.employees_child, (item, index) => {
              return (
                <Col key={index} sm={12} className="mb-25 share-department">
                  <Avatar
                    style={{ cursor: "default" }}
                    className="m-0"
                    size="sm"
                    src={item.icon}
                  />
                  <span className="share-department-name">
                    {item.full_name}
                  </span>
                  <span className="text-primary share-department-email">
                    {item.email}
                  </span>
                  <Button
                    onClick={() => {
                      removeShare(item.value)
                    }}
                    color="flat-secondary"
                    className="share-department-btn">
                    {useFormatMessage("modules.news.share.button.remove")}
                  </Button>
                </Col>
              )
            })}
        </Row>
      </ModalBody>
      <ModalFooter style={{ marginTop: "20px" }}>
        <Button
          type="submit"
          color="primary"
          disabled={state.loading || isEmpty(state.employees_child)}
          onClick={() => {
            saveShare()
          }}>
          {state.loading && <Spinner size="sm" className="me-50" />}
          {useFormatMessage("app.save")}
        </Button>
        <Button
          color="flat-danger"
          onClick={() => {
            setCheckShareEveryone(checkShareEveryone)
            setStateParent(departments, employees)
            toggleShareModal()
          }}>
          {useFormatMessage("button.cancel")}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ShareDepartmentModal
